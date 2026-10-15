<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
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
      label: 'Conversion Rate',
      data: props.months.map((m) => m.conversionRate),
      borderColor: CHART_COLORS.conversion,
      backgroundColor: withOpacity(CHART_COLORS.conversion, 0.25),
      pointRadius: props.months.map((_, i) => (props.selectedIndex === i ? 7 : 3)),
      pointBackgroundColor: props.months.map((_, i) =>
        props.selectedIndex === i ? CHART_COLORS.highlight : CHART_COLORS.conversion,
      ),
      fill: true,
      tension: 0.35,
    },
  ],
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'line'>) => ` ${(ctx.parsed.y ?? 0).toFixed(1)}%`,
      },
    },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      grid: { color: 'rgba(255,255,255,0.08)' },
      ticks: { callback: (value) => `${value}%` },
    },
  },
}
</script>

<template>
  <div style="height: 240px">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
