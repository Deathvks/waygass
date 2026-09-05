const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const colorEffect = `
  useEffect(() => {
    const colors = {
      red: { primary: '#ff3b30', dark: '#c71a10', container: '#ff6961' },
      blue: { primary: '#007aff', dark: '#0056b3', container: '#4aa0ff' },
      green: { primary: '#34c759', dark: '#248a3d', container: '#65d581' },
      purple: { primary: '#af52de', dark: '#893bb0', container: '#c57aeb' },
      orange: { primary: '#ff9500', dark: '#cc7700', container: '#ffad33' }
    };
    const c = colors[settings.appColor] || colors.red;
    document.documentElement.style.setProperty('--app-primary', c.primary);
    document.documentElement.style.setProperty('--app-primary-dark', c.dark);
    document.documentElement.style.setProperty('--app-primary-container', c.container);
  }, [settings.appColor]);
`;

code = code.replace(/\s*\/\/ Persistir ajustes localmente cada vez/, colorEffect + '\n  // Persistir ajustes localmente cada vez');

fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
