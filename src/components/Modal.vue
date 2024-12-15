<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div 
        class="fixed inset-0 bg-base-300/80 backdrop-blur-sm transition-opacity dark:bg-base-900/80" 
        aria-hidden="true"
        @click="$emit('close')"
      ></div>

      <!-- Centraliza o modal -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div class="relative inline-block align-bottom bg-base-100 rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-0 dark:border dark:border-base-700">
        <!-- Cabeçalho -->
        <div class="px-6 py-4 border-b border-gray-300 dark:border-gray-600/30">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-base-content" id="modal-title">
              <slot name="title"></slot>
            </h3>
            <!-- Botão fechar -->
            <button
              type="button"
              class="rounded-lg p-1 text-base-content/50 hover:text-base-content hover:bg-base-200 dark:hover:bg-base-800 transition-colors"
              @click="$emit('close')"
            >
              <span class="sr-only">{{ t('common.close') }}</span>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Conteúdo -->
        <div class="px-6 py-4 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
          <slot name="content"></slot>
        </div>

        <!-- Rodapé -->
        <div class="px-6 py-4 bg-base-100 border-t border-gray-300 dark:border-gray-600/30 flex justify-end gap-2">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '@/i18n';

const { t } = useI18n();

defineEmits(['close']);
</script>

<style>
/* Estilos para campos de formulário dentro do modal */
.modal-form-input {
  @apply mt-1 block w-full rounded-lg !border !border-gray-300 bg-white shadow-sm 
         focus:border-orbit-500 focus:ring-1 focus:ring-orbit-500 
         dark:bg-base-200 dark:text-base-content dark:!border-gray-600/50
         dark:focus:border-orbit-400 dark:focus:ring-orbit-400
         transition-colors duration-200;
}

.modal-form-label {
  @apply block text-sm font-medium text-base-content/70 mb-1;
}

.modal-form-group {
  @apply space-y-1;
}

/* Estilos para ícones nos inputs */
.input-icon-wrapper {
  @apply relative;
}

.input-icon {
  @apply absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50;
}

.input-with-icon {
  @apply pl-10;
}

/* Estilos para campos de seleção */
select.modal-form-input {
  @apply pr-10 cursor-pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

/* Estilos para checkbox e radio */
.modal-form-checkbox,
.modal-form-radio {
  @apply rounded !border !border-gray-300 text-orbit-600 shadow-sm
         focus:border-orbit-500 focus:ring-1 focus:ring-orbit-500
         dark:bg-base-200 dark:!border-gray-600/50
         dark:focus:border-orbit-400 dark:focus:ring-orbit-400;
}

.modal-form-radio {
  @apply rounded-full;
}

/* Estilos para textarea */
textarea.modal-form-input {
  @apply resize-none;
}

/* Animação de entrada e saída do modal */
.modal-enter-active,
.modal-leave-active {
  @apply transition-all duration-300 ease-out;
}

.modal-enter-from,
.modal-leave-to {
  @apply opacity-0 scale-95;
}

.modal-enter-to,
.modal-leave-from {
  @apply opacity-100 scale-100;
}

/* Estilos para botões no modal */
.modal-btn {
  @apply inline-flex justify-center rounded-lg px-4 py-2 text-sm font-medium
         focus:outline-none focus:ring-2 focus:ring-offset-2 
         transition-colors duration-200;
}

.modal-btn-primary {
  @apply bg-orbit-600 text-white hover:bg-orbit-700 
         focus:ring-orbit-500
         dark:bg-orbit-500 dark:hover:bg-orbit-600;
}

.modal-btn-secondary {
  @apply bg-base-200 text-base-content hover:bg-base-300
         focus:ring-orbit-500
         dark:bg-base-300 dark:hover:bg-base-200;
}

.modal-btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700
         focus:ring-red-500;
}
</style> 