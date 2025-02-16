import TelegramBot from 'node-telegram-bot-api';

import { getFilesInDirectory, getOpenVPNConfig } from '../helpers';
import { config } from '../config';

// 🔑 Укажите ваш Telegram токен
const TOKEN = config.telegramBotToken;
const VPN_CONFIG_DIR = config.vpnConfigDir;
const ALLOWED_USERS = config.allowedUsers;

function isNotAllowed(data: { from?: { id: number } }): boolean {
  return !data.from?.id || !ALLOWED_USERS.includes(data.from.id);
}

export const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/current_config/, async (msg) => {
  if (isNotAllowed(msg)) {
    return;
  }
  const chatId = msg.chat.id;
  const currentConfig = await getOpenVPNConfig();
  const text = currentConfig
    ? `✅ Текущий конфиг: ${currentConfig}`
    : '❌ OpenVPN не запущен.';
  bot.sendMessage(chatId, text);
});

bot.onText(/\/available_configs/, async (msg) => {
  if (isNotAllowed(msg)) {
    return;
  }
  const chatId = msg.chat.id;
  const configs = await getFilesInDirectory(VPN_CONFIG_DIR);

  if (configs.length === 0) {
    bot.sendMessage(chatId, '❌ Нет доступных конфигов.');
    return;
  }

  // Генерация кнопок с конфигурациями
  const buttons = configs.map(({ name }) => [
    { text: name, callback_data: `set_config:${name}` },
  ]);

  bot.sendMessage(chatId, '📂 Выберите конфигурацию:', {
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
});

bot.on('callback_query', async (query) => {
  if (isNotAllowed(query)) {
    return;
  }
  const chatId = query.message?.chat.id;
  if (!query.data || !chatId) return;

  if (query.data.startsWith('set_config:')) {
    const configName = query.data.split(':')[1];

    // Здесь можно вызвать `setConfig(configName)` (пока оставил true для теста)
    const success = true;
    const resText = success ? '✅ Конфиг установлен!' : '❌ Ошибка установки.';
    bot.answerCallbackQuery(query.id, { text: resText });
    const text = success
      ? `✅ OpenVPN перезапущен с конфигурацией: ${configName}`
      : '❌ Ошибка при установке конфига.';
    bot.sendMessage(chatId, text);
  }
});

console.log('🤖 Telegram бот запущен!');
