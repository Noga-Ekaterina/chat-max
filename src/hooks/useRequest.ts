import { useCallback, useState } from 'react'

export class HttpError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`HTTP ${status}`)
    this.name = 'HttpError'
    this.status = status
  }
}

/** Выполняет JSON-запросы. Ошибки доступны в error и пробрасываются вызывающему коду. */
export const useRequest = () => {
  const [pendingCount, setPendingCount] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const request = useCallback(async <T = unknown>(
    url: string,
    options: RequestInit = {},
  ): Promise<T | undefined> => {
    setPendingCount((count) => count + 1)
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_GREEN_API_URL}${url}`, {
        ...options,
        signal: options.signal ?? AbortSignal.timeout(15000),
      })
      if (!response.ok) throw new HttpError(response.status)
      if (response.status === 204 || response.status === 205 || options.method?.toUpperCase() === 'HEAD') {
        return undefined
      }
      const body = await response.text()
      if (!body.trim()) return undefined
      return JSON.parse(body) as T
    } catch (cause) {
      const requestError = cause instanceof Error ? cause : new Error('Не удалось выполнить запрос.')
      setError(requestError)
      throw requestError
    } finally {
      setPendingCount((count) => count - 1)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { request, isLoading: pendingCount > 0, error, clearError }
}
