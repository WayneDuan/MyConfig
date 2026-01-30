/**
 * Surge 自动切换策略 (基于 IP 归属地)
 * 事件: network-changed
 */

async function main() {
    // 1. 定义你的策略组名称
    const proxyGroupName = "节点选择"; 
    
    // 2. 获取当前网络详情
    // Surge 会返回当前公网 IP 的地理位置信息
    let http = await $http.get("http://cp.cloudflare.com/generate_204");
    let countryCode = $network.v4.primaryAddress ? $network.location.countryCode : "";

    // 备选方案：如果内置地理位置未就绪，调用轻量 API
    if (!countryCode) {
        try {
            let res = await $http.get("https://api.myip.com/");
            countryCode = JSON.parse(res.body).cc;
        } catch (e) {
            console.log("IP 查询失败: " + e);
        }
    }

    console.log("当前出口国家代码: " + countryCode);

    if (countryCode && countryCode !== "CN") {
        // 如果 IP 归属地不是中国 (CN)，则执行直连
        $surgetool.setSelectGroupPolicy(proxyGroupName, "DIRECT");
        $notification.post("Surge 自动化", "检测到境外 IP (" + countryCode + ")", "策略已自动切换至：直连");
    } else {
        // 如果是国内 IP，切换回 AnyTLS 节点
        $surgetool.setSelectGroupPolicy(proxyGroupName, "香港节点");
        $notification.post("Surge 自动化", "检测到境内 IP (CN)", "策略已自动切换至：代理节点");
    }
}

main().finally(() => $done());
