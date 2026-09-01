const axios = require('axios');

/**
 * Envia un mensaje a travs de Telegram
 * @param {string} message - El mensaje a enviar (soporta Markdown / Emojis)
 */
const sendTelegramAlert = async (message) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('[AlertService] Notificacin omitida porque TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no estn configurados. Mensaje:', message);
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });
    return true;
  } catch (error) {
    console.error('[AlertService] Error enviando alerta de Telegram:', error.message);
    return false;
  }
};

module.exports = {
  sendTelegramAlert
};
