/*
测试香蕉视频
***************************
QuantumultX:
[rewrite_local]
^https?:\/\/.*cjxxapi.*\/index url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/xjad.js
^https?:\/\/.*cjxxapi.*\/getGlobalData url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/xxjd.js
^https?:\/\/.*cjxxapi.*\/game\/(games|broadcasts) url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/xjgame.js
[mitm]
hostname = *.cjxxapi.*
***************************
*/
var body = $response.body;
var objc = JSON.parse(body);
var timestamp = (new Date()).valueOf();
body = JSON.stringify(objc);
$done({
    body
});
