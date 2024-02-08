import { NumberSymbol, getLocaleCurrencySymbol, getLocaleNumberSymbol } from '@angular/common';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import { SessionService } from '../services/session.service';

  // ^\\€?(([1-9](\\d*|\\d{0,2}(\\.\\d{3})*))|0)(\\,\\d{1,2})?$
  // ^\€?(([1-9](\d*|\d{0,2}(\.\d{3})*))|0)(\,\d{1,2})?$

export function maskCurrencyOptionsLocal(session: SessionService, decPlaces: number = 2) {
  return maskitoNumberOptionsGenerator({
            decimalZeroPadding: true,
            precision: decPlaces,
            decimalSeparator: getLocaleNumberSymbol(session.locale, NumberSymbol.Decimal),
            min: 0,
            postfix: ' ' + getLocaleCurrencySymbol(session.locale)
         });  
}

export function maskPercentOptionsLocal(session: SessionService, decPlaces: number = 2) {
  return maskitoNumberOptionsGenerator({
            decimalZeroPadding: true,
            precision: decPlaces,
            decimalSeparator: getLocaleNumberSymbol(session.locale, NumberSymbol.Decimal),
            min: 0,
            max: 100,
            postfix: ' ' + getLocaleNumberSymbol(session.locale, NumberSymbol.PercentSign)
         });  
}