'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useProducts, type Product } from '@/lib/store';

export default function ProductClient() {
  const sp = useSearchParams();
  const idParam = sp.get('id');
  const id = useMemo(() => (idParam ? Number(idParam) : NaN), [idParam]);

  const cached = useProducts(s => (Number.isFinite(id) ? s.items[id] : undefined));
  const loadOne = useProducts(s => s.loadOne);

  const [product, setProduct] = useState<Product | null>(cached ?? null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setErr('Некорректный идентификатор товара');
      return;
    }
    if (cached) return;
    (async () => {
      try {
        const p = await loadOne(id);
        setProduct(p);
      } catch {
        setErr('Товар не найден');
      }
    })();
  }, [id, cached, loadOne]);

  if (err) {
    return (
      <div>
        <Link href="/products">← Назад к списку</Link>
        <p style={{ marginTop: 12 }}>{err}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Link href="/products">← Назад к списку</Link>
        <p style={{ marginTop: 12 }}>Загрузка…</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/products">← Назад к списку</Link>
      <h2 style={{ marginTop: 12 }}>{product.title}</h2>
      <img
        src={product.thumbnail}
        alt={product.title}
        style={{ width: '100%', maxWidth: 720, borderRadius: 12, margin: '12px 0' }}
      />
      <p><strong>Цена:</strong> ${product.price}</p>
      <p><strong>Категория:</strong> {product.category}</p>
      <p style={{ whiteSpace: 'pre-wrap' }}>{product.description}</p>
    </div>
  );
}
