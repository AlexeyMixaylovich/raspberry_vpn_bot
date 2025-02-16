export const config = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN!,
  vpnConfigDir: process.env.VPN_CONFIG_DIR!,
  allowedUsers: (process.env.ALLOWED_USERS || '').split(',').map((id) => parseInt(id, 10)),
};
