
/*
 *
 *
使用声明：⚠️此脚本仅供学习与交流，
        请勿转载与贩卖！⚠️⚠️⚠️
*******************************
[rewrite_local]

^https://m.client.10010.com/servicebusiness/newOrdered/queryOrderRelationship url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/100.js


[mitm] 
hostname = *.10010.com
*
*
*/
var body = $response.body;
var objc = JSON.parse(body);

objc.data.otherProductInfo.forEach(
        (x) => {
            if (x.cancelFlag == '0') {
                x.cancelFlag = '1';
            }
        }
    );

body = JSON.stringify(objc);

$done({ 
    body 
});
