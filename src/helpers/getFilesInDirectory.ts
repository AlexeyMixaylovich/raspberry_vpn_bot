import fs from 'fs/promises';
import path from 'path';

/**
 * Получает список файлов в указанной папке.
 * @param {string} dirPath - Путь к папке.
 * @returns {Promise<string[]>} - Список названий файлов.
 */

export type TFile = {
  name: string;
  fullPath: string;
};

export async function getFilesInDirectory(dirPath: string): Promise<TFile[]> {
  const absoluteDirPath = path.resolve(dirPath);
  const files = await fs.readdir(absoluteDirPath).catch((err) => {
    console.error(`Ошибка чтения директории: ${dirPath}: ${err.message}`);
  });
  return (files || []).map((file) => ({
    name: file,
    fullPath: path.join(absoluteDirPath, file), // Абсолютный путь к файлу
  }));
}
