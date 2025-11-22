import { loadTestApi } from '@/api/loadTestApi'
import type { LoadTestConfig, RequestResult, ProgressCallback } from '@/types'

export class LoadTestService {
  private abortController: AbortController | null = null

  async sendSingleRequest(signal: AbortSignal): Promise<RequestResult> {
    try {
      const response = await loadTestApi.fetchItems(signal)
      return { success: response.ok }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error
      }
      return { success: false }
    }
  }

  async runLoadTest(config: LoadTestConfig, onProgress: ProgressCallback): Promise<void> {
    this.abortController = new AbortController()
    const { requestsCount, delayMs } = config

    try {
      for (let i = 0; i < requestsCount; i++) {
        if (this.abortController.signal.aborted) {
          break
        }

        onProgress({ type: 'sent' })

        try {
          const result = await this.sendSingleRequest(this.abortController.signal)

          // Уведомляем о результате
          if (result.success) {
            onProgress({ type: 'success' })
          } else {
            onProgress({ type: 'error' })
          }
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            break
          }
          onProgress({ type: 'error' })
        }

        // Задержка перед следующим запросом
        if (i < requestsCount - 1 && delayMs > 0) {
          await this.delay(delayMs)
        }
      }
    } catch (error) {
      console.error('Load test error:', error)
      throw error
    }
  }

  stopTest(): void {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  isRunning(): boolean {
    return this.abortController !== null && !this.abortController.signal.aborted
  }
}
