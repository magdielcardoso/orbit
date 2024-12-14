<template>
  <div class="flex h-screen">
    <!-- Sempre usa o UserSidebar -->
    <UserSidebar />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto bg-base-100">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth.store'
import UserSidebar from '../components/layout/UserSidebar.vue'

const authStore = useAuthStore()
</script>
c