import { useState, type FormEvent } from 'react'
import { HttpError, useRequest } from '../hooks/useRequest'

import type { Credentials } from '../types/credentials'

const stateMessages: Record<string, string> = {
  notAuthorized: 'Сначала авторизуйте инстанс в личном кабинете GREEN-API, затем повторите вход.',
  blocked: 'Аккаунт заблокирован. Проверьте его состояние в GREEN-API.',
  starting: 'Инстанс запускается. Подождите несколько минут и повторите вход.',
  sleepMode: 'Инстанс находится в спящем режиме. Проверьте подключение в GREEN-API.',
}

export const useAuth = () => {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [showToken, setShowToken] = useState(false)
  const { request, isLoading, clearError } = useRequest()
  const [error, setError] = useState('')
  const [credentials, setCredentials] = useState<Credentials | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoading) return
    setError('')
    clearError()
    const id = idInstance.trim()
    const token = apiTokenInstance.trim()
    if (!/^\d+$/.test(id) || !token || /\s/.test(token)) {
      setError('Введите числовой idInstance и apiTokenInstance без пробелов.')
      return
    }
    
    try {
      const data = await request(
        `/waInstance${id}/getStateInstance/${encodeURIComponent(token)}`,
        { cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' },
      )
      
      if (!data || typeof data !== 'object' || !('stateInstance' in data) || typeof data.stateInstance !== 'string') {
        setError('GREEN-API вернул неожиданный ответ. Попробуйте позже.')
        return
      }
      if (data.stateInstance !== 'authorized') {
        setError(stateMessages[data.stateInstance] ?? 'Инстанс пока не готов к работе. Проверьте его состояние в GREEN-API.')
        return
      }
      setCredentials({ idInstance: id, apiTokenInstance: token })
      setApiTokenInstance('')
      setShowToken(false)
    } catch (cause) {
      if (cause instanceof HttpError) {
        setError([400, 401, 403, 404].includes(cause.status)
          ? 'Не удалось войти. Проверьте idInstance и apiTokenInstance.'
          : cause.status === 429 ? 'Слишком много запросов. Подождите немного и повторите вход.'
          : 'GREEN-API временно недоступен. Попробуйте позже.')
        return
      }
      setError('Не удалось связаться с GREEN-API. Проверьте интернет-соединение и повторите вход.')
    }
  }

  const toggleTokenVisibility = () => {
    setShowToken((visible) => !visible)
  }

  return {
    idInstance,
    setIdInstance,
    apiTokenInstance,
    setApiTokenInstance,
    showToken,
    toggleTokenVisibility,
    isLoading,
    error,
    credentials,
    handleSubmit,
  }
}
