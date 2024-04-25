import { Component, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { ITagesgeld, Zinzperioden, Zinsmethoden } from '../../../models/tagesgeld';
import { LocalNumberPipe } from '../../../pipes/local-number.pipe';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-form-template-tut',
    standalone: true,
    templateUrl: './form-template-tut.component.html',
    styleUrl: './form-template-tut.component.scss',
    imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, LocalNumberPipe, DecimalPipe]
})
export class FormTemplateTutComponent {

  myNum = 1.23;

  tg : ITagesgeld = {
    anlagekapital : 8000.00,
    zinsstaffel : [],
    zinssatz : 3.00,
    zinzperiode : Zinzperioden.ohneZinseszins,
    datumsbereich : {aktiv : false, anfangmitzaehlen : false, endmitzaehlen : false},
    zinstage : 0,
    zinsertrag : 0.00,
    zinsmethode : Zinsmethoden.DeutscheZinsmethode,
    steuern : {aktiv : false, steuersatz : 26.375, steuerfreibetrag : 1000.00, steuern : 0.00}
  }

 constructor() { }

}