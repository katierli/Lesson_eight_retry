<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import type { ChartOptions, TooltipItem } from 'chart.js'
import { CHART_COLORS, withOpacity } from '@/utils/chartColors'
import type { MonthMetric } from '@/types/metrics'

const props = defineProps<{
  months: MonthMetric[]
  selectedIndex: number | null
}>()

const chartData = computed(() => ({
  labels: props.months.map((m) => m.monthShort),
  datasets: [
    {
      label: 'Revenue',
      data: props.months.map((m) => m.revenue),
      backgroundColor: props.months.map((_, i) =>
        props.selectedIndex === null || props.selectedIndex === i
          ? CHART_COLORS.revenue
          : withOpacity(CHART_COLORS.revenue, 0.3),
      ),
      borderRadius: 4,
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'bar'>) => ` $${(ctx.parsed.y ?? 0).toLocaleString()}`,
      },
    },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      grid: { color: 'rgba(255,255,255,0.08)' },
      ticks: {
        callback: (value) => `$${(Number(value) / 1000).toFixed(0)}k`,
      },
    },
  },
}
</script>

<template>
  <div style="height: 280px">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
