import { useRef, useState, type FormEvent } from 'react'
import { HttpError, useRequest } from '../hooks/useRequest'
import type { Credentials } from '../types/credentials'

type SendMessageOptions = Credentials & {
  chatId: string
  onMessageSent: (message: { id: string; text: string }) => void
}

export const useSendMessage = ({ idInstance, apiTokenInstance, chatId, onMessageSent }: SendMessageOptions) => {
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const pending = useRef(false)
  const { request, isLoading, clearError } = useRequest()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending.current) return
    setError('')
    clearError()
    const text = draft.trim()
    if (!text) {
      setError('Введите сообщение.')
      return
    }
    if (text.length > 4000) {
      setError('Сообщение не должно превышать 4000 символов.')
      return
    }
    if (!chatId.trim()) {
      setError('Сначала выберите получателя.')
      return
    }

    pending.current = true
    try {
      const data = await request(
        `/waInstance${idInstance}/sendMessage/${encodeURIComponent(apiTokenInstance)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId, message: text }),
          credentials: 'omit',
          referrerPolicy: 'no-referrer',
        },
      )
      if (!data || typeof data !== 'object' || !('idMessage' in data)
        || typeof data.idMessage !== 'string' || !data.idMessage.trim()) {
        setError('GREEN-API не подтвердил отправку. Проверьте чат перед повторной попыткой.')
        return
      }
      onMessageSent({ id: data.idMessage, text })
      setDraft((current) => current === draft ? '' : current)
    } catch (cause) {
      setError(cause instanceof HttpError
        ? cause.status === 429
          ? 'Слишком много запросов. Подождите и повторите отправку.'
          : 'Не удалось отправить сообщение. Проверьте данные и состояние инстанса GREEN-API.'
        : 'Не удалось подтвердить отправку. Проверьте соединение и чат перед повторной попыткой.')
    } finally {
      pending.current = false
    }
  }

  return { draft, setDraft, error, isLoading, handleSubmit }
}
