const fs = require('fs');

let client = fs.readFileSync('src/api/client.js', 'utf8');
client = client.replace(/const API_BASE_URL = [^;]+;/, 'const API_BASE_URL = "";');
fs.writeFileSync('src/api/client.js', client);

let app = fs.readFileSync('src/App.jsx', 'utf8');
app = app.replace(/\(import\.meta\.env\.PROD \? "[^"]+" \: ""\) \+ "\/api/g, '"/api');
fs.writeFileSync('src/App.jsx', app);

console.log("URLs reverted");
