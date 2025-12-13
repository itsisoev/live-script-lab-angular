import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import {UiButton} from '@shared/ui-components/ui-button/ui-button';
import {LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'features-setting-editor',
  imports: [
    UiButton,
    LucideAngularModule
  ],
  templateUrl: './setting-editor.html',
  styleUrl: './setting-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingEditor {
  theme = model<'light' | 'dark'>('dark');
  fontSize = model<number>(14);
  fontFamily = model<string>('JetBrains Mono, monospace');

  isOpen = model<boolean>(true);

  close() {
    this.isOpen.set(false);
  }

  onThemeChange(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    if (select) {
      this.theme.set(select.value as 'light' | 'dark');
    }
  }

  onFontSizeChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.fontSize.set(input.valueAsNumber);
    }
  }

  onFontFamilyChange(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    if (select) {
      this.fontFamily.set(select.value);
    }
  }
}
