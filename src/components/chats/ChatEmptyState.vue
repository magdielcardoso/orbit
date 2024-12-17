<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from '@/i18n/plugin'

const { t } = useI18n()
const isDarkMode = ref(false)

// Detecta o tema atual e monitora mudanças
onMounted(() => {
  // Verifica o tema inicial
  isDarkMode.value = document.documentElement.getAttribute('data-theme') === 'dark'

  // Observa mudanças no tema
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        isDarkMode.value = document.documentElement.getAttribute('data-theme') === 'dark'
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })
})
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center p-2 relative">
    <!-- Gradiente Animado (visível apenas no tema dark) -->
    <div 
      v-if="isDarkMode"
      class="absolute inset-0 liquid-gradient opacity-30 pointer-events-none"
      aria-hidden="true"
    />

    <!-- Conteúdo -->
    <div class="relative z-10 flex flex-col items-center w-full">
      <!-- Logo -->
      <div class="flex justify-center w-full">
        <img 
          :src="isDarkMode ? '/orbit_dark.svg' : '/orbit_light.svg'"
          alt="OrbitChat" 
          class="w-[250px] mb-6"
        />
      </div>

      <!-- Mensagem Principal -->
      <h3 class="text-lg font-medium text-base-content/70 text-center mb-2">
        Oh não! Parece que não há mensagens de clientes na sua caixa de entrada 😢
      </h3>

      <!-- Descrição -->
      <p class="text-sm text-base-content/60 text-center max-w-md mb-6">
        Quando você receber mensagens de clientes, elas aparecerão aqui. Enquanto isso, 
        você pode explorar outras funcionalidades do OrbitChat usando os atalhos abaixo.
      </p>

      <!-- Atalhos -->
      <div class="flex flex-col items-center gap-2 text-sm text-base-content/50">
        <div class="flex items-center gap-2">
          <kbd class="kbd kbd-sm">⌘</kbd>
          <kbd class="kbd kbd-sm">K</kbd>
          <span>{{ t('chats.emptyState.shortcuts.command') }}</span>
        </div>
        <div class="flex items-center gap-2">
          <kbd class="kbd kbd-sm">⌘</kbd>
          <kbd class="kbd kbd-sm">/</kbd>
          <span>{{ t('chats.emptyState.shortcuts.keyboard') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kbd {
  @apply bg-base-200 border-base-300 text-xs;
}

.liquid-gradient {
  background: 
    radial-gradient(circle at 0% 0%, rgba(244,63,94,0.60) 0%, transparent 50%),
    radial-gradient(circle at 100% 0%, rgba(236,72,153,0.60) 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, rgba(139,92,246,0.60) 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(6,182,212,0.60) 0%, transparent 50%);
  background-size: 200% 200%;
  animation: liquid 30s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  filter: blur(40px);
}

@keyframes liquid {
  0%, 100% {
    background-position: 0% 0%;
  }
  25% {
    transform: translate(20px, -20px);
  }
  50% {
    transform: translate(0, 0);
  }
  75% {
    transform: translate(-20px, 20px);
  }
}
</style> 