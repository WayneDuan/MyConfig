var body = $response.body;
var objc = JSON.parse(body);
var timestamp = (new Date()).valueOf();
objc.data.pcsliderows={};
objc.data.v2sliderows={};

body = JSON.stringify(objc);

$done({
    body
});