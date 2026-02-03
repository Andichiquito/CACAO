const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nuggxbpabupxkhlmreod.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2d4YnBhYnVweGtobG1yZW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjEwOTEsImV4cCI6MjA3NzA5NzA5MX0.F3AmSuaZbX_u9fZW3-2wxmC5F5WftNIZChENa-5p400';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fullInspection() {
    const { data: categories } = await supabase.from('categories').select('*').order('sort_order');
    const { data: products } = await supabase.from('products').select('*');

    console.log('--- CATEGORÍAS ---');
    categories.forEach(c => {
        console.log(`ID: ${c.id} | Name: "${c.name}" | Active: ${c.is_active} | Emoji: ${c.icon_emoji}`);
    });

    console.log('\n--- PRODUCTOS TRES LECHES / TRES ---');
    const tres = products.filter(p => p.name.toUpperCase().includes('TRES'));
    tres.forEach(p => {
        console.log(`ID: ${p.id} | Name: "${p.name}" | Desc: "${p.description}" | Cat: ${p.category_id}`);
    });
}

fullInspection();
