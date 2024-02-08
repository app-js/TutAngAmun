import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';
import localeGerman from '@angular/common/locales/de';
import localeEnglish from '@angular/common/locales/en';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private _locale!: string;

  constructor() { }

  set locale(value: string) {
    this._locale = value;
  }
  get locale(): string {
      return this._locale || 'de-DE';
  }

  registerCulture(culture: string) {
    if (!culture) {
        return;
    }
    
    this.locale = culture;

    // Register locale data
    switch (culture) { 
        case 'de-DE': {
            registerLocaleData(localeGerman);
            break;
        }
        case 'en-US': { // en-US is registered by default. Here just as an example.
            registerLocaleData(localeEnglish);
            break;
        }
    }
  }
}
