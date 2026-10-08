import React, { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useToast } from '../contexts/ToastContext';
import { NavigationProps, Product, Category } from '../types';
import './AdminProducts.css';

interface CategoryFormData {
    name: string;
    description: string;
    icon_emoji: string;
    sort_order: number;
    is_active: boolean;
}

const emptyCategoryForm: CategoryFormData = {
    name: '',
    description: '',
    icon_emoji: '',
    sort_order: 0,
    is_active: true,
};

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    category_id: number;
    subcategory: string;
    stock_quantity: number;
    is_available: boolean;
    image_url: string;
    sort_order: number;
}

const emptyForm: ProductFormData = {
    name: '',
    description: '',
    price: 0,
    category_id: 0,
    subcategory: '',
    stock_quantity: 0,
    is_available: true,
    image_url: '',
    sort_order: 0,
};

const AdminProducts: React.FC<NavigationProps> = ({ onNavigate }) => {
    const { user, supabase } = useSupabase();
    const { showToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [roleLoading, setRoleLoading] = useState(true);

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | 'all'>('all');

    // CRUD state - Products
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<ProductFormData>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeactivatingStock, setIsDeactivatingStock] = useState(false);

    // CRUD state - Categories
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryForm, setCategoryForm] = useState<CategoryFormData>(emptyCategoryForm);
    const [isSavingCategory, setIsSavingCategory] = useState(false);
    const [showDeleteCategoryConfirm, setShowDeleteCategoryConfirm] = useState(false);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
    const [isDeletingCategory, setIsDeletingCategory] = useState(false);

    // CRUD state - Subcategories
    const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [isSavingSubcategory, setIsSavingSubcategory] = useState(false);
    const [pendingSubcategories, setPendingSubcategories] = useState<string[]>([]);

    // Verificar rol del usuario
    useEffect(() => {
        const checkRole = async () => {
            if (!user) {
                setRoleLoading(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (error) throw error;
                setUserRole(data?.role || 'customer');
            } catch (err: any) {
                console.error('Error checking role:', err.message);
                setUserRole('customer');
            } finally {
                setRoleLoading(false);
            }
        };
        checkRole();
    }, [user, supabase]);

    // Cargar datos
    const fetchData = async () => {
        if (!user || userRole !== 'admin') return;
        try {
            setIsLoading(true);
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('*')
                .order('sort_order', { ascending: true });
            if (catError) throw catError;

            const { data: prodData, error: prodError } = await supabase
                .from('products')
                .select(`*, categories ( id, name )`)
                .order('sort_order', { ascending: true });
            if (prodError) throw prodError;

            setCategories(catData || []);
            setProducts(prodData || []);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching admin data:', err.message);
            setError('No se pudieron cargar los productos.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, supabase, userRole]);

    // ─── Category CRUD Handlers ───

    const openCreateCategoryModal = () => {
        setEditingCategory(null);
        const nextOrder = categories.length > 0 
            ? Math.max(...categories.map(c => c.sort_order || 0), 0) + 1 
            : 1;
        setCategoryForm({ ...emptyCategoryForm, sort_order: nextOrder });
        setShowCategoryModal(true);
    };

    const handleMoveCategoryOrder = async (cat: Category, direction: 'up' | 'down') => {
        const sortedCats = [...categories].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        const currentIndex = sortedCats.findIndex(c => c.id === cat.id);
        if (currentIndex === -1) return;

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= sortedCats.length) return;

        const targetCat = sortedCats[targetIndex];

        let currentOrder = cat.sort_order ?? (currentIndex + 1);
        let targetOrder = targetCat.sort_order ?? (targetIndex + 1);

        if (currentOrder === targetOrder) {
            currentOrder = currentIndex + 1;
            targetOrder = targetIndex + 1;
        }

        try {
            const { error: err1 } = await supabase
                .from('categories')
                .update({ sort_order: targetOrder })
                .eq('id', cat.id);
            if (err1) throw err1;

            const { error: err2 } = await supabase
                .from('categories')
                .update({ sort_order: currentOrder })
                .eq('id', targetCat.id);
            if (err2) throw err2;

            showToast('Éxito', `Orden actualizado.`);
            await fetchData();
        } catch (err: any) {
            console.error('Error reordering categories:', err.message);
            showToast('Error', err.message || 'No se pudo reordenar la categoría.');
        }
    };

    const openEditCategoryModal = (cat: Category) => {
        setEditingCategory(cat);
        setCategoryForm({
            name: cat.name,
            description: cat.description || '',
            icon_emoji: cat.icon_emoji || '',
            sort_order: cat.sort_order,
            is_active: cat.is_active,
        });
        setShowCategoryModal(true);
    };

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
        setEditingCategory(null);
        setCategoryForm(emptyCategoryForm);
    };

    const handleCategoryFormChange = (field: keyof CategoryFormData, value: any) => {
        setCategoryForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryForm.name.trim()) {
            showToast('Error', 'El nombre de la categoría es obligatorio.');
            return;
        }
        setIsSavingCategory(true);
        try {
            if (editingCategory) {
                const { error } = await supabase
                    .from('categories')
                    .update({
                        name: categoryForm.name.trim(),
                        description: categoryForm.description.trim() || null,
                        icon_emoji: categoryForm.icon_emoji.trim() || null,
                        sort_order: categoryForm.sort_order,
                        is_active: categoryForm.is_active,
                    })
                    .eq('id', editingCategory.id);
                if (error) throw error;
                showToast('Éxito', `Categoría "${categoryForm.name}" actualizada.`);
            } else {
                const { error } = await supabase
                    .from('categories')
                    .insert([{
                        name: categoryForm.name.trim(),
                        description: categoryForm.description.trim() || null,
                        icon_emoji: categoryForm.icon_emoji.trim() || null,
                        sort_order: categoryForm.sort_order,
                        is_active: categoryForm.is_active,
                        created_at: new Date().toISOString(),
                    }]);
                if (error) throw error;
                showToast('Éxito', `Categoría "${categoryForm.name}" creada.`);
            }
            closeCategoryModal();
            await fetchData();
        } catch (err: any) {
            console.error('Error saving category:', err.message);
            showToast('Error', err.message || 'No se pudo guardar la categoría.');
        } finally {
            setIsSavingCategory(false);
        }
    };

    const openDeleteCategoryConfirm = (cat: Category) => {
        setDeletingCategory(cat);
        setShowDeleteCategoryConfirm(true);
    };

    const handleDeleteCategory = async () => {
        if (!deletingCategory) return;
        setIsDeletingCategory(true);
        try {
            const hasProducts = products.some(p => p.category_id === deletingCategory.id);
            if (hasProducts) {
                showToast('Error', 'No puedes eliminar una categoría que tiene productos asociados.');
                return;
            }
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', deletingCategory.id);
            if (error) throw error;
            showToast('Eliminado', `Categoría "${deletingCategory.name}" eliminada.`);
            setShowDeleteCategoryConfirm(false);
            setDeletingCategory(null);
            await fetchData();
        } catch (err: any) {
            console.error('Error deleting category:', err.message);
            showToast('Error', err.message || 'No se pudo eliminar la categoría.');
        } finally {
            setIsDeletingCategory(false);
        }
    };

    // ─── Subcategory Handlers ───

    const openSubcategoryModal = () => {
        setNewSubcategoryName('');
        setShowSubcategoryModal(true);
    };

    const closeSubcategoryModal = () => {
        setShowSubcategoryModal(false);
        setNewSubcategoryName('');
    };

    const handleAddSubcategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newSubcategoryName.trim();
        if (!trimmed) {
            showToast('Error', 'El nombre de la subcategoría es obligatorio.');
            return;
        }
        // Verificar si ya existe (en productos o pendientes)
        const existingFromProducts = products.map(p => p.subcategory).filter(Boolean);
        const allExisting = Array.from(new Set([...existingFromProducts, ...pendingSubcategories]));
        if (allExisting.includes(trimmed)) {
            showToast('Error', 'Esa subcategoría ya existe.');
            return;
        }
        // Guardar en estado para que aparezca en el selector del formulario de producto
        setPendingSubcategories(prev => [...prev, trimmed].sort());
        showToast('Éxito', `Subcategoría "${trimmed}" agregada. Ya puedes asignarla a productos.`);
        setNewSubcategoryName('');
    };

    const handleDeleteSubcategory = async (sub: string) => {
        const confirm = window.confirm(`¿Eliminar la subcategoría "${sub}"? Esto la quitará de todos los productos que la tienen asignada.`);
        if (!confirm) return;
        try {
            const { error } = await supabase
                .from('products')
                .update({ subcategory: null, updated_at: new Date().toISOString() })
                .eq('subcategory', sub);
            if (error) throw error;
            showToast('Éxito', `Subcategoría "${sub}" eliminada de todos los productos.`);
            await fetchData();
        } catch (err: any) {
            console.error('Error deleting subcategory:', err.message);
            showToast('Error', err.message || 'No se pudo eliminar la subcategoría.');
        }
    };

    // ─── CRUD Handlers ───

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({
            ...emptyForm,
            category_id: categories.length > 0 ? categories[0].id : 0,
        });
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            category_id: product.category_id,
            subcategory: product.subcategory || '',
            stock_quantity: product.stock_quantity,
            is_available: product.is_available,
            image_url: product.image_url || '',
            sort_order: product.sort_order,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setFormData(emptyForm);
    };

    const handleFormChange = (field: keyof ProductFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            showToast('Error', 'El nombre es obligatorio.');
            return;
        }
        if (formData.price < 0) {
            showToast('Error', 'El precio no puede ser negativo.');
            return;
        }
        if (formData.category_id === 0) {
            showToast('Error', 'Selecciona una categoría.');
            return;
        }

        setIsSaving(true);
        try {
            if (editingProduct) {
                // Actualizar: incluimos nombre, precio, descripción y subcategoría
                const updatePayload = {
                    name: formData.name.trim(),
                    description: (formData.description || '').trim() || null,
                    price: formData.price,
                    subcategory: (formData.subcategory || '').trim() || null,
                    updated_at: new Date().toISOString(),
                };

                const { data, error } = await supabase
                    .from('products')
                    .update(updatePayload)
                    .eq('id', editingProduct.id)
                    .select();
                if (error) throw error;
                if (!data || data.length === 0) {
                    throw new Error("El producto no se actualizó (posible problema de permisos).");
                }
                showToast('Éxito', `"${formData.name}" actualizado correctamente.`);
            } else {
                // Crear: Enviamos todos los campos necesarios
                const createPayload = {
                    name: formData.name.trim(),
                    description: (formData.description || '').trim() || null,
                    price: formData.price,
                    category_id: formData.category_id,
                    subcategory: (formData.subcategory || '').trim() || null,
                    stock_quantity: formData.stock_quantity,
                    is_available: formData.is_available,
                    image_url: (formData.image_url || '').trim() || null,
                    sort_order: formData.sort_order,
                    updated_at: new Date().toISOString(),
                    created_at: new Date().toISOString()
                };

                const { data, error } = await supabase
                    .from('products')
                    .insert([createPayload])
                    .select();
                if (error) throw error;
                if (!data || data.length === 0) {
                    throw new Error("El producto no se creó (posible problema de permisos).");
                }
                showToast('Éxito', `"${formData.name}" creado correctamente.`);
            }

            closeModal();
            await fetchData();
        } catch (err: any) {
            console.error('Error saving product:', err.message);
            showToast('Error', err.message || 'No se pudo guardar el producto.');
        } finally {
            setIsSaving(false);
        }
    };

    const openDeleteConfirm = (product: Product) => {
        setDeletingProduct(product);
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        if (!deletingProduct) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', deletingProduct.id);
            if (error) throw error;
            showToast('Eliminado', `"${deletingProduct.name}" fue eliminado.`);
            setShowDeleteConfirm(false);
            setDeletingProduct(null);
            await fetchData();
        } catch (err: any) {
            console.error('Error deleting product:', err.message);
            showToast('Error', err.message || 'No se pudo eliminar el producto.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSetAvailability = async (product: Product, isAvailable: boolean) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ 
                    is_available: isAvailable, 
                    updated_at: new Date().toISOString() 
                })
                .eq('id', product.id);

            if (error) throw error;
            showToast('Éxito', `"${product.name}" ahora está ${isAvailable ? 'visible' : 'oculto'}.`);
            await fetchData();
        } catch (err: any) {
            console.error('Error updating availability:', err.message);
            showToast('Error', err.message || 'No se pudo actualizar la disponibilidad.');
        }
    };

    const handleDeactivateNoStock = async () => {
        const outOfStockProducts = products.filter(p => p.stock_quantity <= 0 && p.is_available);
        if (outOfStockProducts.length === 0) {
            showToast('Información', 'No hay productos disponibles sin stock para desactivar.');
            return;
        }

        const confirmAction = window.confirm(
            `¿Estás seguro de que deseas desactivar (ocultar) los ${outOfStockProducts.length} productos que no tienen stock actualmente?`
        );
        if (!confirmAction) return;

        setIsDeactivatingStock(true);
        try {
            const { error } = await supabase
                .from('products')
                .update({ 
                    is_available: false, 
                    updated_at: new Date().toISOString() 
                })
                .in('id', outOfStockProducts.map(p => p.id));

            if (error) throw error;
            showToast('Éxito', `${outOfStockProducts.length} productos sin stock fueron desactivados.`);
            await fetchData();
        } catch (err: any) {
            console.error('Error deactivating stock:', err.message);
            showToast('Error', err.message || 'No se pudieron desactivar los productos.');
        } finally {
            setIsDeactivatingStock(false);
        }
    };

    // ─── Access control ───

    if (!user && !roleLoading) {
        return (
            <div className="access-denied">
                <div className="access-denied-icon">🔒</div>
                <h2>Acceso Restringido</h2>
                <p>Debes iniciar sesión para acceder a esta sección.</p>
                <button className="access-denied-btn" onClick={() => onNavigate('home')}>
                    Volver al Inicio
                </button>
            </div>
        );
    }

    if (roleLoading) {
        return (
            <div className="admin-products-container">
                <div className="admin-loading">Verificando permisos...</div>
            </div>
        );
    }

    if (userRole !== 'admin') {
        return (
            <div className="access-denied">
                <div className="access-denied-icon">⛔</div>
                <h2>Sin Permisos</h2>
                <p>Solo el administrador puede ver esta sección.</p>
                <button className="access-denied-btn" onClick={() => onNavigate('home')}>
                    Volver al Inicio
                </button>
            </div>
        );
    }

    // ─── Filter logic ───

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
        const matchesSubcategory = selectedSubcategory === 'all' || p.subcategory === selectedSubcategory;
        return matchesSearch && matchesCategory && matchesSubcategory && p.name.toLowerCase() !== 'torta del mes';
    });

    const availableSubcategories = Array.from(new Set(
        products
            .filter(p => selectedCategory === 'all' || p.category_id === selectedCategory)
            .map(p => p.subcategory)
            .filter((s): s is string => Boolean(s))
    ));

    // Agrupar por categoría
    const groupedProducts: { category: Category; products: Product[] }[] = [];
    if (selectedCategory === 'all') {
        categories.forEach(cat => {
            const catProducts = filteredProducts.filter(p => p.category_id === cat.id);
            if (catProducts.length > 0) {
                groupedProducts.push({ category: cat, products: catProducts });
            }
        });
    } else {
        const cat = categories.find(c => c.id === selectedCategory);
        if (cat) {
            groupedProducts.push({ category: cat, products: filteredProducts });
        }
    }

    const getSubcategoryGroups = (prods: Product[]): { subcategory: string | null; products: Product[] }[] => {
        const groups: Map<string | null, Product[]> = new Map();
        prods.forEach(p => {
            const sub = p.subcategory || null;
            if (!groups.has(sub)) groups.set(sub, []);
            groups.get(sub)!.push(p);
        });
        return Array.from(groups.entries()).map(([subcategory, prods]) => ({ subcategory, products: prods }));
    };

    const totalProducts = products.length;
    const availableCount = products.filter(p => p.is_available).length;
    const unavailableCount = totalProducts - availableCount;

    // Subcategorías existentes para el formulario (productos + pendientes pre-añadidas)
    const allSubcategories = Array.from(new Set([
        ...products.map(p => p.subcategory).filter((s): s is string => Boolean(s)),
        ...pendingSubcategories,
    ])).sort();

    return (
        <div className="admin-products-container">
            <header className="admin-products-header">
                <div className="admin-header-top">
                    <button
                        className="admin-back-btn"
                        onClick={() => onNavigate('home')}
                        aria-label="Volver al inicio"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <h1 className="admin-products-title">PRODUCTOS</h1>
                </div>
                <div className="admin-header-actions">
                    <button 
                        className="deactivate-stock-btn" 
                        onClick={handleDeactivateNoStock}
                        disabled={isDeactivatingStock}
                        title="Desactivar todos los productos sin stock"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        {isDeactivatingStock ? 'Desactivando...' : 'Ocultar sin Stock'}
                    </button>
                    <button className="manage-categories-btn" onClick={openCreateCategoryModal} title="Gestionar categorías">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        Categorías
                    </button>
                    <button className="manage-subcategories-btn" onClick={openSubcategoryModal} title="Gestionar subcategorías">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                        Subcategorías
                    </button>
                    <button className="add-product-btn" onClick={openCreateModal}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nuevo Producto
                    </button>
                </div>
            </header>

            {/* Stats */}
            <div className="admin-stats">
                <div className="stat-card">
                    <span className="stat-number">{totalProducts}</span>
                    <span className="stat-label">Total</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{availableCount}</span>
                    <span className="stat-label">Disponibles</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{unavailableCount}</span>
                    <span className="stat-label">No Disponibles</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{categories.length}</span>
                    <span className="stat-label">Categorías</span>
                </div>
            </div>

            {/* Filtros */}
            <div className="admin-filters">
                <input
                    type="text"
                    className="filter-search"
                    placeholder="🔍 Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="filter-select"
                    value={selectedCategory === 'all' ? 'all' : selectedCategory}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSelectedCategory(val === 'all' ? 'all' : Number(val));
                        setSelectedSubcategory('all');
                    }}
                >
                    <option value="all">Todas las categorías</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.icon_emoji ? `${cat.icon_emoji} ` : ''}{cat.name}
                        </option>
                    ))}
                </select>
                {availableSubcategories.length > 0 && (
                    <select
                        className="filter-select"
                        value={selectedSubcategory}
                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                    >
                        <option value="all">Todas las subcategorías</option>
                        {availableSubcategories.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Contenido */}
            <div className="admin-products-content">
                {isLoading ? (
                    <div className="admin-loading">Cargando productos...</div>
                ) : error ? (
                    <div className="admin-error">{error}</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="admin-empty">
                        <div className="admin-empty-icon">📦</div>
                        <p>No se encontraron productos con esos filtros.</p>
                    </div>
                ) : (
                    groupedProducts.map(({ category, products: catProducts }) => (
                        <div key={category.id} className="category-group">
                            <div className="category-group-header">
                                {category.icon_emoji && (
                                    <span className="category-emoji">{category.icon_emoji}</span>
                                )}
                                <h3 className="category-group-name">{category.name}</h3>
                                <span className="category-count">{catProducts.length} productos</span>
                            </div>

                            {getSubcategoryGroups(catProducts).map(({ subcategory, products: subProducts }) => (
                                <div key={subcategory || 'sin-sub'} className="subcategory-group">
                                    {subcategory && (
                                        <p className="subcategory-label">{subcategory}</p>
                                    )}
                                    <table className="products-table">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Precio</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subProducts.map(product => (
                                                <tr key={product.id}>
                                                    <td>
                                                        <div className="product-name-cell">
                                                            {product.image_url ? (
                                                                <img src={product.image_url} alt={product.name} className="product-thumb" />
                                                            ) : (
                                                                <div className="product-thumb-placeholder">📷</div>
                                                            )}
                                                            {product.name}
                                                        </div>
                                                    </td>
                                                    <td className="product-price">Bs. {product.price.toFixed(2)}</td>
                                                    <td>
                                                        <span className={`product-status ${product.is_available ? 'status-available' : 'status-unavailable'}`}>
                                                            {product.is_available ? 'Disponible' : 'No disponible'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="product-actions">
                                                            <select
                                                                className={`action-select-status ${product.is_available ? 'status-visible' : 'status-hidden'}`}
                                                                value={product.is_available ? 'visible' : 'hidden'}
                                                                onChange={(e) => handleSetAvailability(product, e.target.value === 'visible')}
                                                                title="Cambiar visibilidad"
                                                            >
                                                                <option value="visible">No ocultar</option>
                                                                <option value="hidden">Ocultar</option>
                                                            </select>
                                                            <button
                                                                className="action-btn edit"
                                                                onClick={() => openEditModal(product)}
                                                                title="Editar"
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                className="action-btn delete"
                                                                onClick={() => openDeleteConfirm(product)}
                                                                title="Eliminar"
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            {/* ─── Modal Crear/Editar ─── */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                            <button className="modal-close-btn" onClick={closeModal}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <form className="product-form" onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Nombre *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleFormChange('name', e.target.value)}
                                    placeholder="Nombre del producto"
                                    required
                                />
                            </div>

                            {editingProduct ? (
                                /* ─── Modo Editar: solo nombre, precio, descripción ─── */
                                <>
                                    <div className="form-group">
                                        <label>Precio (Bs.) *</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => handleFormChange('price', parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Descripción</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleFormChange('description', e.target.value)}
                                            placeholder="Descripción del producto (opcional)"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Subcategoría</label>
                                        <select
                                            value={formData.subcategory}
                                            onChange={(e) => handleFormChange('subcategory', e.target.value)}
                                        >
                                            <option value="">Sin subcategoría</option>
                                            {allSubcategories.map(sub => (
                                                <option key={sub} value={sub}>{sub}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                /* ─── Modo Crear: nombre, precio, descripción, categoría, subcategoría, imagen ─── */
                                <>
                                    <div className="form-group">
                                        <label>Precio (Bs.) *</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => handleFormChange('price', parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Descripción</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleFormChange('description', e.target.value)}
                                            placeholder="Descripción del producto (opcional)"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Categoría *</label>
                                            <select
                                                value={formData.category_id}
                                                onChange={(e) => handleFormChange('category_id', Number(e.target.value))}
                                                required
                                            >
                                                <option value={0} disabled>Seleccionar...</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.icon_emoji ? `${cat.icon_emoji} ` : ''}{cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Subcategoría</label>
                                            <select
                                                value={formData.subcategory}
                                                onChange={(e) => handleFormChange('subcategory', e.target.value)}
                                            >
                                                <option value="">Sin subcategoría</option>
                                                {allSubcategories.map(sub => (
                                                    <option key={sub} value={sub}>{sub}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                </>
                            )}

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-save" disabled={isSaving}>
                                    {isSaving ? 'Guardando...' : editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── Modal Confirmar Eliminación Producto ─── */}
            {showDeleteConfirm && deletingProduct && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-confirm-content">
                            <div className="delete-confirm-icon">🗑️</div>
                            <h3>¿Eliminar producto?</h3>
                            <p>Estás a punto de eliminar:</p>
                            <p className="delete-product-name">"{deletingProduct.name}"</p>
                            <p>Esta acción no se puede deshacer.</p>
                            <div className="delete-confirm-actions">
                                <button
                                    className="btn-cancel"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn-delete-confirm"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Modal Crear/Editar Categoría ─── */}
            {showCategoryModal && (
                <div className="modal-overlay" onClick={closeCategoryModal}>
                    <div className="modal-content modal-categories" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h2>
                            <button className="modal-close-btn" onClick={closeCategoryModal}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Lista de categorías existentes */}
                        {!editingCategory && (
                            <div className="categories-list-section">
                                <p className="categories-list-title">Categorías existentes</p>
                                {categories.length === 0 ? (
                                    <p className="categories-empty">No hay categorías aún.</p>
                                ) : (
                                    <div className="categories-list">
                                        {categories.map((cat, index) => (
                                            <div key={cat.id} className="category-list-item">
                                                <span className="category-list-order" title="Posición en el menú">#{cat.sort_order ?? (index + 1)}</span>
                                                <span className="category-list-emoji">{cat.icon_emoji || '📁'}</span>
                                                <span className="category-list-name">{cat.name}</span>
                                                <span className={`category-list-status ${cat.is_active ? 'active' : 'inactive'}`}>
                                                    {cat.is_active ? 'Activa' : 'Inactiva'}
                                                </span>
                                                <div className="category-list-actions">
                                                    <button
                                                        className="action-btn reorder"
                                                        onClick={() => handleMoveCategoryOrder(cat, 'up')}
                                                        disabled={index === 0}
                                                        title="Mover arriba"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="18 15 12 9 6 15"></polyline>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="action-btn reorder"
                                                        onClick={() => handleMoveCategoryOrder(cat, 'down')}
                                                        disabled={index === categories.length - 1}
                                                        title="Mover abajo"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="6 9 12 15 18 9"></polyline>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => openEditCategoryModal(cat)}
                                                        title="Editar"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => openDeleteCategoryConfirm(cat)}
                                                        title="Eliminar"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="categories-list-divider"></div>
                            </div>
                        )}

                        <form className="product-form" onSubmit={handleSaveCategory}>
                            <p className="categories-form-subtitle">
                                {editingCategory ? `Editando: ${editingCategory.name}` : 'Crear nueva categoría'}
                            </p>
                            <div className="form-row">
                                <div className="form-group" style={{ flex: '0 0 80px' }}>
                                    <label>Emoji</label>
                                    <input
                                        type="text"
                                        value={categoryForm.icon_emoji}
                                        onChange={(e) => handleCategoryFormChange('icon_emoji', e.target.value)}
                                        placeholder="☕"
                                        maxLength={4}
                                        style={{ textAlign: 'center', fontSize: '1.5rem' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nombre *</label>
                                    <input
                                        type="text"
                                        value={categoryForm.name}
                                        onChange={(e) => handleCategoryFormChange('name', e.target.value)}
                                        placeholder="Ej: Bebidas de Autor"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    value={categoryForm.description}
                                    onChange={(e) => handleCategoryFormChange('description', e.target.value)}
                                    placeholder="Descripción de la categoría (opcional)"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Orden (Posición)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={categoryForm.sort_order}
                                        onChange={(e) => handleCategoryFormChange('sort_order', parseInt(e.target.value) || 1)}
                                        placeholder="1"
                                    />
                                </div>
                                <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                                    <label>Estado</label>
                                    <select
                                        value={categoryForm.is_active ? 'active' : 'inactive'}
                                        onChange={(e) => handleCategoryFormChange('is_active', e.target.value === 'active')}
                                    >
                                        <option value="active">Activa</option>
                                        <option value="inactive">Inactiva</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={closeCategoryModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-save" disabled={isSavingCategory}>
                                    {isSavingCategory ? 'Guardando...' : editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── Modal Confirmar Eliminación Categoría ─── */}
            {showDeleteCategoryConfirm && deletingCategory && (
                <div className="modal-overlay" onClick={() => setShowDeleteCategoryConfirm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-confirm-content">
                            <div className="delete-confirm-icon">🗂️</div>
                            <h3>¿Eliminar categoría?</h3>
                            <p>Estás a punto de eliminar:</p>
                            <p className="delete-product-name">
                                {deletingCategory.icon_emoji} {deletingCategory.name}
                            </p>
                            {products.some(p => p.category_id === deletingCategory.id) ? (
                                <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: 8 }}>
                                    ⚠️ Esta categoría tiene productos. Muévalos primero.
                                </p>
                            ) : (
                                <p>Esta acción no se puede deshacer.</p>
                            )}
                            <div className="delete-confirm-actions">
                                <button className="btn-cancel" onClick={() => setShowDeleteCategoryConfirm(false)}>
                                    Cancelar
                                </button>
                                <button
                                    className="btn-delete-confirm"
                                    onClick={handleDeleteCategory}
                                    disabled={isDeletingCategory || products.some(p => p.category_id === deletingCategory.id)}
                                >
                                    {isDeletingCategory ? 'Eliminando...' : 'Sí, Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Modal Gestión Subcategorías ─── */}
            {showSubcategoryModal && (
                <div className="modal-overlay" onClick={closeSubcategoryModal}>
                    <div className="modal-content modal-categories" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Subcategorías</h2>
                            <button className="modal-close-btn" onClick={closeSubcategoryModal}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <div className="categories-list-section">
                            <p className="categories-list-title">Subcategorías existentes</p>
                            {allSubcategories.length === 0 ? (
                                <p className="categories-empty">No hay subcategorías aún. Se crean al asignarlas a un producto.</p>
                            ) : (
                                <div className="categories-list">
                                    {allSubcategories.map(sub => {
                                        const count = products.filter(p => p.subcategory === sub).length;
                                        return (
                                            <div key={sub} className="category-list-item">
                                                <span className="category-list-emoji">📂</span>
                                                <span className="category-list-name">{sub}</span>
                                                <span className="category-list-count">{count} producto{count !== 1 ? 's' : ''}</span>
                                                <div className="category-list-actions">
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => handleDeleteSubcategory(sub)}
                                                        title="Eliminar subcategoría"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <div className="categories-list-divider"></div>
                        </div>

                        <form className="product-form" onSubmit={handleAddSubcategory}>
                            <p className="categories-form-subtitle">Agregar nueva subcategoría</p>
                            <div className="form-group">
                                <label>Nombre *</label>
                                <input
                                    type="text"
                                    value={newSubcategoryName}
                                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                                    placeholder="Ej: Matcha Lovers"
                                    required
                                />
                            </div>
                            <p className="subcategory-hint">
                                💡 Las subcategorías se asocian a productos al crearlos o editarlos. Al agregar una aquí, quedará disponible en el selector de subcategorías del formulario de producto.
                            </p>
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={closeSubcategoryModal}>
                                    Cerrar
                                </button>
                                <button type="submit" className="btn-save" disabled={isSavingSubcategory}>
                                    {isSavingSubcategory ? 'Agregando...' : 'Agregar Subcategoría'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
