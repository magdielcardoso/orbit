<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { checkSystemStatus } from './utils/system';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () => {
  try {
    const status = await checkSystemStatus();
    
    // Se o sistema não estiver configurado e não estivermos na página de setup
    if (!status.configured && router.currentRoute.value.name !== 'system-setup') {
      router.push({ name: 'system-setup' });
    }
  } catch (error) {
    console.error('Erro ao verificar status do sistema:', error);
  }
});
</script>
