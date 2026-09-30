const fs = require('fs');
let code = fs.readFileSync('frontend/src/main.jsx', 'utf8');

const wrappedStart = /const WrappedPage = \(\{ children \}\) => \{/;
const newWrappedStart = `const WrappedPage = ({ children }) => {
  useEffect(() => {
    applyThemeAndColor();
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement("script");
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3243042902219004";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }, []);
`;
code = code.replace(wrappedStart, newWrappedStart);

// Also remove applyThemeAndColor from its previous location in WrappedPage to avoid duplication
const duplicateRegex = /useEffect\(\(\) => \{\s*applyThemeAndColor\(\);\s*\}, \[\]\);/;
code = code.replace(duplicateRegex, '');

fs.writeFileSync('frontend/src/main.jsx', code, 'utf8');
console.log('Injected AdSense into WrappedPage');
