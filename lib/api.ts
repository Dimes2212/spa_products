import type { Product, ProductResponse } from './store'

const clientBase = () => {
    if (typeof window === 'undefined') return '';
    // На GH Pages Next проставит assetPrefix/basePath — берём его
    const prefix = (window as any).__NEXT_DATA__?.assetPrefix || '';
    return prefix;
};

export async function fetchProducts() {
    
    const base =
      process.env.NODE_ENV === 'production'
        ? '/spa_products'
        : '';
    const res = await fetch(`${base}/products.json`);
    if (!res.ok) {
      throw new Error(`Ошибка загрузки: ${res.status}`);
    }
    return res.json();
  }
  

export async function fetchProductById(id: number): Promise<Product> {
    const data = await fetchProducts();
    const p = data.products.find((p: Product) => p.id === id);
    if (!p) {
        throw new Error('Mot found')
    }
    return p;
}