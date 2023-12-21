var body = $response.body;
var objc = JSON.parse(body);
var timestamp = (new Date()).valueOf();
objc = {
    "retcode" : 0,
  "errmsg" : "",
  "data" : {
    "data" : [
    ]
  }

};

body = JSON.stringify(objc);

$done({
    body
});
