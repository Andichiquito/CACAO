
import React, { useState } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useToast } from '../contexts/ToastContext';
import './AuthModal.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signIn, signUp } = useSupabase();
    const { showToast } = useToast();

    if (!isOpen) return null;

    /**
     * Maneja el envío del formulario (Login o Registro).
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isLogin) {
                // Lógica de Inicio de Sesión
                const result = await signIn(email, password);
                if (result.success) {
                    showToast('¡Bienvenido!', 'Has iniciado sesión correctamente.');
                    onClose();
                } else {
                    showToast('Error', result.message || 'Error al iniciar sesión');
                }
            } else {
                // Lógica de Registro
                if (!fullName.trim()) {
                    showToast('Información', 'Por favor ingresa tu nombre completo');
                    setIsLoading(false);
                    return;
                }

                // Validación de formato de teléfono (Específico para Bolivia: 600... o 700...)
                const cleanPhone = phone.replace(/[\s\-()]/g, '');
                if (!/^[67][0-9]{6,7}$/.test(cleanPhone)) {
                    showToast('Teléfono inválido', 'Debe empezar por 6 o 7 y tener 7 a 8 números');
                    setIsLoading(false);
                    return;
                }

                const result = await signUp(email, password, fullName, cleanPhone);
                if (result.success) {
                    showToast('Cuenta creada', result.message || '¡Registro exitoso!');
                    onClose();
                } else {
                    showToast('Error', result.message || 'Error al registrarse');
                }
            }
        } catch (error) {
            showToast('Error', 'Ocurrió un error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
                <button className="auth-close-btn" onClick={onClose} aria-label="Cerrar">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="15" y1="5" x2="5" y2="15"></line>
                        <line x1="5" y1="5" x2="15" y2="15"></line>
                    </svg>
                </button>

                <div className="auth-header">
                    <h2>{isLogin ? '¡Hola de nuevo!' : 'Crea tu cuenta'}</h2>
                    <p>{isLogin ? 'Ingresa para disfrutar de Cacao' : 'Únete a nuestra comunidad del café'}</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label htmlFor="fullName">Nombre Completo</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    placeholder="Juan Pérez"
                                    required={!isLogin}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Teléfono / WhatsApp</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="70012345"
                                    required={!isLogin}
                                    disabled={isLoading}
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            disabled={isLoading}
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                        {isLoading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                    </button>
                </form>

                <div className="auth-switch">
                    {isLogin ? (
                        <>
                            ¿No tienes cuenta?{' '}
                            <button className="auth-switch-btn" onClick={() => setIsLogin(false)}>
                                Regístrate aquí
                            </button>
                        </>
                    ) : (
                        <>
                            ¿Ya tienes cuenta?{' '}
                            <button className="auth-switch-btn" onClick={() => setIsLogin(true)}>
                                Inicia sesión
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
