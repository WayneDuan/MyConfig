/**
 * Loon 运营商自动切换脚本 (Argument 版)
 * 参数示例：group=策略组名&cmcc=移动节点&cu=联通节点&ct=电信节点&default=默认节点
 */

// 解析 Argument 参数 (支持 key=value&key2=value2 格式)
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

const cellularInfo = $network.cellular;

if (cellularInfo && cellularInfo.mnc) {
    const mnc = cellularInfo.mnc;
    let targetNode = Default_Node;
    let carrierName = "未知";

    // MNC 映射逻辑
    if (["00", "02", "04", "07"].includes(mnc)) {
        targetNode = CMCC_Node;
        carrierName = "中国移动";
    } else if (["01", "06", "09"].includes(mnc)) {
        targetNode = CU_Node;
        carrierName = "中国联通";
    } else if (["03", "05", "11"].includes(mnc)) {
        targetNode = CT_Node;
        carrierName = "中国电信";
    }

    // 执行切换
    // $configuration.selectProxy(策略组, 节点) 返回的是布尔值
    const success = $configuration.selectProxy(groupName, targetNode);
    
    if (success) {
        $notification.post("Loon 自动切换", `检测到${carrierName}`, `已切换至：${targetNode}`);
    } else {
        console.log(`切换失败，请检查策略组[${groupName}]或节点[${targetNode}]名称是否正确`);
    }
} else {
    console.log("当前非蜂窝网络，不执行运营商切换");
}

$done();
