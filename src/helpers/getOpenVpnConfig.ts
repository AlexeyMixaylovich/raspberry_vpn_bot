import path from 'path';
import { execPromise } from './execPromise';

export const getConfigLines = async (): Promise<string[] | undefined> => {
  const res = await execPromise('ps aux | grep [o]penvpn');
  if (res.status === 'success') {
    return res.data.split('\n');
  }
  return undefined;
};

const getConfigLinesMock = (): Promise<string[] | undefined> => Promise.resolve([
  'root         750  0.0  0.4  10668  3848 ?        Ss   15:57   0:00 /usr/bin/sudo /usr/sbin/openvpn --config /home/alexey/opnen_vpn_config/Germany, Limburg S9.ovpn',
  'root         784  2.3  0.9  13700  8832 ?        S    15:57   4:23 /usr/sbin/openvpn --config /home/alexey/opnen_vpn_config/Germany, Limburg S9.ovpn',
]);
export async function getOpenVPNConfig(): Promise<string | undefined> {
  const lines = await getConfigLinesMock();
  if (!lines) {
    return undefined;
  }

  const filterLines = lines.filter((line) => line.includes('--config'));
  if (filterLines.length === 0) {
    return undefined;
  }

  // Найти путь к конфигурационному файлу
  const configMatch = lines[0].match(/--config\s+["']?([^"'\s]+[^"']+)["']?/);
  if (configMatch && configMatch[1]) {
    const configFileName = path.basename(configMatch[1]); // Извлекаем только имя файла
    return configFileName;
  }

  return undefined;
}
