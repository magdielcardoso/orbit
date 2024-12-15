<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Form Section -->
    <div class="w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md space-y-8">
        <!-- Logo -->
        <div class="flex justify-center">
          <img src="/orbit_light.svg" alt="OrbitChat" class="w-60 h-auto" />
        </div>

        <div class="bg-white rounded-lg shadow-lg border-2 border-purple-500 p-8">
          <div>
            <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
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

        <!-- Links de Política e Termos -->
        <div class="text-gray-600 text-xs text-center mt-6">
          {{ t('auth.login.termsText') }}
          <router-link to="/privacy" class="text-gray-600 hover:text-gray-800 underline">
            {{ t('auth.login.privacyPolicy') }}
          </router-link>
          {{ t('auth.login.and') }}
          <router-link to="/terms" class="text-gray-600 hover:text-gray-800 underline">
            {{ t('auth.login.termsOfUse') }}
          </router-link>
        </div>

        <!-- Seletor de Idioma -->
        <div class="mt-6 flex justify-center">
          <LanguageSelector />
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="w-1/2 p-12 relative overflow-hidden flex flex-col bg-purple-900">
      <!-- Gradientes animados -->
      <div class="absolute inset-0 liquid-gradient"></div>

      <!-- Resto do conteúdo -->
      <div class="relative z-10 h-full flex flex-col">
        <!-- Imagem de fundo -->
        <div class="flex-1 relative">
          <img 
            src="/assets/ui/omnichannel.png" 
            alt="Omnichannel" 
            class="absolute inset-0 w-full h-full object-contain scale-125"
          />
        </div>

        <!-- Cards de Features -->
        <div class="grid grid-cols-3 gap-8 -mt-32 px-8 mb-8 relative z-20">
          <!-- Feature 1 -->
          <div 
            class="bg-white/10 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.15)] w-full transform hover:scale-105 transition-all duration-300 border border-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:border-purple-500/40"
          >
            <div class="bg-purple-500/10 p-4 rounded-t-xl border-b border-purple-500/20">
              <div class="flex items-center gap-3">
                <span class="i-lucide-message-circle-more h-5 w-5 text-purple-300"></span>
                <h3 class="text-base font-semibold text-white">{{ t('auth.register.hero.feature1.title') }}</h3>
              </div>
            </div>
            <div class="p-4">
              <p class="text-purple-100/80 text-sm">{{ t('auth.register.hero.feature1.description') }}</p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div 
            class="bg-white/10 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.15)] w-full transform hover:scale-105 transition-all duration-300 border border-blue-500/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-500/40"
          >
            <div class="bg-blue-500/10 p-4 rounded-t-xl border-b border-blue-500/20">
              <div class="flex items-center gap-3">
                <span class="i-lucide-users h-5 w-5 text-blue-300"></span>
                <h3 class="text-base font-semibold text-white">{{ t('auth.register.hero.feature2.title') }}</h3>
              </div>
            </div>
            <div class="p-4">
              <p class="text-blue-100/80 text-sm">{{ t('auth.register.hero.feature2.description') }}</p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div 
            class="bg-white/10 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.15)] w-full transform hover:scale-105 transition-all duration-300 border border-green-500/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:border-green-500/40"
          >
            <div class="bg-green-500/10 p-4 rounded-t-xl border-b border-green-500/20">
              <div class="flex items-center gap-3">
                <span class="i-lucide-bar-chart-2 h-5 w-5 text-green-300"></span>
                <h3 class="text-base font-semibold text-white">{{ t('auth.register.hero.feature3.title') }}</h3>
              </div>
            </div>
            <div class="p-4">
              <p class="text-green-100/80 text-sm">{{ t('auth.register.hero.feature3.description') }}</p>
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
import LanguageSelector from '../components/LanguageSelector.vue';
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

<style scoped>
.liquid-gradient {
  background: 
    radial-gradient(circle at 0% 0%, rgba(244,63,94,1) 0%, transparent 45%),
    radial-gradient(circle at 100% 0%, rgba(236,72,153,1) 0%, transparent 45%),
    radial-gradient(circle at 100% 100%, rgba(139,92,246,1) 0%, transparent 45%),
    radial-gradient(circle at 0% 100%, rgba(6,182,212,1) 0%, transparent 45%);
  background-size: 180% 180%;
  animation: liquid 25s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  filter: blur(30px);
  opacity: 0.7;
}

@keyframes liquid {
  0% {
    background-position: 0% 0%;
  }
  25% {
    background-position: 100% 25%;
  }
  50% {
    background-position: 80% 100%;
  }
  75% {
    background-position: 20% 75%;
  }
  100% {
    background-position: 0% 0%;
  }
}
</style> 