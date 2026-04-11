import type { Gender } from './schema'

const SEED_PREFIX: Record<Gender, string> = {
  MALE: 'hero',
  FEMALE: 'heroine',
}

const AVATAR_BG: Record<Gender, string> = {
  MALE: 'b6e3f4,c0aede,d1d4f9',
  FEMALE: 'ffdfbf,ffd5dc,ffb3b3',
}

export const INITIALS_COLORS: Record<Gender, string> = {
  MALE: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  FEMALE: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200',
}

export const getAvatarUrl = (code: string, gender: Gender): string => {
  const seed = `${SEED_PREFIX[gender]}-${code}`
  const bg = AVATAR_BG[gender]
  return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}&radius=50`
}
