import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { lucideIconAliases } from './lucide-icon-aliases';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider(lucideIconAliases),
    },
  ]
};