import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = 'https://jlnywbbypuxtltijryag.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsbnl3YmJ5cHV4dGx0aWpyeWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMTExMTYsImV4cCI6MjA4Mzc4NzExNn0.zYAl1PQdeRfnkvryGoXEVpRNPPWoOVozrlhekmD_nCE';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});