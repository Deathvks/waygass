const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/AuthScreen.jsx', 'utf8');

content = content.replace(
  'const [verificationSent, setVerificationSent] = useState(false);',
  'const [verificationSent, setVerificationSent] = useState(false);\n  const [resendTimer, setResendTimer] = useState(20);\n  const [resendMessage, setResendMessage] = useState("");'
);

const timerEffect = `
  useEffect(() => {
    let interval;
    if (verificationSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [verificationSent, resendTimer]);
`;
content = content.replace('useEffect(() => {', timerEffect + '\n\n  useEffect(() => {');

const handleResendFn = `
  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await axios.post('/api/resend-verification', { email: formData.email });
      setResendTimer(20);
      setError("");
      setResendMessage("¡Nuevo enlace enviado! Revisa tu bandeja.");
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Error al reenviar el correo.");
      }
    }
  };
`;
content = content.replace('const handleSubmit = async (e) => {', handleResendFn + '\n\n  const handleSubmit = async (e) => {');

content = content.replace(
  'setVerificationSent(true);',
  'setVerificationSent(true);\n        setResendTimer(20);\n        setError("");\n        setResendMessage("");'
);

const buttonsRegex = /<button [^>]+>[\s\S]*?Ya lo he verificado, Iniciar sesi.n[\s\S]*?<\/button>/;
const newButtons = `
                {resendMessage && (
                  <div className="text-green-600 dark:text-green-400 text-sm font-medium mb-6 bg-green-50 dark:bg-green-500/10 p-3 rounded-lg border border-green-100 dark:border-green-500/20">
                    {resendMessage}
                  </div>
                )}
                {error && (
                  <div className="text-rose-500 text-sm font-medium mb-6 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-lg border border-rose-100 dark:border-rose-500/20">
                    {error}
                  </div>
                )}
                <button 
                  onClick={() => {
                    setVerificationSent(false);
                    setIsLogin(true);
                    setError("");
                    setResendMessage("");
                  }}
                  className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:opacity-90 transition-opacity mb-4"
                >
                  Ya lo he verificado, Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className={\`w-full py-3.5 rounded-xl font-bold text-sm transition-all \${resendTimer > 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700'}\`}
                >
                  {resendTimer > 0 ? \`Reenviar de nuevo en \${resendTimer}s\` : 'No me ha llegado, enviar de nuevo'}
                </button>
`;
content = content.replace(buttonsRegex, newButtons);

fs.writeFileSync('frontend/src/components/AuthScreen.jsx', content);
