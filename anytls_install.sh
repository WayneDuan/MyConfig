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

# 2. 自动获取最新版本号
echo "正在获取最新版本信息..."
LATEST_RELEASE=$(curl -s https://api.github.com/repos/anytls/anytls-go/releases/latest)
NEW_VER=$(echo "$LATEST_RELEASE" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$NEW_VER" ]; then
    NEW_VER="v0.0.12" # 备选方案
fi

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

URL="https://github.com/anytls/anytls-go/releases/download/${NEW_VER}/${FILE_NAME}"
echo -e "${GREEN}下载地址: $URL${NC}"

# 3. 下载并解压
mkdir -p /tmp/anytls_build
cd /tmp/anytls_build
wget -q --show-progress "$URL" -O anytls.zip

if [ $? -ne 0 ]; then
    echo -e "${RED}下载失败！${NC}"
    exit 1
fi

unzip -q anytls.zip

# --- 关键修正：识别 anytls-server ---
if [ -f "anytls-server" ]; then
    mv anytls-server /usr/local/bin/anytls
elif [ -f "anytls" ]; then
    mv anytls /usr/local/bin/anytls
else
    # 兜底搜索
    SERVER_BIN=$(find . -name "anytls-server" -type f | head -n 1)
    if [ -n "$SERVER_BIN" ]; then
        mv "$SERVER_BIN" /usr/local/bin/anytls
    else
        echo -e "${RED}未在压缩包中找到 anytls-server 文件！${NC}"
        exit 1
    fi
fi

chmod +x /usr/local/bin/anytls
echo -e "${GREEN}二进制文件已安装到 /usr/local/bin/anytls${NC}"

# 4. 配置文件逻辑 (默认端口 3344)
mkdir -p /etc/anytls
cd /etc/anytls

if [ ! -f "server.crt" ]; then
    openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -sha256 -days 3650 -nodes -subj "/C=CN/ST=BJ/L=BJ/O=AnyTLS/OU=IT/CN=www.icloud.com"
fi

read -p "请输入服务端口 (默认 3344): " PORT
PORT=${PORT:-3344}
read -p "请输入连接密码 (默认随机): " PASSWORD
PASSWORD=${PASSWORD:-$(openssl rand -base64 12)}

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

# 5. Systemd 服务项
cat <<EOF > /etc/systemd/system/anytls.service
[Unit]
Description=AnyTLS Server Service
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

# 6. 启动
systemctl daemon-reload
systemctl enable anytls
systemctl restart anytls

# 清理
rm -rf /tmp/anytls_build

echo -e "\n${GREEN}部署成功！${NC}"
echo -e "端口: $PORT | 密码: $PASSWORD"
echo -e "状态: $(systemctl is-active anytls)"
