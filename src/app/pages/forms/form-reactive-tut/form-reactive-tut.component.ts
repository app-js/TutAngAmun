import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { IPipeObj, LocalNumberPipe } from '../../../pipes/local-number.pipe';
import { SessionService } from '../../../services/session.service';
import { JsonPipe } from '@angular/common';
import { MaskitoDirective } from '@maskito/angular';
import { MaskitoOptions } from '@maskito/core';
import { MatCardModule } from '@angular/material/card';
import { ITagesgeld, Zinsmethode, Zinzperiode } from '../../../models/tagesgeld';
import { LoggerService } from '../../../services/logger.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { maskCurrencyOptionsLocal, maskPercentOptionsLocal } from '../../../directives/maskito-masks';

@Component({
  selector: 'app-form-reactive-tut',
  standalone: true,
  imports: [ReactiveFormsModule, 
            MatFormFieldModule, 
            MatInputModule, 
            LocalNumberPipe, 
            MaskitoDirective,
            MatCardModule,
            JsonPipe,
            MatButtonModule,
            MatDividerModule,
           ],
  templateUrl: './form-reactive-tut.component.html',
  styleUrl: './form-reactive-tut.component.scss',
  providers: [],
})
export class FormReactiveTutComponent {

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

  currencyMaskOption:MaskitoOptions;
  percentMaskOption4:MaskitoOptions;
  percentMaskOption:MaskitoOptions;
  tagesgeldForm: FormGroup;

  constructor(private session: SessionService, private logger: LoggerService) { 

    this.tagesgeldForm = new FormGroup({
      anlagekapital: new FormControl(),
      zinssatz: new FormControl(),
    });
    
    this.currencyMaskOption = maskCurrencyOptionsLocal(session);  
    this.percentMaskOption = maskPercentOptionsLocal(session); 
    this.percentMaskOption4 = maskPercentOptionsLocal(session,4); 

    this.tagesgeldForm.get("anlagekapital")?.valueChanges.subscribe((value) => { 
                          this.logger.log('anlagekapital changed ' + value);
                          let pObj: IPipeObj = {num:0, strNum:'0'};
                          value = this.getDecimal(value,pObj);
                          this.tg.anlagekapital = pObj.num;
                        });
    this.tagesgeldForm.controls["zinssatz"].valueChanges.subscribe((value) => { 
                          this.logger.log('zinssatz changed ' + value);
                          let pObj: IPipeObj = {num:0, strNum:'0'};
                          value = this.getDecimal(value,pObj);
                          this.tg.zinssatz = pObj.num;
                        });
                                       
  }

  getDecimal(val: any, nObj?: IPipeObj): string {
    this.logger.log('getDecimal in ' + val);
    let checkP = new LocalNumberPipe(this.session);
    val = checkP.transform({value:val,numPObj:nObj});
    this.logger.log('getDecimal out ' + val);
    return val;
  }
}
