export const AppHeader = () => {
  return (
    <header className="flex items-center justify-between gap-5 px-[5%] py-7 max-[520px]:px-5 max-[520px]:py-[22px]">
      <a className="flex items-center gap-3 text-xl font-[650] no-underline max-[520px]:gap-2 max-[520px]:text-lg" href="/" aria-label="Чат — главная"><span className="grid size-[35px] place-items-center rounded-[11px_11px_11px_3px] bg-[#5975f5] text-[26px] text-white" aria-hidden="true">↗</span> Чат<span className="mx-1 font-normal text-[#d1d5e4] max-[520px]:mx-0">/</span><span className="text-[13px] tracking-[1px] max-[520px]:text-[10px] max-[520px]:tracking-[.4px]">GREEN-API</span></a>
      <a className="text-[13px] text-[#737786] no-underline hover:text-[#4964e3] hover:underline max-[520px]:max-w-[83px] max-[520px]:text-right max-[520px]:text-[11px]" href="https://console.green-api.com/" target="_blank" rel="noreferrer">Личный кабинет ↗</a>
    </header>
  )
}
