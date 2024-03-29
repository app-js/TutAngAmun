import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { SessionService } from '../services/session.service';

@Pipe({
    name: 'localDate',
    standalone: true
})
export class LocalDatePipe implements PipeTransform {

    constructor(private session: SessionService) { }

    transform(value: any, format?: string) {

        if (!value) { return ''; }
        if (!format) { format = 'shortDate'; }

        return formatDate(value, format, this.session.locale);       
    }
}