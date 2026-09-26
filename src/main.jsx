import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { TeamProvider } from './context/TeamContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TeamProvider>
        <App />
      </TeamProvider>
    </BrowserRouter>
  </StrictMode>
)
