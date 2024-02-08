import { Pipe, PipeTransform } from '@angular/core';
import { SessionService } from '../services/session.service';
import { NumberSymbol, formatNumber, getLocaleCurrencySymbol, getLocaleNumberSymbol } from '@angular/common';

@Pipe({
  name: 'localNumber',
  standalone: true
})
export class LocalNumberPipe implements PipeTransform {

  constructor(private session: SessionService) { }
  
  transform({value, format, numPObj}:{value: any, format?: string, numPObj?: IPipeObj}) {

    let back : any,
    regex = new RegExp('[^' + 
                       getLocaleNumberSymbol(this.session.locale, NumberSymbol.Decimal) +
                       '\\d]', 'g')

    if (!format) { format = '.2-2'; }

    console.log(value.toString() + ' ' + 
                typeof(value) + ' ' + 
                format + ' ' + 
                this.session.locale + ' ' +
                getLocaleNumberSymbol(this.session.locale, NumberSymbol.Decimal).charAt(0) + ' ' + 
                getLocaleNumberSymbol(this.session.locale, NumberSymbol.Group) + ' ' +
                getLocaleCurrencySymbol(this.session.locale) +
                regex);

    if (value == null) { 
      return ''; 
    }
    
    if (typeof(value) == 'string') {
      value = value.replace(regex, '');
      value = value.replace(getLocaleNumberSymbol(this.session.locale, NumberSymbol.Decimal).charAt(0),'.');
    }

    value = Number(value);
    if (numPObj) numPObj.num = value;

    back = formatNumber(value, this.session.locale, format);
    console.log(back);

    if (numPObj) numPObj.strNum = back;

    return back;
  }
}

export interface IPipeObj {
  num: number;
  strNum: string;
}
