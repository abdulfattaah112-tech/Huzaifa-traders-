const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');

if (!c.includes('import path from "path";')) {
  c = c.replace('import dotenv from "dotenv";', 'import dotenv from "dotenv";\nimport path from "path";\nimport { fileURLToPath } from "url";\n\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = path.dirname(__filename);');
}

if (!c.includes('app.use(express.static')) {
  c = c.replace('app.listen(PORT, () => {', 'app.use(express.static(path.join(__dirname, "dist")));\n\napp.get("*", (req, res) => {\n  res.sendFile(path.join(__dirname, "dist", "index.html"));\n});\n\napp.listen(PORT, () => {');
}

fs.writeFileSync('server.js', c);
console.log("server.js updated");
