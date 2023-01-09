const cellular_PROXYS = ['460-11'];
const network = JSON.parse(JSON.stringify($network))
const mcc = network['cellular-data']['carrier']
const wifi = $network.wifi.ssid
console.log(wifi)
const mode = wifi == null && cellular_PROXYS.includes(mcc)
    ? 'global-proxy'
    : 'rule';

console.log(mode)
$surge.setOutboundMode(mode);
$done();
