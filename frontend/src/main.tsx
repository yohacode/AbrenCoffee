import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import App from './App.tsx'
import { CartProvider } from './context/cartContex.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider >
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
