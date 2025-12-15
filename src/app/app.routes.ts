import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'editor',
    loadComponent: () =>
      import('./features/editor/editor').then(m => m.Editor),
    data: {
      showHeader: false
    }
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
