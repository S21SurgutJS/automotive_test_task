import { ref, onUnmounted, type Ref } from 'vue'
import { LoadTestService } from '@/services/loadTestService'
import type { LoadTestStats, ProgressEvent } from '@/types'

/**
 * Composable для работы с нагрузочным тестом
 */
export interface UseLoadTestReturn {
  requestsCount: Ref<number>
  delayMs: Ref<number>
  isRunning: Ref<boolean>
  stats: Ref<LoadTestStats>

  startLoadTest: () => Promise<void>
  stopLoadTest: () => void
  formatTime: (ms: number) => string
}

export function useLoadTest(): UseLoadTestReturn {
  const requestsCount = ref<number>(100)
  const delayMs = ref<number>(100)
  const isRunning = ref<boolean>(false)

  const stats = ref<LoadTestStats>({
    sent: 0,
    success: 0,
    error: 0,
    startTime: null,
    elapsedTime: 0,
  })

  let timer: number | null = null
  const loadTestService = new LoadTestService()

  const startTimer = (): void => {
    timer = window.setInterval(() => {
      if (stats.value.startTime !== null) {
        stats.value.elapsedTime = Date.now() - stats.value.startTime
      }
    }, 100)
  }

  const stopTimer = (): void => {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  const resetStats = (): void => {
    stats.value = {
      sent: 0,
      success: 0,
      error: 0,
      startTime: Date.now(),
      elapsedTime: 0,
    }
  }

  const handleProgress = (event: ProgressEvent): void => {
    if (event.type === 'sent') {
      stats.value.sent++
    } else if (event.type === 'success') {
      stats.value.success++
    } else if (event.type === 'error') {
      stats.value.error++
    }
  }

  // Основные методы
  const startLoadTest = async (): Promise<void> => {
    if (isRunning.value) return

    isRunning.value = true
    resetStats()
    startTimer()

    try {
      await loadTestService.runLoadTest(
        {
          requestsCount: requestsCount.value,
          delayMs: delayMs.value,
        },
        handleProgress,
      )
    } catch (error) {
      console.error('Load test error:', error)
    } finally {
      isRunning.value = false
      stopTimer()
    }
  }

  const stopLoadTest = (): void => {
    loadTestService.stopTest()
    isRunning.value = false
    stopTimer()
  }

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    const milliseconds = ms % 1000
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`
  }

  // Cleanup при размонтировании компонента
  onUnmounted(() => {
    stopTimer()
    loadTestService.stopTest()
  })

  return {
    // State
    requestsCount,
    delayMs,
    isRunning,
    stats,

    // Methods
    startLoadTest,
    stopLoadTest,
    formatTime,
  }
}
