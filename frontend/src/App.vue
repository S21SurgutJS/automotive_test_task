<template>
  <div class="container">
    <AppHeader />

    <div class="content">
      <TestForm
        :is-running="isRunning"
        v-model:requests-count="requestsCount"
        v-model:delay-ms="delayMs"
        @start-test="startLoadTest"
        @stop-test="stopLoadTest"
      />

      <TestStats :stats="stats" :formatted-time="formatTime(stats.elapsedTime)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoadTest } from '@/composables/useLoadTest'
import AppHeader from '@/components/AppHeader.vue'
import TestForm from '@/components/TestForm.vue'
import TestStats from '@/components/TestStats.vue'

const { requestsCount, delayMs, isRunning, stats, startLoadTest, stopLoadTest, formatTime } =
  useLoadTest()
</script>
