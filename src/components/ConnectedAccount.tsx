import PhoneForm from './PhoneForm'
import { Chat } from './Chat'
import type { Credentials } from '../types/credentials'
import { useState } from 'react';

export const ConnectedAccount = (credentials: Credentials) => {
  const [recipient, setRecipient] = useState<{ chatId: string; phone: string } | null>(null);
  if (recipient) {
    return <Chat key={recipient.chatId} idInstance={credentials.idInstance} apiTokenInstance={credentials.apiTokenInstance} chatId={recipient.chatId} phone={recipient.phone} onBack={() => setRecipient(null)} />
  }
  return (
    <section className="w-full max-w-[476px] rounded-[22px] border border-[#e7e8ee] bg-white p-11 shadow-[0_18px_65px_#2829540a] max-[520px]:rounded-2xl max-[520px]:px-6 max-[520px]:py-8" aria-labelledby="connected-title">  
      <PhoneForm
        idInstance={credentials.idInstance}
        apiTokenInstance={credentials.apiTokenInstance}
        onRecipientChange={setRecipient}
      />
    </section>
  )
}
