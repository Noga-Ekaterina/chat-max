import { useState, type FormEvent } from "react"
import { HttpError, useRequest } from "../hooks/useRequest"

import type { Credentials } from '../types/credentials'

export const useSearchPhone=({ idInstance, apiTokenInstance }: Credentials)=>{
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [chatId, setChatId] = useState('')
  const { request, isLoading, clearError } = useRequest()


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoading) return
    setError('')
    setChatId('')
    clearError()

    const normalizedPhone = phone.replace(/[\s()-]/g, '')
    if (!/^\+?(7\d{10}|375\d{9})$/.test(normalizedPhone)) {
      setError('Введите номер РФ (+7, 11 цифр) или Беларуси (+375, 12 цифр).')
      return
    }
    
    try {
      const data = await request(
        `/waInstance${idInstance}/checkAccount/${encodeURIComponent(apiTokenInstance)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: Number(normalizedPhone) }),
          credentials: 'omit',
          referrerPolicy: 'no-referrer',
        },
      )
      if (data && typeof data === 'object' && 'status' in data && data.status === false) {
        setError('reason' in data && data.reason === 'User get contact info limit reached'
          ? 'Превышен лимит проверок номеров. Повторите попытку позже.'
          : 'Не удалось проверить аккаунт. Проверьте состояние инстанса в GREEN-API.')
        return
      }
      if (!data || typeof data !== 'object' || !('exist' in data) || typeof data.exist !== 'boolean') {
        setError('GREEN-API вернул неожиданный ответ. Попробуйте позже.')
        return
      }
      if (!data.exist) {
        setError('На этом номере нет аккаунта MAX.')
        return
      }
      if (!('chatId' in data) || typeof data.chatId !== 'string' || !data.chatId) {
        setError('GREEN-API не вернул идентификатор чата. Попробуйте позже.')
        return
      }
      setChatId(data.chatId)
    } catch (cause) {
      setError(cause instanceof HttpError
        ? [429, 469].includes(cause.status)
          ? 'Превышен лимит проверок номеров. Повторите попытку позже.'
          : 'Не удалось проверить аккаунт в GREEN-API. Проверьте данные инстанса и повторите попытку.'
        : 'Не удалось связаться с GREEN-API. Проверьте интернет-соединение.')
    }
  }

  const changePhone = (value: string) => {
    setPhone(value)
    setChatId('')
    setError('')
  }

  return {phone, setPhone: changePhone, handleSubmit, error, isLoading, chatId}
}
