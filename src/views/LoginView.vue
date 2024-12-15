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

            <!-- Divisor -->
            <div class="relative my-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  {{ t('auth.login.orContinueWith') }}
                </span>
              </div>
            </div>

            <!-- Botões de Login Social -->
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <img src="/assets/ui/auth/google.webp" alt="Google" class="w-5 h-5" />
                Google
              </button>
              <button
                type="button"
                class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <img src="/assets/ui/auth/whatsapp.png" alt="WhatsApp" class="w-6 h-6" />
                WhatsApp
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
      <div class="absolute inset-0 liquid-gradient z-0"></div>

      <!-- Logo de fundo -->
      <div class="absolute inset-0 flex items-center justify-center z-10 -translate-y-32">
        <img 
          src="/orbit.svg" 
          alt="" 
          class="w-[550px] h-[550px] opacity-50 blur-sm floating-logo"
          aria-hidden="true"
        />
      </div>

      <!-- Resto do conteúdo -->
      <div class="relative z-20 h-full flex flex-col">
        <!-- Lottie Animation -->
        <div class="flex-1 relative flex items-center justify-center scale-150 transform -mb-64">
          <Vue3Lottie
            v-if="astronotAnimation"
            :animation-data="astronotAnimation"
            :height="800"
            :width="800"
            :loop="true"
            :autoplay="true"
            :speed="0.5"
            direction="normal"
            mode="bounce"
          />
        </div>

        <!-- Cards de Features -->
        <div class="grid grid-cols-3 gap-8 px-8 mb-8 relative z-30">
          <!-- Feature 1 -->
          <div 
            class="bg-white/10 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.15)] w-full transform hover:scale-105 transition-all duration-300 border border-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:border-purple-500/40"
          >
            <div class="bg-purple-500/10 p-4 rounded-t-xl border-b border-purple-500/20">
              <div class="flex items-center gap-3">
                <span class="i-lucide-message-circle-more h-5 w-5 text-purple-300"></span>
                <h3 class="text-base font-semibold text-white">{{ t('auth.login.hero.feature1.title') }}</h3>
              </div>
            </div>
            <div class="p-4">
              <p class="text-purple-100/80 text-sm">{{ t('auth.login.hero.feature1.description') }}</p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div 
            class="bg-white/10 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.15)] w-full transform hover:scale-105 transition-all duration-300 border border-blue-500/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-500/40"
          >
            <div class="bg-blue-500/10 p-4 rounded-t-xl border-b border-blue-500/20">
              <div class="flex items-center gap-3">
                <span class="i-lucide-users h-5 w-5 text-blue-300"></span>
                <h3 class="text-base font-semibold text-white">{{ t('auth.login.hero.feature2.title') }}</h3>
              </div>
            </div>
            <div class="p-4">
              <p class="text-blue-100/80 text-sm">{{ t('auth.login.hero.feature2.description') }}</p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div 
            class="bg-white/10 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.15)] w-full transform hover:scale-105 transition-all duration-300 border border-green-500/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:border-green-500/40"
          >
            <div class="bg-green-500/10 p-4 rounded-t-xl border-b border-green-500/20">
              <div class="flex items-center gap-3">
                <span class="i-lucide-bar-chart-2 h-5 w-5 text-green-300"></span>
                <h3 class="text-base font-semibold text-white">{{ t('auth.login.hero.feature3.title') }}</h3>
              </div>
            </div>
            <div class="p-4">
              <p class="text-green-100/80 text-sm">{{ t('auth.login.hero.feature3.description') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useI18n } from '@/i18n/plugin';
import LanguageSelector from '../components/LanguageSelector.vue';
import { Eye, EyeOff } from 'lucide-vue-next';
import { gqlRequest } from '../utils/graphql';
import { Vue3Lottie } from 'vue3-lottie';

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

// Carregando o arquivo Lottie
const astronotAnimation = ref(null);

// Função para formatar a URL da conta
function formatAccountUrl(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]/g, '-') // Substitui caracteres especiais por hífen
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, ''); // Remove hífens no início e fim
}

onMounted(async () => {
  try {
    const response = await fetch('/assets/ui/lotties/astronot.json');
    if (!response.ok) throw new Error('Erro ao carregar animação');
    astronotAnimation.value = await response.json();
  } catch (err) {
    console.error('Erro ao carregar animação:', err);
  }
});

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

    // Atualiza o estado de autenticaço
    authStore.setAuth({
      token: response.login.token,
      user: response.login.user
    });

    // Sempre redireciona para o dashboard do usuário, independente da role
    const accountUrl = formatAccountUrl(response.login.user.name);
    router.push(`/dashboard/${accountUrl}`);
    
  } catch (err) {
    console.error('Erro no login:', err);
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

.floating-logo {
  animation: float-space 20s ease-in-out infinite;
  transform-origin: center;
}

@keyframes float-space {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  20% {
    transform: translate(20px, -20px) rotate(3deg) scale(1.02);
  }
  40% {
    transform: translate(-15px, -25px) rotate(-2deg) scale(0.98);
  }
  60% {
    transform: translate(-20px, 15px) rotate(-4deg) scale(1.01);
  }
  80% {
    transform: translate(15px, 20px) rotate(2deg) scale(0.99);
  }
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
}

@keyframes liquid {
  0%, 100% {
    background-position: 0% 0%;
  }
  25% {
    transform: translate(15px, -15px);
  }
  50% {
    transform: translate(0, 0);
  }
  75% {
    transform: translate(-15px, 15px);
  }
}
</style> 