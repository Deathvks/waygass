import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios'

// Bypass Ngrok browser warning for all API requests
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-mock.apps.googleusercontent.com'}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
