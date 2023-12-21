var body = $response.body;
var objc = JSON.parse(body);
var timestamp = (new Date()).valueOf();
objc.data={};

body = JSON.stringify(objc);

$done({
    body
});