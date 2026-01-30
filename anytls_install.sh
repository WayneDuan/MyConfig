#!/bin/bash

# 检查是否为 root 用户
[[ $EUID -ne 0 ]] && echo "请以 root 用户运行此脚本！" && exit 1

echo "正在更新系统并安装必要组件..."
apt update && apt install -y curl wget tar openssl docker.io docker-compose

# 创建安装目录
mkdir -p /etc/anytls
cd /etc/anytls

# 生成自签名证书（用于 TLS 伪装）
echo "正在生成自签名证书..."
openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -sha256 -days 3650 -nodes -subj "/C=CN/ST=BJ/L=BJ/O=AnyTLS/OU=IT/CN=www.icloud.com"

# 获取用户输入
read -p "请输入服务端口 (默认 443): " PORT
PORT=${PORT:-443}
read -p "请输入连接密码 (UUID): " PASSWORD
PASSWORD=${PASSWORD:-$(cat /proc/sys/kernel/random/uuid)}

# 创建配置文件 config.json
cat <<EOF > /etc/anytls/config.json
{
    "listen": ":$PORT",
    "cert": "/etc/anytls/server.crt",
    "key": "/etc/anytls/server.key",
    "password": "$PASSWORD",
    "tcp": true,
    "udp": true
}
EOF

# 创建 Docker Compose 文件
cat <<EOF > /etc/anytls/docker-compose.yml
version: '3'
services:
  anytls:
    image: anytls/anytls-go:latest
    container_name: anytls
    restart: always
    network_mode: "host"
    volumes:
      - /etc/anytls:/etc/anytls
    command: ["-c", "/etc/anytls/config.json"]
EOF

# 启动容器
docker-compose up -d

echo "--------------------------------------------------"
echo "AnyTLS 部署完成！"
echo "端口: $PORT"
echo "密码: $PASSWORD"
echo "证书位置: /etc/anytls/server.crt"
echo "--------------------------------------------------"
