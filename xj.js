/*
测试香蕉视频
***************************
QuantumultX:
[rewrite_local]
^https?:\/\/.*megdnvg.*\.cn\/ucp\/index url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/xj.js
^https?:\/\/.*megdnvg.*\.cn\/index url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/xjad.js

^https?:\/\/.*megdnvg.*\.cn\/game\/(games|broadcasts) url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/xjgame.js
[mitm]
hostname = *.megdnvg.cn
***************************
*/
var body = $response.body;
var objc = JSON.parse(body);
var timestamp = (new Date()).valueOf();
objc = {
    "retcode": 0,
    "errmsg": "",
    "data": {
        "uinfo": {
            "goldcoin": "0",
            "down_daily_remainders": 44444440,
            "curr_group": null,
            "minivod_play_daily_remainders": 300000,
            "minivod_down_daily_remainders": 300000,
            "next_upgrade_need": 444444440,
            "play_daily_remainders": 500000,
            "next_group": null
        },
        "user": {
            "duetime": "2999-09-28",
            "sysgid": null,
            "uid": 89870,
            "uniqkey": "0",
            "gids": null,
            "avatar_url": "https://c1220.xjimg3.cc:17856/sysavatar/noavatar.png",
            "newmsg": null,
            "gicon": "",
            "gid": null,
            "avatar": null,
            "dueday": "",
            "mobi": null,
            "username": '哇一本',
            "goldcoin": 0,
            "regtime": "2022-09-28 08:00:00",
            "nickname": '哇一本',
            "email": 'mk@mk163.com',
            "isvip": 1,
            "gender": 0
        },
        "signed": 1
    }
};

body = JSON.stringify(objc);

$done({
    body
});
