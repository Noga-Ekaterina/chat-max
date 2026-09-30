import { useEffect, useRef, useState } from 'react'
import { useSendMessage } from '../models/useSendMessage'
import { useReceiveNotification } from '../models/useReceiveNotification'
import type { Credentials } from '../types/credentials'

type ChatProps = Credentials & {
  chatId: string
  phone: string
  onBack: () => void
}

type Message = {
  id: string
  text: string
  time: string
  outgoing: boolean
}

export const Chat = ({ chatId, phone, onBack, idInstance, apiTokenInstance }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])

  useReceiveNotification({
    idInstance, apiTokenInstance, chatId,
    onMessageReceived: (message) => setMessages((current) => {
      if (current.some((item) => item.id === message.id)) return current
      return [...current, {
        id: message.id,
        text: message.text,
        time: new Date(message.timestamp * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        outgoing: false,
      }]
    }),
  })
  
  const { draft, setDraft, handleSubmit, isLoading, error } = useSendMessage({
    chatId, idInstance, apiTokenInstance,
    onMessageSent: (message) => setMessages((current) => [...current, {
      ...message,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      outgoing: true,
    }]),
  })
  const messageListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = messageListRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages])

  return (
    <section className="max-chat" aria-label="Чат с получателем">
      <header className="max-chat-header">
        <button type="button" onClick={onBack} className="max-chat-back" aria-label="Назад к выбору получателя" title="Выбрать другого получателя">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 5-7 7 7 7M5 12h14" /></svg>
        </button>
        <div className="max-chat-avatar" aria-hidden="true">М</div>
        <div className="min-w-0 flex-1">
          <h1 className="text-[15px] font-semibold tracking-[-0.2px]">Получатель</h1>
          <p className="mt-0.5 truncate text-xs text-[#9296a2]" title={phone}>{phone}</p>
        </div>
        <span className="max-chat-brand">MAX<span>чат</span></span>
      </header>

      <div ref={messageListRef} className="max-chat-history" role="log" aria-label="Сообщения" aria-live="polite" tabIndex={0}>
        <div className="max-chat-date"><span>Сегодня</span></div>
        <div className="max-chat-messages">
          {messages.length === 0 && <p className="max-chat-hint">Напишите первое сообщение получателю.</p>}
          {messages.map((message) => (
            <article key={message.id} aria-label={message.outgoing ? 'Вы' : 'Получатель'} className={`max-chat-bubble ${message.outgoing ? 'max-chat-bubble-out' : 'max-chat-bubble-in'}`}>
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed [overflow-wrap:anywhere]">{message.text}</p>
              <div className="max-chat-time">
                <time>{message.time}</time>
              </div>
            </article>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-chat-composer">
        <div className="max-chat-input-row">
          <label htmlFor="chat-message" className="sr-only">Сообщение</label>
          <input id="chat-message" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={4000} disabled={isLoading} autoComplete="off" placeholder="Сообщение" className="max-chat-input" />
          <button type="submit" disabled={isLoading || !draft.trim()} className="max-chat-send" aria-label={isLoading ? 'Отправка сообщения' : 'Отправить сообщение'}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13" /></svg>
          </button>
        </div>
        {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
        <p className="max-chat-hint">{isLoading ? 'Отправка…' : 'До 4000 символов · показаны сообщения текущего сеанса'}</p>
      </form>
    </section>
  )
}
