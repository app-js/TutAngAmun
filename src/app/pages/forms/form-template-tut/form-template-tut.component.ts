import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { ITagesgeld, Zinzperiode, Zinsmethode } from '../../../models/tagesgeld';

@Component({
  selector: 'app-form-template-tut',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './form-template-tut.component.html',
  styleUrl: './form-template-tut.component.scss'
})
export class FormTemplateTutComponent {

  tg : ITagesgeld = {
    anlagekapital : 8000.00,
    zinsstaffel : [],
    zinssatz : 3.00,
    zinzperiode : Zinzperiode.ohneZinseszins,
    datumsbereich : {aktiv : false, anfangmitzaehlen : false, endmitzaehlen : false},
    zinstage : 0,
    zinsertrag : 0.00,
    zinsmethode : Zinsmethode.DeutscheZinsmethode,
    steuern : {aktiv : false, steuersatz : 26.375, steuerfreibetrag : 1000.00}
  }

  constructor() { }


}
