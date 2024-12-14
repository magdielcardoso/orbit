<template>
  <div class="relative h-full">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const chartRef = ref(null);
let chart = null;

onMounted(() => {
  if (chartRef.value) {
    chart = new Chart(chartRef.value, {
      type: 'pie',
      data: props.data,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
});

watch(() => props.data, (newData) => {
  if (chart) {
    chart.data = newData;
    chart.update();
  }
}, { deep: true });
</script> 