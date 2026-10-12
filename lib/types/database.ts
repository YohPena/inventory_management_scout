export type Role = "admin" | "manager" | "viewer";

export type Item = {
  id: string;
  reference: string;
  name: string;
  category: string | null;
  quantityTotal: number;
  state: "new" | "good" | "damaged" | "broken";
  photoUrl: string | null;
  locationId: string | null;
  createdAt: string;
};

export type Location = {
  id: string;
  name: string;
  type: "local" | "external";
  holderName: string | null;
  expectedReturnDate: string | null;
};
