import { Suspense } from 'react';
import ProductClient from './ProductClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Загрузка…</div>}>
      <ProductClient />
    </Suspense>
  );
}
