const WIFI_PROXYS = ['@HW'];

const mode = WIFI_PROXYS.includes($network.wifi.ssid)
    ? 'global-proxy'
    : 'rule';
  $surge.setOutboundMode(mode);
  $notification.post(
    'Surge',
    `Wi-Fi changed to ${$network.wifi.ssid || 'cellular'}`,
    `use ${mode} mode`
  );
$done();
