const { createClient } = supabase;

const supabaseUrl = window.env.SUPABASE_URL;
const supabaseAnonKey = window.env.SUPABASE_ANON_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
