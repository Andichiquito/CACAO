const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nuggxbpabupxkhlmreod.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2d4YnBhYnVweGtobG1yZW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjEwOTEsImV4cCI6MjA3NzA5NzA5MX0.F3AmSuaZbX_u9fZW3-2wxmC5F5WftNIZChENa-5p400';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findBebidasDeAutor() {
    const { data: cat } = await supabase.from('categories').select('id').eq('name', 'BEBIDAS DE AUTOR').single();

    if (!cat) {
        console.error('Categoría "BEBIDAS DE AUTOR" no encontrada');
        return;
    }

    const { data: products } = await supabase.from('products').select('*').eq('category_id', cat.id);

    console.log('--- PRODUCTOS EN BEBIDAS DE AUTOR ---');
    products.forEach(p => {
        console.log(`ID: ${p.id}, Name: "${p.name}", Price: ${p.price}`);
    });
}

findBebidasDeAutor();
