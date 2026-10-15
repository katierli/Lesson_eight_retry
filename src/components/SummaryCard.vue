<script setup lang="ts">
defineProps<{
  label: string
  value: string
  change: number | null
  color: string
}>()
</script>

<template>
  <v-card class="pa-4 h-100" variant="flat" border>
    <div class="d-flex align-center justify-space-between">
      <span class="text-caption text-medium-emphasis">{{ label }}</span>
      <span class="indicator-dot" :style="{ backgroundColor: color }" />
    </div>
    <div class="text-h5 font-weight-bold mt-1">{{ value }}</div>
    <div
      v-if="change !== null"
      class="d-flex align-center mt-1 text-caption"
      :class="change >= 0 ? 'text-success' : 'text-error'"
    >
      <v-icon :icon="change >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'" size="14" class="mr-1" />
      {{ Math.abs(change).toFixed(1) }}% vs last month
    </div>
    <div v-else class="text-caption text-medium-emphasis mt-1">Year to date</div>
  </v-card>
</template>

<style scoped>
.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
