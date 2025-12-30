/**
 * Loon 运营商自动切换脚本 (支持 Argument 传参)
 * 参数格式：{"group":"策略组名","cmcc":"移动节点","cu":"联通节点","ct":"电信节点","default":"默认节点"}
 */

let arg = {};
try {
    arg = JSON.parse($argument);
} catch (e) {
    $notification.post("运营商脚本错误", "", "参数解析失败，请检查插件配置");
    $done();
}

const groupName = arg.group || "手动选择";
const CMCC_Node = arg.cmcc || "移动专线";
const CU_Node = arg.cu || "联通专线";
const CT_Node = arg.ct || "电信专线";
const Default_Node = arg.default || "自动选择";

const cellularInfo = $network.cellular;

if (cellularInfo && cellularInfo.mnc) {
    const mnc = cellularInfo.mnc;
    let targetNode = Default_Node;
    let carrierName = "未知";

    // 中国移动
    if (["00", "02", "04", "07"].includes(mnc)) {
        targetNode = CMCC_Node;
        carrierName = "中国移动";
    } 
    // 中国联通
    else if (["01", "06", "09"].includes(mnc)) {
        targetNode = CU_Node;
        carrierName = "中国联通";
    } 
    // 中国电信
    else if (["03", "05", "11"].includes(mnc)) {
        targetNode = CT_Node;
        carrierName = "中国电信";
    }

    // 执行切换
    const currentStatus = $configuration.selectProxy(groupName, targetNode);
    if (currentStatus) {
        $notification.post("Loon 环境切换", `检测到${carrierName}`, `已自动切换至：${targetNode}`);
    }
} else {
    // 非蜂窝网络（如 Wi-Fi）可在此处增加逻辑，或保持现状
    console.log("非蜂窝网络环境，跳过运营商检测");
}

$done();
