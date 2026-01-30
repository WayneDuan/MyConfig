/**
 * Surge 自动切换策略 (极简不超时版)
 */
function main() {
    const proxyGroupName = "节点选择"; 
    const targetPolicy = "香港节点"; 
    
    // 获取当前运营商名称和国家代码
    let countryCode = $network.location ? $network.location.countryCode : "";
    let carrier = $network.cellular.carrier;

    console.log(`检测执行: Carrier=${carrier}, GeoIP=${countryCode}`);

    // 逻辑 1: 如果 GeoIP 已经识别出非 CN，直接切直连
    if (countryCode && countryCode !== "CN") {
        $surgetool.setSelectGroupPolicy(proxyGroupName, "DIRECT");
        $notification.post("Surge 自动化", "境外网络 (" + countryCode + ")", "策略：DIRECT");
    } 
    // 逻辑 2: 如果 GeoIP 是 CN，切代理
    else if (countryCode === "CN") {
        $surgetool.setSelectGroupPolicy(proxyGroupName, targetPolicy);
        $notification.post("Surge 自动化", "境内网络 (CN)", "策略：" + targetPolicy);
    }
    // 逻辑 3: 如果 GeoIP 还没出来，但运营商是 3HK，先盲切直连 (针对漫游优化)
    else if (carrier === "3HK" || carrier === "3") {
        $surgetool.setSelectGroupPolicy(proxyGroupName, "DIRECT");
    }
}

main();
$done();
