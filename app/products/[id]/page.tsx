'use client';

import { useEffect, useState } from 'react';
import { useProducts, type Product } from '@/lib/store';
import Link from 'next/link';

type Props = { params: { id: string } };

export default function ProductDetail({ params }: Props) {
  const id = Number(params.id);
  const cached = useProducts(s => s.items[id]);
  const loadOne = useProducts(s => s.loadOne);
  const [product, setProduct] = useState<Product | null>(cached ?? null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (cached) return;
    (async () => {
      try {
        const p = await loadOne(id);
        setProduct(p);
      } catch (e) {
        setErr('Не удалось загрузить товар');
      }
    })();
  }, [id, cached, loadOne]);

  if (err) return <div><Link href="/products">← Назад</Link><p>{err}</p></div>;
  if (!product) return <div><Link href="/products">← Назад</Link><p>Загрузка…</p></div>;

  return (
    <div>
      <Link href="/products">← Назад к списку</Link>
      <h2 style={{ marginTop:12 }}>{product.title}</h2>
      <img src={product.thumbnail} alt={product.title} style={{ width:'100%', maxWidth:720, borderRadius:12, margin:'12px 0' }} />
      <p><strong>Цена:</strong> ${product.price}</p>
      <p><strong>Категория:</strong> {product.category}</p>
      <p style={{ whiteSpace:'pre-wrap' }}>{product.description}</p>
    </div>
  );
}
