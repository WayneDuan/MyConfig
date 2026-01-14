#!/bin/bash

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}正在开始安装 AnyTLS-Go...${NC}"

# 1. 检查权限
[[ $EUID -ne 0 ]] && echo -e "${RED}错误：请使用 root 用户运行！${NC}" && exit 1

# 2. 安装必要依赖
if ! command -v unzip &> /dev/null || ! command -v curl &> /dev/null; then
    apt update && apt install -y curl unzip || yum install -y curl unzip
fi

# 3. 确定系统架构
ARCH=$(uname -m)
case $ARCH in
    x86_64)  TAG_ARCH="amd64" ;;
    aarch64) TAG_ARCH="arm64" ;;
    *) echo -e "${RED}不支持的架构: $ARCH${NC}"; exit 1 ;;
esac

# 4. 获取最新版本并下载
echo -e "正在获取最新版本信息..."
LATEST_URL=$(curl -s https://api.github.com/repos/anytls/anytls-go/releases/latest | grep "browser_download_url" | grep "linux_${TAG_ARCH}.zip" | cut -d '"' -f 4)

if [ -z "$LATEST_URL" ]; then
    echo -e "${RED}错误：无法解析下载链接。${NC}"
    exit 1
fi

echo -e "正在下载: $LATEST_URL"
curl -L -o /tmp/anytls.zip "$LATEST_URL"

# 5. 解压安装
mkdir -p /tmp/anytls_bin
unzip -o /tmp/anytls.zip -d /tmp/anytls_bin
mv /tmp/anytls_bin/anytls-server /usr/local/bin/anytls-server
chmod +x /usr/local/bin/anytls-server
rm -rf /tmp/anytls.zip /tmp/anytls_bin

# 6. 配置参数 (修复了此处的 fi 语法错误)
read -p "请输入服务监听端口 (默认 8443): " LISTEN_PORT
LISTEN_PORT=${LISTEN_PORT:-8443}
read -p "请输入连接密码 (回车随机生成): " PASSWORD
if [ -z "$PASSWORD" ]; then
    PASSWORD=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 12)
fi

# 7. 创建 Systemd 服务
cat <<EOF > /etc/systemd/system/anytls.service
[Unit]
Description=AnyTLS-Go Server Service
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/anytls-server -l 0.0.0.0:$LISTEN_PORT -p $PASSWORD
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# 8. 启动服务
systemctl daemon-reload
systemctl enable anytls
systemctl restart anytls

# 9. 输出信息
PUBLIC_IP=$(curl -s https://api.ipify.org || echo "您的服务器IP")
echo -e "\n--------------------------------------------------"
echo -e "${GREEN}AnyTLS-Go 服务端安装成功！${NC}"
echo -e "服务器地址: ${GREEN}$PUBLIC_IP${NC}"
echo -e "监听端口: ${GREEN}$LISTEN_PORT${NC}"
echo -e "连接密码: ${GREEN}$PASSWORD${NC}"
echo -e "\n客户端分享链接 (URI):"
echo -e "${GREEN}anytls://$PASSWORD@$PUBLIC_IP:$LISTEN_PORT${NC}"
echo -e "--------------------------------------------------"
