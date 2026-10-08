import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://pgsphvxetiwxpkzcqeui.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnc3BodnhldGl3eHBremNxZXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTI2MDgsImV4cCI6MjEwMDQ4ODYwOH0.uPSXknquTjvZjIyR6XMY0UNZRzNG1y-yXbkQYAUSOF8';

const TABLES = ['categories', 'products', 'orders', 'history', 'business_details'];
const EXPORT_DIR = path.join(process.cwd(), 'data_export');

if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR);
}

async function dumpData() {
    for (const table of TABLES) {
        console.log(`Fetching ${table}...`);
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
            headers: {
                apikey: ANON_KEY,
                Authorization: `Bearer ${ANON_KEY}`
            }
        });
        if (!res.ok) {
            console.error(`Failed to fetch ${table}: ${res.statusText}`);
            continue;
        }
        const data = await res.json();
        fs.writeFileSync(path.join(EXPORT_DIR, `${table}.json`), JSON.stringify(data, null, 2));
        console.log(`Saved ${table}.json (${data.length} records)`);
    }
    console.log('All tables exported successfully.');
}

dumpData().catch(console.error);
