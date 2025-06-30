import './main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MainPage } from '@renderer/pages'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainPage />
  </StrictMode>
)
