
/*
 *
 *
使用声明：⚠️此脚本仅供学习与交流，
        请勿转载与贩卖！⚠️⚠️⚠️
*******************************
[rewrite_local]

^https://m.client.10010.com/servicebusiness/newOrdered/queryOrderRelationship url script-response-body https://raw.githubusercontent.com/yqc007/QuantumultX/master/91GVCrack.js


[mitm] 
hostname = *.10010.com

var body = $response.body;
var hack = /"cancelFlag":\w+/g;
body = body.replace(hack,'"cancelFlag":4');
$done({
    body
});