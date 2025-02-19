import fs from 'fs/promises';
import { existsSync } from 'fs';

import { execPromise } from './execPromise';

/**
 * Перезапускает OpenVPN с новым конфигурационным файлом.
 * @param {string} newConfigPath - Полный путь к новому конфигу OpenVPN (.ovpn).
 * @returns {Promise<void>}
 */
export async function restartOpenVPNWithConfig(newConfigPath: string): Promise<boolean> {
  const serviceFilePath = '/etc/systemd/system/openvpn-autostart.service';
  if (!existsSync(newConfigPath)) {
    console.error(`❌ Ошибка: Файл конфигурации не найден: ${newConfigPath}`);
    return false;
  }
  const file = await fs.readFile(serviceFilePath, 'utf8').catch((readErr) => {
    console.error(`❌ Ошибка чтения systemd-файла: ${readErr.message}`);
    return undefined;
  });
  if (!file) {
    return false;
  }
  const updatedServiceFile = file.replace(/(--config\s+")(.*?)(")/, `$1${newConfigPath}$3`);

  const updatedFile = await fs.writeFile(serviceFilePath, updatedServiceFile, 'utf8')
    .then(() => 'success')
    .catch((writeErr) => {
      console.error(`❌ Ошибка записи systemd-файла: ${writeErr.message}`);
      return 'error';
    });
  if (updatedFile === 'error') {
    return false;
  }
  const { status } = await execPromise('sudo systemctl daemon-reload && sudo systemctl restart openvpn-autostart.service');
  return status === 'success';
}
