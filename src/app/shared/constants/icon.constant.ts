import {
  ChevronLeft,
  Settings,
  CircleX,
  Play,
  Palette
} from 'lucide-angular';

export const ICONS = {
  ChevronLeft,
  Settings,
  CircleX,
  Play,
  Palette
} as const;

export type IconName = keyof typeof ICONS;
