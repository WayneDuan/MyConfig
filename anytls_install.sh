#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# 检查 root 权限
[[ $EUID -ne 0 ]] && echo -e "${RED}请以 root 用户运行此脚本！${NC}" && exit 1

echo -e "${GREEN}正在开始安装 AnyTLS (优化版)...${NC}"

# 1. 安装基础依赖
echo "正在安装依赖..."
apt update && apt install -y curl wget openssl tar unzip || yum install -y curl wget openssl tar unzip

# 2. 自动获取最新版本号
echo "正在获取最新版本信息..."
LATEST_RELEASE=$(curl -s https://api.github.com/repos/anytls/anytls-go/releases/latest)
NEW_VER=$(echo "$LATEST_RELEASE" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$NEW_VER" ]; then
    NEW_VER="v0.0.12" 
fi

PURE_VER=${NEW_VER#v}

# 3. 下载并解压
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

mkdir -p /tmp/anytls_build
cd /tmp/anytls_build
wget -q --show-progress "$URL" -O anytls.zip
unzip -q -o anytls.zip

# 移动二进制文件并更名
if [ -f "anytls-server" ]; then
    mv anytls-server /usr/local/bin/anytls
elif [ -f "anytls" ]; then
    mv anytls /usr/local/bin/anytls
else
    SERVER_BIN=$(find . -name "anytls-server" -type f | head -n 1)
    if [ -n "$SERVER_BIN" ]; then
        mv "$SERVER_BIN" /usr/local/bin/anytls
    else
        echo -e "${RED}未找到二进制文件，安装失败！${NC}"
        exit 1
    fi
fi
chmod +x /usr/local/bin/anytls

# 4. 设置交互参数
read -p "请输入服务端口 (默认 3344): " PORT
PORT=${PORT:-3344}
read -p "请输入连接密码 (默认 Wayne0816111): " PASSWORD
PASSWORD=${PASSWORD:-"Wayne0816111"}

# 5. 写入 Systemd 服务项
cat <<EOF > /etc/systemd/system/anytls.service
[Unit]
Description=AnyTLS Server Service
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/anytls -l 0.0.0.0:$PORT -p $PASSWORD
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=inherit

[Install]
WantedBy=multi-user.target
EOF

# 6. 启动服务
systemctl daemon-reload
systemctl enable anytls
systemctl restart anytls

# 清理临时文件
rm -rf /tmp/anytls_build

# 7. 输出结果
PUBLIC_IP=$(curl -s https://api.ipify.org || echo "您的服务器IP")

echo -e "\n${GREEN}--------------------------------------------------${NC}"
echo -e "${GREEN}AnyTLS 部署成功！${NC}"
echo -e "版本: $NEW_VER"
echo -e "端口: ${RED}$PORT${NC}"
echo -e "密码: ${RED}$PASSWORD${NC}"
echo -e "状态: $(systemctl is-active anytls)"
echo -e "分享链接: ${GREEN}anytls://$PASSWORD@$PUBLIC_IP:$PORT${NC}"
echo -e "\n管理命令:"
echo -e "查看状态: ${NC}systemctl status anytls"
echo -e "实时日志: ${NC}journalctl -u anytls -f"
echo -e "${GREEN}--------------------------------------------------${NC}"
