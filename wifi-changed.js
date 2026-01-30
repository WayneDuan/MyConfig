/**
 * Surge 自动切换策略 (重试增强版)
 * 事件: network-changed
 */

async function main() {
    const proxyGroupName = "节点选择"; 
    const targetPolicy = "香港节点"; 
    let maxTries = 10; // 最多尝试 10 次
    let currentTry = 0;

    while (currentTry < maxTries) {
        currentTry++;
        // 直接读取 Surge 内置的地理位置数据
        let countryCode = $network.location ? $network.location.countryCode : "";
        
        console.log(`第 ${currentTry} 次检测，国家代码: ${countryCode}`);

        if (countryCode) {
            if (countryCode !== "CN") {
                // 境外 IP (如 3HK 漫游显示的 HK)
                $surgetool.setSelectGroupPolicy(proxyGroupName, "DIRECT");
                $notification.post("Surge 自动化", `检测到境外网络 (${countryCode})`, "策略已切换至：DIRECT");
            } else {
                // 境内 IP (CN)
                $surgetool.setSelectGroupPolicy(proxyGroupName, targetPolicy);
                $notification.post("Surge 自动化", "检测到境内网络 (CN)", `策略已切换至：${targetPolicy}`);
            }
            return; // 成功获取并执行，直接退出脚本
        }

        // 如果没拿到，等 1 秒再试
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log("超过最大尝试次数，未能获取到有效国家代码");
}

main().finally(() => $done());
