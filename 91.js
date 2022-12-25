
var hausd0rff = $request.headers;
console.log(hausd0rff)
hausd0rff['x-auth-token'] = 'eyJhbGciOiJIUzUxMiIsImlhdCI6MTY3MDg0MTYwMSwiZXhwIjoxNjg2MzkzNjAxfQ.eyJpZCI6MTEyNDM1MTY0fQ.cDXTx14EaNf1TJzihOxOoIB4lyfwKnNNSrXbDiBj43kXzkzkqfftQRAqE23WTCuxQ45VYB-1IadrwxG_t3QoNA';
$done({headers : hausd0rff});
