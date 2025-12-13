import {
  ChevronLeft,
  Settings,
  CircleX,
  Play
} from 'lucide-angular';

export const ICONS = {
  ChevronLeft,
  Settings,
  CircleX,
  Play
} as const;

export type IconName = keyof typeof ICONS;
