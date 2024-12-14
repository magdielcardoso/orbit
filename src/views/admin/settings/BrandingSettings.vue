<template>
  <div class="p-6">
    <div class="sm:flex sm:items-center mb-8">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Configurações de Marca</h1>
        <p class="mt-2 text-sm text-gray-700">
          Personalize a identidade visual do seu sistema.
        </p>
      </div>
    </div>

    <form @submit.prevent="saveSettings" class="space-y-8">
      <!-- Identidade Visual -->
      <div class="bg-white shadow sm:rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Identidade Visual</h3>
        
        <!-- Logo Upload -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Logo</label>
          <div class="flex items-center space-x-4">
            <div class="w-24 h-24 border-2 border-gray-300 rounded-lg flex items-center justify-center">
              <img v-if="preview.logo" :src="preview.logo" class="max-w-full max-h-full" />
              <ImageIcon v-else class="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <input
                type="file"
                ref="logoInput"
                class="hidden"
                accept="image/*"
                @change="handleLogoUpload"
              />
              <button
                type="button"
                @click="$refs.logoInput.click()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Alterar Logo
              </button>
              <p class="mt-1 text-xs text-gray-500">PNG, JPG ou SVG. Máximo 2MB.</p>
            </div>
          </div>
        </div>

        <!-- Cores -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Cor Primária</label>
            <div class="flex items-center space-x-2">
              <div 
                class="w-8 h-8 rounded-full border shadow-sm cursor-pointer"
                :style="{ backgroundColor: settings.primaryColor }"
                @click="openColorPicker('primary')"
              ></div>
              <input
                v-model="settings.primaryColor"
                type="text"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
            <div class="flex items-center space-x-2">
              <div 
                class="w-8 h-8 rounded-full border shadow-sm cursor-pointer"
                :style="{ backgroundColor: settings.secondaryColor }"
                @click="openColorPicker('secondary')"
              ></div>
              <input
                v-model="settings.secondaryColor"
                type="text"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Cor de Destaque</label>
            <div class="flex items-center space-x-2">
              <div 
                class="w-8 h-8 rounded-full border shadow-sm cursor-pointer"
                :style="{ backgroundColor: settings.accentColor }"
                @click="openColorPicker('accent')"
              ></div>
              <input
                v-model="settings.accentColor"
                type="text"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Fontes -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fonte Principal</label>
            <select
              v-model="settings.primaryFont"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            >
              <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fonte Secundária</label>
            <select
              v-model="settings.secondaryFont"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            >
              <option value="">Nenhuma</option>
              <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Elementos de Marca -->
      <div class="bg-white shadow sm:rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Elementos de Marca</h3>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
            <input
              v-model="settings.companyName"
              type="text"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Slogan</label>
            <input
              v-model="settings.slogan"
              type="text"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              v-model="settings.description"
              rows="3"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Redes Sociais -->
      <div class="bg-white shadow sm:rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Redes Sociais</h3>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                facebook.com/
              </span>
              <input
                v-model="socialLinks.facebook"
                type="text"
                class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                instagram.com/
              </span>
              <input
                v-model="socialLinks.instagram"
                type="text"
                class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Botões -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="resetSettings"
          class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Resetar
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/auth.store';
import { gqlRequest } from '../../../utils/graphql';
import { ImageIcon } from 'lucide-vue-next';

const authStore = useAuthStore();
const loading = ref(false);

// Lista de fontes disponíveis
const fonts = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Source Sans Pro',
  'Poppins'
];

// Estados
const settings = ref({
  logo: '',
  favicon: '',
  primaryColor: '#9333EA',
  secondaryColor: '#22C55E',
  accentColor: '#F59E0B',
  primaryFont: 'Inter',
  secondaryFont: '',
  companyName: '',
  slogan: '',
  description: ''
});

const preview = ref({
  logo: null,
  favicon: null
});

const socialLinks = ref({
  facebook: '',
  instagram: '',
  twitter: '',
  linkedin: ''
});

// Funções
async function loadSettings() {
  try {
    loading.value = true;
    const query = `
      query GetBrandSettings {
        brandConfig {
          logo
          favicon
          primaryColor
          secondaryColor
          accentColor
          primaryFont
          secondaryFont
          companyName
          slogan
          description
          socialLinks
        }
      }
    `;

    const response = await gqlRequest(query, null, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    if (response?.brandConfig) {
      settings.value = { ...response.brandConfig };
      if (response.brandConfig.socialLinks) {
        socialLinks.value = JSON.parse(response.brandConfig.socialLinks);
      }
      preview.value.logo = settings.value.logo;
      preview.value.favicon = settings.value.favicon;
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
  } finally {
    loading.value = false;
  }
}

async function saveSettings() {
  try {
    loading.value = true;
    const mutation = `
      mutation UpdateBrandSettings($input: BrandConfigInput!) {
        updateBrandConfig(input: $input) {
          id
        }
      }
    `;

    await gqlRequest(mutation, {
      input: {
        ...settings.value,
        socialLinks: JSON.stringify(socialLinks.value)
      }
    }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    alert('Configurações salvas com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value.logo = e.target.result;
      // Aqui você implementaria o upload real para seu servidor
    };
    reader.readAsDataURL(file);
  }
}

function resetSettings() {
  loadSettings();
}

onMounted(loadSettings);
</script> 