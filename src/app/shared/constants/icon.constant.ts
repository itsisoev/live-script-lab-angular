import {
  ChevronLeft,
  Settings
} from 'lucide-angular';

export const ICONS = {
  ChevronLeft,
  Settings
} as const;

export type IconName = keyof typeof ICONS;
