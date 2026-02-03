const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nuggxbpabupxkhlmreod.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2d4YnBhYnVweGtobG1yZW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjEwOTEsImV4cCI6MjA3NzA5NzA5MX0.F3AmSuaZbX_u9fZW3-2wxmC5F5WftNIZChENa-5p400';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeDB() {
    const { data: categories } = await supabase.from('categories').select('*').order('sort_order');
    const { data: products } = await supabase.from('products').select('*');

    console.log('--- CATEGORÍAS EN DB ---');
    categories.forEach(c => {
        const pCount = products.filter(p => p.category_id === c.id).length;
        console.log(`ID: ${c.id}, Name: ${c.name}, Order: ${c.sort_order}, Icon: ${c.icon_emoji}, Active: ${c.is_active}, Products: ${pCount}`);
    });

    console.log('\n--- PRODUCTOS CON MISMO NOMBRE ---');
    const names = {};
    products.forEach(p => {
        const n = p.name.trim().toUpperCase();
        if (!names[n]) names[n] = [];
        names[n].push({ id: p.id, cat: p.category_id, available: p.is_available });
    });

    Object.entries(names).forEach(([name, occs]) => {
        if (occs.length > 1) {
            console.log(`\n"${name}":`);
            occs.forEach(o => {
                const cat = categories.find(c => c.id === o.cat)?.name || 'Desconocida';
                console.log(` - ID: ${o.id}, Cat: ${cat}, Disponible: ${o.available}`);
            });
        }
    });
}

analyzeDB();
