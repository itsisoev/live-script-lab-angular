import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {ChevronLeft, LUCIDE_ICONS, LucideIconProvider} from 'lucide-angular';
import {ICONS} from './shared/constants/icon.constant';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(ICONS)},
  ]
};
