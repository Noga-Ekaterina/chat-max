import { AppHeader } from './components/AppHeader'
import { AppFooter } from './components/AppFooter'
import { ConnectedAccount } from './components/ConnectedAccount'
import { LoginForm } from './components/LoginForm'
import { useAuth } from './models/useAuth'

const App = () => {
  const { credentials, ...loginForm } = useAuth()

  return (
    <div className="flex min-h-svh flex-col bg-[radial-gradient(ellipse_at_50%_45%,#e9edff_0,#f3f4f8_65%)] [&_button]:cursor-pointer [&_button:disabled]:cursor-wait [&_button:disabled]:opacity-65 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-[#7187f7] [&_button:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-[#7187f7] [&_a:focus-visible]:outline-offset-4">
      <AppHeader />
      <main className="grid flex-1 place-items-center px-5 py-[45px] max-[520px]:px-4 max-[520px]:py-[25px]">
        {credentials ? (
          <ConnectedAccount {...credentials} />
        ) : (
          <LoginForm {...loginForm} />
        )}
      </main>
      <AppFooter />
    </div>
  )
}

export default App
