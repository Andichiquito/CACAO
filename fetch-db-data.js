
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nuggxbpabupxkhlmreod.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2d4YnBhYnVweGtobG1yZW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjEwOTEsImV4cCI6MjA3NzA5NzA5MX0.F3AmSuaZbX_u9fZW3-2wxmC5F5WftNIZChENa-5p400';

const supabase = createClient(supabaseUrl, supabaseKey);

async function dumpData() {
    console.log('--- CATEGORÍAS ---');
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (catError) {
        console.error('Error fetching categories:', catError);
    } else {
        categories.forEach(c => {
            console.log(`[${c.id}] ${c.name} - ${c.description || 'Sin descripción'}`);
        });
    }

    console.log('\n--- PRODUCTOS (Primeros 50) ---');
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, price, category_id, is_available')
        .order('name')
        .limit(50);

    if (prodError) {
        console.error('Error fetching products:', prodError);
    } else {
        products.forEach(p => {
            console.log(`- ${p.name}: Bs. ${p.price} (Cat: ${p.category_id}) [${p.is_available ? 'Disp' : 'No Disp'}]`);
        });
    }
}

dumpData();
