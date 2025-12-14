import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {UiButton} from '@shared/ui-components/ui-button/ui-button';
import {LucideAngularModule} from 'lucide-angular';
import {ThemeService} from '@shared/services/theme.service';

@Component({
  selector: 'layout-header',
  imports: [
    RouterLink,
    UiButton,
    LucideAngularModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggle();
  }
}
