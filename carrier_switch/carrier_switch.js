/**
 * Loon 运营商自动切换脚本 (修复版)
 * 使用 Loon 官方支持的 $info 对象获取网络信息
 */

// 1. 解析 Argument
const args = {};
if (typeof $argument !== "undefined" && $argument) {
    $argument.split("&").forEach(item => {
        const [key, value] = item.split("=");
        args[key] = value;
    });
}

const groupName = args.group || "手动选择";
const CMCC_Node = args.cmcc || "移动专线";
const CU_Node = args.cu || "联通专线";
const CT_Node = args.ct || "电信专线";
const Default_Node = args.default || "自动选择";

// 2. 获取网络信息 (Loon 使用 $info.network)
const info = $info;
const network = info.network;

console.log("Loon Network Info: " + JSON.stringify(network));

// 3. 判断是否为蜂窝网络并获取 MNC
// network.cellular 可能在某些环境下为 null，需要安全访问
if (network && network.cellular) {
    const mnc = network.cellular.mnc; // 移动网络代码
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

    // 4. 执行切换
    const success = $configuration.selectProxy(groupName, targetNode);
    
    if (success) {
        $notification.post("Loon 自动切换", `检测到${carrierName} (MNC: ${mnc})`, `策略组[${groupName}]已切换至：${targetNode}`);
    } else {
        console.log(`切换失败：请检查策略组[${groupName}]或节点[${targetNode}]是否存在`);
    }
} else {
    console.log("非蜂窝网络或无法读取运营商信息，脚本跳过");
}

$done();
