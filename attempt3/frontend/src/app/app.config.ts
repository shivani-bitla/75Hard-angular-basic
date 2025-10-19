import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { routes } from './app.routes';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFunctions, provideFunctions } from '@angular/fire/functions';

const firebaseConfig = { 
  projectId: "challenge-90-44ed1", 
  appId: "1:1003699975781:web:1592fa92e71fe5154af88c", 
  storageBucket: "challenge-90-44ed1.firebasestorage.app", 
  // Get your new API key from your new Firebase app config
  apiKey: "YOUR_NEW_API_KEY", 
  authDomain: "challenge-90-44ed1.firebaseapp.com", 
  messagingSenderId: "1003699975781", 
  measurementId: "G-8SJ5FT9511"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),provideFirebaseApp(() => initializeApp(firebaseConfig)), 
    provideAuth(() => getAuth()), 
    provideAnalytics(() => getAnalytics()), 
    ScreenTrackingService, 
    UserTrackingService, 
    provideAppCheck(() => {
      // TODO: Get a reCAPTCHA Enterprise site key
      // https://console.cloud.google.com/security/recaptcha
      const provider = new ReCaptchaEnterpriseProvider('YOUR_RECAPTCHA_SITE_KEY');
      return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
    }), 
    provideFunctions(() => getFunctions())
  ]
};
