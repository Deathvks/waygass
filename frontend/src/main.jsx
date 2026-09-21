import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'overlayscrollbars/styles/overlayscrollbars.css';

import App from './App.jsx'

import { PrivacyPage, LegalPage, CookiesPolicyPage } from './components/LegalPages.jsx';
import { useState, useEffect } from 'react';
import CookiesBanner from './components/CookiesBanner.jsx';
import { BlogIndex, BlogPost1, BlogPost2, BlogPost3, BlogPost4 } from './components/BlogPage.jsx';

import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios'

// Bypass Ngrok browser warning for all API requests
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';


// The OverlayScrollbarsReact wrapper is used inside App.jsx or main.jsx.
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

const path = window.location.pathname;
const rootElement = document.getElementById('root');


const applyThemeAndColor = () => {
  let settings = { theme: 'light', appColor: 'red' };
  if (localStorage.getItem('waygass_cookie_consent_v2') === 'accepted') {
    const saved = localStorage.getItem('waygas_settings');
    if (saved) {
      try {
        settings = JSON.parse(saved);
      } catch (e) {}
    }
  }

  // Apply Theme
  const isDark = 
    settings.theme === 'dark' || 
    (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Apply Color
  const colors = {
    red: { primary: '#ff3b30', dark: '#c71a10', container: '#ff6961', secondary: '#ff2d55' },
    blue: { primary: '#007aff', dark: '#0056b3', container: '#4aa0ff', secondary: '#5856d6' },
    green: { primary: '#34c759', dark: '#248a3d', container: '#65d581', secondary: '#32ade6' },
    purple: { primary: '#af52de', dark: '#893bb0', container: '#c57aeb', secondary: '#ff2d55' },
    orange: { primary: '#ff9500', dark: '#cc7700', container: '#ffad33', secondary: '#ffcc00' }
  };
  const c = colors[settings.appColor] || colors.red;
  document.documentElement.style.setProperty('--app-primary', c.primary);
  document.documentElement.style.setProperty('--app-primary-dark', c.dark);
  document.documentElement.style.setProperty('--app-primary-container', c.container);
  document.documentElement.style.setProperty('--app-secondary', c.secondary);
};

const WrappedPage = ({ children }) => {
  useEffect(() => {
    applyThemeAndColor();
  }, []);

  const isDark = document.documentElement.classList.contains('dark');
  const [showCookiesBanner, setShowCookiesBanner] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('waygass_cookie_consent_v2')) {
      setShowCookiesBanner(true);
    }
    const handleOpen = () => setShowCookiesBanner(true);
    window.addEventListener('openCookiesBanner', handleOpen);
    return () => window.removeEventListener('openCookiesBanner', handleOpen);
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('waygass_cookie_consent_v2', 'accepted');
    window.dispatchEvent(new Event('cookieConsentUpdated'));
    setShowCookiesBanner(false);
  };

  const handleRejectCookies = () => {
    localStorage.setItem('waygass_cookie_consent_v2', 'rejected');
    window.dispatchEvent(new Event('cookieConsentUpdated'));
    setShowCookiesBanner(false);
    const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('waygas_') && key !== 'waygas_token' && key !== 'waygas_user') {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      window.dispatchEvent(new Event('preferencesCleared'));
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
  } else if (path === '/blog/mejores-apps-coche-2026') {
    createRoot(rootElement).render(<WrappedPage><BlogPost3 /></WrappedPage>);
  } else if (path === '/blog/mantenimiento-preventivo-consumo') {
    createRoot(rootElement).render(<WrappedPage><BlogPost4 /></WrappedPage>);
  } else {
  createRoot(rootElement).render(<WrappedPage><App /></WrappedPage>);
}

