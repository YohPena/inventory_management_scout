"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ItemRow = {
  id: string;
  reference: string;
  name: string;
  category: string | null;
  state: string;
};

export default function ItemsPage() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

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

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .map((i) => i.category)
            .filter((c): c is string => c !== null)
        )
      ),
    [items]
  );

  const filtered = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.reference.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || item.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Materiel</h1>

      <div className="mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded border px-3 py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="">Toutes categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading && <p>Chargement...</p>}
      {!loading && filtered.length === 0 && <p>Aucun materiel trouve.</p>}

      <ul className="divide-y">
        {filtered.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-3">
            <span className="font-mono text-sm text-gray-500">{item.reference}</span>
            <a href={`/items/${item.reference}`} className="font-medium hover:underline">
             {item.name}
            </a>

            <span className="text-sm text-gray-500">{item.category}</span>
            <span className="ml-auto text-sm">{item.state}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
