/**
 * Surge 自动切换策略 (通用合并版)
 * 参数格式：策略组名称,国内/WiFi目标策略
 * 示例：argument="节点选择,日本节点"
 */

function main() {
    // 1. 获取并解析参数
    if (typeof $argument === "undefined" || !$argument) {
        console.log("错误：未检测到 argument 参数。请在配置中添加 argument='策略组,策略'");
        $done();
        return;
    }

    const args = $argument.split(",");
    if (args.length < 2) {
        console.log("错误：参数格式错误。应为 '策略组,策略'");
        $done();
        return;
    }

    const proxyGroupName = args[0].trim();  // 对应你的 "节点选择"
    const targetPolicy = args[1].trim();    // 对应你的 "日本节点"

    // 2. 环境判定
    const ssid = $network?.wifi?.ssid;
    const v6Addr = $network?.v6?.primaryAddress;
    const v4Addr = $network?.v4?.primaryAddress;

    console.log(`[网络检测] SSID: ${ssid || "N/A"}, IPv4: ${v4Addr || "N/A"}, HasIPv6: ${!!v6Addr}`);

    // 3. 执行逻辑
    if (ssid) {
        // --- Wi-Fi 环境 ---
        $surge.setSelectGroupPolicy(proxyGroupName, targetPolicy);
        console.log(`Wi-Fi 环境: 已确保 ${proxyGroupName} 切换至 ${targetPolicy}`);
    } else if (v4Addr) {
        // --- 蜂窝网络环境 ---
        if (!v6Addr) {
            // 无 IPv6 -> 判定为国外卡 (如 3HK/CTM 漫游)
            $surge.setSelectGroupPolicy(proxyGroupName, "DIRECT");
            console.log("检测到国外漫游卡: 已切换至 DIRECT");
        } else {
            // 有 IPv6 -> 判定为国内运营商
            $surge.setSelectGroupPolicy(proxyGroupName, targetPolicy);
            console.log(`检测到国内卡: 已切换至 ${targetPolicy}`);
        }
    }
}

main();
$done();
