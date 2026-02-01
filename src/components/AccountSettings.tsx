
import React, { useState, useEffect, useRef } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useToast } from '../contexts/ToastContext';
import { NavigationProps } from '../types';
import './AccountSettings.css';

const AccountSettings: React.FC<NavigationProps> = ({ onNavigate }) => {
    const { user, supabase } = useSupabase();
    const { showToast } = useToast();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        /**
         * Carga los datos del perfil del usuario desde la tabla 'profiles'.
         */
        const fetchProfile = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('full_name, phone, avatar_url')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                if (data) {
                    setFullName(data.full_name || '');
                    setPhone(data.phone || '');
                    setAvatarUrl(data.avatar_url || null);
                }
            } catch (error: any) {
                console.error('Error fetching profile:', error.message);
                showToast('Error', 'No se pudieron cargar tus datos.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user, supabase, showToast]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    /**
     * Sube una nueva imagen al Storage de Supabase y actualiza la URL en el perfil.
     */
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            showToast('Error', 'Por favor selecciona una imagen válida.');
            return;
        }

        // Mostrar preview local inmediatamente para feedback visual rápido
        const previewUrl = URL.createObjectURL(file);
        setAvatarUrl(previewUrl);

        setIsSaving(true);
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

            // PASO 1: Subir el archivo físico al Bucket de 'avatars' en Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // PASO 2: Obtener la URL pública para poder visualizar la imagen
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // PASO 3: Actualizar la base de datos (tabla profiles) con la nueva URL de la foto
            setAvatarUrl(publicUrl);
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            showToast('Éxito', 'Foto de perfil actualizada.');
        } catch (error: any) {
            console.error('Error uploading avatar:', error.message);
            showToast('Error', 'No se pudo subir la imagen.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        // Validación de teléfono
        const cleanPhone = phone.replace(/[\s\-()]/g, '');
        if (!/^[67][0-9]{6,7}$/.test(cleanPhone)) {
            showToast('Teléfono inválido', 'Debe empezar por 6 o 7 y tener 7 a 8 números');
            setIsSaving(false);
            return;
        }

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    phone: cleanPhone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            showToast('Éxito', 'Tus cambios han sido guardados.');
        } catch (error: any) {
            console.error('Error updating profile:', error.message);
            showToast('Error', 'No se pudieron guardar los cambios.');
        } finally {
            setIsSaving(false);
        }
    };

    const getUserInitial = () => {
        return (fullName || user?.email || 'U').charAt(0).toUpperCase();
    };

    if (isLoading) {
        return (
            <div className="settings-container">
                <div className="loading-spinner">Cargando tu perfil...</div>
            </div>
        );
    }

    return (
        <div className="settings-container">
            <header className="settings-header">
                <button
                    className="settings-back-btn"
                    onClick={() => onNavigate('home')}
                    aria-label="Volver al inicio"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1 className="settings-title">AJUSTES</h1>
            </header>

            <div className="settings-content">
                <div className="profile-section">
                    <div className="settings-avatar" onClick={handleAvatarClick} title="Cambiar foto de perfil">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Perfil" />
                        ) : (
                            getUserInitial()
                        )}
                        <div className="avatar-overlay">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                            <span>CAMBIAR</span>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    <p className="avatar-hint">Haz clic en la imagen para cambiarla</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '-10px' }}>ID: {user?.id.substring(0, 8)}...</p>
                </div>

                <form className="settings-form" onSubmit={handleSave}>
                    <div className="settings-group">
                        <label htmlFor="email">Email (No se puede cambiar)</label>
                        <input
                            id="email"
                            type="email"
                            value={user?.email || ''}
                            disabled
                        />
                    </div>

                    <div className="settings-group">
                        <label htmlFor="fullName">Nombre Completo</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Tu nombre completo"
                            required
                        />
                    </div>

                    <div className="settings-group">
                        <label htmlFor="phone">Teléfono / WhatsApp</label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="70012345"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="save-btn"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AccountSettings;
