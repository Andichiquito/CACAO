import React, { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useToast } from '../contexts/ToastContext';
import { NavigationProps } from '../types';
import './AdminProducts.css';

const AdminTorta: React.FC<NavigationProps> = ({ onNavigate }) => {
    const { supabase } = useSupabase();
    const { showToast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchTorta = async () => {
            const { data } = await supabase
                .from('products')
                .select('image_url')
                .ilike('name', 'Torta del mes')
                .limit(1)
                .single();
            
            if (data?.image_url) {
                setCurrentImage(data.image_url);
            }
        };
        fetchTorta();
    }, [supabase]);

    const handleTortaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            setIsUploading(true);

            // Generar un nombre único para el archivo
            const fileExt = file.name.split('.').pop();
            const fileName = `torta_del_mes_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Subir al bucket 'products'
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw new Error('Asegúrate de tener un bucket público llamado "products" en Supabase Storage.');
            }

            // Obtener la URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            // Buscar si ya existe la "Torta del mes"
            const { data: existingTorta } = await supabase
                .from('products')
                .select('id')
                .ilike('name', 'Torta del mes')
                .limit(1)
                .single();

            if (existingTorta) {
                // Actualizar
                await supabase.from('products').update({ image_url: publicUrl, updated_at: new Date().toISOString() }).eq('id', existingTorta.id);
            } else {
                // Crear (necesitamos una categoría válida, así que intentamos obtener la primera)
                const { data: cats } = await supabase.from('categories').select('id').limit(1);
                const categoryId = cats && cats.length > 0 ? cats[0].id : 1;

                await supabase.from('products').insert([{
                    name: 'Torta del mes',
                    description: 'Torta destacada del mes',
                    price: 0,
                    category_id: categoryId,
                    image_url: publicUrl,
                    is_available: true,
                    stock_quantity: 0,
                    sort_order: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }]);
            }
            
            setCurrentImage(publicUrl);
            showToast('Éxito', 'Torta del mes actualizada correctamente.');
        } catch (error: any) {
            console.error('Error uploading torta:', error);
            showToast('Error', error.message || 'Error al subir la imagen');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="admin-products-container">
            <div className="admin-header">
                <button className="back-button" onClick={() => onNavigate('home')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19L5 12L12 5" />
                    </svg>
                </button>
                <h1 className="admin-title">GESTIÓN DE TORTA DEL MES</h1>
            </div>

            <div className="admin-content">
                <div className="admin-card" style={{ marginBottom: '2rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                    <h3 style={{ color: '#d4af37', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🎂 Banner Principal
                    </h3>
                    <p style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Sube la imagen que quieres mostrar como la "Torta del mes" en la página de inicio y el Menú.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <label style={{
                            background: '#d4af37', color: 'black', padding: '0.8rem 1.5rem',
                            borderRadius: '8px', cursor: isUploading ? 'not-allowed' : 'pointer', fontWeight: 'bold',
                            display: 'inline-block', width: 'fit-content'
                        }}>
                            {isUploading ? 'Subiendo...' : 'Seleccionar Imagen'}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleTortaUpload}
                                disabled={isUploading}
                                style={{ display: 'none' }}
                            />
                        </label>
                        
                        {currentImage && (
                            <div style={{ marginTop: '1rem' }}>
                                <p style={{ color: '#d4af37', marginBottom: '0.5rem', fontWeight: 'bold' }}>Imagen actual:</p>
                                <img 
                                    src={currentImage} 
                                    alt="Torta del Mes Actual" 
                                    style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)' }} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTorta;
