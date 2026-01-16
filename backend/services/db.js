import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ CRITICAL: Supabase credentials (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are missing!');
}

// Cliente para o Backend (Service Role - Bypass RLS)
export const supabase = (supabaseUrl && supabaseServiceKey)
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : null;

if (!supabase) {
    console.error('⚠️ Supabase client could not be initialized. API will fail.');
}

// Duck-typing para manter compatibilidade com o pool do mysql2 enquanto migramos
// Isso permite que o código que usa 'pool.query' continue funcionando ou nos dê um erro claro
export const pool = {
    query: async (sql, params) => {
        console.warn('⚠️ Chamada legada ao pool.query detectada. Migre para o cliente Supabase.');
        throw new Error('MySQL Pool is deprecated. Use Supabase client.');
    }
};

console.log('🚀 Supabase Service initialized');
