
import React, { useState, useRef, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useToast } from '../contexts/ToastContext';
import './UserMenu.css';

interface UserMenuProps {
    onNavigate: (page: 'home' | 'menu' | 'about' | 'settings' | 'admin-products' | 'admin-torta') => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const { user, supabase, signOut } = useSupabase();
    const { showToast } = useToast();
    const menuRef = useRef<HTMLDivElement>(null);

    // Obtiene los datos del perfil (incluyendo el avatar y rol) al cargar el componente
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            const { data } = await supabase
                .from('profiles')
                .select('avatar_url, role')
                .eq('id', user.id)
                .single();

            if (data?.avatar_url) {
                setAvatarUrl(data.avatar_url);
            }
            if (data?.role) {
                setUserRole(data.role);
            }
        };
        fetchProfile();
    }, [user, supabase]);

    // Cierra el menú desplegable si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const handleLogout = async () => {
        const result = await signOut();
        if (result.success) {
            showToast('Sesión cerrada', 'Vuelve pronto por un café.');
        } else {
            showToast('Error', 'No se pudo cerrar la sesión.');
        }
        setIsOpen(false);
    };

    const getUserInitial = () => {
        const fullName = user.user_metadata?.full_name || user.email || 'U';
        return fullName.charAt(0).toUpperCase();
    };

    const getDisplayName = () => {
        return user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';
    };

    return (
        <div className={`user-menu-container ${isOpen ? 'open' : ''}`} ref={menuRef}>
            <button className="user-menu-trigger" onClick={() => setIsOpen(!isOpen)}>
                <div className="user-avatar">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Perfil" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        getUserInitial()
                    )}
                </div>
                <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <div className="user-dropdown-menu">
                    <div className="user-info-header">
                        <span className="user-display-name">{getDisplayName()}</span>
                        <span className="user-email-label">{user.email}</span>
                    </div>

                    <button className="dropdown-item-btn" onClick={() => {
                        onNavigate('settings');
                        setIsOpen(false);
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Ajustes de Cuenta
                    </button>

                    {userRole === 'admin' && (
                        <>
                            <button className="dropdown-item-btn" onClick={() => {
                                onNavigate('admin-products');
                                setIsOpen(false);
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 7h-9"></path>
                                    <path d="M14 17H5"></path>
                                    <circle cx="17" cy="17" r="3"></circle>
                                    <circle cx="7" cy="7" r="3"></circle>
                                </svg>
                                Productos
                            </button>
                            <button className="dropdown-item-btn" onClick={() => {
                                onNavigate('admin-torta');
                                setIsOpen(false);
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                    <path d="M2 17l10 5 10-5"></path>
                                    <path d="M2 12l10 5 10-5"></path>
                                </svg>
                                Torta del Mes
                            </button>
                        </>
                    )}

                    <div className="dropdown-divider"></div>

                    <button className="dropdown-item-btn logout" onClick={handleLogout}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
