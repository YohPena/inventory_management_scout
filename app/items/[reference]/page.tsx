import { Suspense } from "react";
import { ItemDetail } from "./ItemDetail";

export default function Page() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-3xl p-8">Chargement...</main>}>
      <ItemDetail />
    </Suspense>
  );
}
