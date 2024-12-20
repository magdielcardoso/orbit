<template>
  <div class="logs-container">
    <div class="logs-header">
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-semibold text-green-400">Terminal</h2>
        <div class="flex gap-2">
          <button 
            v-for="level in levels" 
            :key="level"
            @click="toggleLevel(level)"
            :class="[
              'px-2 py-1 text-xs rounded-md',
              isLevelActive(level) ? getLevelActiveClass(level) : 'bg-gray-800 text-gray-400'
            ]"
          >
            {{ level.toUpperCase() }}
          </button>
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="clearLogs" class="btn btn-sm btn-ghost text-gray-400">
          Clear
        </button>
        <button @click="toggleAutoScroll" class="btn btn-sm btn-ghost text-gray-400">
          {{ autoScroll ? 'Pause Scroll' : 'Resume Scroll' }}
        </button>
      </div>
    </div>

    <div class="terminal-container" ref="terminalContainer">
      <div 
        class="logs-content" 
        ref="logsContainer"
        @mousedown="handleDragStart"
        @mousemove="handleDragMove"
        @mouseup="handleDragEnd"
        @mouseleave="handleDragEnd"
        @touchstart="handleDragStart"
        @touchmove="handleDragMove"
        @touchend="handleDragEnd"
      >
        <div class="logs-main-container">
          <div class="logs-wrapper">
            <div
              v-for="(log, index) in filteredLogs"
              :key="index"
              :class="['log-entry', `source-${log.source || 'unknown'}`, { 'expanded': expandedLogs.has(index) }]"
            >
              <!-- Visualização Simplificada -->
              <div 
                class="flex items-center gap-3 px-4 py-3 rounded-lg touch-pan-y hover:bg-gray-800/50 transition-colors"
                @touchstart="handleTouchStart"
                @touchmove="handleTouchMove"
                @touchend="handleTouchEnd"
              >
                <span class="log-timestamp text-xs text-gray-500">{{ formatTime(log.timestamp) }}</span>
                <span :class="['log-type', getTypeClass(log.type || log.level)]">
                  {{ (log.type || log.level || 'unknown').toUpperCase() }}
                </span>
                <div class="flex-1 flex flex-col gap-1">
                  <span class="log-message-preview whitespace-normal">
                    {{ log.message }}
                  </span>
                  <!-- Alertas inline -->
                  <div v-if="getLogAlerts(log).length" 
                       class="flex flex-wrap gap-2"
                  >
                    <span v-for="alert in getLogAlerts(log)" 
                          :key="alert.type"
                          :class="['alert-inline', `alert-${alert.type}`]"
                    >
                      {{ alert.message }}
                      <span v-if="alert.count > 1" class="text-xs opacity-75 ml-1">
                        ({{ alert.count }}x)
                      </span>
                    </span>
                  </div>
                </div>
                <button 
                  class="expand-button p-2 hover:bg-gray-700/50 rounded-full flex-shrink-0 ml-2"
                  @click.stop="toggleLogExpansion(index)"
                >
                  <span class="text-gray-500 text-xs transform transition-transform" 
                        :class="{ 'rotate-180': expandedLogs.has(index) }">
                    ▼
                  </span>
                </button>
              </div>

              <!-- Detalhes Expandidos -->
              <div v-if="expandedLogs.has(index)" class="log-details">
                <!-- Cabeçalho do Log -->
                <div class="log-header">
                  <div class="flex items-center gap-2">
                    <span class="text-xs px-2 py-1 rounded bg-gray-700">PID: {{ log.pid || 'N/A' }}</span>
                    <span class="text-xs px-2 py-1 rounded bg-gray-700">
                      Memória: {{ formatMemory((log.memory || log.process?.memory || {}).heapUsed || 0) }}
                    </span>
                    <span class="text-xs px-2 py-1 rounded bg-gray-700">
                      Uptime: {{ formatUptime(log.uptime || log.process?.uptime || 0) }}
                    </span>
                  </div>
                </div>

                <!-- Alertas do Log -->
                <div v-if="getLogAlerts(log).length" class="alerts-section mb-3">
                  <div v-for="alert in getLogAlerts(log)" 
                       :key="alert.type"
                       :class="['alert-message', `alert-${alert.type}`]"
                  >
                    {{ alert.message }}
                    <span v-if="alert.count > 1" class="text-xs opacity-75">
                      ({{ alert.count }}x)
                    </span>
                  </div>
                </div>

                <!-- Mensagem Completa -->
                <div class="full-message mt-3">
                  <div class="message-content" v-html="formatMessage(log.message || '')"></div>
                </div>

                <!-- Metadados -->
                <div v-if="hasMetadata(log)" class="metadata-section mt-3">
                  <div class="metadata-header">
                    <span class="text-sm font-semibold text-gray-400">REQUEST</span>
                  </div>
                  <div class="metadata-content">
                    <pre>{{ formatMetadata(log.request) }}</pre>
                  </div>
                  <div class="metadata-header">
                    <span class="text-sm font-semibold text-gray-400">RESPONSE</span>
                  </div>
                  <div class="metadata-content">
                    <pre>{{ formatMetadata(log.response) }}</pre>
                  </div>
                </div>

                <!-- Stack Trace para Erros -->
                <div v-if="log.stack" class="stack-trace-section mt-3">
                  <div class="stack-trace-header">
                    <span class="text-sm font-semibold text-red-400">Stack Trace</span>
                  </div>
                  <div class="stack-trace-content">
                    <pre>{{ log.stack }}</pre>
                  </div>
                </div>
              </div>
            </div>
            <!-- Fim dos logs como ��ltimo card -->
            <div class="log-entry end-log-entry">
              <div class="flex items-center justify-center p-2">
                <div class="flex items-center gap-4">
                  <div class="h-px bg-gray-700 flex-grow max-w-[100px]"></div>
                  <span class="text-gray-500 text-sm font-mono">Fim dos logs</span>
                  <div class="h-px bg-gray-700 flex-grow max-w-[100px]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="logs-footer">
      <div class="flex items-center gap-2 text-xs text-gray-500">
        <span>{{ filteredLogs.length }} logs</span>
        <span>|</span>
        <span>Memory: {{ currentMemory }}</span>
        <span>|</span>
        <span>Uptime: {{ systemUptime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { io } from 'socket.io-client';
import { logAnalyzer } from '../services/logAnalyzer.service.js';

const logs = ref([]);
const activeLevels = ref(new Set(['error', 'warn', 'info', 'debug', 'http', 'verbose']));
const autoScroll = ref(true);
const logsContainer = ref(null);
const systemStats = ref({
  memory: 0,
  uptime: 0
});
let socket = null;

const levels = ['error', 'warn', 'info', 'debug', 'http', 'verbose'];
const command = ref('');
const expandedLogs = ref(new Set());
const terminalContainer = ref(null);

// Drag state
const isDragging = ref(false);
const startY = ref(null);
const startScrollTop = ref(null);

const systemAlerts = ref([]);

// Computed
const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const logLevel = log.type || log.level;
    return logLevel && activeLevels.value.has(logLevel);
  });
});

const currentMemory = computed(() => {
  return formatMemory(systemStats.value.memory || 0);
});

const systemUptime = computed(() => {
  return formatUptime(systemStats.value.uptime || 0);
});

// Methods
function toggleLevel(level) {
  if (activeLevels.value.has(level)) {
    activeLevels.value.delete(level);
  } else {
    activeLevels.value.add(level);
  }
}

function isLevelActive(level) {
  return activeLevels.value.has(level);
}

function getLevelClass(level) {
  return {
    error: 'text-red-500',
    warn: 'text-yellow-500',
    info: 'text-cyan-400',
    debug: 'text-green-400',
    http: 'text-purple-400',
    verbose: 'text-gray-400'
  }[level] || 'text-gray-400';
}

function getLevelActiveClass(level) {
  return {
    error: 'bg-red-950 text-red-400',
    warn: 'bg-yellow-950 text-yellow-400',
    info: 'bg-cyan-950 text-cyan-400',
    debug: 'bg-green-950 text-green-400',
    http: 'bg-purple-950 text-purple-400',
    verbose: 'bg-gray-800 text-gray-400'
  }[level] || 'bg-gray-800 text-gray-400';
}

function formatDate(timestamp) {
  return new Date(timestamp).toISOString().split('T')[1].slice(0, -1);
}

function formatStack(stack) {
  return stack.split('\n').slice(1).join('\n');
}

function formatMemory(bytes) {
  return `${Math.round(bytes / 1024 / 1024)}MB`;
}

function formatUptime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function hasMetadata(log) {
  if (!log) return false;
  const excludedKeys = ['timestamp', 'level', 'type', 'message', 'stack', 'process', 'source', 'pid', 'memory', 'uptime'];
  return Object.keys(log).some(key => !excludedKeys.includes(key));
}

function formatMetadata(log) {
  if (!log) return '';
  const metadata = { ...log };
  const excludedKeys = ['timestamp', 'level', 'type', 'message', 'stack', 'process', 'source', 'pid', 'memory', 'uptime'];
  excludedKeys.forEach(key => delete metadata[key]);
  return JSON.stringify(metadata, null, 2);
}

function toggleAutoScroll() {
  autoScroll.value = !autoScroll.value;
  if (autoScroll.value) {
    scrollToBottom();
  }
}

function clearLogs() {
  logs.value = [];
}

function scrollToBottom() {
  if (!autoScroll.value) return;
  
  const container = logsContainer.value;
  if (!container) return;

  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 300);
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

function formatMessage(message) {
  // Adiciona syntax highlighting para JSON
  if (typeof message === 'string' && message.startsWith('{')) {
    try {
      const obj = JSON.parse(message);
      return syntaxHighlight(obj);
    } catch (e) {
      // Não é JSON válido, retorna como está
      return message;
    }
  }
  return message;
}

function syntaxHighlight(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return `<span class="json-${cls}">${match}</span>`;
  });
}

function getTypeClass(type) {
  if (!type) return 'text-gray-400';
  return {
    error: 'text-red-500',
    warn: 'text-yellow-500',
    info: 'text-cyan-400',
    log: 'text-white',
    debug: 'text-green-400',
    http: 'text-purple-400'
  }[type.toLowerCase()] || 'text-gray-400';
}

async function executeCommand() {
  if (!command.value.trim()) return;

  try {
    socket.emit('execute-command', command.value);
    command.value = '';
  } catch (error) {
    console.error('Erro ao executar comando:', error);
  }
}

// Função para formatar apenas o horário
function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Função para obter preview da mensagem
function getMessagePreview(message) {
  if (!message) return '';
  const cleanMessage = message.replace(/\u001b\[\d+m/g, '').trim();
  return cleanMessage.length > 60
    ? cleanMessage.substring(0, 60) + '...'
    : cleanMessage;
}

// Função para expandir/colapsar log
function toggleLogExpansion(index) {
  if (expandedLogs.value.has(index)) {
    expandedLogs.value.delete(index);
  } else {
    expandedLogs.value.add(index);
  }
}

function handleDragStart(event) {
  isDragging.value = true;
  if (event.type === 'mousedown') {
    startY.value = event.pageY;
    startScrollTop.value = logsContainer.value.scrollTop;
    
    // Previne seleção de texto durante o drag
    event.preventDefault();
    
    // Atualiza o cursor imediatamente
    logsContainer.value.style.cursor = 'grabbing';
  }
  
  if (event.type === 'touchstart') {
    startY.value = event.touches[0].pageY;
    startScrollTop.value = logsContainer.value.scrollTop;
  }
}

function handleDragMove(event) {
  if (!isDragging.value) return;

  // Previne eventos padrão para evitar comportamentos indesejados
  event.preventDefault();
  
  const currentY = event.type === 'mousemove' ? event.pageY : event.touches[0].pageY;
  const deltaY = startY.value - currentY;
  
  if (logsContainer.value) {
    // Aplica o scroll imediatamente sem animação
    logsContainer.value.style.scrollBehavior = 'auto';
    logsContainer.value.scrollTop = startScrollTop.value + deltaY;
  }
}

function handleDragEnd() {
  isDragging.value = false;
  if (logsContainer.value) {
    logsContainer.value.style.cursor = 'grab';
    logsContainer.value.style.scrollBehavior = 'smooth';
  }
}

onMounted(() => {
  // Conecta ao WebSocket
  socket = io(`${import.meta.env.VITE_API_URL}/logs`, {
    path: '/socket'
  })

  socket.on('connect', () => {
    console.log('Conectado ao serviço de logs');
    showToast('Conectado ao serviço de logs', 'success');
  });

  socket.on('recent-logs', (recentLogs) => {
    logs.value = recentLogs;
    scrollToBottom();
  });

  socket.on('new-log', (logEntry) => {
    if (!logEntry) return;
    logs.value.push(logEntry);
    
    if (logEntry.process) {
      systemStats.value = {
        memory: logEntry.process.memory?.heapUsed || 0,
        uptime: logEntry.process.uptime || 0
      };
    }
    
    if (logs.value.length > 1000) {
      logs.value = logs.value.slice(-1000);
    }

    if ((logEntry.type === 'error' || logEntry.level === 'error') && logEntry.message) {
      showToast(logEntry.message, 'error');
    }

    if (autoScroll.value) {
      scrollToBottom();
    }

    // Analisa o log em busca de padrões
    const alerts = logAnalyzer.analyzeLog(logEntry);
    if (alerts.length) {
      systemAlerts.value = [...new Set([...systemAlerts.value, ...alerts])];
      
      // Remove alertas após o tempo específico para cada tipo
      alerts.forEach(alert => {
        setTimeout(() => {
          systemAlerts.value = systemAlerts.value.filter(a => a !== alert);
        }, getAlertTimeout(alert.type));
      });
    }
  });

  socket.on('system-stats', (stats) => {
    systemStats.value = stats;
  });

  socket.on('connect_error', (error) => {
    console.error('Erro na conexão com o serviço de logs:', error);
    showToast('Erro na conexão com o serviço de logs', 'error');
  });

  // Adiciona observador de mutações
  const observer = new MutationObserver((mutations) => {
    if (autoScroll.value) {
      // Verifica se houve adição de nós
      const hasAddedNodes = mutations.some(mutation => 
        mutation.addedNodes.length > 0
      );
      
      if (hasAddedNodes) {
        scrollToBottom();
      }
    }
  });

  if (logsContainer.value) {
    observer.observe(logsContainer.value, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  // Cleanup
  onUnmounted(() => {
    observer.disconnect();
  });
});

onUnmounted(() => {
  if (socket) {
    socket.disconnect();
  }
});

// Adiciona watch para scroll automático
watch(filteredLogs, () => {
  if (autoScroll.value) {
    scrollToBottom();
  }
});

// Ajusta o tempo de exibição baseado no tipo
function getAlertTimeout(type) {
  const timeouts = {
    error: 30000,    // 30 segundos para erros
    warn: 20000,     // 20 segundos para avisos
    success: 5000,   // 5 segundos para sucessos
    info: 10000      // 10 segundos para informações
  };
  return timeouts[type] || 10000;
}

// Função para obter alertas específicos do log
function getLogAlerts(log) {
  return logAnalyzer.analyzeLog(log);
}
</script>

<style scoped>
.logs-container {
  @apply bg-gray-900 rounded-lg flex flex-col font-mono h-[600px];
}

.logs-header {
  @apply flex justify-between items-center p-2 border-b border-gray-800 sticky top-0 bg-gray-900 z-10;
}

.logs-content {
  height: calc(100vh - 200px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  touch-action: pan-y;
  cursor: grab;
  display: flex;
  flex-direction: column;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  will-change: scroll-position;
  @apply p-4;
}

.logs-content:active {
  cursor: grabbing;
  user-select: none;
  -webkit-user-select: none;
}

.logs-footer {
  @apply p-2 border-t border-gray-800 bg-gray-900;
}

.log-entry {
  @apply my-2 first:mt-0 last:mb-0;
  min-height: 28px;
  touch-action: pan-y;
  @apply transition-all duration-200;
}

.log-entry:hover {
  @apply bg-gray-800/30;
}

.log-timestamp {
  @apply text-gray-500 font-bold;
}

.log-message-preview {
  @apply text-gray-300 text-sm leading-relaxed;
}

.log-stack {
  @apply ml-24 mt-1 text-red-400 text-xs whitespace-pre-wrap;
}

.log-process {
  @apply ml-24 mt-1 space-x-4 text-xs;
}

.log-metadata {
  @apply ml-24 mt-1 text-xs bg-gray-800/50 p-2 rounded text-gray-400 whitespace-pre-wrap;
}

/* Scrollbar customization */
.logs-content::-webkit-scrollbar {
  @apply w-2;
}

.logs-content::-webkit-scrollbar-track {
  @apply bg-gray-800;
}

.logs-content::-webkit-scrollbar-thumb {
  @apply bg-gray-600 rounded-full;
}

.logs-content::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}

.terminal-container {
  @apply flex-1 flex flex-col;
}

.terminal-input {
  @apply flex items-center gap-2 p-2 bg-gray-800 border-t border-gray-700;
}

.prompt {
  @apply text-green-400 font-bold;
}

.command-input {
  @apply flex-1 bg-transparent border-none outline-none text-white;
}

.source-console {
  @apply border-l-2 border-blue-500;
}

.source-stdout {
  @apply border-l-2 border-green-500;
}

.source-stderr {
  @apply border-l-2 border-red-500;
}

/* JSON highlighting */
.json-string {
  @apply text-green-400;
}

.json-number {
  @apply text-cyan-400;
}

.json-boolean {
  @apply text-yellow-400;
}

.json-null {
  @apply text-red-400;
}

.json-key {
  @apply text-purple-400;
}

.log-details {
  @apply mt-2 mx-2 space-y-2 p-4 bg-gray-800/30 rounded border border-gray-700/50;
}

.process-info, .metadata-info, .stack-trace, .full-message {
  @apply text-sm;
}

.log-header {
  @apply flex justify-between items-center;
}

.message-content {
  @apply text-gray-300 whitespace-pre-wrap font-mono text-sm bg-gray-900/50 p-3 rounded;
}

.metadata-section, .stack-trace-section {
  @apply border border-gray-700/30 rounded overflow-hidden;
}

.metadata-header, .stack-trace-header {
  @apply px-3 py-2 bg-gray-800/50 border-b border-gray-700/30;
}

.metadata-content, .stack-trace-content {
  @apply p-3 bg-gray-900/50 overflow-x-auto;
  @apply font-mono text-sm;
}

.metadata-content pre {
  @apply text-cyan-400;
}

.stack-trace-content pre {
  @apply text-red-400;
}

/* Animação de expansão mais suave */
.log-details {
  @apply overflow-hidden transition-all duration-300;
  animation: expand 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity, max-height;
}

@keyframes expand {
  from {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    max-height: 5000px; /* Remove o comentário que causava o erro */
    opacity: 1;
    transform: translateY(0);
  }
}

/* Melhor contraste para os tipos de log */
.log-type {
  @apply px-2 py-1 rounded-md font-medium min-w-[70px] text-center text-xs bg-gray-800/50;
}

/* Otimizações de performance */
.log-entry {
  @apply will-change-transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.log-message-preview {
  @apply text-gray-300 text-sm leading-relaxed;
}

.expand-button {
  @apply opacity-50 hover:opacity-100 transition-opacity;
  min-width: 24px;
  min-height: 24px;
}

.expand-button span {
  @apply transition-transform duration-200;
}

/* Previne seleção de texto durante drag */
.logs-content {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Permite seleção de texto dentro das mensagens */
.log-message-preview,
.message-content,
.metadata-content pre,
.stack-trace-content pre {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.logs-main-container {
  @apply flex flex-col min-h-full relative;
}

.logs-wrapper {
  @apply flex-grow;
}

.end-log-entry {
  @apply border-none bg-transparent;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.end-log-entry:hover {
  opacity: 1;
  @apply bg-transparent;
}

/* Estilos para os alertas */
.system-alerts {
  @apply absolute top-0 left-0 right-0 p-2 space-y-1;
  z-index: 100;
}

.alert-item {
  @apply px-3 py-1.5 rounded text-sm font-medium;
  @apply flex items-center justify-between;
  @apply animate-slideIn;
}

.alert-error {
  @apply bg-red-900/80 text-red-200 border border-red-700;
}

.alert-warn {
  @apply bg-yellow-900/80 text-yellow-200 border border-yellow-700;
}

.alert-success {
  @apply bg-green-900/80 text-green-200 border border-green-700;
}

.alert-info {
  @apply bg-blue-900/80 text-blue-200 border border-blue-700;
}

@keyframes slideIn {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

.alert-indicator {
  @apply text-xs;
}

.alert-indicator.alert-error {
  @apply text-red-500;
}

.alert-indicator.alert-warn {
  @apply text-yellow-500;
}

.alert-indicator.alert-success {
  @apply text-green-500;
}

.alert-indicator.alert-info {
  @apply text-blue-500;
}

.alert-message {
  @apply px-3 py-2 rounded-md text-sm;
  @apply flex items-center justify-between;
}

.alert-message.alert-error {
  @apply bg-red-900/50 text-red-200 border border-red-700/50;
}

.alert-message.alert-warn {
  @apply bg-yellow-900/50 text-yellow-200 border border-yellow-700/50;
}

.alert-message.alert-success {
  @apply bg-green-900/50 text-green-200 border border-green-700/50;
}

.alert-message.alert-info {
  @apply bg-blue-900/50 text-blue-200 border border-blue-700/50;
}

.alerts-section {
  @apply space-y-2;
}

/* Ajusta o espaçamento entre os logs */
.logs-wrapper > * + * {
  @apply mt-2;
}

.alert-inline {
  @apply text-xs px-2 py-1 rounded-md;
  @apply inline-flex items-center;
}

.alert-inline.alert-error {
  @apply bg-red-950 text-red-200;
}

.alert-inline.alert-warn {
  @apply bg-yellow-950 text-yellow-200;
}

.alert-inline.alert-success {
  @apply bg-green-950 text-green-200;
}

.alert-inline.alert-info {
  @apply bg-blue-950 text-blue-200;
}
</style> 