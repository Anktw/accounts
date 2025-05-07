const WARMUP_ENDPOINT = '/api/health'
const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 2 seconds

export async function warmupApi(): Promise<boolean> {
  let retryCount = 0

  while (retryCount < MAX_RETRIES) {
    try {
      const response = await fetch(WARMUP_ENDPOINT)
      if (response.ok) {
        return true
      }
    } catch (error) {
      console.log(`Warmup attempt ${retryCount + 1} failed`)
    }

    retryCount++
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
    }
  }

  return false
} 