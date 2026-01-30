/**
 * Surge 自动切换策略 (基于 IPv6 判定 + Wi-Fi 排除版)
 * 逻辑：
 * 1. 连着 Wi-Fi 时：不执行动作，保持用户手动选定的策略。
 * 2. 蜂窝数据下：有 IPv6 则判为国内卡（代理），无 IPv6 则判为国外卡（直连）。
 */

function main() {
    const proxyGroupName = "节点选择"; 
    const targetPolicy = "香港节点"; 

    // 获取 Wi-Fi 信息
    let ssid = $network?.wifi?.ssid;
    
    // 1. 如果 SSID 存在，说明在 Wi-Fi 环境下，直接退出
    if (ssid) {
        console.log(`当前处于 Wi-Fi 网络 (${ssid})，跳过自动切换`);
        return;
    }

    // 2. 蜂窝网络下的 IPv6 判定逻辑
    let hasV6 = ($network && $network.v6 && $network.v6.primaryAddress) ? true : false;
    let v4Addr = $network && $network.v4 ? $network.v4.primaryAddress : "N/A";

    console.log(`蜂窝网络检测: IPv4=${v4Addr}, HasIPv6=${hasV6}`);

    if (v4Addr === "N/A") {
        console.log("未检测到有效蜂窝网络 IP，跳过本次切换");
        return;
    }

    if (!hasV6) {
        // 无 IPv6 -> 判定为 3HK 等国外漫游卡
        $surgetool.setSelectGroupPolicy(proxyGroupName, "DIRECT");
        $notification.post("Surge 自动化", "切换至国外卡 (无 IPv6)", "策略：DIRECT");
    } else {
        // 有 IPv6 -> 判定为国内运营商卡
        $surgetool.setSelectGroupPolicy(proxyGroupName, targetPolicy);
        $notification.post("Surge 自动化", "切换至国内卡 (有 IPv6)", `策略：${targetPolicy}`);
    }
}

main();
$done();
