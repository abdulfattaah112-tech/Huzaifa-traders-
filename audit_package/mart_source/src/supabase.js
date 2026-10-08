import { createClient } from '@supabase/supabase-js';

// Route traffic through our local Express WAF proxy.
// Fallback to window.location.origin if available, otherwise localhost
const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
const supabaseUrl = `${baseUrl}/supabase`;
const supabaseKey = '[REDACTED]';

export const supabase = createClient(supabaseUrl, supabaseKey);
