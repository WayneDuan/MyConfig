const cellular_PROXYS = ['460-11'];
const network = JSON.parse(JSON.stringify($network))
const mcc = network['cellular-data']['carrier']
const wifi = $network.wifi.ssid

const mode = wifi == '' && cellular_PROXYS.includes(mcc)
    ? 'global-proxy'
    : 'rule';
$surge.setOutboundMode(mode);
$done();
