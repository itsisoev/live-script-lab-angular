import {
  ChevronLeft,
  Settings,
  CircleX,
  Play,
  Palette,
  Save,
  PencilLine,
  Earth,
  Rocket
} from 'lucide-angular';

export const ICONS = {
  ChevronLeft,
  Settings,
  CircleX,
  Play,
  Palette,
  Save,
  PencilLine,
  Earth,
  Rocket
} as const;

export type IconName = keyof typeof ICONS;
