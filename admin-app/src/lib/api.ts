// API client utilities for Finspeed Admin

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Admin-specific API paths
const ADMIN_PATHS = {
  USERS: '/admin/users',
  PRODUCTS: '/admin/products',
  ORDERS: '/admin/orders',
  CATEGORIES: '/admin/categories',
  DASHBOARD: '/admin/dashboard/stats',
};

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  expires_at: number;
  user: User;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  currency: string;
  sku?: string;
  hsn?: string;
  stock_qty: number;
  category_id?: number;
  specs?: Record<string, string | number | boolean | null | undefined>;
  warranty_months?: number;
  created_at: string;
  updated_at?: string;
  images?: ProductImage[];
  category?: Category;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  alt?: string;
  is_primary: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

// Cart-related interfaces and methods have been removed from the admin API client

export interface ShippingAddress {
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  qty: number;
  price_each: number;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  subtotal: number;
  shipping_fee: number;
  tax_amount: number;
  total: number;
  payment_id?: string;
  shipping_address: ShippingAddress;
  created_at: string;
  items?: OrderItem[];
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('finspeed_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const headers: Record<string, string> = {};
      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }
      const bodyIsFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
      if (options.body && !bodyIsFormData) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers || {}),
        },
      });

      // Handle non-2xx responses
      if (!response.ok) {
        // Try to parse error response as JSON, fallback to text
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          const text = await response.text();
          throw new Error(text || `HTTP ${response.status} ${response.statusText}`);
        }
        
        const errorMessage = errorData?.message || 
                           errorData?.error || 
                           `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      // For 204 No Content responses, return null
      if (response.status === 204) {
        return null as unknown as T;
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error instanceof Error ? error : new Error('Network request failed');
    }
  }

  // Auth methods
  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(response.token);
    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(response.token);
    return response;
  }

  // Product methods
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category_id?: number;
    search?: string;
  }): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.category_id) searchParams.set('category_id', params.category_id.toString());
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return this.request<ProductsResponse>(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(slug: string): Promise<Product> {
    return this.request<Product>(`/products/${slug}`);
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'images' | 'category'>): Promise<Product> {
    return this.request<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(
    id: number,
    product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'images' | 'category'>>
  ): Promise<Product> {
    return this.request<Product>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: number): Promise<{ status: string } | { message: string }> {
    return this.request<{ status: string } | { message: string }>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Product image methods
  async uploadProductImage(
    productId: number,
    file: File | Blob,
    opts?: { alt?: string; is_primary?: boolean }
  ): Promise<{ image: ProductImage }> {
    const form = new FormData();
    form.append('file', file);
    if (opts?.alt) form.append('alt', opts.alt);
    if (typeof opts?.is_primary !== 'undefined') form.append('is_primary', String(!!opts.is_primary));
    return this.request<{ image: ProductImage }>(`${ADMIN_PATHS.PRODUCTS}/${productId}/images`, {
      method: 'POST',
      body: form,
    });
  }

  async deleteProductImage(productId: number, imageId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`${ADMIN_PATHS.PRODUCTS}/${productId}/images/${imageId}`, {
      method: 'DELETE',
    });
  }

  async setPrimaryProductImage(productId: number, imageId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`${ADMIN_PATHS.PRODUCTS}/${productId}/images/${imageId}/primary`, {
      method: 'PUT',
    });
  }

  // Category methods
  async getCategories(params?: { page?: number; limit?: number; search?: string }): Promise<{ categories: Category[]; total: number; page?: number; limit?: number }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return this.request<{ categories: Category[]; total: number; page?: number; limit?: number }>(`/categories${query ? `?${query}` : ''}`);
  }

  async getCategory(slug: string): Promise<Category> {
    return this.request<Category>(`/categories/${slug}`);
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return this.request<Category>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: number, category: Omit<Category, 'id'>): Promise<Category> {
    return this.request<Category>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: number): Promise<{ status: string } | { message: string }> {
    return this.request<{ status: string } | { message: string }>(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin-specific methods
  async getDashboardStats() {
    return this.request<{
      totalProducts: number;
      totalOrders: number;
      totalUsers: number;
      recentOrders: any[];
      revenueStats: any;
    }>(ADMIN_PATHS.DASHBOARD);
  }

  // Order methods
  async getOrders(params?: { page?: number; limit?: number }): Promise<OrdersResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<OrdersResponse>(`${ADMIN_PATHS.ORDERS}${query ? `?${query}` : ''}`);
  }

  async getOrder(id: number): Promise<Order> {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(items: { product_id: number; qty: number }[], shippingAddress: ShippingAddress): Promise<{ order_id: number; total: number }> {
    return this.request<{ order_id: number; total: number }>('/orders', {
      method: 'POST',
      body: JSON.stringify({ items, shipping_address: shippingAddress }),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; database: string }> {
    return this.request<{ status: string; database: string }>('/healthz');
  }

  // Admin User methods
  async getUsers(params?: { page?: number; limit?: number; search?: string }): Promise<UsersResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return this.request<UsersResponse>(`/admin/users${query ? `?${query}` : ''}`);
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/admin/users/${id}`);
  }

  async updateUser(id: number, payload: { email: string; role: string }): Promise<User> {
    return this.request<User>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteUser(id: number): Promise<{ status: string } | { message: string }> {
    return this.request<{ status: string } | { message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('finspeed_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('finspeed_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiClient = new ApiClient();
