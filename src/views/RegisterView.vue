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

          <!-- Progress Steps -->
          <div class="mt-8 mb-8">
            <div class="flex items-center justify-between relative">
              <div v-for="step in 3" :key="step" 
                class="z-10 flex flex-col items-center"
              >
                <div 
                  class="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300"
                  :class="[
                    currentStep >= step 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  ]"
                >
                  <span class="text-sm">{{ step }}</span>
                </div>
                <span class="mt-2 text-xs text-gray-600" :class="{ 'font-medium': currentStep >= step }">
                  {{ t(`auth.register.steps.${step === 1 ? 'account' : step === 2 ? 'organization' : 'confirmation'}`) }}
                </span>
              </div>
              <!-- Progress Bar -->
              <div class="absolute top-4 transform -translate-y-1/2 h-1 w-[calc(100%-2rem)] bg-gray-200">
                <div 
                  class="h-full bg-purple-600 transition-all duration-300"
                  :style="{ width: ((currentStep - 1) / 2 * 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Step 1: Conta do Usuário -->
          <form v-if="currentStep === 1" class="mt-8 space-y-6" @submit.prevent="nextStep">
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
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {{ t('common.next') }}
              </button>
            </div>
          </form>

          <!-- Step 2: Organização -->
          <form v-if="currentStep === 2" class="mt-8 space-y-6" @submit.prevent="nextStep">
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="orgName" class="sr-only">{{ t('auth.register.organization.name') }}</label>
                <input
                  id="orgName"
                  v-model="form.organization.name"
                  name="orgName"
                  type="text"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  :placeholder="t('auth.register.organization.namePlaceholder')"
                  @input="generateSlug"
                />
              </div>
              <div>
                <label for="orgSlug" class="sr-only">{{ t('auth.register.organization.slug') }}</label>
                <input
                  id="orgSlug"
                  v-model="form.organization.slug"
                  name="orgSlug"
                  type="text"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  :placeholder="t('auth.register.organization.slugPlaceholder')"
                  @blur="validateSlug"
                />
              </div>
              <div>
                <label for="orgDomain" class="sr-only">{{ t('auth.register.organization.domain') }}</label>
                <input
                  id="orgDomain"
                  v-model="form.organization.domain"
                  name="orgDomain"
                  type="text"
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  :placeholder="t('auth.register.organization.domainPlaceholder')"
                />
              </div>
            </div>

            <!-- Preview da Organização -->
            <div v-if="organizationPreview" class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex items-center gap-4">
                <div class="avatar">
                  <div class="rounded-full w-16 h-16">
                    <template v-if="organizationPreview.avatar">
                      <img :src="organizationPreview.avatar" :alt="organizationPreview.name" class="rounded-full" />
                    </template>
                    <template v-else>
                      <div class="bg-neutral-focus text-neutral-content w-full h-full rounded-full flex items-center justify-center">
                        <span class="text-xl">{{ organizationPreview.name.charAt(0).toUpperCase() }}</span>
                      </div>
                    </template>
                  </div>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">{{ organizationPreview.name }}</h3>
                  <p class="text-sm text-gray-500">{{ organizationPreview.slug }}</p>
                  <p v-if="organizationPreview.domain" class="text-sm text-gray-500">{{ organizationPreview.domain }}</p>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                @click="currentStep--"
                class="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {{ t('common.back') }}
              </button>
              <button
                type="submit"
                :disabled="!isOrganizationValid"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white"
                :class="[
                  isOrganizationValid 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-purple-300 cursor-not-allowed'
                ]"
              >
                {{ t('common.next') }}
              </button>
            </div>
          </form>

          <!-- Step 3: Confirmação -->
          <div v-if="currentStep === 3" class="mt-8 space-y-6">
            <div class="bg-white rounded-lg border border-gray-200">
              <!-- Dados do Usuário -->
              <div class="border-b border-gray-200">
                <button 
                  @click="expandedSection = expandedSection === 'user' ? null : 'user'"
                  class="w-full p-4 flex justify-between items-center hover:bg-gray-50"
                >
                  <h3 class="font-medium text-gray-900">{{ t('auth.register.confirmation.userData') }}</h3>
                  <span class="i-lucide-chevron-down h-5 w-5 text-gray-500 transform transition-transform duration-200"
                    :class="{ 'rotate-180': expandedSection === 'user' }"
                  ></span>
                </button>
                <div v-show="expandedSection === 'user'" class="p-4 space-y-2 bg-gray-50">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">{{ t('auth.register.name') }}</span>
                    <span class="text-sm text-gray-900">{{ form.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">{{ t('auth.register.email') }}</span>
                    <span class="text-sm text-gray-900">{{ form.email }}</span>
                  </div>
                </div>
              </div>

              <!-- Dados da Organização -->
              <div class="border-b border-gray-200">
                <button 
                  @click="expandedSection = expandedSection === 'organization' ? null : 'organization'"
                  class="w-full p-4 flex justify-between items-center hover:bg-gray-50"
                >
                  <h3 class="font-medium text-gray-900">{{ t('auth.register.confirmation.organizationData') }}</h3>
                  <span class="i-lucide-chevron-down h-5 w-5 text-gray-500 transform transition-transform duration-200"
                    :class="{ 'rotate-180': expandedSection === 'organization' }"
                  ></span>
                </button>
                <div v-show="expandedSection === 'organization'" class="p-4 bg-gray-50">
                  <div class="flex items-center gap-4 mb-4">
                    <div class="avatar">
                      <div class="rounded-full w-16 h-16">
                        <template v-if="form.organization.avatar">
                          <img :src="form.organization.avatar" :alt="form.organization.name" class="rounded-full" />
                        </template>
                        <template v-else>
                          <div class="bg-neutral-focus text-neutral-content w-full h-full rounded-full flex items-center justify-center">
                            <span class="text-xl">{{ form.organization.name.charAt(0).toUpperCase() }}</span>
                          </div>
                        </template>
                      </div>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900">{{ form.organization.name }}</h3>
                      <p class="text-sm text-gray-500">{{ form.organization.slug }}</p>
                      <p v-if="form.organization.domain" class="text-sm text-gray-500">{{ form.organization.domain }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Preferências -->
              <div>
                <button 
                  @click="expandedSection = expandedSection === 'preferences' ? null : 'preferences'"
                  class="w-full p-4 flex justify-between items-center hover:bg-gray-50"
                >
                  <h3 class="font-medium text-gray-900">{{ t('auth.register.confirmation.preferences') }}</h3>
                  <span class="i-lucide-chevron-down h-5 w-5 text-gray-500 transform transition-transform duration-200"
                    :class="{ 'rotate-180': expandedSection === 'preferences' }"
                  ></span>
                </button>
                <div v-show="expandedSection === 'preferences'" class="p-4 space-y-2 bg-gray-50">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">{{ t('auth.register.preferences.timezone') }}</span>
                    <span class="text-sm text-gray-900">{{ form.preferences.timezone }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">{{ t('auth.register.preferences.language') }}</span>
                    <span class="text-sm text-gray-900">
                      {{ form.preferences.locale === 'pt-BR' ? 'Português (Brasil)' : 'English' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                @click="currentStep--"
                class="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {{ t('common.back') }}
              </button>
              <button
                type="button"
                @click="handleRegister"
                :disabled="loading"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <span v-if="loading">{{ t('auth.register.loading') }}</span>
                <span v-else>{{ t('auth.register.submit') }}</span>
              </button>
            </div>
          </div>

          <div v-if="error" class="mt-4 text-red-500 text-sm text-center">
            {{ error }}
          </div>

          <div class="mt-4 text-sm text-center">
            <router-link
              to="/login"
              class="font-medium text-purple-600 hover:text-purple-500"
            >
              {{ t('auth.register.hasAccount') }}
            </router-link>
          </div>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useI18n } from '@/i18n/plugin';
import LanguageSelector from '../components/LanguageSelector.vue';
import { Eye, EyeOff } from 'lucide-vue-next';
import { gqlRequest } from '../utils/graphql';
import { formatAccountUrl } from '../utils/string';
import { Vue3Lottie } from 'vue3-lottie';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const currentStep = ref(1);
const form = ref({
  name: '',
  email: '',
  password: '',
  organization: {
    name: '',
    slug: '',
    domain: '',
    avatar: null
  },
  preferences: {
    timezone: 'America/Sao_Paulo',
    locale: localStorage.getItem('locale') || 'pt-BR'
  }
});

const loading = ref(false);
const error = ref(null);
const showPassword = ref(false);
const organizationPreview = ref(null);
const isOrganizationValid = ref(false);
const expandedSection = ref('user');

// Cores para os avatares
const colors = [
  'bg-orbit-500/10 text-orbit-500',
  'bg-orbit-600/10 text-orbit-600',
  'bg-orbit-700/10 text-orbit-700',
  'bg-orbit-400/10 text-orbit-400',
  'bg-orbit-500/10 text-orbit-500',
  'bg-orbit-600/10 text-orbit-600'
];

// Gera uma cor baseada no nome
const getColorFromName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

function generateSlug() {
  form.value.organization.slug = form.value.organization.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function validateSlug() {
  try {
    const validateSlugQuery = `
      query ValidateOrganizationSlug($slug: String!) {
        validateOrganizationSlug(slug: $slug) {
          available
          organization {
            name
            slug
            domain
          }
        }
      }
    `;

    const response = await gqlRequest(validateSlugQuery, {
      slug: form.value.organization.slug
    });

    const validation = response.validateOrganizationSlug;

    if (!validation.available) {
      // Apenas mostra o preview da organização existente
      organizationPreview.value = validation.organization;
    } else {
      // Mostra o preview com os dados do formulário
      organizationPreview.value = {
        name: form.value.organization.name,
        slug: form.value.organization.slug,
        domain: form.value.organization.domain
      };
    }

    // Sempre permite prosseguir se tiver um slug válido
    error.value = null;
    isOrganizationValid.value = true;
  } catch (err) {
    console.error('Erro ao validar slug:', err);
    error.value = err.message;
    isOrganizationValid.value = false;
  }
}

function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
}

async function handleRegister() {
  try {
    loading.value = true;
    error.value = null;

    const registerMutation = `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
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
            currentOrg {
              id
              name
              slug
            }
          }
        }
      }
    `;

    const response = await gqlRequest(registerMutation, {
      input: {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        organization: {
          name: form.value.organization.name,
          slug: form.value.organization.slug,
          domain: form.value.organization.domain || null,
          timezone: form.value.preferences.timezone,
          locale: form.value.preferences.locale
        }
      }
    });

    authStore.setAuth({
      token: response.register.token,
      user: response.register.user
    });

    const accountUrl = formatAccountUrl(response.register.user.currentOrg.slug);
    router.push(`/dashboard/${accountUrl}`);
  } catch (err) {
    console.error('Erro no registro:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// Carregando o arquivo Lottie
const astronotAnimation = ref(null);

onMounted(async () => {
  try {
    const response = await fetch('/assets/ui/lotties/astronot.json');
    if (!response.ok) throw new Error('Erro ao carregar animação');
    astronotAnimation.value = await response.json();
  } catch (err) {
    console.error('Erro ao carregar animação:', err);
  }
});
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