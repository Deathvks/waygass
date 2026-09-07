import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'overlayscrollbars/styles/overlayscrollbars.css';

import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios'

// Bypass Ngrok browser warning for all API requests
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';


// The OverlayScrollbarsReact wrapper is used inside App.jsx or main.jsx.
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

const RootApp = () => {
  const isDark = document.documentElement.classList.contains('dark');
  
  return (
    <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-mock.apps.googleusercontent.com'}>
        <OverlayScrollbarsComponent 
          options={{ 
            scrollbars: { 
              theme: isDark ? 'os-theme-light' : 'os-theme-dark', 
              autoHide: 'leave', 
              autoHideDelay: 200 
            } 
          }} 
          defer
          style={{ height: '100%', width: '100vw' }}
        >
          <App />
        </OverlayScrollbarsComponent>
      </GoogleOAuthProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<RootApp />);