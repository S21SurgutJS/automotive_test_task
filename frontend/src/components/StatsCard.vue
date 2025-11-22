<template>
  <div :class="['stat-card', type]">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
import type { StatCardProps } from '@/types'

defineProps<StatCardProps>()
</script>
