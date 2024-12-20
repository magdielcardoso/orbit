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
  <div class="h-full flex flex-col items-center justify-center p-2 relative overflow-hidden">
    <!-- Partículas -->
    <div v-if="isDarkMode" class="particles-container">
      <!-- 50 partículas alternando entre as cores -->
      <div v-for="i in 50" :key="i" 
        :class="[
          'particle',
          i % 3 === 0 ? 'particle-purple' : i % 3 === 1 ? 'particle-pink' : 'particle-blue'
        ]"
      ></div>
    </div>

    <!-- Gradiente Animado -->
    <div 
      v-if="isDarkMode"
      class="absolute inset-0 liquid-gradient opacity-25 pointer-events-none"
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

.particles-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 1px;
  height: 1px;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(0.3px);
  box-shadow: 0 0 12px currentColor;
}

/* Cores das partículas com brilho variado */
.particle-purple {
  background: rgb(139,92,246);
  color: rgb(139,92,246);
  animation: twinkle 4s ease-in-out infinite;
}

.particle-pink {
  background: rgb(236,72,153);
  color: rgb(236,72,153);
}

.particle-blue {
  background: rgb(6,182,212);
  color: rgb(6,182,212);
  animation: twinkle 3s ease-in-out infinite;
}

/* Posições mais afastadas do centro e animações */
.particle:nth-child(1) { top: 2%; left: 3%; animation: edge-particle 45s ease-in-out infinite; }
.particle:nth-child(2) { top: 98%; left: 5%; animation: edge-particle 42s ease-in-out infinite -2s; }
.particle:nth-child(3) { top: 15%; left: 20%; animation: edge-particle 38s ease-in-out infinite -2s; }
.particle:nth-child(4) { top: 70%; left: 25%; animation: edge-particle 42s ease-in-out infinite -3s; }
.particle:nth-child(5) { top: 25%; left: 30%; animation: edge-particle 37s ease-in-out infinite -4s; }
.particle:nth-child(6) { top: 60%; left: 35%; animation: edge-particle 39s ease-in-out infinite -5s; }
.particle:nth-child(7) { top: 35%; left: 40%; animation: edge-particle 41s ease-in-out infinite -6s; }
.particle:nth-child(8) { top: 50%; left: 45%; animation: edge-particle 36s ease-in-out infinite -7s; }
.particle:nth-child(9) { top: 45%; left: 50%; animation: edge-particle 43s ease-in-out infinite -8s; }
.particle:nth-child(10) { top: 40%; left: 55%; animation: edge-particle 38s ease-in-out infinite -9s; }
.particle:nth-child(11) { top: 85%; left: 60%; animation: edge-particle 40s ease-in-out infinite -10s; }
.particle:nth-child(12) { top: 30%; left: 65%; animation: edge-particle 37s ease-in-out infinite -11s; }
.particle:nth-child(13) { top: 75%; left: 70%; animation: edge-particle 42s ease-in-out infinite -12s; }
.particle:nth-child(14) { top: 20%; left: 75%; animation: edge-particle 39s ease-in-out infinite -13s; }
.particle:nth-child(15) { top: 65%; left: 80%; animation: edge-particle 41s ease-in-out infinite -14s; }
.particle:nth-child(16) { top: 10%; left: 85%; animation: edge-particle 36s ease-in-out infinite -15s; }
.particle:nth-child(17) { top: 55%; left: 90%; animation: edge-particle 43s ease-in-out infinite -16s; }
.particle:nth-child(18) { top: 95%; left: 95%; animation: edge-particle 38s ease-in-out infinite -17s; }
.particle:nth-child(19) { top: 15%; left: 5%; animation: edge-particle 40s ease-in-out infinite -18s; }
.particle:nth-child(20) { top: 90%; left: 8%; animation: edge-particle 37s ease-in-out infinite -19s; }
.particle:nth-child(21) { top: 8%; left: 12%; animation: edge-particle 42s ease-in-out infinite -20s; }
.particle:nth-child(22) { top: 82%; left: 18%; animation: edge-particle 39s ease-in-out infinite -21s; }
.particle:nth-child(23) { top: 18%; left: 22%; animation: edge-particle 41s ease-in-out infinite -22s; }
.particle:nth-child(24) { top: 72%; left: 28%; animation: edge-particle 36s ease-in-out infinite -23s; }
.particle:nth-child(25) { top: 28%; left: 32%; animation: edge-particle 43s ease-in-out infinite -24s; }
.particle:nth-child(26) { top: 62%; left: 38%; animation: edge-particle 38s ease-in-out infinite -25s; }
.particle:nth-child(27) { top: 38%; left: 42%; animation: edge-particle 40s ease-in-out infinite -26s; }
.particle:nth-child(28) { top: 52%; left: 48%; animation: edge-particle 37s ease-in-out infinite -27s; }
.particle:nth-child(29) { top: 48%; left: 52%; animation: edge-particle 42s ease-in-out infinite -28s; }
.particle:nth-child(30) { top: 42%; left: 58%; animation: edge-particle 39s ease-in-out infinite -29s; }
.particle:nth-child(31) { top: 88%; left: 62%; animation: edge-particle 41s ease-in-out infinite -30s; }
.particle:nth-child(32) { top: 32%; left: 68%; animation: edge-particle 36s ease-in-out infinite -31s; }
.particle:nth-child(33) { top: 78%; left: 72%; animation: edge-particle 43s ease-in-out infinite -32s; }
.particle:nth-child(34) { top: 22%; left: 78%; animation: edge-particle 38s ease-in-out infinite -33s; }
.particle:nth-child(35) { top: 68%; left: 82%; animation: edge-particle 40s ease-in-out infinite -34s; }
.particle:nth-child(36) { top: 12%; left: 88%; animation: edge-particle 37s ease-in-out infinite -35s; }
.particle:nth-child(37) { top: 58%; left: 92%; animation: edge-particle 42s ease-in-out infinite -36s; }
.particle:nth-child(38) { top: 98%; left: 98%; animation: edge-particle 39s ease-in-out infinite -37s; }
.particle:nth-child(39) { top: 2%; left: 2%; animation: edge-particle 41s ease-in-out infinite -38s; }
.particle:nth-child(40) { top: 92%; left: 8%; animation: edge-particle 36s ease-in-out infinite -39s; }
.particle:nth-child(41) { top: 8%; left: 15%; animation: edge-particle 43s ease-in-out infinite -40s; }
.particle:nth-child(42) { top: 85%; left: 20%; animation: edge-particle 38s ease-in-out infinite -41s; }
.particle:nth-child(43) { top: 15%; left: 25%; animation: edge-particle 40s ease-in-out infinite -42s; }
.particle:nth-child(44) { top: 75%; left: 30%; animation: edge-particle 37s ease-in-out infinite -43s; }
.particle:nth-child(45) { top: 25%; left: 35%; animation: edge-particle 42s ease-in-out infinite -44s; }
.particle:nth-child(46) { top: 65%; left: 40%; animation: edge-particle 39s ease-in-out infinite -45s; }
.particle:nth-child(47) { top: 35%; left: 45%; animation: edge-particle 41s ease-in-out infinite -46s; }
.particle:nth-child(48) { top: 55%; left: 50%; animation: edge-particle 36s ease-in-out infinite -47s; }
.particle:nth-child(49) { top: 45%; left: 55%; animation: edge-particle 43s ease-in-out infinite -48s; }
.particle:nth-child(50) { top: 50%; left: 60%; animation: edge-particle 38s ease-in-out infinite -49s; }

@keyframes edge-particle {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg) scale(0.6);
    opacity: 0.3;
  }
  25% {
    transform: translate(200px, -150px) rotate(180deg) scale(1.2);
    opacity: 0.8;
  }
  50% {
    transform: translate(-100px, -300px) rotate(360deg) scale(0.4);
    opacity: 0.2;
  }
  75% {
    transform: translate(-200px, -100px) rotate(540deg) scale(1);
    opacity: 0.6;
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Adiciona variação no brilho para algumas partículas */
.particle:nth-child(3n) {
  animation: edge-particle 40s ease-in-out infinite, twinkle 3s ease-in-out infinite;
}

.particle:nth-child(5n) {
  animation: edge-particle 45s ease-in-out infinite, twinkle 4s ease-in-out infinite;
}

.particle:nth-child(7n) {
  animation: edge-particle 50s ease-in-out infinite, twinkle 5s ease-in-out infinite;
}

/* Ajuste para o container principal */
.overflow-hidden {
  overflow: hidden;
}
</style> 