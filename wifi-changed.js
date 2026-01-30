/**
 * Surge 自动切换策略 (基于 IPv6 判定版)
 * 逻辑：国内卡通常有 IPv6 (2409/2408/240c)，国外漫游卡通常无 IPv6
 */

function main() {
    const proxyGroupName = "节点选择"; 
    const targetPolicy = "香港节点"; 

    // 获取 IPv6 地址
    let hasV6 = ($network && $network.v6 && $network.v6.primaryAddress) ? true : false;
    let v4Addr = $network && $network.v4 ? $network.v4.primaryAddress : "N/A";

    console.log(`检测执行: IPv4=${v4Addr}, HasIPv6=${hasV6}`);

    // 判定逻辑
    if (!hasV6 && v4Addr !== "N/A") {
        // 没有 IPv6 且有 IPv4 地址 -> 判定为国外卡 (3HK)
        $surgetool.setSelectGroupPolicy(proxyGroupName, "DIRECT");
        $notification.post("Surge 自动化", "检测到国外卡网络 (无 IPv6)", "策略已切换至：DIRECT");
    } else if (hasV6) {
        // 存在 IPv6 -> 判定为国内卡
        $surgetool.setSelectGroupPolicy(proxyGroupName, targetPolicy);
        $notification.post("Surge 自动化", "检测到国内卡网络 (有 IPv6)", `策略已切换至：${targetPolicy}`);
    } else {
        console.log("未检测到有效网络接口，跳过切换");
    }
}

main();
$done();
