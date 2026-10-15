<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { CHART_COLORS } from '@/utils/chartColors'
import type { MonthMetric } from '@/types/metrics'

const props = defineProps<{
  months: MonthMetric[]
  selectedIndex: number | null
}>()

const chartData = computed(() => ({
  labels: props.months.map((m) => m.monthShort),
  datasets: [
    {
      label: 'Visitors',
      data: props.months.map((m) => m.visitors),
      borderColor: CHART_COLORS.visitors,
      backgroundColor: CHART_COLORS.visitors,
      pointRadius: props.months.map((_, i) => (props.selectedIndex === i ? 7 : 3)),
      pointBackgroundColor: props.months.map((_, i) =>
        props.selectedIndex === i ? CHART_COLORS.highlight : CHART_COLORS.visitors,
      ),
      tension: 0.35,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: { parsed: { y: number } }) => ` ${ctx.parsed.y.toLocaleString()} visitors`,
      },
    },
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(255,255,255,0.08)' } },
  },
}
</script>

<template>
  <div style="height: 280px">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
