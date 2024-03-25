/*
滴答清单解锁
***************************
QuantumultX:
[rewrite_local]
^https:\/\/dida365.com\/api/v2/user/status url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/dida.js
[mitm]
hostname = dida365.com
***************************
*/

var body = $response.body;
var objc = JSON.parse(body);
var timestamp = (new Date()).valueOf();
objc.username= "我是叼毛安妮";
objc.proEndDate= "2999-09-28T00:00:00.000+0000";
objc.pro= true;
objc.teamPro= true;    
body = JSON.stringify(objc);

$done({ 
    body 
});
