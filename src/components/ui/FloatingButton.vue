<template>
  <div
    ref="button"
    :style="{
      transform: `translate(${position.x}px, ${position.y}px)`,
      opacity: isDragging || isHovering ? 1 : 0.6
    }"
    class="fixed z-50 select-none transition-opacity duration-200"
    :class="{ 'cursor-move': isDragging, 'cursor-default': !isDragging }"
    @mousedown="handleMouseDown"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div 
      class="w-10 h-10 rounded-full bg-gradient-to-br from-orbit-500 to-orbit-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 border-2 border-orbit-700/50 group"
    >
      <Zap class="h-4 w-4 text-white group-hover:animate-spin-once" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Zap } from 'lucide-vue-next'

const button = ref(null)
const isDragging = ref(false)
const isHovering = ref(false)
const position = ref({ 
  x: window.innerWidth - 44,
  y: window.innerHeight - 544
})
let offset = { x: 0, y: 0 }
let mouseDownTimer = null
const HOLD_DELAY = 200

// Limites da tela
const limits = ref({
  minX: 4,
  maxX: window.innerWidth - 44,
  minY: 4,
  maxY: window.innerHeight - 44
})

// Atualiza os limites quando a janela é redimensionada
const updateLimits = () => {
  limits.value = {
    minX: 4,
    maxX: window.innerWidth - 44,
    minY: 4,
    maxY: window.innerHeight - 44
  }
  
  // Mantém o botão no lado direito e na mesma altura relativa ao redimensionar
  position.value = { 
    x: limits.value.maxX,
    y: window.innerHeight - 544
  }
}

const snapToEdge = (x, y) => {
  const threshold = 50
  const result = { x, y }
  
  // Snap horizontal
  if (x < limits.value.minX + threshold) {
    result.x = limits.value.minX
  } else if (x > limits.value.maxX - threshold) {
    result.x = limits.value.maxX
  }
  
  // Snap vertical
  if (y < limits.value.minY + threshold) {
    result.y = limits.value.minY
  } else if (y > limits.value.maxY - threshold) {
    result.y = limits.value.maxY
  }
  
  // Força o botão a ficar em uma das bordas (horizontal ou vertical)
  const distanceToLeftEdge = Math.abs(result.x - limits.value.minX)
  const distanceToRightEdge = Math.abs(result.x - limits.value.maxX)
  const distanceToTopEdge = Math.abs(result.y - limits.value.minY)
  const distanceToBottomEdge = Math.abs(result.y - limits.value.maxY)
  
  // Encontra a borda mais próxima
  const minDistance = Math.min(
    distanceToLeftEdge,
    distanceToRightEdge,
    distanceToTopEdge,
    distanceToBottomEdge
  )
  
  // Snap para a borda mais próxima
  if (minDistance === distanceToLeftEdge) {
    result.x = limits.value.minX
  } else if (minDistance === distanceToRightEdge) {
    result.x = limits.value.maxX
  } else if (minDistance === distanceToTopEdge) {
    result.y = limits.value.minY
  } else {
    result.y = limits.value.maxY
  }
  
  return result
}

const handleMouseDown = (e) => {
  // Limpa qualquer timer existente
  if (mouseDownTimer) clearTimeout(mouseDownTimer)
  
  // Inicia um novo timer
  mouseDownTimer = setTimeout(() => {
    startDrag(e)
  }, HOLD_DELAY)

  // Adiciona listener para cancelar o timer se o mouse for solto antes do tempo
  const cancelDrag = () => {
    if (mouseDownTimer) {
      clearTimeout(mouseDownTimer)
      mouseDownTimer = null
    }
    document.removeEventListener('mouseup', cancelDrag)
  }

  document.addEventListener('mouseup', cancelDrag)
}

const startDrag = (e) => {
  isDragging.value = true
  offset = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
}

const drag = (e) => {
  if (isDragging.value) {
    let newX = e.clientX - offset.x
    let newY = e.clientY - offset.y
    
    newX = Math.min(Math.max(newX, limits.value.minX), limits.value.maxX)
    newY = Math.min(Math.max(newY, limits.value.minY), limits.value.maxY)
    
    position.value = { x: newX, y: newY }
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
  
  if (mouseDownTimer) {
    clearTimeout(mouseDownTimer)
    mouseDownTimer = null
  }

  const snapped = snapToEdge(position.value.x, position.value.y)
  position.value = snapped
}

onMounted(() => {
  window.addEventListener('resize', updateLimits)
  const snapped = snapToEdge(position.value.x, position.value.y)
  position.value = snapped
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateLimits)
  if (mouseDownTimer) clearTimeout(mouseDownTimer)
})
</script>

<style scoped>
.select-none {
  user-select: none;
  -webkit-user-select: none;
}

.w-10:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
  border-color: theme('colors.orbit.700');
}

@keyframes spin-once {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-once {
  animation: spin-once 0.5s ease-out;
}
</style> 