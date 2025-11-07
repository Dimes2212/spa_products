'use client';

import { useEffect, useMemo, useState } from 'react';
import { useProducts } from '@/lib/store';
import { useRouter } from 'next/navigation';

function norm(s: string) {
  return s.toLowerCase();
}

export default function ProductsPage() {
  const {
    order, items, filter, setFilter, loadList, loading, error,
    page, perPage, setPage, setPerPage,
    search, setSearch,
  } = useProducts();

  
  const [localSearch, setLocalSearch] = useState(search);
  useEffect(() => setLocalSearch(search), [search]);
  useEffect(() => {
    const t = setTimeout(() => setSearch(localSearch), 150);
    return () => clearTimeout(t);
  }, [localSearch, setSearch]);

  useEffect(() => { void loadList(); }, [loadList]);

  
  const base = useMemo(() => {
    const arr = order.map(id => items[id]).filter(Boolean).filter(p => !p!.deleted);
    return filter === 'liked' ? arr.filter(p => p!.liked) : arr;
  }, [order, items, filter]);

  
  const filtered = useMemo(() => {
    const q = norm(search);
    if (!q) return base;
    return base.filter(p => {
      const t = norm(p!.title);
      const d = norm(p!.description);
      const c = norm(p!.category);
      return t.includes(q) || d.includes(q) || c.includes(q);
    });
  }, [base, search]);

  
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const visible = filtered.slice(start, start + perPage);

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [currentPage, page, setPage]);

  return (
    <div>
      <div className="controls" style={{ marginBottom: 12, display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
        <input
          placeholder="Поиск по названию, описанию, категории…"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          style={{ flex: '1 1 280px', padding:'8px 10px', border:'1px solid #ddd', borderRadius:8 }}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="all">Все</option>
          <option value="liked">Избранное</option>
        </select>

        <span style={{ opacity:.7 }}>На странице:</span>
        <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
          <option value={6}>6</option>
          <option value={9}>9</option>
          <option value={12}>12</option>
          <option value={18}>18</option>
        </select>

        <span style={{ marginLeft: 'auto', opacity:.7 }}>
          Всего: {total} • Стр. {currentPage}/{totalPages}
        </span>
      </div>

      {loading && <div className="badge">Загрузка…</div>}
      {error && <div className="badge" style={{ background:'#ffe8e8' }}>Ошибка: {error}</div>}
      {!loading && !error && visible.length === 0 && <div className="empty">Ничего не найдено</div>}

      <div className="grid">
        {visible.map(p => <Card key={p!.id} id={p!.id} />)}
      </div>

      {totalPages > 1 && (
        <div className="pagination" style={{ display:'flex', gap:8, justifyContent:'center', marginTop:16 }}>
          <button className="icon-btn" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>← Назад</button>
          <span className="badge">Стр. {currentPage} из {totalPages}</span>
          <button className="icon-btn" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>Вперёд →</button>
        </div>
      )}
    </div>
  );
}

function Card({ id }: { id: number }) {
  const p = useProducts(s => s.items[id])!;
  const toggleLike = useProducts(s => s.toggleLike);
  const remove = useProducts(s => s.remove);
  const router = useRouter();

  return (
    <div
      className="card"
      role="button"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.icon-btn')) return;
        router.push(`/product?id=${id}`);
      }}
    >
      <img src={p.thumbnail} alt={p.title} />
      <div className="card-body">
        <div className="row">
          <strong className="line-clamp" style={{ maxWidth: '70%' }}>{p.title}</strong>
          <span className="badge">${p.price}</span>
        </div>
        <div className="line-clamp">{p.description}</div>
        <div className="row">
          <span className="badge">{p.category}</span>
          <div className="row" style={{ gap: 4 }}>
            <button className={`icon-btn like ${p.liked ? 'active' : ''}`} title="Like" onClick={() => toggleLike(p.id)}>❤</button>
            <button className="icon-btn" title="Delete" onClick={(e) => { e.stopPropagation(); remove(p.id); }}>🗑</button>
          </div>
        </div>
      </div>
    </div>
  );
}
