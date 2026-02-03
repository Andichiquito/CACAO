const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nuggxbpabupxkhlmreod.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2d4YnBhYnVweGtobG1yZW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjEwOTEsImV4cCI6MjA3NzA5NzA5MX0.F3AmSuaZbX_u9fZW3-2wxmC5F5WftNIZChENa-5p400';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
    const { data: products, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_available', true);

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    const nameMap = new Map();
    products.forEach(p => {
        const name = p.name.trim().toUpperCase();
        if (!nameMap.has(name)) {
            nameMap.set(name, []);
        }
        nameMap.get(name).push({
            id: p.id,
            category: p.categories?.name,
            price: p.price
        });
    });

    console.log('--- PRODUCTOS REPETIDOS (Mismo nombre en diferentes categorías o duplicados) ---');
    let duplicatesFound = false;
    for (const [name, occurrences] of nameMap.entries()) {
        if (occurrences.length > 1) {
            duplicatesFound = true;
            console.log(`\nProducto: "${name}"`);
            occurrences.forEach(occ => {
                console.log(` - ID: ${occ.id}, Categoría: ${occ.category}, Precio: ${occ.price}`);
            });
        }
    }

    if (!duplicatesFound) {
        console.log('No se encontraron productos con nombres repetidos.');
    }

    console.log('\n--- RESUMEN POR CATEGORÍA ---');
    const catMap = new Map();
    products.forEach(p => {
        const catName = p.categories?.name || 'Sin Categoría';
        if (!catMap.has(catName)) catMap.set(catName, 0);
        catMap.set(catName, catMap.get(catName) + 1);
    });

    for (const [cat, count] of catMap.entries()) {
        console.log(`${cat}: ${count} productos`);
    }
}

checkDuplicates();
