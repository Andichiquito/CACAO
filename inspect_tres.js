const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nuggxbpabupxkhlmreod.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2d4YnBhYnVweGtobG1yZW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjEwOTEsImV4cCI6MjA3NzA5NzA5MX0.F3AmSuaZbX_u9fZW3-2wxmC5F5WftNIZChENa-5p400';

const supabase = createClient(supabaseUrl, supabaseKey);

const fs = require('fs');

async function inspectPorcion() {
    console.log('Searching for PORCIÓN...');
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', '%PORCIÓN%')
        .limit(10);

    if (!products || products.length === 0) {
        fs.writeFileSync('porcion_output.txt', 'No products found');
        return;
    }

    let output = '';
    products.forEach(p => {
        output += `ID: ${p.id}\n`;
        output += `Name: '${p.name}'\n`;
        output += `Subcategory: '${p.subcategory}'\n`;
        output += `Category ID: ${p.category_id}\n`;
        output += '----------------\n';
    });
    fs.writeFileSync('porcion_output.txt', output);
    console.log('Done writing to porcion_output.txt');
}

inspectPorcion();
