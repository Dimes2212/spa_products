'use client';

import { useEffect, useMemo } from 'react';
import { useProducts } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const { order, items, filter, setFilter, loadList, loading, error } = useProducts();

  useEffect(() => { void loadList(); }, [loadList]);

  const visible = useMemo(() => {
    const arr = order.map(id => items[id]).filter(Boolean).filter(p => !p!.deleted);
    return filter === 'liked' ? arr.filter(p => p!.liked) : arr;
  }, [order, items, filter]);

  return (
    <div>
      <div className="controls" style={{ marginBottom: 12, display:'flex', gap:8 }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="all">Все</option>
          <option value="liked">Избранное</option>
        </select>
      </div>

      {loading && <div className="badge">Загрузка…</div>}
      {error && <div className="badge" style={{ background:'#ffe8e8' }}>Ошибка: {error}</div>}
      {!loading && !error && visible.length === 0 && <div className="empty">Ничего не найдено</div>}

      <div className="grid">
        {visible.map(p => <Card key={p!.id} id={p!.id} />)}
      </div>
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
        if (target.closest('.icon-btn')) return; // не переходить по клику на иконки
        router.push(`/products/${id}`);
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
            <button
              className={`icon-btn like ${p.liked ? 'active' : ''}`}
              title="Like"
              onClick={() => toggleLike(p.id)}
            >❤</button>
            <button
              className="icon-btn"
              title="Delete"
              onClick={(e) => { e.stopPropagation(); remove(p.id); }}
            >🗑</button>
          </div>
        </div>
      </div>
    </div>
  );
}
