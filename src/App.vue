<script setup lang="ts">
import { ref, computed } from 'vue'
import metricsData from '@/data/metrics.json'
import type { MonthMetric } from '@/types/metrics'
import SummaryCard from '@/components/SummaryCard.vue'
import RevenueBarChart from '@/components/charts/RevenueBarChart.vue'
import VisitorsLineChart from '@/components/charts/VisitorsLineChart.vue'
import ConversionAreaChart from '@/components/charts/ConversionAreaChart.vue'

const months = metricsData.months as MonthMetric[]

const monthOptions = [
  { title: 'All Months', value: 'all' as const },
  ...months.map((m, i) => ({ title: m.month, value: i })),
]

const selected = ref<'all' | number>('all')

const selectedIndex = computed(() => (selected.value === 'all' ? null : selected.value))

const currency = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)

const compactNumber = (n: number) => new Intl.NumberFormat('en-US').format(n)

function percentChange(current: number, previous: number | null) {
  if (previous === null || previous === 0) return null
  return ((current - previous) / previous) * 100
}

const summary = computed(() => {
  const i = selectedIndex.value

  if (i === null) {
    const totalRevenue = months.reduce((sum, m) => sum + m.revenue, 0)
    const totalVisitors = months.reduce((sum, m) => sum + m.visitors, 0)
    const totalOrders = months.reduce((sum, m) => sum + m.orders, 0)
    const avgConversion = months.reduce((sum, m) => sum + m.conversionRate, 0) / months.length

    return {
      revenue: totalRevenue,
      visitors: totalVisitors,
      orders: totalOrders,
      conversionRate: avgConversion,
      revenueChange: null,
      visitorsChange: null,
      ordersChange: null,
      conversionChange: null,
    }
  }

  const current = months[i]
  if (!current) {
    return {
      revenue: 0,
      visitors: 0,
      orders: 0,
      conversionRate: 0,
      revenueChange: null,
      visitorsChange: null,
      ordersChange: null,
      conversionChange: null,
    }
  }
  const previous = i > 0 ? months[i - 1] : null

  return {
    revenue: current.revenue,
    visitors: current.visitors,
    orders: current.orders,
    conversionRate: current.conversionRate,
    revenueChange: percentChange(current.revenue, previous?.revenue ?? null),
    visitorsChange: percentChange(current.visitors, previous?.visitors ?? null),
    ordersChange: percentChange(current.orders, previous?.orders ?? null),
    conversionChange: percentChange(current.conversionRate, previous?.conversionRate ?? null),
  }
})
</script>

<template>
  <v-app>
    <v-app-bar color="surface" elevation="1">
      <v-app-bar-title class="font-weight-bold">My Dashboard</v-app-bar-title>
      <v-spacer />
      <v-select
        v-model="selected"
        :items="monthOptions"
        item-title="title"
        item-value="value"
        label="Month"
        density="compact"
        variant="outlined"
        hide-details
        style="max-width: 220px"
        class="mr-4"
      />
    </v-app-bar>

    <v-main>
      <v-container fluid class="py-6">
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <SummaryCard
              label="Revenue"
              :value="currency(summary.revenue)"
              :change="summary.revenueChange"
              color="#7C9CFF"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <SummaryCard
              label="Visitors"
              :value="compactNumber(summary.visitors)"
              :change="summary.visitorsChange"
              color="#4ECDC4"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <SummaryCard
              label="Conversion Rate"
              :value="`${summary.conversionRate.toFixed(1)}%`"
              :change="summary.conversionChange"
              color="#FFB454"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <SummaryCard
              label="Orders"
              :value="compactNumber(summary.orders)"
              :change="summary.ordersChange"
              color="#F06292"
            />
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="text-subtitle-1">Monthly Revenue</v-card-title>
              <v-card-text>
                <RevenueBarChart :months="months" :selected-index="selectedIndex" />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="text-subtitle-1">Visitors Over Time</v-card-title>
              <v-card-text>
                <VisitorsLineChart :months="months" :selected-index="selectedIndex" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12">
            <v-card>
              <v-card-title class="text-subtitle-1">Conversion Rate Trend</v-card-title>
              <v-card-text>
                <ConversionAreaChart :months="months" :selected-index="selectedIndex" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
