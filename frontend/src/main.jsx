import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'overlayscrollbars/styles/overlayscrollbars.css';

import App from './App.jsx'

import { PrivacyPage, LegalPage, CookiesPolicyPage } from './components/LegalPages.jsx';
import { useState, useEffect } from 'react';
import CookiesBanner from './components/CookiesBanner.jsx';
import { BlogIndex, BlogPost1, BlogPost2 } from './components/BlogPage.jsx';

import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios'

// Bypass Ngrok browser warning for all API requests
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';


// The OverlayScrollbarsReact wrapper is used inside App.jsx or main.jsx.
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

const path = window.location.pathname;
const rootElement = document.getElementById('root');


const WrappedPage = ({ children }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const [showCookiesBanner, setShowCookiesBanner] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('waygass_cookie_consent_v2')) {
      setShowCookiesBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('waygass_cookie_consent_v2', 'accepted');
    setShowCookiesBanner(false);
  };

  const handleRejectCookies = () => {
    localStorage.setItem('waygass_cookie_consent_v2', 'rejected');
    setShowCookiesBanner(false);
    ['waygas_filters', 'waygas_viewMode', 'waygas_province', 'waygas_location'].forEach(k => 
      localStorage.removeItem(k)
    );
  };

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
          {children}
          {showCookiesBanner && (
            <CookiesBanner 
              onAccept={handleAcceptCookies} 
              onReject={handleRejectCookies} 
            />
          )}
        </OverlayScrollbarsComponent>
      </GoogleOAuthProvider>
    </StrictMode>
  );
};

if (path === '/privacidad') {
  createRoot(rootElement).render(<WrappedPage><PrivacyPage /></WrappedPage>);
} else if (path === '/legal') {
  createRoot(rootElement).render(<WrappedPage><LegalPage /></WrappedPage>);
} else if (path === '/cookies') {
  createRoot(rootElement).render(<WrappedPage><CookiesPolicyPage /></WrappedPage>);
} else if (path === '/blog') {
  createRoot(rootElement).render(<WrappedPage><BlogIndex /></WrappedPage>);
} else if (path === '/blog/5-trucos-ahorrar-combustible') {
  createRoot(rootElement).render(<WrappedPage><BlogPost1 /></WrappedPage>);
} else if (path === '/blog/gasolineras-lowcost-mito-realidad') {
  createRoot(rootElement).render(<WrappedPage><BlogPost2 /></WrappedPage>);
} else {
  createRoot(rootElement).render(<WrappedPage><App /></WrappedPage>);
}

