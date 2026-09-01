const fs = require('fs');
const { Blob } = require('buffer');
const { sendTelegramAlert } = require('./alertService');
const path = require('path');

async function sendDatabaseBackupToTelegram() {
  try {
    const dbPath = path.join(__dirname, '..', 'waygas.sqlite');
    
    if (!fs.existsSync(dbPath)) {
      console.log("[Backup] Error: No se encontró la base de datos.");
      return;
    }

    const fileBuffer = fs.readFileSync(dbPath);
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.log("[Backup] Error: Faltan las credenciales de Telegram.");
      return;
    }

    const formData = new FormData();
    formData.append('document', new Blob([fileBuffer]), 'waygas.sqlite');
    formData.append('chat_id', chatId);
    formData.append('caption', '📦 *Backup Automático Semanal*\n\nAquí tienes la copia de seguridad de la base de datos de WayGass. Guárdala en un lugar seguro.\n\nFecha: ' + new Date().toLocaleString('es-ES'));

    // Envío usando Node.js 22 fetch nativo (sin dependencias extra)
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument?parse_mode=Markdown`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (result.ok) {
      console.log(`[Backup] ✅ Copia de seguridad enviada a Telegram con éxito.`);
    } else {
      console.error(`[Backup] ❌ Error de Telegram:`, result.description);
    }
  } catch (error) {
    console.error(`[Backup] ❌ Error crítico al enviar backup:`, error.message);
  }
}

module.exports = { sendDatabaseBackupToTelegram };
