<template>
  <div class="min-h-screen bg-gray-100">
    <main class="py-10">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div class="p-6 bg-white border-b border-gray-200">
            <h1 class="text-2xl font-semibold text-gray-900">
              Bem-vindo ao OrbitChat
            </h1>
            <p class="mt-4 text-gray-600">
              Você está logado como {{ authStore.user?.name }}
            </p>
            <div v-if="authStore.userRole" class="mt-2 text-sm text-gray-500">
              Seu papel: {{ authStore.userRole }}
            </div>
            <div v-if="authStore.user?.permissions?.length" class="mt-4">
              <h2 class="text-lg font-medium text-gray-900">Suas permissões:</h2>
              <ul class="mt-2 list-disc list-inside text-gray-600">
                <li v-for="permission in authStore.user.permissions" :key="permission">
                  {{ permission }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth.store';

const authStore = useAuthStore();
</script> 