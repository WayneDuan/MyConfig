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
http-response ^https:\/\/(api\.revenuecat\.com\/v\d\/subscribers|vsco\.co\/api\/subscriptions\/\d\.\d\/user-subscriptions)\/ requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/WayneDuan/MyConfig/main/tte.js
[MITM]
hostname = api.revenuecat.com
**************************/
var objc = JSON.parse(body);
objc.data = [
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
