<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <UserSidebar />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto bg-base-100">
      <!-- Navbar -->
      <Navbar />

      <!-- Conteúdo da página -->
      <div class="w-full h-full">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth.store'
import UserSidebar from '../components/layout/UserSidebar.vue'
import Navbar from '../components/layout/Navbar.vue'

const authStore = useAuthStore()
</script>