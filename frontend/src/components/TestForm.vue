<template>
  <div>
    <div class="form-row">
      <div class="form-group">
        <label>
          <span>Количество запросов</span>
          <input
            type="number"
            :value="requestsCount"
            @input="updateRequestsCount"
            :disabled="isRunning"
            min="1"
            max="10000"
          />
        </label>
      </div>

      <div class="form-group">
        <label>
          <span>Задержка между запросами (мс)</span>
          <input
            type="number"
            :value="delayMs"
            @input="updateDelayMs"
            :disabled="isRunning"
            min="0"
            max="10000"
          />
        </label>
      </div>
    </div>

    <button v-if="!isRunning" @click="emit('start-test')" class="btn btn-start">
      Старт нагрузочного теста
    </button>

    <button v-else @click="emit('stop-test')" class="btn btn-stop">Остановить тест</button>
  </div>
</template>

<script setup lang="ts">
import type { TestFormProps, TestFormEmits } from '@/types'

defineProps<TestFormProps>()

const emit = defineEmits<TestFormEmits>()

const updateRequestsCount = (event: Event): void => {
  const target = event.target as HTMLInputElement
  emit('update:requestsCount', parseInt(target.value) || 1)
}

const updateDelayMs = (event: Event): void => {
  const target = event.target as HTMLInputElement
  emit('update:delayMs', parseInt(target.value) || 0)
}
</script>
