import { loadTestApi } from '@/api/loadTestApi'
import type { LoadTestConfig, RequestResult, ProgressCallback } from '@/types'

const BATCH_SIZE = 50

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

    const batches = Math.ceil(requestsCount / BATCH_SIZE)

    try {
      for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
        if (this.abortController.signal.aborted) {
          break
        }

        const batchStart = batchIndex * BATCH_SIZE
        const batchEnd = Math.min(batchStart + BATCH_SIZE, requestsCount)
        const batchRequests: Promise<void>[] = []

        for (let i = batchStart; i < batchEnd; i++) {
          if (this.abortController.signal.aborted) {
            break
          }

          onProgress({ type: 'sent' })

          const requestPromise = this.sendSingleRequest(this.abortController.signal)
            .then((result) => {
              if (result.success) {
                onProgress({ type: 'success' })
              } else {
                onProgress({ type: 'error' })
              }
            })
            .catch((error) => {
              if (!(error instanceof Error && error.name === 'AbortError')) {
                onProgress({ type: 'error' })
              }
            })

          batchRequests.push(requestPromise)

          if (delayMs > 0 && i < batchEnd - 1) {
            await this.delay(delayMs)
          }
        }

        await Promise.allSettled(batchRequests)

        if (batchIndex < batches - 1) {
          await this.delay(Math.max(delayMs, 5))
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
