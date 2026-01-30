/**
 * Surge 自动切换策略 (兼容性最终版)
 * 逻辑：蜂窝网络下，有 IPv6 判定为国内卡，无 IPv6 判定为国外卡。Wi-Fi 下跳过。
 */

function main() {
    const proxyGroupName = "节点选择"; 
    const targetPolicy = "香港节点"; 

    const proxyGroupNamechina = "国内出口"; 
    const targetPolicy1 = "上海出口"; 

    // 1. Wi-Fi 环境拦截
    let ssid = $network?.wifi?.ssid;
    if (ssid) {
        $surge.setSelectGroupPolicy(proxyGroupName, targetPolicy);
        $surge.setSelectGroupPolicy(proxyGroupNamechina, "DIRECT");
        //console.log(`当前处于 Wi-Fi (${ssid})，保持原策略`);
        return;
    }

    // 2. 蜂窝网络数据获取
    // 漫游卡通常无 IPv6
    let hasV6 = ($network?.v6?.primaryAddress) ? true : false;
    let v4Addr = $network?.v4?.primaryAddress || "N/A";

    console.log(`网络检测: IPv4=${v4Addr}, HasIPv6=${hasV6}`);

    if (v4Addr === "N/A") return;

    // 3. 执行切换 (改用 $surge 提高兼容性)
    try {
        if (!hasV6) {
            // 无 IPv6 -> 国外卡 (如 3HK 漫游)
            $surge.setSelectGroupPolicy(proxyGroupName, "DIRECT");
            $surge.setSelectGroupPolicy(proxyGroupNamechina, targetPolicy1);
            $notification.post("Surge 自动化", "检测到国外卡", "已自动切换至：DIRECT");
        } else {
            // 有 IPv6 -> 国内运营商卡
            $surge.setSelectGroupPolicy(proxyGroupName, targetPolicy);
            $surge.setSelectGroupPolicy(proxyGroupNamechina, "DIRECT");
            $notification.post("Surge 自动化", "检测到国内卡", `已自动切换至：${targetPolicy}`);
        }
    } catch (e) {
        console.log("切换策略失败: " + e);
    }
}

main();
$done();
