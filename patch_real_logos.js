const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/LandingPage.jsx', 'utf8');

const realBanner = `
            {/* COMPATIBILITY BANNER */}
            <div className="pt-12 mt-12 border-t border-slate-200 dark:border-white/10 flex flex-col items-center">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Integrado y funcionando con</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80 hover:opacity-100 transition-all duration-500">
                
                {/* Spain */}
                <div className="flex items-center gap-3 font-bold text-lg text-slate-800 dark:text-white">
                  <div className="w-8 h-6 rounded-sm overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                    <div className="h-[25%] bg-[#c60b1e]"></div>
                    <div className="h-[50%] bg-[#ffc400]"></div>
                    <div className="h-[25%] bg-[#c60b1e]"></div>
                  </div>
                  Toda España
                </div>

                {/* Google Maps */}
                <div className="flex items-center gap-3 font-bold text-lg text-slate-800 dark:text-white">
                  <svg className="w-7 h-7" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Google Maps
                </div>

                {/* Apple Maps */}
                <div className="flex items-center gap-3 font-bold text-lg text-slate-800 dark:text-white">
                  <svg className="w-7 h-7 text-black dark:text-white" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.1-44.6-35.9-2.8-74.3 22.7-93.1 22.7-18.8 0-46.6-22.2-75-22.2-45.8 0-89 27.2-113.8 69-52 87.2-11.2 216.5 39.4 289.4 24.5 35.1 53 74 91.2 72.8 36.7-1.2 51.5-23.7 96-23.7 44.5 0 57.6 23.7 96 23.2 40-1 65.6-38.3 90.1-73.8 29.8-43 41.2-84.7 42.1-87-1.1-.4-39.7-15.6-38.8-57zM243 89.9c20-24 32.2-57.1 28.5-89.9-27.5 1.1-62 18.2-82.5 42.4-18.2 21.2-32.2 55.4-27.7 87.3 30.6 2.3 62-15.5 81.7-39.8z"/>
                  </svg>
                  Apple Maps
                </div>
                
              </div>
            </div>`;

code = code.replace(/\{\/\* COMPATIBILITY BANNER \*\/\}[\s\S]*?<\/div>\s*<\/div>/, realBanner);

fs.writeFileSync('frontend/src/components/LandingPage.jsx', code, 'utf8');
console.log('Replaced with real logos');
