<template>
  <div class="logs-container">
    <div class="logs-header">
      <h2 class="text-xl font-semibold">Logs do Sistema</h2>
      <div class="flex gap-2">
        <select v-model="filterLevel" class="select select-sm">
          <option value="">Todos os níveis</option>
          <option value="error">Erro</option>
          <option value="warn">Alerta</option>
          <option value="info">Info</option>
          <option value="debug">Debug</option>
        </select>
        <button @click="clearLogs" class="btn btn-sm btn-ghost">
          Limpar
        </button>
      </div>
    </div>

    <div class="logs-content" ref="logsContainer">
      <div
        v-for="log in filteredLogs"
        :key="log.timestamp"
        :class="['log-entry', `level-${log.level}`]"
      >
        <div class="log-timestamp">
          {{ formatDate(log.timestamp) }}
        </div>
        <div class="log-level">
          {{ log.level.toUpperCase() }}
        </div>
        <div class="log-message">
          {{ log.message }}
        </div>
        <div v-if="log.metadata" class="log-metadata">
          <pre>{{ JSON.stringify(log.metadata, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { io } from 'socket.io-client';

const logs = ref([]);
const filterLevel = ref('');
const logsContainer = ref(null);
let socket = null;

const filteredLogs = computed(() => {
  return filterLevel.value
    ? logs.value.filter(log => log.level === filterLevel.value)
    : logs.value;
});

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString();
}

function clearLogs() {
  logs.value = [];
}

function scrollToBottom() {
  if (logsContainer.value) {
    logsContainer.value.scrollTop = logsContainer.value.scrollHeight;
  }
}

function showToast(message, type = 'info') {
  // Remove toasts anteriores do mesmo tipo
  const existingToasts = document.querySelectorAll(`.toast-${type}`);
  existingToasts.forEach(toast => toast.remove());

  // Cria o novo toast
  const toast = document.createElement('div');
  toast.className = `toast toast-top toast-end z-50`;

  const alert = document.createElement('div');
  alert.className = `alert ${getAlertClass(type)}`;
  
  const content = document.createElement('span');
  content.textContent = message;
  
  alert.appendChild(content);
  toast.appendChild(alert);
  document.body.appendChild(toast);

  // Remove após 3 segundos
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function getAlertClass(type) {
  const classes = {
    error: 'alert-error',
    warn: 'alert-warning',
    info: 'alert-info',
    success: 'alert-success'
  };
  return classes[type] || 'alert-info';
}

onMounted(() => {
  // Conecta ao WebSocket
  socket = io(import.meta.env.VITE_API_URL, {
    path: '/logs'
  });

  socket.on('connect', () => {
    console.log('Conectado ao serviço de logs');
    showToast('Conectado ao serviço de logs', 'success');
  });

  socket.on('new-log', (logEntry) => {
    logs.value.push(logEntry);
    
    // Mantém apenas os últimos 1000 logs
    if (logs.value.length > 1000) {
      logs.value = logs.value.slice(-1000);
    }

    // Notifica erros via toast
    if (logEntry.level === 'error') {
      showToast(logEntry.message, 'error');
    }

    scrollToBottom();
  });

  socket.on('connect_error', (error) => {
    console.error('Erro na conexão com o serviço de logs:', error);
    showToast('Erro na conexão com o serviço de logs', 'error');
  });
});

onUnmounted(() => {
  if (socket) {
    socket.disconnect();
  }
});
</script>

<style scoped>
.logs-container {
  @apply bg-base-200 rounded-lg p-4 h-[600px] flex flex-col;
}

.logs-header {
  @apply flex justify-between items-center mb-4;
}

.logs-content {
  @apply flex-1 overflow-y-auto space-y-2 font-mono text-sm;
}

.log-entry {
  @apply p-2 rounded bg-base-100 flex flex-col gap-1;
}

.log-timestamp {
  @apply text-xs text-base-content/70;
}

.log-level {
  @apply text-xs font-semibold;
}

.level-error .log-level {
  @apply text-error;
}

.level-warn .log-level {
  @apply text-warning;
}

.level-info .log-level {
  @apply text-info;
}

.level-debug .log-level {
  @apply text-success;
}

.log-metadata {
  @apply mt-1 text-xs bg-base-300 p-2 rounded;
}
</style> 