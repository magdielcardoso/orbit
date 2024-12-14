<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <UserSidebar />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto bg-base-100">
      <!-- Header com OrganizationSelector -->
      <header class="p-4 border-b border-base-200 bg-base-100 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Seletor de Organização -->
          <OrganizationSelector />
        </div>
        
        <div class="flex items-center gap-2">
          <!-- Outros elementos do header se necessário -->
        </div>
      </header>

      <!-- Conteúdo da página -->
      <div class="container mx-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth.store'
import UserSidebar from '../components/layout/UserSidebar.vue'
import OrganizationSelector from '../components/OrganizationSelector.vue'

const authStore = useAuthStore()
</script>
c