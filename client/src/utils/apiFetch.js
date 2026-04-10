export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function requestWithRetry(requestFactory, options = {}) {
  const retries = Number(options.retries ?? 0)
  const delayMs = Number(options.delayMs ?? 500)

  let lastError = null

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await requestFactory()
    } catch (error) {
      lastError = error

      // Don't retry on 404, auth errors, or validation errors
      if (error?.response?.status === 404 || error?.response?.status === 401 || error?.response?.status === 400) {
        throw error
      }

      if (attempt < retries) {
        await sleep(delayMs)
      }
    }
  }

  throw lastError
}

export function getApiErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage
}
