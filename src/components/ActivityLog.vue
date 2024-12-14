<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-medium">Atividades Recentes</h2>
      <div class="space-x-2">
        <select v-model="filters.type" class="text-sm border rounded">
          <option value="">Todos os tipos</option>
          <option v-for="type in activityTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <!-- outros filtros... -->
      </div>
    </div>

    <div class="space-y-2">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="p-3 bg-white rounded shadow"
      >
        <div class="flex items-center justify-between">
          <span 
            class="px-2 py-1 text-xs rounded"
            :class="getLevelClass(activity.level)"
          >
            {{ activity.level }}
          </span>
          <span class="text-sm text-gray-500">
            {{ new Date(activity.createdAt).toLocaleString() }}
          </span>
        </div>
        <p class="mt-2 text-sm">{{ activity.description }}</p>
        <div class="mt-1 text-xs text-gray-500">
          {{ activity.user.name }} | {{ activity.source }} | {{ activity.action }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ... implementação do componente ...
</script> 