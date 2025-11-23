/**
 * Статистика нагрузочного теста
 */
export interface LoadTestStats {
  sent: number
  success: number
  error: number
  startTime: number | null
  elapsedTime: number
}

/**
 * Конфигурация нагрузочного теста
 */
export interface LoadTestConfig {
  requestsCount: number
  delayMs: number
}

/**
 * Результат отправки запроса
 */
export interface RequestResult {
  success: boolean
}

/**
 * Событие прогресса теста
 */
export interface ProgressEvent {
  type: 'sent' | 'success' | 'error'
}

export type ProgressCallback = (event: ProgressEvent) => void

export type StatCardType = 'sent' | 'success' | 'error' | 'time'

export interface TestFormProps {
  isRunning: boolean
  requestsCount: number
  delayMs: number
}

export interface TestFormEmits {
  (e: 'start-test'): void
  (e: 'stop-test'): void
  (e: 'update:requestsCount', value: number): void
  (e: 'update:delayMs', value: number): void
}

export interface TestStatsProps {
  stats: LoadTestStats
  formattedTime: string
}

export interface StatCardProps {
  label: string
  value: number | string
  type: StatCardType
}
