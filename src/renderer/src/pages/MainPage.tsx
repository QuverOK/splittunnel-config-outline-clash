import type { ReactElement } from 'react'
import { ConfigForm } from '@renderer/widgets/ConfigForm'

export const MainPage = (): ReactElement => {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="mb-4 text-center text-2xl font-bold">Clash Config Generator</h1>
        <ConfigForm />
      </div>
    </div>
  )
}
