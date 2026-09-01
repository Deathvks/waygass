const os = require('os');
const { sendTelegramAlert } = require('./alertService');

// Umbrales de alerta (en porcentaje)
const CPU_THRESHOLD = 90; 
const RAM_THRESHOLD = 90;

let lastCpuMeasure = getCpuUsage();
let isAlerting = false; // Para no spamear mensajes repetidos si sigue alto

function getCpuUsage() {
  const cpus = os.cpus();
  let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;
  for (let cpu of cpus) {
    user += cpu.times.user;
    nice += cpu.times.nice;
    sys += cpu.times.sys;
    idle += cpu.times.idle;
    irq += cpu.times.irq;
  }
  return { idle, total: user + nice + sys + idle + irq };
}

const checkSystemHealth = async () => {
  // 1. Calcular CPU
  const currentCpuMeasure = getCpuUsage();
  const idleDifference = currentCpuMeasure.idle - lastCpuMeasure.idle;
  const totalDifference = currentCpuMeasure.total - lastCpuMeasure.total;
  const cpuPercent = totalDifference === 0 ? 0 : 100 - Math.floor(100 * idleDifference / totalDifference);
  lastCpuMeasure = currentCpuMeasure;

  // 2. Calcular RAM
  const totalRam = os.totalmem();
  const freeRam = os.freemem();
  const usedRam = totalRam - freeRam;
  const ramPercent = Math.floor(100 * usedRam / totalRam);

  // 3. Comprobar umbrales
  if (cpuPercent >= CPU_THRESHOLD || ramPercent >= RAM_THRESHOLD) {
    if (!isAlerting) {
      isAlerting = true;
      const msg = `\uD83D\uDEA8 <b>ALERTA DE RECURSOS</b> \uD83D\uDEA8\n\nEl servidor est\u00e1 sufriendo una carga cr\u00edtica:\n\n\uD83D\uDDA5\uFE0F <b>CPU:</b> ${cpuPercent}%\n\uD83D\uDCBE <b>RAM:</b> ${ramPercent}%\n\n<i>Podr\u00eda ser un ataque DDoS o un fallo interno. Revisa el sistema.</i>`;
      await sendTelegramAlert(msg);
      console.log(`[Monitor] Alerta enviada! CPU: ${cpuPercent}% | RAM: ${ramPercent}%`);
    }
  } else {
    if (isAlerting) {
      isAlerting = false;
      await sendTelegramAlert(`\u2705 <b>SISTEMA ESTABILIZADO</b>\n\nLos recursos han vuelto a la normalidad.\nCPU: ${cpuPercent}% | RAM: ${ramPercent}%`);
    }
  }
};

const startMonitoring = () => {
  console.log(`[Monitor] Vigilante de sistema activado. Umbrales: CPU >${CPU_THRESHOLD}% | RAM >${RAM_THRESHOLD}%`);
  // Revisar cada 10 segundos
  setInterval(checkSystemHealth, 10000);
};

module.exports = { startMonitoring };
