"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ItemRow = {
  id: string;
  reference: string;
  name: string;
  category: string | null;
  state: string;
};

export default function HomePage() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("items")
      .select("id, reference, name, category, state")
      .order("reference")
      .then(({ data, error }) => {
        if (error) console.error("Erreur Supabase :", error);
        if (data) setItems(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Inventaire du matériel</h1>

      {loading && <p>Chargement...</p>}

      {!loading && items.length === 0 && (
        <p>Aucun materiel trouve. Verifiez les donnees dans Supabase.</p>
      )}

      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-3">
            <span className="font-mono text-sm text-gray-500">{item.reference}</span>
            <span className="font-medium">{item.name}</span>
            <span className="text-sm text-gray-500">{item.category}</span>
            <span className="ml-auto text-sm">{item.state}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
