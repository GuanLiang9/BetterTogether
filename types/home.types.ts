export interface CoupleHome {
  id: string;
  couple_id: string;
  background: string;
  created_at: string;
  updated_at: string;
}

export interface HomePlacement {
  id: string;
  couple_id: string;
  item_slug: string;
  item_emoji: string;
  item_label: string;
  placed_by: string | null;
  grid_x: number;
  grid_y: number;
  created_at: string;
}

export const HOME_BACKGROUNDS: Record<string, { label: string; gradient: string }> = {
  cozy:    { label: "Cozy Night",    gradient: "from-slate-900 via-indigo-950 to-slate-900" },
  forest:  { label: "Forest Cabin",  gradient: "from-emerald-950 via-slate-900 to-emerald-950" },
  ocean:   { label: "Ocean View",    gradient: "from-cyan-950 via-slate-900 to-cyan-950" },
  sunset:  { label: "Sunset Loft",   gradient: "from-rose-950 via-slate-900 to-orange-950" },
  minimal: { label: "Minimal White", gradient: "from-slate-800 via-slate-900 to-slate-800" },
};

export const FURNITURE_CATALOG: Record<string, { emoji: string; label: string; w: number; h: number }> = {
  furniture_couch:     { emoji: "🛋️", label: "Cozy Couch",   w: 2, h: 1 },
  furniture_table:     { emoji: "☕", label: "Coffee Table", w: 1, h: 1 },
  furniture_bookshelf: { emoji: "📚", label: "Bookshelf",    w: 1, h: 2 },
  furniture_plant:     { emoji: "🪴", label: "Potted Plant", w: 1, h: 1 },
  furniture_bed:       { emoji: "🛏️", label: "Cozy Bed",     w: 2, h: 2 },
  furniture_tv:        { emoji: "📺", label: "TV Set",       w: 2, h: 1 },
  furniture_rug:       { emoji: "🟫", label: "Fluffy Rug",   w: 2, h: 2 },
  furniture_lamp:      { emoji: "💡", label: "Desk Lamp",    w: 1, h: 1 },
  furniture_window:    { emoji: "🪟", label: "Garden Window",w: 2, h: 1 },
  furniture_cat:       { emoji: "🐱", label: "House Cat",    w: 1, h: 1 },
  furniture_dog:       { emoji: "🐕", label: "Puppy",        w: 1, h: 1 },
  furniture_piano:     { emoji: "🎹", label: "Mini Piano",   w: 2, h: 1 },
  furniture_fireplace: { emoji: "🔥", label: "Fireplace",    w: 2, h: 1 },
};
