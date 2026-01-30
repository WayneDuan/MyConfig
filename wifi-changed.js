/**
 * Surge 自动切换策略 (基于 IP 归属地 - 增强版)
 * 事件: network-changed
 */

async function main() {
    const proxyGroupName = "节点选择"; 
    const targetPolicy = "香港节点"; 

    // 1. 等待网络稳定 (延迟 2 秒执行，避开切换瞬间的断网)
    await new Promise(r => setTimeout(r, 2000));

    let countryCode = "";

    // 2. 优先通过 API 获取 IP 归属地 (比内置 location 更准)
    try {
        let res = await $http.get({
            url: "https://api.mcloc.cn/ip", // 一个极简的 IP 地理位置 API
            timeout: 5000
        });
        // 假设返回格式包含 country_code 或直接是国家代码，这里以 myip.com 逻辑为例
        // 如果该 API 不可用，请替换为 https://api.myip.com/
        countryCode = JSON.parse(res.body).cc;
    } catch (e) {
        console.log("外部 API 查询失败，尝试使用 Surge 内置数据: " + e);
        countryCode = $network.location.countryCode;
    }

    console.log("检测到出口国家代码: " + countryCode);

    // 3. 执行切换逻辑
    if (countryCode && countryCode !== "CN") {
        // 非中国大陆 IP -> 切换至直连
        $surgetool.setSelectGroupPolicy(proxyGroupName, "DIRECT");
        $notification.post("Surge 自动化", "境外网络 (" + countryCode + ")", "已切换至：DIRECT");
    } else if (countryCode === "CN") {
        // 中国大陆 IP -> 切换至香港节点
        $surgetool.setSelectGroupPolicy(proxyGroupName, targetPolicy);
        $notification.post("Surge 自动化", "境内网络 (CN)", "已切换至：" + targetPolicy);
    } else {
        console.log("未能获取到有效的国家代码，不执行切换");
    }
}

main().finally(() => $done());
