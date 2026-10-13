"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ItemDetail = {
  id: string;
  reference: string;
  name: string;
  category: string | null;
  quantity_total: number;
  state: string;
  photo_url: string | null;
  location: { name: string; type: string; holder_name: string | null } | null;
};

const stateLabels: Record<string, string> = {
  new: "Neuf",
  good: "Bon etat",
  damaged: "Abime",
  broken: "HS",
};

export function ItemDetail() {
  const { reference } = useParams<{ reference: string }>();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!reference) return;
    const supabase = createClient();
    supabase
      .from("items")
      .select(
        "id, reference, name, category, quantity_total, state, photo_url, location:locations(name, type, holder_name)"
      )
      .eq("reference", reference)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Erreur Supabase :", error);
          setNotFound(true);
        }
        // PostgREST renvoie un objet, supabase-js infere un tableau sans types generes
        if (data) setItem(data as unknown as ItemDetail);
        setLoading(false);
      });
  }, [reference]);

  if (loading) return <main className="mx-auto max-w-3xl p-8">Chargement...</main>;
  if (notFound || !item)
    return <main className="mx-auto max-w-3xl p-8">Materiel introuvable.</main>;

  return (
    <main className="mx-auto max-w-3xl p-8">
      <a href="/items" className="text-sm text-gray-500 hover:underline">
        &larr; Retour a la liste
      </a>

      <h1 className="mb-2 mt-4 text-2xl font-bold">{item.name}</h1>
      <p className="mb-6 font-mono text-sm text-gray-500">{item.reference}</p>

      {item.photo_url && (
        <img
          src={item.photo_url}
          alt={item.name}
          className="mb-6 max-w-md rounded-lg"
        />
      )}

      <dl className="space-y-2">
        <div className="flex gap-2">
          <dt className="font-medium">Categorie :</dt>
          <dd>{item.category ?? "Non renseignee"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium">Quantite :</dt>
          <dd>{item.quantity_total}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium">Etat :</dt>
          <dd>{stateLabels[item.state] ?? item.state}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium">Emplacement :</dt>
          <dd>
            {item.location
              ? item.location.type === "external"
                ? `Chez ${item.location.holder_name ?? "inconnu"}`
                : item.location.name
              : "Non renseigne"}
          </dd>
        </div>
      </dl>
    </main>
  );
}
