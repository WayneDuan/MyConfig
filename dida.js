/*
滴答清单解锁
***************************
QuantumultX:
[rewrite_local]
^https:\/\/dida365.com\/api/v2/user/status url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/dida.js
[mitm]
hostname = dida365.com
***************************

var body = $response.body;
var objc = JSON.parse(body);
var timestamp = (new Date()).valueOf();
objc = {
        "userId": "1013918876",
  "username": "0lusmpfe@user.dida365.com",
  "proEndDate": "2999-09-28T00:00:00.000+0000",
  "needSubscribe": false,
  "inboxId": "inbox1013918876",
  "teamUser": false,
  "activeTeamUser": false,
  "freeTrial": true,
  "timeStamp": timestamp,
  "pro": true,
  "ds": true
      };
    
body = JSON.stringify(objc);

$done({ 
    body 
});
