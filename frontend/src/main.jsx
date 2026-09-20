import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'overlayscrollbars/styles/overlayscrollbars.css';

import App from './App.jsx'

import { PrivacyPage, LegalPage, CookiesPolicyPage } from './components/LegalPages.jsx';
import { BlogIndex, BlogPost1, BlogPost2 } from './components/BlogPage.jsx';

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


const path = window.location.pathname;
const rootElement = document.getElementById('root');

if (path === '/privacidad') {
  createRoot(rootElement).render(<PrivacyPage />);
} else if (path === '/legal') {
  createRoot(rootElement).render(<LegalPage />);
} else if (path === '/cookies') {
  createRoot(rootElement).render(<CookiesPolicyPage />);
} else if (path === '/blog') {
  createRoot(rootElement).render(<BlogIndex />);
} else if (path === '/blog/5-trucos-ahorrar-combustible') {
  createRoot(rootElement).render(<BlogPost1 />);
} else if (path === '/blog/gasolineras-lowcost-mito-realidad') {
  createRoot(rootElement).render(<BlogPost2 />);
} else {
  createRoot(rootElement).render(<RootApp />);
}
