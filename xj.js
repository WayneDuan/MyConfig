/*
测试香蕉视频
***************************
QuantumultX:
[rewrite_local]
^https?:\/\/.*megdnvg.*\.cn\/ucp\/index url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/xj.js
^https?:\/\/.*megdnvg.*\.cn\/index url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/xjad.js
^https?:\/\/.*megdnvg.*\.cn\/getGlobalData url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/xjjd.js
^https?:\/\/.*megdnvg.*\.cn\/game\/(games|broadcasts) url script-response-body https://raw.githubusercontent.com/WayneDuan/MyConfig/main/xjgame.js
[mitm]
hostname = *.megdnvg.cn
***************************
*/
var body = $response.body;
var objc = JSON.parse(body);
var timestamp = (new Date()).valueOf();
objc = {
  "retcode" : 0,
  "errmsg" : "",
  "data" : {
    "signed" : 0,
    "uinfo" : {
      "goldcoin" : "5",
      "down_daily_remainders" : 200,
      "curr_group" : {
        "minup" : "1000000",
        "gicon" : "V6",
        "gid" : "6",
        "gname" : "尊贵VIP"
      },
      "minivod_play_daily_remainders" : 999,
      "minivod_down_daily_remainders" : 200,
      "next_upgrade_need" : 2000000,
      "play_daily_remainders" : 999,
      "next_group" : {
        "minup" : "2000000",
        "gicon" : "V7",
        "gid" : "7",
        "gname" : "禁止发言"
      }
    },
    "groups" : [
      {
        "gname" : "游客",
        "gicon" : "V0",
        "play_daynum" : 5,
        "minivod_play_daynum" : 30,
        "minup" : "0",
        "minivod_down_daynum" : 30,
        "down_daynum" : 0,
        "comment_daynum" : 5
      },
      {
        "gname" : "VIP1",
        "gicon" : "V1",
        "play_daynum" : 10,
        "minivod_play_daynum" : 60,
        "minup" : "0",
        "minivod_down_daynum" : 50,
        "down_daynum" : 3,
        "comment_daynum" : 1
      },
      {
        "gname" : "VIP2",
        "gicon" : "V2",
        "play_daynum" : 16,
        "minivod_play_daynum" : 80,
        "minup" : "1",
        "minivod_down_daynum" : 80,
        "down_daynum" : 6,
        "comment_daynum" : 2
      },
      {
        "gname" : "VIP3",
        "gicon" : "V3",
        "play_daynum" : 25,
        "minivod_play_daynum" : 100,
        "minup" : "3",
        "minivod_down_daynum" : 100,
        "down_daynum" : 12,
        "comment_daynum" : 3
      },
      {
        "gname" : "VIP4",
        "gicon" : "V4",
        "play_daynum" : 40,
        "minivod_play_daynum" : 150,
        "minup" : "6",
        "minivod_down_daynum" : 150,
        "down_daynum" : 30,
        "comment_daynum" : 4
      },
      {
        "gname" : "荣誉VIP",
        "gicon" : "V5",
        "play_daynum" : 999,
        "minivod_play_daynum" : 999,
        "minup" : "10",
        "minivod_down_daynum" : 200,
        "down_daynum" : 50,
        "comment_daynum" : 5
      },
      {
        "gname" : "尊贵VIP",
        "gicon" : "V6",
        "play_daynum" : 999,
        "minivod_play_daynum" : 999,
        "minup" : "1000000",
        "minivod_down_daynum" : 200,
        "down_daynum" : 200,
        "comment_daynum" : 50
      },
      {
        "gname" : "禁止发言",
        "gicon" : "V7",
        "play_daynum" : 0,
        "minivod_play_daynum" : 0,
        "minup" : "2000000",
        "minivod_down_daynum" : 0,
        "down_daynum" : 0,
        "comment_daynum" : 0
      }
    ],
    "user" : {
      "duetime" : "2023-12-24 21:22:31",
      "sysgid" : "6",
      "uid" : "21145049",
      "uniqkey" : "H7HSAL",
      "gids" : null,
      "avatar_url" : "https://c1220.xjimg3.cc:17856/sysavatar/man/7.png",
      "newmsg" : "1",
      "gicon" : "V6",
      "gid" : "1",
      "avatar" : "sysavatar/man/7.png",
      "dueday" : "2天后过期",
      "mobi" : "853.63527458",
      "username" : "~1040512125",
      "goldcoin" : 5,
      "regtime" : "2023-12-21 21:22:31",
      "nickname" : "",
      "email" : "~1040512125",
      "isvip" : 1,
      "gender" : 1
    }
  }
};

body = JSON.stringify(objc);

$done({
    body
});
