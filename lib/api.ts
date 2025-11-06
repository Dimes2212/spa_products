import type { Product, ProductResponse } from './store'

const clientBase = () => {
    if (typeof window === 'undefined') return '';
    // На GH Pages Next проставит assetPrefix/basePath — берём его
    const prefix = (window as any).__NEXT_DATA__?.assetPrefix || '';
    return prefix;
};

export async function fetchProducts(): Promise<ProductResponse> {
    const res = await fetch(`${clientBase()}/products.json`, {cache: 'no-store'});
    if (!res.ok) {
        throw new Error('Failed to load products');
    }
    return res.json() as Promise<{products: any[]; total: number}>
}

export async function fetchProductById(id: number): Promise<Product> {
    const data = await fetchProducts();
    const p = data.products.find((p: Product) => p.id === id);
    if (!p) {
        throw new Error('Mot found')
    }
    return p;
}