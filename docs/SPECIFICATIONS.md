# Inventory App - Specifications

Shared inventory management web app for scout equipment.
Stack: Next.js (App Router, TypeScript), Tailwind CSS, Supabase (PostgreSQL, Auth, Storage), deployed on Vercel.

## 1. Product vision

Manage a pool of shared equipment between several people: what exists, where it is,
who has it, when it is reserved, and its full history. Users access the app from their
phones; the user interface is in French.

## 2. Roles

| Role | Permissions |
| --- | --- |
| Admin | Full access: manage accounts, delete items, configure the app |
| Manager | Update stock, approve reservations, comment, manage storage locations |
| Viewer | Read-only: browse items and calendars, request reservations |

## 3. Feature scope

### 3.1 Item catalog
- Unique reference per item (e.g. MT-0001), name, category, quantity, condition, photo
- Storage location: shelf/box in the hut, or "held by [person]" with expected return date
- Search and filters (category, condition, availability)

### 3.2 Stock movements
- Check-out (who, what, when, purpose) and check-in
- Distinct status "held externally, awaiting return" vs "available"
- Full history per item: movements, comments, attached photos

### 3.3 Reservations
- Reserve an item for a date range (start/end)
- Conflict detection when the item is already booked
- Manager approval workflow

### 3.4 Calendars
- Global calendar: all equipment in use on a given day
- Per-item calendar: timeline of check-outs and reservations

### 3.5 Communication
- Comments on each item, with photos
- Chatbot answering natural-language questions about the inventory (long-term)

## 4. Data model (Supabase)

```
items        : id, reference (unique), name, category, quantity_total, state, photo_url, location_id, created_at
locations    : id, name, type (local | external), holder_name, expected_return_date
profiles     : id (linked to auth user), role (admin | manager | viewer)
movements    : id, item_id, user_id, type (checkout | checkin | move), quantity, date, comment
reservations : id, item_id, user_id, start_date, end_date, status (pending | approved | cancelled)
comments     : id, item_id, user_id, text, photo_url, created_at
```

## 5. Project structure

```
app/        Pages (routing)
components/ UI building blocks (items/, calendar/, ui/)
lib/        Data access, Supabase clients, TypeScript types, utils
docs/       Specifications and decisions
```

## 6. Roadmap

- Milestone 1 (MVP): Supabase connection, items + locations tables, item list with
  search, item detail page, email auth with roles, deployed on Vercel
- Milestone 2: check-out / check-in movements, full history timeline, comments with photos
- Milestone 3: reservations with conflict detection, global and per-item calendars
- Milestone 4: QR code per item, installable PWA, return reminders
- Milestone 5: chatbot answering questions from the inventory data

## 7. Engineering practices

- One milestone = one branch (`git checkout -b milestone-2-movements`), merge into main when done
- Small commits in English: `feat: add item detail page`
- Secrets live in `.env.local`, never committed
- Row Level Security enabled in Supabase from the first table (viewers cannot mutate items)
- Strict TypeScript types in `lib/types/` from the first table
- Every page verified on mobile from milestone 1 (primary usage is phones in the hut)
