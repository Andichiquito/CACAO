import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env.REACT_APP_SUPABASE_URL || 'https://nuggxbpabupxkhlmreod.supabase.co';
const supabaseKey: string = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2d4YnBhYnVweGtobG1yZW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjEwOTEsImV4cCI6MjA3NzA5NzA5MX0.F3AmSuaZbX_u9fZW3-2wxmC5F5WftNIZChENa-5p400';

export const supabase = createClient(supabaseUrl, supabaseKey);

