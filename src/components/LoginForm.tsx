import type { FormEvent } from 'react'

type LoginFormProps = {
  idInstance: string
  setIdInstance: (value: string) => void
  apiTokenInstance: string
  setApiTokenInstance: (value: string) => void
  showToken: boolean
  toggleTokenVisibility: () => void
  isLoading: boolean
  error: string
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export const LoginForm = ({
  idInstance,
  setIdInstance,
  apiTokenInstance,
  setApiTokenInstance,
  showToken,
  toggleTokenVisibility,
  isLoading,
  error,
  handleSubmit,
}: LoginFormProps) => {
  return (
    <section className="w-full max-w-[476px] rounded-[22px] border border-[#e7e8ee] bg-white p-11 shadow-[0_18px_65px_#2829540a] max-[520px]:rounded-2xl max-[520px]:px-6 max-[520px]:py-8" aria-labelledby="login-title">
      <div className="mb-[17px] text-[10px] font-[650] tracking-[1.6px] text-[#5969e8]">ВАШИ СООБЩЕНИЯ. ОДНО МЕСТО.</div>
      <h1 className="mb-3.5 text-[34px] leading-[1.2] font-semibold tracking-[-1.2px] max-[520px]:text-[30px]" id="login-title">Войдите в чат</h1>
      <p className="m-0 text-sm leading-[1.75] text-[#737786]">Подключите свой аккаунт GREEN-API, используя данные инстанса.</p>
      <form className="mt-8" onSubmit={handleSubmit} aria-busy={isLoading}>
        <label className="mb-[9px] block text-[13px] font-semibold" htmlFor="instance">idInstance</label>
        <input className="h-[49px] w-full rounded-lg border border-[#e3e5ed] bg-[#f3f4f7] px-3.5 text-sm text-[#20212b] outline-none placeholder:text-[#a0a3b0] focus:border-[#8e9df5] focus:shadow-[0_0_0_3px_#7187f71a] disabled:opacity-60" id="instance" name="idInstance" inputMode="numeric" autoComplete="username" placeholder="Введите ID инстанса" value={idInstance} onChange={(event) => setIdInstance(event.target.value)} required disabled={isLoading} aria-describedby={error ? 'login-error' : undefined} />
        <label className="mt-[23px] mb-[9px] block text-[13px] font-semibold" htmlFor="token">apiTokenInstance</label>
        <div className="relative">
          <input className="h-[49px] w-full rounded-lg border border-[#e3e5ed] bg-[#f3f4f7] px-3.5 text-sm text-[#20212b] outline-none placeholder:text-[#a0a3b0] focus:border-[#8e9df5] focus:shadow-[0_0_0_3px_#7187f71a] disabled:opacity-60 pr-[87px]" id="token" name="apiTokenInstance" type={showToken ? 'text' : 'password'} autoComplete="current-password" placeholder="Введите токен инстанса" value={apiTokenInstance} onChange={(event) => setApiTokenInstance(event.target.value)} required disabled={isLoading} aria-describedby={error ? 'login-error' : undefined} />
          <button className="absolute top-0 right-3 h-[49px] border-0 bg-transparent px-0.5 text-[11px] text-[#6676c0]" type="button" onClick={toggleTokenVisibility} aria-label={showToken ? 'Скрыть токен' : 'Показать токен'} aria-pressed={showToken}>{showToken ? 'Скрыть' : 'Показать'}</button>
        </div>
        <p className="mt-[11px] text-[11px] leading-[1.7] text-[#858b9c]">Данные доступны в <a className="text-[#5975f5] underline underline-offset-3 hover:text-[#4964e3]" href="https://console.green-api.com/" target="_blank" rel="noreferrer">личном кабинете GREEN-API ↗</a></p>
        {error && <p className="mt-[18px] rounded-lg bg-[#fff2ef] p-3 text-[13px] leading-normal text-[#a0392b]" id="login-error" role="alert">{error}</p>}
        <button className="mt-[29px] flex min-h-[49px] w-full items-center justify-center gap-[15px] rounded-lg border-0 bg-[#5975f5] px-5 py-3 text-sm font-semibold text-white transition-[background] duration-150 enabled:hover:bg-[#4964e3]" disabled={isLoading} type="submit">{isLoading ? 'Подключаемся…' : 'Войти в чат'}<span className="text-xl font-normal" aria-hidden="true">→</span></button>
        <p className="mt-5 text-center text-[11px] leading-[1.8] text-[#9296a2]">Токен хранится только в памяти этой страницы и передаётся напрямую в GREEN-API.</p>
      </form>
    </section>
  )
}
