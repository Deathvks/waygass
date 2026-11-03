import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'overlayscrollbars/styles/overlayscrollbars.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'flag-icons/css/flag-icons.min.css';

import App from './App.jsx'

import { PrivacyPage, LegalPage, CookiesPolicyPage } from './components/LegalPages.jsx';
import { useState, useEffect } from 'react';
import CookiesBanner from './components/CookiesBanner.jsx';
import { BlogIndex, BlogPostPage, BlogPost1, BlogPost2, BlogPost3, BlogPost4 } from './components/BlogPage.jsx';
import ProvincePage from './components/ProvincePage.jsx';
import ProvincesDirectory from './components/ProvincesDirectory.jsx';

import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios'

// Bypass Ngrok browser warning for all API requests
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';


// The OverlayScrollbarsReact wrapper is used inside App.jsx or main.jsx.
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

const rawPath = typeof window !== 'undefined' ? window.location.pathname : '/';
const path = (rawPath.length > 1 && rawPath.endsWith('/')) ? rawPath.slice(0, -1) : rawPath;
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

  // Always Light Mode
  document.documentElement.classList.remove('dark');

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
    if (!document.querySelector('script[src*="adsbygoogle.js"]') && (window.location.pathname.startsWith('/blog') || window.location.pathname.startsWith('/gasolineras') || window.location.pathname === '/legal' || window.location.pathname === '/privacidad' || window.location.pathname === '/cookies')) {
      const script = document.createElement("script");
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3243042902219004";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }, []);

  // Tracking de visitas (Sniffing de Tráfico)
  useEffect(() => {
    try {
      const token = localStorage.getItem('waygas_token') || sessionStorage.getItem('waygas_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      axios.post('/api/track-visit', {
        path: window.location.pathname || '/',
        referrer: document.referrer || ''
      }, { headers }).catch(() => {});
    } catch (e) {}
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

// Navegación SPA instantánea sin recarga de página completa
export const spaNavigate = (to) => {
  if (typeof window === 'undefined') return;
  if (to === window.location.pathname) return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
};

if (typeof window !== 'undefined') {
  window.spaNavigate = spaNavigate;
}

function AppRouter() {
  const [currentPath, setCurrentPath] = useState(() => {
    const raw = typeof window !== 'undefined' ? window.location.pathname : '/';
    return (raw.length > 1 && raw.endsWith('/')) ? raw.slice(0, -1) : raw;
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const raw = window.location.pathname;
      const clean = (raw.length > 1 && raw.endsWith('/')) ? raw.slice(0, -1) : raw;
      setCurrentPath(clean);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Interceptar clics en enlaces internos (<a href="/blog/...">) para navegación instantánea sin recarga
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      const targetAttr = anchor.getAttribute('target');
      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        targetAttr === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }
      if (href.startsWith('/')) {
        e.preventDefault();
        spaNavigate(href);
      }
    };
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  if (currentPath === '/privacidad') {
    return <WrappedPage><PrivacyPage /></WrappedPage>;
  } else if (currentPath === '/legal') {
    return <WrappedPage><LegalPage /></WrappedPage>;
  } else if (currentPath === '/cookies') {
    return <WrappedPage><CookiesPolicyPage /></WrappedPage>;
  } else if (currentPath === '/blog') {
    return <WrappedPage><BlogIndex /></WrappedPage>;
  } else if (currentPath.startsWith('/blog/')) {
    const slug = currentPath.replace(/^\/blog\//, '').replace(/\/$/, '');
    if (!slug) {
      return <WrappedPage><BlogIndex /></WrappedPage>;
    }
    return <WrappedPage><BlogPostPage slug={slug} /></WrappedPage>;
  } else if (currentPath === '/gasolineras') {
    return <WrappedPage><ProvincesDirectory /></WrappedPage>;
  } else if (currentPath.startsWith('/gasolineras/')) {
    const slug = currentPath.replace(/^\/gasolineras\//, '').replace(/\/$/, '');
    if (!slug) {
      return <WrappedPage><ProvincesDirectory /></WrappedPage>;
    }
    return <WrappedPage><ProvincePage slug={slug} /></WrappedPage>;
  } else if (currentPath === '/login') {
    return <WrappedPage><App initialAuth={true} /></WrappedPage>;
  } else {
    return <WrappedPage><App /></WrappedPage>;
  }
}

createRoot(rootElement).render(<AppRouter />);

