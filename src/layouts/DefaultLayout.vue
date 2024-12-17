<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <UserSidebar />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden bg-base-100">
      <!-- Navbar -->
      <Navbar class="shrink-0" />

      <!-- Conteúdo da página -->
      <div class="flex-1 overflow-hidden h-[calc(100vh-4rem)]">
        <router-view class="h-full" />
      </div>
    </main>

    <!-- Floating Button -->
    <FloatingButton />
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth.store'
import UserSidebar from '../components/layout/UserSidebar.vue'
import Navbar from '../components/layout/Navbar.vue'
import FloatingButton from '../components/ui/FloatingButton.vue'

const authStore = useAuthStore()
</script>

<style scoped>
/* Garante que os elementos flex não cresçam além do necessário */
:deep(.flex) {
  min-height: 0;
}

/* Garante que o router-view ocupe toda a altura disponível */
:deep(.router-view-container) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>