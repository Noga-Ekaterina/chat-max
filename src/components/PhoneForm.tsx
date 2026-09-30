import { useEffect } from 'react'
import { useSearchPhone } from '../models/useSearchPhone'
import type { Credentials } from '../types/credentials'

type PhoneFormProps = Credentials & {
  onRecipientChange: (recipient: { chatId: string; phone: string } | null) => void
}

const PhoneForm = ({ onRecipientChange, ...credentials }: PhoneFormProps) => {
  const {phone, setPhone, handleSubmit, error, isLoading, chatId}= useSearchPhone(credentials)

  useEffect(() => {
    onRecipientChange(chatId ? { chatId, phone } : null)
  }, [chatId, phone, onRecipientChange])

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <label className="mb-[9px] block text-[13px] font-semibold" htmlFor="recipient-phone">Номер телефона получателя</label>
      <input className="h-[49px] w-full rounded-lg border border-[#e3e5ed] bg-[#f3f4f7] px-3.5 text-sm text-[#20212b] outline-none placeholder:text-[#a0a3b0] focus:border-[#8e9df5] focus:shadow-[0_0_0_3px_#7187f71a] disabled:opacity-60"
        id="recipient-phone"
        name="recipientPhone"
        type="tel"
        inputMode="tel"
        autoComplete="off"
        placeholder="+7 999 123-45-67"
        value={phone}
        onChange={(event) => {
          setPhone(event.target.value)
        }}
        required
        disabled={isLoading}
        aria-invalid={Boolean(error)}
        aria-describedby={`recipient-help${error ? ' recipient-error' : ''}`}
      />
      <p className="mt-[11px] text-[11px] leading-[1.7] text-[#858b9c]" id="recipient-help">Введите номер получателя с кодом страны.</p>
      {error && <p className="mt-[18px] rounded-lg bg-[#fff2ef] p-3 text-[13px] leading-normal text-[#a0392b]" id="recipient-error" role="alert">{error}</p>}
      <button className="mt-[29px] flex min-h-[49px] w-full items-center justify-center gap-[15px] rounded-lg border-0 bg-[#5975f5] px-5 py-3 text-sm font-semibold text-white transition-[background] duration-150 enabled:hover:bg-[#4964e3]" type="submit" disabled={isLoading}>
        {isLoading ? 'Проверка…' : 'Выбрать получателя'}
      </button>
    </form>
  )
}

export default PhoneForm
