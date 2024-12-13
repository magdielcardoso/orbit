<template>
  <nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <router-link to="/" class="text-white font-bold text-xl">
              OrbitChat
            </router-link>
          </div>
        </div>
        
        <div class="flex items-center">
          <template v-if="authStore.isAuthenticated">
            <div class="ml-4 flex items-center md:ml-6">
              <div class="ml-3 relative">
                <div class="text-gray-300">
                  {{ authStore.user?.name }}
                  <span v-if="authStore.userRole" class="text-gray-500 text-sm ml-2">
                    ({{ authStore.userRole }})
                  </span>
                </div>
              </div>
              <button
                @click="handleLogout"
                class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Sair
              </button>
            </div>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Entrar
            </router-link>
            <router-link
              to="/register"
              class="ml-4 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Registrar
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

async function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script> 