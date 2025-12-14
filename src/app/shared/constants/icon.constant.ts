import {
  ChevronLeft,
  Settings,
  CircleX,
  Play,
  Palette,
  Save
} from 'lucide-angular';

export const ICONS = {
  ChevronLeft,
  Settings,
  CircleX,
  Play,
  Palette,
  Save
} as const;

export type IconName = keyof typeof ICONS;
