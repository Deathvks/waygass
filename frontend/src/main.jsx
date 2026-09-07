import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars } from 'overlayscrollbars';
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios'

// Bypass Ngrok browser warning for all API requests
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';


// Initialize global custom scrollbar
OverlayScrollbars(document.body, {
  scrollbars: {
    theme: 'os-theme-light',
    autoHide: 'leave',
    autoHideDelay: 200
  }
});

// Update scrollbar theme dynamically based on dark mode
const updateScrollbarTheme = () => {
  const isDark = document.documentElement.classList.contains('dark');
  OverlayScrollbars(document.body, {
    scrollbars: { theme: isDark ? 'os-theme-light' : 'os-theme-dark' } // os-theme-light means light thumb (good for dark background)
  });
};

const observer = new MutationObserver(updateScrollbarTheme);
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
updateScrollbarTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-mock.apps.googleusercontent.com'}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
