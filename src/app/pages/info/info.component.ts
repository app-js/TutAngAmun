import { Component } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { LocalNumberPipe } from '../../pipes/local-number.pipe';
import { LocalDatePipe } from '../../pipes/local-date.pipe';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [LocalNumberPipe, LocalDatePipe, DatePipe, DecimalPipe],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {
 
  today = new Date();
  val = 123.4567;
  val1 = .01;
  
  constructor(private session: SessionService) {}

  german() {
    this.session.registerCulture('de-DE');
    this.refreshValues();
  }

  english() {
    this.session.registerCulture('en-US');
    this.refreshValues();
  }

  private refreshValues() {
    this.today = new Date();
    this.val++;
    this.val1 = this.val1 + .01;
  }
}
