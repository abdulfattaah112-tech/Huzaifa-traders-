const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

code = code.replace(/fetch\('(\/api\/[^']+)'/g, 'fetch((import.meta.env.PROD ? "https://huzaifa-traders-two-seven.vercel.app" : "") + "$1"');

fs.writeFileSync('src/App.jsx', code);
console.log("Replaced!");
