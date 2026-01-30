#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# 检查 root 权限
[[ $EUID -ne 0 ]] && echo -e "${RED}请以 root 用户运行此脚本！${NC}" && exit 1

echo -e "${GREEN}正在开始安装 AnyTLS (二进制版)...${NC}"

# 1. 安装基础依赖
apt update && apt install -y curl wget openssl tar unzip

# 2. 自动获取最新版本号并下载 (修复变量为空的问题)
echo "正在获取最新版本信息..."
LATEST_RELEASE=$(curl -s https://api.github.com/repos/anytls/anytls-go/releases/latest)
NEW_VER=$(echo "$LATEST_RELEASE" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$NEW_VER" ]; then
    echo -e "${RED}无法获取版本号，请手动指定版本（例如 v0.0.12）${NC}"
    read -p "版本号: " NEW_VER
fi

# 去掉前面的 v，得到 0.0.12
PURE_VER=${NEW_VER#v}

ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
    FILE_NAME="anytls_${PURE_VER}_linux_amd64.zip"
elif [ "$ARCH" = "aarch64" ]; then
    FILE_NAME="anytls_${PURE_VER}_linux_arm64.zip"
else
    echo -e "${RED}不支持的架构: $ARCH${NC}"
    exit 1
fi

# 拼接完整 URL
URL="https://github.com/anytls/anytls-go/releases/download/${NEW_VER}/${FILE_NAME}"

echo -e "${GREEN}下载地址: $URL${NC}"

# 3. 下载并解压
mkdir -p /tmp/anytls_build
cd /tmp/anytls_build
wget -q --show-progress "$URL" -O anytls.zip

if [ $? -ne 0 ]; then
    echo -e "${RED}下载失败，请检查服务器是否能连接 GitHub。${NC}"
    exit 1
fi

unzip -q anytls.zip
# 找到解压后的可执行文件并移动
if [ -f "anytls" ]; then
    mv anytls /usr/local/bin/anytls
else
    # 有些压缩包内可能带路径，尝试搜索
    find . -name "anytls" -type f -exec mv {} /usr/local/bin/anytls \;
fi
chmod +x /usr/local/bin/anytls

# 4. 创建配置目录并生成证书
mkdir -p /etc/anytls
cd /etc/anytls

if [ ! -f "server.crt" ]; then
    echo "正在生成自签名证书..."
    openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -sha256 -days 3650 -nodes -subj "/C=CN/ST=BJ/L=BJ/O=AnyTLS/OU=IT/CN=www.icloud.com"
fi

# 5. 设置交互参数（默认端口 3344）
read -p "请输入服务端口 (默认 3344): " PORT
PORT=${PORT:-3344}
read -p "请输入连接密码 (默认随机): " PASSWORD
PASSWORD=${PASSWORD:-$(openssl rand -base64 12)}

# 6. 写入配置文件
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

# 7. 写入 Systemd 服务项
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

[Install]
WantedBy=multi-user.target
EOF

# 8. 启动服务
systemctl daemon-reload
systemctl enable anytls
systemctl restart anytls

# 清理
rm -rf /tmp/anytls_build

# 9. 输出结果
echo -e "\n${GREEN}--------------------------------------------------${NC}"
echo -e "${GREEN}AnyTLS 部署成功！${NC}"
echo -e "版本: $NEW_VER"
echo -e "端口: ${RED}$PORT${NC}"
echo -e "密码: ${RED}$PASSWORD${NC}"
echo -e "状态: $(systemctl is-active anytls)"
echo -e "${GREEN}--------------------------------------------------${NC}"
