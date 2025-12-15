import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {UiButton} from '@shared/ui-components/ui-button/ui-button';
import {LucideAngularModule} from 'lucide-angular';
import {Router} from '@angular/router';

@Component({
  selector: 'page-home',
  imports: [
    UiButton,
    LucideAngularModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly router = inject(Router);

  openEditor() {
    this.router.navigate(['/editor']).then(success => {
      if (!success) {
        console.log('Navigation failed');
      }
    });
  }
}
