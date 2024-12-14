<template>
  <div class="min-h-screen flex bg-gray-50">
    <LocaleSelector />
    
    <!-- Form Section -->
    <div class="w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md space-y-8 bg-white rounded-lg shadow-lg border-2 border-purple-500 p-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {{ t('auth.login.title') }}
          </h2>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">{{ t('auth.login.email') }}</label>
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                :placeholder="t('auth.login.email')"
              />
            </div>
            <div class="relative">
              <label for="password" class="sr-only">{{ t('auth.login.password') }}</label>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm pr-10"
                :placeholder="t('auth.login.password')"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Eye v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-500" />
                <EyeOff v-else class="h-5 w-5 text-gray-400 hover:text-gray-500" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                {{ t('auth.login.rememberMe') }}
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <span v-if="loading">{{ t('auth.login.loading') }}</span>
              <span v-else>{{ t('auth.login.submit') }}</span>
            </button>
          </div>

          <div v-if="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </div>

          <div class="text-sm text-center">
            <router-link
              to="/register"
              class="font-medium text-purple-600 hover:text-purple-500"
            >
              {{ t('auth.login.noAccount') }}
            </router-link>
          </div>
        </form>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="w-1/2 bg-purple-700 p-12 flex items-center">
      <div class="text-white">
        <h1 class="text-4xl font-bold mb-6">
          {{ t('auth.login.hero.title') }}
        </h1>
        <div class="space-y-6">
          <div class="flex items-start space-x-4">
            <svg class="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="text-xl font-semibold mb-2">{{ t('auth.login.hero.feature1.title') }}</h3>
              <p class="text-purple-100">{{ t('auth.login.hero.feature1.description') }}</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4">
            <svg class="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="text-xl font-semibold mb-2">{{ t('auth.login.hero.feature2.title') }}</h3>
              <p class="text-purple-100">{{ t('auth.login.hero.feature2.description') }}</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-4">
            <svg class="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="text-xl font-semibold mb-2">{{ t('auth.login.hero.feature3.title') }}</h3>
              <p class="text-purple-100">{{ t('auth.login.hero.feature3.description') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useI18n } from '@/i18n/plugin';
import LocaleSelector from '../components/LocaleSelector.vue';
import { Eye, EyeOff } from 'lucide-vue-next';
import { gqlRequest } from '../utils/graphql';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const form = ref({
  email: '',
  password: '',
  rememberMe: false
});

const loading = ref(false);
const error = ref(null);
const showPassword = ref(false);

async function handleLogin() {
  try {
    loading.value = true;
    error.value = null;

    const loginMutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
            name
            email
            role {
              name
              permissions {
                name
              }
            }
          }
        }
      }
    `;

    const response = await gqlRequest(loginMutation, {
      email: form.value.email,
      password: form.value.password
    });

    // Atualiza o estado de autenticação
    authStore.setAuth({
      token: response.login.token,
      user: response.login.user
    });

    // Redireciona baseado no papel do usuário
    if (authStore.hasPermission('manage_system')) {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  } catch (err) {
    console.error('Erro no login:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script> 