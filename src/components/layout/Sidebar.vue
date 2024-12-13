<template>
  <aside class="flex h-screen w-16 flex-col justify-between border-r border-base-300 bg-base-200 px-1.5 py-4">
    <div class="space-y-8">
      <!-- Logo -->
      <div class="flex justify-center text-smooth">
        <div class="tooltip tooltip-right" :data-tip="$t('navigation.chats')">
          <MessageSquare class="h-5 w-5 text-primary" />
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex flex-col items-center space-y-2 text-smooth">
        <div class="tooltip tooltip-right" :data-tip="$t('navigation.home')">
          <button
            @click="navigate('home')"
            :class="[
              'btn btn-ghost btn-sm h-8 w-8 p-0 antialiased',
              currentRoute === 'home' ? 'btn-active' : ''
            ]"
          >
            <Home class="h-4 w-4" />
          </button>
        </div>

        <div class="tooltip tooltip-right" :data-tip="$t('navigation.chats')">
          <button
            @click="navigate('chats')"
            :class="[
              'btn btn-ghost btn-sm h-8 w-8 p-0 antialiased',
              currentRoute === 'chats' ? 'btn-active' : ''
            ]"
          >
            <MessageCircle class="h-4 w-4" />
          </button>
        </div>

        <div class="tooltip tooltip-right" :data-tip="$t('navigation.contacts')">
          <button
            @click="navigate('contacts')"
            :class="[
              'btn btn-ghost btn-sm h-8 w-8 p-0 antialiased',
              currentRoute === 'contacts' ? 'btn-active' : ''
            ]"
          >
            <Users class="h-4 w-4" />
          </button>
        </div>

        <div class="tooltip tooltip-right" :data-tip="$t('navigation.favorites')">
          <button
            @click="navigate('favorites')"
            :class="[
              'btn btn-ghost btn-sm h-8 w-8 p-0 antialiased',
              currentRoute === 'favorites' ? 'btn-active' : ''
            ]"
          >
            <Star class="h-4 w-4" />
          </button>
        </div>
      </nav>
    </div>

    <!-- Settings -->
    <div class="flex justify-center text-smooth">
      <div class="tooltip tooltip-right" :data-tip="$t('navigation.settings')">
        <button
          @click="navigate('settings')"
          :class="[
            'btn btn-ghost btn-sm h-8 w-8 p-0 antialiased',
            currentRoute === 'settings' ? 'btn-active' : ''
          ]"
        >
          <Settings class="h-4 w-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { 
  MessageCircle, 
  Home, 
  Users, 
  Star,
  Settings,
  MessageSquare
} from 'lucide-vue-next'

const router = useRouter()
const currentRoute = ref(router.currentRoute.value.name)

const navigate = (route) => {
  router.push({ name: route })
  currentRoute.value = route
}
</script>

<style scoped>
.tooltip {
  --tooltip-offset: 4px;
  position: relative;
}

/* Ajusta o posicionamento da tooltip */
.tooltip.tooltip-right:before {
  transform: translateY(-50%);
  top: 50%;
  right: auto;
  left: 100%;
  margin-left: var(--tooltip-offset);
}

/* Remove a seta da tooltip */
.tooltip.tooltip-right:after {
  display: none;
}

/* Garante que a tooltip não seja cortada */
.tooltip-right:hover:before {
  white-space: nowrap;
}
</style>
