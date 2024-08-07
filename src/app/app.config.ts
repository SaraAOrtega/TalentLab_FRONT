// src/app/app.config.ts
import { AuthInterceptor } from './utils/add-token.interceptor';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      preventDuplicates: true,
      positionClass: 'toast-bottom-right',
    }), provideAnimationsAsync(),
  ]
};