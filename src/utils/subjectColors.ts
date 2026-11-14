export interface SubjectTheme {
  badge: string;
  badgeDot: string;
  cardBorder: string;
  hoverBorder: string;
  text: string;
  bgSubtle: string;
  ring: string;
  activeBtn: string;
}

export const SUBJECT_THEMES: Record<string, SubjectTheme> = {
  rose: {
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    badgeDot: 'bg-rose-500',
    cardBorder: 'border-rose-900/40',
    hoverBorder: 'hover:border-rose-500/50',
    text: 'text-rose-400',
    bgSubtle: 'bg-rose-500/10',
    ring: 'focus:ring-rose-500',
    activeBtn: 'bg-rose-600 text-white',
  },
  cyan: {
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    badgeDot: 'bg-cyan-500',
    cardBorder: 'border-cyan-900/40',
    hoverBorder: 'hover:border-cyan-500/50',
    text: 'text-cyan-400',
    bgSubtle: 'bg-cyan-500/10',
    ring: 'focus:ring-cyan-500',
    activeBtn: 'bg-cyan-600 text-white',
  },
  amber: {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    badgeDot: 'bg-amber-500',
    cardBorder: 'border-amber-900/40',
    hoverBorder: 'hover:border-amber-500/50',
    text: 'text-amber-400',
    bgSubtle: 'bg-amber-500/10',
    ring: 'focus:ring-amber-500',
    activeBtn: 'bg-amber-600 text-white',
  },
  pink: {
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    badgeDot: 'bg-pink-500',
    cardBorder: 'border-pink-900/40',
    hoverBorder: 'hover:border-pink-500/50',
    text: 'text-pink-400',
    bgSubtle: 'bg-pink-500/10',
    ring: 'focus:ring-pink-500',
    activeBtn: 'bg-pink-600 text-white',
  },
  blue: {
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    badgeDot: 'bg-blue-500',
    cardBorder: 'border-blue-900/40',
    hoverBorder: 'hover:border-blue-500/50',
    text: 'text-blue-400',
    bgSubtle: 'bg-blue-500/10',
    ring: 'focus:ring-blue-500',
    activeBtn: 'bg-blue-600 text-white',
  },
  emerald: {
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    badgeDot: 'bg-emerald-500',
    cardBorder: 'border-emerald-900/40',
    hoverBorder: 'hover:border-emerald-500/50',
    text: 'text-emerald-400',
    bgSubtle: 'bg-emerald-500/10',
    ring: 'focus:ring-emerald-500',
    activeBtn: 'bg-emerald-600 text-white',
  },
  violet: {
    badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    badgeDot: 'bg-violet-500',
    cardBorder: 'border-violet-900/40',
    hoverBorder: 'hover:border-violet-500/50',
    text: 'text-violet-400',
    bgSubtle: 'bg-violet-500/10',
    ring: 'focus:ring-violet-500',
    activeBtn: 'bg-violet-600 text-white',
  },
  indigo: {
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    badgeDot: 'bg-indigo-500',
    cardBorder: 'border-indigo-900/40',
    hoverBorder: 'hover:border-indigo-500/50',
    text: 'text-indigo-400',
    bgSubtle: 'bg-indigo-500/10',
    ring: 'focus:ring-indigo-500',
    activeBtn: 'bg-indigo-600 text-white',
  },
  teal: {
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    badgeDot: 'bg-teal-500',
    cardBorder: 'border-teal-900/40',
    hoverBorder: 'hover:border-teal-500/50',
    text: 'text-teal-400',
    bgSubtle: 'bg-teal-500/10',
    ring: 'focus:ring-teal-500',
    activeBtn: 'bg-teal-600 text-white',
  },
  yellow: {
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    badgeDot: 'bg-yellow-500',
    cardBorder: 'border-yellow-900/40',
    hoverBorder: 'hover:border-yellow-500/50',
    text: 'text-yellow-400',
    bgSubtle: 'bg-yellow-500/10',
    ring: 'focus:ring-yellow-500',
    activeBtn: 'bg-yellow-600 text-white',
  },
};

export const getSubjectTheme = (colorKey?: string): SubjectTheme => {
  return SUBJECT_THEMES[colorKey || 'indigo'] || SUBJECT_THEMES.indigo;
};
