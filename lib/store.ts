'use client'
import { create } from 'zustand'
import { fetchProducts, fetchProductById } from './api'


export type Product = {
  id: number
  title: string
  description: string
  price: number
  category: string
  thumbnail: string
  liked?: boolean
  deleted?: boolean
  local?: boolean
}

type Filter = 'all' | 'liked'

type State = {
  items: Record<number, Product>
  order: number[]
  filter: Filter
  loading: boolean
  error?: string
  page: number            
  perPage: number 
  search: string          
}

type Actions = {
  setFilter: (f: Filter) => void
  setPage: (p: number) => void          
  setPerPage: (n: number) => void       
  loadList: () => Promise<void>
  loadOne: (id: number) => Promise<Product | null>
  toggleLike: (id: number) => void
  remove: (id: number) => void
  createLocal: (p: Omit<Product,'id'>) => number
  setSearch: (q: string) => void  
}


export const useProducts = create<State & Actions>((set, get) => ({
  items: {}, 
  order: [], 
  filter: 'all', 
  loading: false,
  page: 1,
  perPage: 9,
  search: '',

  setFilter(f) {
    set({ filter: f, page: 1 });
  },

  setPage(p) {
    set({ page: Math.max(1, Math.floor(p)) });
  },

  setPerPage(n) {
    const per = Math.max(1, Math.floor(n));
    set({ perPage: per, page: 1 }); 
  },

  setSearch(q) {
    const query = q.trim();
    set({ search: query, page: 1 }); 
  },

  async loadList() {
    set({ loading: true, error: undefined })
    try {
      const data = await fetchProducts()
      const next = { ...get().items }
      const apiIds: number[] = []

      for (const r of data.products) {
        const id = r.id
        apiIds.push(id)
        next[id] = {
          id,
          title: r.title,
          description: r.description,
          price: r.price,
          category: r.category,
          thumbnail: r.thumbnail,
          liked: next[id]?.liked ?? false,
          deleted: next[id]?.deleted ?? false,
          local: next[id]?.local ?? false,
        }
      }

      const localIds = Object.values(next)
        .filter(p => p.local && !p.deleted)
        .map(p => p.id)

      set({ items: next, order: [...localIds, ...apiIds], loading: false })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Load error'
      set({ error: msg, loading: false })
    }
  },

  async loadOne(id) {
    const cached = get().items[id]
    if (cached && !cached.deleted) return cached

    const r = await fetchProductById(id);
    const prod: Product = {
      id: r.id,
      title: r.title,
      description: r.description,
      price: r.price,
      category: r.category,
      thumbnail: r.thumbnail,
      liked: false,
      deleted: false,
      local: r.local ?? false,
    }

    set({items: {...get().items, [id]: prod}})
    return prod;
  },

  toggleLike(id) {
    const items = { ...get().items }
    const it = items[id]
    if (!it) return
    items[id] = { ...it, liked: !it.liked }
    set({ items })
  },
  
  remove(id) {
    const items = { ...get().items }
    const it = items[id]
    if (!it) return
    items[id] = { ...it, deleted: true, liked: false }
    set({ items, order: get().order.filter(x => x !== id) })
  },

  createLocal(p) {
    const id = Math.floor(100000 + Math.random() * 900000)
    const prod: Product = { ...p, id, local: true, liked: false, deleted: false }
    const items = { ...get().items, [id]: prod }
    set({ items, order: [id, ...get().order] })
    return id
  },
}))

export interface ProductResponse {
  products: Product[]
  total: number
}

// setFilter: ()=>{},
  // loadList: async ()=>{},
  // loadOne: async ()=> null,
  // toggleLike: ()=>{},
  // remove: ()=>{},
  // createLocal: ()=>0,

  

  