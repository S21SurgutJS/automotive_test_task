const API_BASE_URL = 'http://localhost:3000'

export const loadTestApi = {
  async fetchItems(signal: AbortSignal): Promise<Response> {
    try {
      return await fetch(`${API_BASE_URL}/items`, {
        method: 'GET',
        signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error
      }
      console.error('API Error:', error)
      throw new Error('Failed to fetch items')
    }
  },
}
