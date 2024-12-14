<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { gqlRequest } from '@/utils/graphql'
import { Building } from 'lucide-vue-next'

const authStore = useAuthStore()
const organizations = ref([])
const loading = ref(true)

async function fetchOrganizations() {
  try {
    const query = `
      query GetUserOrganizations {
        me {
          organizations {
            organization {
              id
              name
              slug
            }
          }
        }
      }
    `

    const response = await gqlRequest(query, null, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    organizations.value = response.me.organizations.map(org => org.organization)
    
    // Se só tem uma organização, seleciona ela automaticamente
    if (organizations.value.length === 1 && !authStore.currentOrganization) {
      authStore.setCurrentOrganization(organizations.value[0])
    }
  } catch (error) {
    console.error('Erro ao buscar organizações:', error)
  } finally {
    loading.value = false
  }
}

function handleOrganizationChange(org) {
  authStore.setCurrentOrganization(org)
  window.location.reload() // Recarrega para atualizar os dados
}

onMounted(fetchOrganizations)
</script>

<template>
  <div class="dropdown">
    <label tabindex="0" class="btn btn-ghost gap-2">
      <Building class="h-4 w-4" />
      <span v-if="loading">Carregando...</span>
      <span v-else class="truncate max-w-[200px]">
        {{ authStore.currentOrganization?.name || 'Selecione uma organização' }}
      </span>
    </label>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2">
      <li v-for="org in organizations" :key="org.id">
        <a 
          :class="{ 'active': org.id === authStore.currentOrganization?.id }"
          @click="handleOrganizationChange(org)"
        >
          {{ org.name }}
        </a>
      </li>
      <li v-if="organizations.length === 0" class="text-sm text-gray-500 p-2">
        Nenhuma organização encontrada
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown-content {
  z-index: 1000;
}
</style> 