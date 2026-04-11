import {
  AlarmClockPlus,
  Baby,
  BookOpenText,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  IdCardLanyard,
  LayoutDashboard,
  LayoutList,
  type LucideIcon,
  PackageSearch,
  ShieldCheck,
  ShoppingBasket,
  Store,
  Tags,
  UserStar,
  Users,
  UtensilsCrossed,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  LayoutList,
  Users,
  UtensilsCrossed,
  CalendarDays,
  ClipboardList,
  ShieldCheck,
  Store,
  Baby,
  IdCardLanyard,
  UserStar,
  CircleDollarSign,
  Tags,
  ShoppingBasket,
  PackageSearch,
  BookOpenText,
  AlarmClockPlus,
}

export const resolveIcon = (name: string | null): LucideIcon | undefined =>
  name ? ICON_MAP[name] : undefined
