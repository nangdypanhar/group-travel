import {
  BedDouble,
  Building2,
  Coffee,
  FerrisWheel,
  Landmark,
  Moon,
  PlaneLanding,
  PlaneTakeoff,
  ShoppingBag,
  Trees,
  UtensilsCrossed,
} from 'lucide-react'

// Icon + tile color per place category or fixed item kind. Also used by the place picker.
export const PLACE_STYLES = {
  landmarks: { Icon: Building2, tile: 'bg-sky-50 text-sky-600' },
  nature: { Icon: Trees, tile: 'bg-emerald-50 text-emerald-600' },
  culture: { Icon: Landmark, tile: 'bg-amber-50 text-amber-600' },
  food: { Icon: UtensilsCrossed, tile: 'bg-orange-50 text-orange-600' },
  fun: { Icon: FerrisWheel, tile: 'bg-pink-50 text-pink-600' },
  shopping: { Icon: ShoppingBag, tile: 'bg-violet-50 text-violet-600' },
  nightlife: { Icon: Moon, tile: 'bg-indigo-50 text-indigo-600' },
  arrive: { Icon: PlaneLanding, tile: 'bg-brand-50 text-brand-600' },
  depart: { Icon: PlaneTakeoff, tile: 'bg-brand-50 text-brand-600' },
  hotel: { Icon: BedDouble, tile: 'bg-slate-100 text-slate-600' },
  free: { Icon: Coffee, tile: 'bg-slate-100 text-slate-600' },
}
