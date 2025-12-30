/**
 * Loon 运营商自动切换脚本 (修复 $network 报错版)
 * 参数：group=策略组名&cmcc=移动节点&cu=联通节点&ct=电信节点&default=默认节点
 */

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

// 在 Loon 中，通过 $info 获取当前连接信息或使用 $network 的特定子集
// 如果是 network-changed 触发，我们直接读取当前网络节点状态
const networkInfo = $network; 

// 调试日志：如果切换不成功，请在 Loon 日志中查看此输出
console.log("当前网络详情: " + JSON.stringify(networkInfo));

const cellularInfo = networkInfo.v4 && networkInfo.v4.primaryInterface === "pdp_ip0" ? networkInfo.cellular : null;

if (cellularInfo && cellularInfo.mnc) {
    const mnc = cellularInfo.mnc;
    let targetNode = Default_Node;
    let carrierName = "未知运营商";

    // MNC 映射
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

    const success = $configuration.selectProxy(groupName, targetNode);
    
    if (success) {
        $notification.post("Loon 自动切换", `检测到${carrierName} (MNC: ${mnc})`, `已切换至：${targetNode}`);
    } else {
        console.log(`切换失败：请检查策略组[${groupName}]和节点[${targetNode}]名称`);
    }
} else {
    console.log("非蜂窝网络或无法读取 MNC，跳过切换");
}

$done();
