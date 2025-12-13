import {
    ChevronLeft,
    Settings,
    CircleX
} from 'lucide-angular';

export const ICONS = {
    ChevronLeft,
    Settings,
    CircleX
} as const;

export type IconName = keyof typeof ICONS;
