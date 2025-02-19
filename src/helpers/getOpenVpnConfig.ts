import path from 'path';
import { execPromise } from './execPromise';

const getConfigLines = async (): Promise<string[] | undefined> => {
  const res = await execPromise('ps aux | grep [o]penvpn');
  if (res.status === 'success') {
    return res.data.split('\n');
  }
  return undefined;
};

export async function getOpenVPNConfig(): Promise<string | undefined> {
  const lines = await getConfigLines();
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
