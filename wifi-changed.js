const WIFI_PROXYS = ['@HW'];

const mode = WIFI_PROXYS.includes($network.wifi.ssid)
    ? 'global-proxy'
    : 'rule';
  $surge.setOutboundMode(mode);
$done();
