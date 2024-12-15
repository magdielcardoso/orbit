import os from 'os';

export async function getSystemMetrics() {
  const cpuUsage = os.loadavg()[0];
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;

  return {
    cpu: Math.round(cpuUsage * 100) / 100,
    memory: Math.round(memoryUsage * 100) / 100,
    uptime: os.uptime()
  };
} 