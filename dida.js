/*
滴答清单解锁
***************************
QuantumultX:
[rewrite_local]
^https:\/\/dida365.com\/api/v2/user/status url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/dida.js
[mitm]
hostname = dida365.com
***************************
Surge4 or Loon: 
[Script]
http-response ^https:\/\/dida365.com\/api/v2/user/status requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/WayneDuan/MyConfig/main/dida.js
[MITM]
hostname = dida365.com
**************************/
var objc = JSON.parse(body);
objc = [
      {
        "userId": "1013918876",
  "username": "0lusmpfe@user.dida365.com",
  "proEndDate": "2099-01-01T00:00:00.000+0000",
  "needSubscribe": true,
  "inboxId": "inbox1013918876",
  "teamUser": false,
  "activeTeamUser": false,
  "freeTrial": false,
  "timeStamp": 1652951915934,
  "pro": true,
  "ds": true
      }
    ];
    body = JSON.stringify(objc);


$done({ 
    body 
});
