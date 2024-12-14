<template>
  <div class="flex h-screen">
    <!-- Sidebar baseado no tipo de usuário -->
    <UserSidebar v-if="!isAdmin" />
    <SuperAdminSidebar v-else />
    <div class="hidden">
      Debug: {{ authStore.user?.permissions }}
      IsAdmin: {{ isAdmin }}
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto bg-base-100">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import UserSidebar from '../components/layout/UserSidebar.vue'
import SuperAdminSidebar from '../components/layout/SuperAdminSidebar.vue'

const authStore = useAuthStore()

// Verifica se o usuário é admin baseado nas permissões
const isAdmin = computed(() => {
  const hasPermission = authStore.hasPermission('manage_system')
  console.log('Is Admin?', hasPermission) // Debug
  return hasPermission
})
</script>
