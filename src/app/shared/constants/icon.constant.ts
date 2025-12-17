import {
  ChevronLeft,
  Settings,
  CircleX,
  Play,
  Palette,
  Save,
  PencilLine,
  Earth,
  Rocket,
  Copy
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
  Rocket,
  Copy
} as const;

export type IconName = keyof typeof ICONS;
