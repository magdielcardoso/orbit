v<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'md' // sm, md, lg
  }
})

// Cores para os avatares
const colors = [
  'bg-orbit-500/10 text-orbit-500',
  'bg-orbit-600/10 text-orbit-600',
  'bg-orbit-700/10 text-orbit-700',
  'bg-orbit-400/10 text-orbit-400',
  'bg-orbit-500/10 text-orbit-500',
  'bg-orbit-600/10 text-orbit-600'
]

// Gera uma cor baseada no nome
const getColorFromName = (name) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// Classes dinâmicas
const avatarSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-8 h-8 text-sm'
    case 'lg': return 'w-12 h-12 text-lg'
    default: return 'w-10 h-10 text-base'
  }
})

const avatarColor = computed(() => getColorFromName(props.name))
</script>

<template>
  <div class="avatar">
    <div 
      :class="[
        'rounded-full flex items-center justify-center',
        avatarSize
      ]"
    >
      <template v-if="avatar">
        <img :src="avatar" :alt="name" class="rounded-full" />
      </template>
      <template v-else>
        <div 
          class="w-full h-full rounded-full flex items-center justify-center"
          :class="avatarColor"
        >
          <span class="font-medium">{{ name.charAt(0).toUpperCase() }}</span>
        </div>
      </template>
    </div>
  </div>
</template> 