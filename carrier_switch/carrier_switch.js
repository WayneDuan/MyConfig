/**
 * Loon 运营商自动切换脚本 (官方 API 适配版)
 */

// 1. 解析参数
let args = {};
if (typeof $argument !== "undefined" && $argument) {
    // 自动处理空格并解析
    $argument.split("&").forEach(item => {
        let pair = item.split("=");
        if (pair.length === 2) {
            args[pair[0].trim()] = pair[1].trim();
        }
    });
}

// 获取配置参数
const groupName = args.group || "手动选择";
const CMCC_Node = args.cmcc || "移动专线";
const CU_Node = args.cu || "联通专线";
const CT_Node = args.ct || "电信专线";
const Default_Node = args.default || "自动选择";

// 2. 获取 Loon 网络信息
// 根据官网文档，$info 包含当前网络状态
const networkInfo = (typeof $info !== "undefined") ? $info.network : null;

if (networkInfo && networkInfo.cellular) {
    const mnc = networkInfo.cellular.mnc;
    let targetNode = Default_Node;
    let carrierName = "未知";

    // MNC 匹配逻辑
    if (["00", "02", "04", "07", "08"].includes(mnc)) {
        targetNode = CMCC_Node;
        carrierName = "中国移动";
    } else if (["01", "06", "09"].includes(mnc)) {
        targetNode = CU_Node;
        carrierName = "中国联通";
    } else if (["03", "05", "11"].includes(mnc)) {
        targetNode = CT_Node;
        carrierName = "中国电信";
    }

    // 3. 执行切换 (Loon 的选组 API)
    const success = $configuration.selectProxy(groupName, targetNode);
    
    if (success) {
        $notification.post("Loon 自动切换", `检测到${carrierName}`, `策略组[${groupName}] -> ${targetNode}`);
    } else {
        // 如果失败，可能是策略组或节点名没对上
        console.log(`[Error] 切换失败。请检查：\n1. 策略组名是否为: ${groupName}\n2. 节点名是否为: ${targetNode}`);
    }
} else {
    console.log("当前非蜂窝网络或尚未获取到网络信息。");
}

$done();
