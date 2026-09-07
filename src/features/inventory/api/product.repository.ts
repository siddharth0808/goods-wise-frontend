import { apiRequest } from '../../../services/api/apiClient';
import type {  Product, UpdateProductRequest } from '../types/product.types';

export function getProducts(): Promise<Product[]> {
  return apiRequest<Product[]>(`/products`);
}

export function createProduct(payload: Product): Promise<Product> {
  return apiRequest<Product>('/products', { method: 'POST', body: payload });
}

export function getProductById(productId: string): Promise<Product> {
  return apiRequest<Product>(`/products/${productId}`);
}

export function updateProduct(productId: string, payload: UpdateProductRequest): Promise<Product> {
  return apiRequest<Product>(`/products/${productId}`, { method: 'PATCH', body: payload });
}

export function deleteProduct(productId: string): Promise<void> {
  return apiRequest<void>(`/products/${productId}`, { method: 'DELETE' });
}