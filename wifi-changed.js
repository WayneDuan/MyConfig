/**
 * 支持模块参数解析的自动切换脚本
 */

function main() {
    // 1. 解析模块传入的 {{{ARG}}} 参数
    const params = new URLSearchParams($argument || "");
    const proxyGroupName = params.get("GROUP") || "节点选择";
    const targetPolicy = params.get("TARGET") || "日本节点";
    const wifiEnable = params.get("WIFI") === "1";
    const v6Enable = params.get("V6") === "1";

    const ssid = $network?.wifi?.ssid;
    const v6Addr = $network?.v6?.primaryAddress;
    const v4Addr = $network?.v4?.primaryAddress;

    console.log(`[自动切换] 目标组: ${proxyGroupName}, 默认策略: ${targetPolicy}`);

    // 2. Wi-Fi 逻辑
    if (ssid) {
        if (wifiEnable) {
            $surge.setSelectGroupPolicy(proxyGroupName, targetPolicy);
            console.log("Wi-Fi 环境，已设为: " + targetPolicy);
        }
        $done();
        return;
    }

    // 3. 蜂窝网络逻辑
    if (v4Addr) {
        if (v6Enable && !v6Addr) {
            // 无 IPv6 判定为国外卡
            $surge.setSelectGroupPolicy(proxyGroupName, "DIRECT");
            console.log("检测到国外漫游卡，已设为: DIRECT");
        } else {
            // 有 IPv6 或未开启 V6 判定，判定为国内正常环境
            $surge.setSelectGroupPolicy(proxyGroupName, targetPolicy);
            console.log("检测到国内网络，已设为: " + targetPolicy);
        }
    }
}

main();
$done();
