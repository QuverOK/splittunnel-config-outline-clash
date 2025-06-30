import { Button } from '@renderer/shared/ui'
import './main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Button className="text-red-500">Hello world</Button>
  </StrictMode>
)
