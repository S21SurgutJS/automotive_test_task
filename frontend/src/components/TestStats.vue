<template>
  <div class="stats">
    <div class="stats-grid">
      <StatCard label="Отправлено" :value="stats.sent" type="sent" />
      <StatCard label="Успешно" :value="stats.success" type="success" />
      <StatCard label="Ошибки" :value="stats.error" type="error" />
      <StatCard label="Время" :value="formattedTime" type="time" />
    </div>

    <StatsSummary v-if="stats.sent > 0" />
  </div>
</template>

<script setup lang="ts">
import type { TestStatsProps } from '@/types'
import StatCard from './StatsCard.vue'

defineProps<TestStatsProps>()
</script>
