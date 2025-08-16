// API client utilities for Finspeed frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

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
  specs?: Record<string, any>;
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
  parent_id?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CartItem {
  product_id: number;
  qty: number;
  product: Product;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
  count: number;
}

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
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add headers from options if provided
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    // Add authorization header if token exists
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
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
  }): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.category_id) searchParams.set('category_id', params.category_id.toString());

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

  // Category methods
  async getCategories(): Promise<{ categories: Category[]; total: number }> {
    return this.request<{ categories: Category[]; total: number }>('/categories');
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

  // Cart methods
  async getCart(): Promise<Cart> {
    return this.request<Cart>('/cart');
  }

  async addToCart(productId: number, qty: number): Promise<Cart> {
    return this.request<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, qty }),
    });
  }

  async updateCartItem(productId: number, qty: number): Promise<Cart> {
    return this.request<Cart>(`/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ qty }),
    });
  }

  async removeFromCart(productId: number): Promise<Cart> {
    return this.request<Cart>(`/cart/items/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<Cart> {
    return this.request<Cart>('/cart', {
      method: 'DELETE',
    });
  }

  // Order methods
  async getOrders(params?: { page?: number; limit?: number }): Promise<OrdersResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<OrdersResponse>(`/orders${query ? `?${query}` : ''}`);
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
