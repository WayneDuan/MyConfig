const WIFI_PROXYS = ['@HW'];
const CURRENT_WIFI_SSID_KEY = '';

if (wifiChanged()) {
  const mode = WIFI_PROXYS.includes($network.wifi.ssid)
    ? 'global-proxy'
    : 'rule';
  $surge.setOutboundMode(mode);
  $notification.post(
    'Surge',
    `Wi-Fi changed to ${$network.wifi.ssid || 'cellular'}`,
    `use ${mode} mode`
  );
}

function wifiChanged() {
  const currentWifiSSid = $persistentStore.read(CURRENT_WIFI_SSID_KEY);
  const changed = currentWifiSSid !== $network.wifi.ssid;
  changed && $persistentStore.write($network.wifi.ssid, CURRENT_WIFI_SSID_KEY);
  return changed;
}

$done();
