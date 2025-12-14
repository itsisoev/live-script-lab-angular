import {Injectable, effect, signal} from '@angular/core';
import {Theme} from '@shared/types/theme.type';

const STORAGE_KEY = 'code-lab-theme';

@Injectable({providedIn: 'root'})
export class ThemeService {
  theme = signal<Theme>('light');

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'dark' || saved === 'light') {
      this.theme.set(saved);
    }

    effect(() => {
      const current = this.theme();
      document.body.classList.toggle('theme-dark', current === 'dark');
      localStorage.setItem(STORAGE_KEY, current);
    });
  }

  toggle() {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }
}
