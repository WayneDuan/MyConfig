#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# 检查 root 权限
[[ $EUID -ne 0 ]] && echo -e "${RED}请以 root 用户运行此脚本！${NC}" && exit 1

echo -e "${GREEN}正在开始安装 AnyTLS...${NC}"

# 1. 安装基础依赖
apt update && apt install -y curl wget openssl tar

# 2. 获取最新版本并下载二进制文件
# 自动检测架构 (amd64 或 arm64)
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
    URL="https://github.com/anytls/anytls-go/releases/latest/download/anytls-go-linux-amd64"
elif [ "$ARCH" = "aarch64" ]; then
    URL="https://github.com/anytls/anytls-go/releases/latest/download/anytls-go-linux-arm64"
else
    echo -e "${RED}不支持的架构: $ARCH${NC}"
    exit 1
fi

echo -e "${GREEN}正在从 GitHub 下载二进制文件...${NC}"
wget -q --show-progress $URL -O /usr/local/bin/anytls
chmod +x /usr/local/bin/anytls

# 3. 创建配置目录并生成证书
mkdir -p /etc/anytls
cd /etc/anytls

if [ ! -f "server.crt" ]; then
    echo "正在生成自签名证书..."
    openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -sha256 -days 3650 -nodes -subj "/C=CN/ST=BJ/L=BJ/O=AnyTLS/OU=IT/CN=www.icloud.com"
fi

# 4. 设置交互参数（默认端口 3344）
read -p "请输入服务端口 (默认 3344): " PORT
PORT=${PORT:-3344}
read -p "请输入连接密码 (默认随机): " PASSWORD
PASSWORD=${PASSWORD:-$(openssl rand -base64 12)}

# 5. 写入配置文件
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

# 6. 写入 Systemd 服务项
cat <<EOF > /etc/systemd/system/anytls.service
[Unit]
Description=AnyTLS Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/etc/anytls
ExecStart=/usr/local/bin/anytls -c /etc/anytls/config.json
Restart=on-failure
RestartSec=5
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
EOF

# 7. 启动服务
systemctl daemon-reload
systemctl enable anytls
systemctl restart anytls

# 8. 输出结果
echo -e "\n${GREEN}--------------------------------------------------${NC}"
echo -e "${GREEN}AnyTLS 部署成功！${NC}"
echo -e "端口: ${RED}$PORT${NC}"
echo -e "密码: ${RED}$PASSWORD${NC}"
echo -e "配置文件: /etc/anytls/config.json"
echo -e "管理命令: systemctl status/start/stop/restart anytls"
echo -e "${GREEN}--------------------------------------------------${NC}"
