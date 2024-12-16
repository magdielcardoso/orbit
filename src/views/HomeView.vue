<template>
  <div class="min-h-screen bg-gray-100">
    <main class="py-4 md:py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Seção de Boas-vindas -->
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4 md:mb-6 border-2 border-orbit-500">
          <div class="p-4 md:p-6 bg-white">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
              <div class="flex items-center space-x-4">
                <div class="w-10 rounded-full ring ring-orbit-500 ring-offset-base-100 ring-offset-2">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" class="rounded-full" />
                </div>
                <div>
                  <h1 class="text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    Bem-vindo ao OrbitChat 
                    <span>👋</span>
                  </h1>
                  <p class="mt-1 md:mt-2 text-gray-600">
                    Olá, {{ authStore.user?.name }}!
                  </p>
                </div>
              </div>
              <div class="text-left md:text-right">
                <p class="text-sm text-gray-500">{{ getCurrentDateTime() }}</p>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="isOnline ? 'bg-orbit-100 text-orbit-800' : 'bg-red-100 text-red-800'">
                  {{ isOnline ? 'Online' : 'Offline' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Cards de Estatísticas -->
        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
          <div v-for="stat in statistics" :key="stat.title" class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div class="p-4 md:p-6">
              <div class="flex items-center">
                <div :class="stat.iconClass" class="rounded-md p-2 md:p-3">
                  <component :is="stat.icon" class="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div class="ml-3 md:ml-4">
                  <p class="text-xs md:text-sm font-medium text-gray-500">{{ stat.title }}</p>
                  <p class="text-lg md:text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Conversas Ativas -->
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4 md:mb-6">
          <div class="p-4 md:p-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3 md:gap-0">
              <h2 class="text-lg font-medium text-gray-900">Conversas Ativas</h2>
              <div class="flex gap-2 overflow-x-auto md:overflow-visible">
                <button class="btn btn-sm btn-ghost whitespace-nowrap">
                  <Filter class="h-4 w-4" />
                  <span class="hidden md:inline">Filtrar</span>
                </button>
                <button class="btn btn-sm btn-ghost whitespace-nowrap">
                  <SortAsc class="h-4 w-4" />
                  <span class="hidden md:inline">Ordenar</span>
                </button>
                <button class="btn btn-sm btn-primary whitespace-nowrap">
                  <Plus class="h-4 w-4" />
                  <span class="hidden md:inline">Nova Conversa</span>
                </button>
              </div>
            </div>
            <div class="space-y-3 md:space-y-4">
              <div v-for="chat in activeChats" :key="chat.id" 
                class="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200 relative gap-3 md:gap-0">
                <!-- Badge de não lidas -->
                <div v-if="chat.unreadCount" class="badge badge-primary badge-sm absolute -top-2 -right-2">
                  {{ chat.unreadCount }}
                </div>
                
                <div class="flex items-center flex-grow">
                  <UserAvatar
                    :name="chat.name"
                    :avatar="chat.avatar"
                    size="md"
                  />
                  <div class="ml-4 flex-grow min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ chat.name }}</p>
                    <p class="text-sm text-gray-500 truncate">{{ chat.lastMessage }}</p>
                  </div>
                  <div class="flex items-center gap-2 ml-4">
                    <span :class="chat.channelClass" class="px-2 py-1 text-xs rounded-full whitespace-nowrap">
                      {{ chat.channel }}
                    </span>
                    <span class="text-sm text-gray-500 hidden md:inline">{{ chat.time }}</span>
                  </div>
                </div>

                <!-- Ações Rápidas -->
                <div class="flex items-center gap-2 md:ml-4 justify-end">
                  <button class="btn btn-ghost btn-sm btn-square tooltip" data-tip="Responder">
                    <MessageCircle class="h-4 w-4" />
                  </button>
                  <button class="btn btn-ghost btn-sm btn-square tooltip" data-tip="Transferir">
                    <Share2 class="h-4 w-4" />
                  </button>
                  <button class="hidden md:flex btn btn-ghost btn-sm btn-square tooltip" data-tip="Arquivar">
                    <Archive class="h-4 w-4" />
                  </button>
                  <div class="dropdown dropdown-end">
                    <button class="btn btn-ghost btn-sm btn-square">
                      <MoreVertical class="h-4 w-4" />
                    </button>
                    <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li><a><Star class="h-4 w-4" /> Favoritar</a></li>
                      <li><a><Tag class="h-4 w-4" /> Adicionar Tag</a></li>
                      <li class="md:hidden"><a><Archive class="h-4 w-4" /> Arquivar</a></li>
                      <li><a><AlertOctagon class="h-4 w-4" /> Reportar</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Canais de Atendimento -->
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div class="p-4 md:p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Canais de Atendimento</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div v-for="channel in channels" :key="channel.name" 
                class="border rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-colors duration-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <component :is="channel.icon" class="h-5 w-5 md:h-6 md:w-6" :class="channel.iconClass" />
                    <span class="ml-2 font-medium text-sm md:text-base">{{ channel.name }}</span>
                  </div>
                  <span :class="channel.statusClass" class="px-2 py-1 text-xs rounded-full">
                    {{ channel.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import UserAvatar from '../components/chats/UserAvatar.vue';
import { 
  MessageCircle, 
  Clock, 
  Heart, 
  Users,
  Share2,
  Archive,
  MoreVertical,
  Star,
  Tag,
  AlertOctagon,
  Filter,
  SortAsc,
  Plus
} from 'lucide-vue-next';

const authStore = useAuthStore();
const isOnline = ref(true);

const getCurrentDateTime = () => {
  const now = new Date();
  const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const diaDaSemana = diasDaSemana[now.getDay()];
  
  const dia = now.getDate().toString().padStart(2, '0');
  const mes = (now.getMonth() + 1).toString().padStart(2, '0');
  const hora = now.getHours().toString().padStart(2, '0');
  const minutos = now.getMinutes().toString().padStart(2, '0');
  
  return `${diaDaSemana}, ${dia}/${mes} às ${hora}:${minutos}`;
};

const statistics = ref([
  {
    title: 'Conversas Hoje',
    value: '24',
    icon: MessageCircle,
    iconClass: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Tempo Médio Resposta',
    value: '5min',
    icon: Clock,
    iconClass: 'bg-green-100 text-green-600'
  },
  {
    title: 'Satisfação',
    value: '98%',
    icon: Heart,
    iconClass: 'bg-red-100 text-red-600'
  },
  {
    title: 'Atendimentos',
    value: '156',
    icon: Users,
    iconClass: 'bg-purple-100 text-purple-600'
  }
]);

const activeChats = ref([
  {
    id: 1,
    name: 'João Silva',
    avatar: null,
    lastMessage: 'Preciso de ajuda com meu pedido',
    channel: 'WhatsApp',
    channelClass: 'bg-green-100 text-green-800',
    time: '5min',
    unreadCount: 3
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    avatar: null,
    lastMessage: 'Como faço para trocar o produto?',
    channel: 'Instagram',
    channelClass: 'bg-pink-100 text-pink-800',
    time: '12min',
    unreadCount: 1
  }
]);

const channels = ref([
  {
    name: 'WhatsApp',
    icon: 'PhoneIcon',
    iconClass: 'text-green-600',
    status: 'Conectado',
    statusClass: 'bg-green-100 text-green-800'
  },
  {
    name: 'Instagram',
    icon: 'CameraIcon',
    iconClass: 'text-pink-600',
    status: 'Conectado',
    statusClass: 'bg-green-100 text-green-800'
  },
  {
    name: 'Telegram',
    icon: 'PaperAirplaneIcon',
    iconClass: 'text-blue-600',
    status: 'Desconectado',
    statusClass: 'bg-red-100 text-red-800'
  }
]);
</script>

<style scoped>
.tooltip {
  position: relative;
}

.btn-ghost:hover {
  @apply bg-orbit-100;
}

.dropdown-content {
  @apply z-50;
}

/* Ajustes para mobile */
@media (max-width: 768px) {
  .tooltip:before {
    display: none;
  }
}
</style> 