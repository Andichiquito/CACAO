// Tipos para la aplicación Cacao

export interface Category {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  image_url?: string;
  is_available: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  categories?: {
    id: number;
    name: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Profile {
  id: string;
  username?: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: 'customer' | 'admin' | 'staff';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuDataHook {
  categories: Category[];
  products: Product[];
  loading: boolean;
  error: string | null;
  getProductsByCategory: (categoryId: number) => Product[];
  getCategoryById: (categoryId: number) => Category | undefined;
  refetch: () => Promise<void>;
}

export interface CartHook {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: any;
}

export interface SupabaseContextType {
  supabase: any; // Tipo de Supabase client
  user: any; // Tipo de usuario de Supabase
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<AuthResponse>;
  signOut: () => Promise<AuthResponse>;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface NavigationProps {
  onNavigate: (page: 'home' | 'menu' | 'about' | 'settings') => void;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
}

export interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string;
  emoji?: string;
}

export interface CarouselHook {
  currentSlide: number;
  isPaused: boolean;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  pauseCarousel: () => void;
  resumeCarousel: () => void;
}

export interface SmoothScrollHook {
  scrollToSection: (sectionId: string) => void;
}

// Tipos para props de componentes
export interface MenuProps extends NavigationProps {
  onOpenAuth: () => void;
}

export interface HomePageProps extends NavigationProps {
  onOpenAuth: () => void;
}

export interface AboutUsProps extends NavigationProps {
  onOpenAuth: () => void;
}

export interface CarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
}

export interface ImageCarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

export interface SimpleCarouselProps {
  items: CarouselItem[];
  autoPlayInterval?: number;
}

export interface SimpleImageCarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

export interface BaseComponentsProps {
  children: React.ReactNode;
}

// Tipos para eventos
export interface ButtonClickEvent {
  onClick: () => void;
}

export interface FormSubmitEvent {
  onSubmit: (e: React.FormEvent) => void;
}

// Tipos para API responses
export interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

