<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <SecondarySidebar v-if="showSecondarySidebar" />
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '../components/layout/Sidebar.vue'
import SecondarySidebar from '../components/layout/SecondarySidebar.vue'

const route = useRoute()

// Mostra a sidebar secundária apenas em rotas específicas
const showSecondarySidebar = computed(() => {
  return [
    'settings',
    'account-settings',
    'agents',
    'teams',
    'inbox',
    'tags',
    'custom-fields',
    'macros',
    'canned-responses',
    'audit-logs',
    'integrations',
    'custom-functions',
    'sla'
  ].includes(route.name)
})
</script>
