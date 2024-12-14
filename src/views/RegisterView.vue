<template>
  <div class="min-h-screen flex bg-gray-50">
    <LocaleSelector />
    
    <!-- Form Section -->
    <div class="w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md space-y-8 bg-white rounded-lg shadow-lg border-2 border-purple-500 p-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {{ t('auth.register.title') }}
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            {{ t('auth.register.subtitle') }}
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="name" class="sr-only">{{ t('auth.register.name') }}</label>
              <input
                id="name"
                v-model="form.name"
                name="name"
                type="text"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                :placeholder="t('auth.register.namePlaceholder')"
              />
            </div>
            <div>
              <label for="email" class="sr-only">{{ t('auth.register.email') }}</label>
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                :placeholder="t('auth.register.emailPlaceholder')"
              />
            </div>
            <div class="relative">
              <label for="password" class="sr-only">{{ t('auth.register.password') }}</label>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm pr-10"
                :placeholder="t('auth.register.passwordPlaceholder')"
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

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <span v-if="loading">{{ t('auth.register.loading') }}</span>
              <span v-else>{{ t('auth.register.submit') }}</span>
            </button>
          </div>

          <div v-if="error" class="text-red-500 text-sm text-center">
            {{ t(error) }}
          </div>

          <div class="text-sm text-center">
            <router-link
              to="/login"
              class="font-medium text-purple-600 hover:text-purple-500"
            >
              {{ t('auth.register.hasAccount') }}
            </router-link>
          </div>
        </form>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="w-1/2 bg-purple-700 p-12 flex items-center">
      <div class="text-white">
        <h1 class="text-4xl font-bold mb-6">
          {{ t('auth.register.hero.title') }}
        </h1>
        <div class="space-y-6">
          <div v-for="(feature, index) in 3" :key="index" class="flex items-start space-x-4">
            <svg class="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="text-xl font-semibold mb-2">
                {{ t(`auth.register.hero.feature${index + 1}.title`) }}
              </h3>
              <p class="text-purple-100">
                {{ t(`auth.register.hero.feature${index + 1}.description`) }}
              </p>
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
import { formatAccountUrl } from '../utils/string';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const form = ref({
  name: '',
  email: '',
  password: ''
});

const loading = ref(false);
const error = ref(null);
const showPassword = ref(false);

async function handleRegister() {
  try {
    loading.value = true;
    error.value = null;

    const registerMutation = `
      mutation Register($name: String!, $email: String!, $password: String!) {
        register(name: $name, email: $email, password: $password) {
          token
          user {
            id
            name
            email
            active
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

    const response = await gqlRequest(registerMutation, {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    });

    authStore.setAuth({
      token: response.register.token,
      user: response.register.user
    });

    const accountUrl = formatAccountUrl(response.register.user.name);
    router.push(`/dashboard/${accountUrl}`);
  } catch (err) {
    console.error('Erro no registro:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script> 