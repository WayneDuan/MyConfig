/**
 * Surge 自动切换策略 (内置变量版)
 * 事件: network-changed
 */

function main() {
    const proxyGroupName = "节点选择"; 
    const targetPolicy = "香港节点"; 

    // 直接读取 Surge 内置的地理位置数据
    // 注意：Surge 的地理位置信息可能在网络切换后几秒内更新
    let countryCode = $network.location ? $network.location.countryCode : "";

    console.log("Surge 内置国家代码: " + countryCode);

    if (countryCode && countryCode !== "CN") {
        // 境外 IP -> 直连
        $surgetool.setSelectGroupPolicy(proxyGroupName, "DIRECT");
        $notification.post("Surge 自动化", "检测到境外出口 (" + countryCode + ")", "策略已切换至：DIRECT");
    } else if (countryCode === "CN") {
        // 境内 IP -> 代理
        $surgetool.setSelectGroupPolicy(proxyGroupName, targetPolicy);
        $notification.post("Surge 自动化", "检测到境内出口 (CN)", "策略已切换至：" + targetPolicy);
    } else {
        // 如果国家代码为空，通常是因为网络尚未完全连接
        console.log("国家代码为空，跳过本次切换");
    }
}

// 这里的 $done() 必须在同步逻辑末尾
main();
$done();
