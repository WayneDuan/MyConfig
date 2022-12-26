
var hausd0rff = $request.headers;
var data=JSON.stringify(hausd0rff).toLowerCase()
data['x-auth-token'] = 'eyJhbGciOiJIUzUxMiIsImlhdCI6MTY3MDg0MTYwMSwiZXhwIjoxNjg2MzkzNjAxfQ.eyJpZCI6MTEyNDM1MTY0fQ.cDXTx14EaNf1TJzihOxOoIB4lyfwKnNNSrXbDiBj43kXzkzkqfftQRAqE23WTCuxQ45VYB-1IadrwxG_t3QoNA';
console.log(data)
$done({headers : data});
