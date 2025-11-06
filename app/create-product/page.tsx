'use client';

import { FormEvent, useState } from 'react';
import { useProducts } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateProduct() {
  const createLocal = useProducts(s => s.createLocal);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [category, setCategory] = useState('LEGO LOTR');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [err, setErr] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!title.trim() || !description.trim() || !category.trim() || !thumbnail.trim() || price === '' || Number(price) < 0) {
      setErr('Заполните все поля корректно (цена ≥ 0).');
      return;
    }

    const id = createLocal({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      thumbnail: thumbnail.trim(),
    });

    router.push(`/product?id=${id}`);
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <Link href="/products">← Назад к списку</Link>
      <h2 style={{ marginTop: 12 }}>Добавить сет</h2>

      {err && <div className="badge" style={{ background:'#ffe8e8', margin:'8px 0' }}>{err}</div>}

      <form onSubmit={onSubmit} style={{ display:'flex', flexDirection:'column', gap:10, marginTop:8 }}>
        <input placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Цена" inputMode="decimal" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} />
        <input placeholder="Категория" value={category} onChange={e => setCategory(e.target.value)} />
        <input placeholder="Ссылка на изображение" value={thumbnail} onChange={e => setThumbnail(e.target.value)} />
        <textarea placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)} rows={5} />
        <div style={{ display:'flex', gap:8 }}>
          <button type="submit" className="primary">Создать</button>
          <Link href="/products"><button type="button">Отмена</button></Link>
        </div>
      </form>
    </div>
  );
}
