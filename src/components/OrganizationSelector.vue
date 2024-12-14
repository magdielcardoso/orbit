<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { gqlRequest } from '@/utils/graphql'
import { useI18n } from '@/i18n'
import { Building } from 'lucide-vue-next'

const { t } = useI18n()
const authStore = useAuthStore()
const organizations = ref([])
const loading = ref(false)

// Busca organizações do usuário
async function fetchUserOrganizations() {
  try {
    loading.value = true
    const query = `
      query GetUserOrganizations {
        users {
          id
          name
          email
          currentOrgId
          organizations {
            organization {
              id
              name
              slug
              plan
            }
            isAdmin
            isOwner
            status
          }
        }
      }
    `

    const response = await gqlRequest(query, null, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    console.log('Resposta completa:', response)

    // Encontra o usuário atual
    const currentUser = response.users.find(u => u.id === authStore.user.id)
    if (!currentUser) return

    // Extrai as organizações e marca a atual
    const userOrgs = currentUser.organizations || []
    const currentOrgId = currentUser.currentOrgId

    organizations.value = userOrgs.map(org => ({
      id: org.organization.id,
      name: org.organization.name,
      slug: org.organization.slug,
      plan: org.organization.plan,
      isAdmin: org.isAdmin,
      isOwner: org.isOwner,
      status: org.status,
      isCurrent: org.organization.id === currentOrgId
    }))

    // Encontra e atualiza a organização atual
    const currentOrg = userOrgs.find(org => 
      org.organization.id === currentOrgId
    )?.organization

    if (currentOrg) {
      authStore.setCurrentOrganization({
        id: currentOrg.id,
        name: currentOrg.name,
        slug: currentOrg.slug,
        plan: currentOrg.plan
      })
    }

    console.log('Organizações processadas:', organizations.value)
  } catch (error) {
    console.error('Erro ao carregar organizações:', error)
  } finally {
    loading.value = false
  }
}

// Função para trocar de organização
async function switchOrganization(orgId) {
  try {
    loading.value = true
    const mutation = `
      mutation UpdateUser($id: ID!, $input: UserInput!) {
        updateUser(id: $id, input: $input) {
          id
          currentOrgId
        }
      }
    `

    await gqlRequest(mutation, {
      id: authStore.user.id,
      input: {
        currentOrgId: orgId
      }
    }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    // Atualiza a lista
    await fetchUserOrganizations()

    // Atualiza o estado global se necessário
    authStore.setCurrentOrgId(orgId)
  } catch (error) {
    console.error('Erro ao trocar organização:', error)
  } finally {
    loading.value = false
  }
}

// Função para lidar com a mudança de organização
async function handleOrganizationChange(org) {
  if (org.id !== authStore.currentOrganization?.id) {
    await switchOrganization(org.id)
  }
}

onMounted(fetchUserOrganizations)

// Expõe funções e dados necessários
defineExpose({
  organizations,
  loading,
  switchOrganization,
  fetchUserOrganizations
})
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