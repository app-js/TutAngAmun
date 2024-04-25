import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { IPipeObj, LocalNumberPipe } from '../../../pipes/local-number.pipe';
import { SessionService } from '../../../services/session.service';
import { JsonPipe } from '@angular/common';
import { MaskitoDirective } from '@maskito/angular';
import { MaskitoOptions, maskitoTransform } from '@maskito/core';
import { MatCardModule } from '@angular/material/card';
import { IKapitalElement, ITagesgeld, Zinsmethoden, Zinzperioden } from '../../../models/tagesgeld';
import { LoggerService } from '../../../services/logger.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { maskCurrencyOptionsLocal, maskDecimalOptionsLocal, maskPercentOptionsLocal } from '../../../directives/maskito-masks';
import { MatSelectModule } from '@angular/material/select';
import { Tagesgeld } from '../../../utils/tagesgeld';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTable, MatTableModule } from '@angular/material/table';

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
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
  ],
  templateUrl: './form-reactive-tut.component.html',
  styleUrl: './form-reactive-tut.component.scss',
  providers: [],
})

export class FormReactiveTutComponent implements OnInit {

  tg: ITagesgeld = {
    anlagekapital: 5000.00,
    zinsstaffel: [],
    zinssatz: 7.00,
    zinzperiode: Zinzperioden.monatlich,
    datumsbereich: { aktiv: false, anfangmitzaehlen: false, endmitzaehlen: false },
    zinstage: 40,
    zinsertrag: 0.00,
    zinsmethode: Zinsmethoden.DeutscheZinsmethode,
    steuern: { aktiv: false, steuersatz: 26.375, steuerfreibetrag: 1000.00, steuern: 0.00 }
  }

  tagesgeldForm!: FormGroup;

  currencyMaskOption!: MaskitoOptions;
  decimalMaskOption!: MaskitoOptions;
  percentMaskOption4!: MaskitoOptions;
  percentMaskOption!: MaskitoOptions;

  zinzperioden = Zinzperioden;
  zinzperiodenKeys: any = [];

  ertrag:string = '0';
  steuern:string = '0';

  tgC = new Tagesgeld(this.session, this.tg);

  dataSource = this.tgC.steuerTabelle;
  displayedColumns: string[] = ['periode', 'anlage', 'ertrag', 'anlageneu', 'freibetrag', 'steuer', 'steuerverlust'];
  @ViewChild(MatTable) table!: MatTable<IKapitalElement>;
  
  constructor(private session: SessionService, private logger: LoggerService) {

    this.zinzperiodenKeys = Object.keys(this.zinzperioden).filter(f => !isNaN(Number(f)));
  }

  ngOnInit(): void {
    
    this.tagesgeldForm = new FormGroup({
      anlagekapital: new FormControl(),
      zinssatz: new FormControl(),
      zinsperiode: new FormControl(),
      zinstage: new FormControl(),
      steuern: new FormControl(),
      steuersatz: new FormControl(),
      freibetrag: new FormControl(),
    });

    this.currencyMaskOption = maskCurrencyOptionsLocal(this.session);
    this.decimalMaskOption = maskDecimalOptionsLocal(this.session,0,'Tage');
    this.percentMaskOption = maskPercentOptionsLocal(this.session);
    this.percentMaskOption4 = maskPercentOptionsLocal(this.session, 4);

    this.tagesgeldForm.get("anlagekapital")?.valueChanges.subscribe((value) => {
      this.logger.log('anlagekapital changed ' + value);
      let pObj: IPipeObj = { num: 0, strNum: '0' };
      value = this.getDecimal(value, pObj);
      this.tg.anlagekapital = pObj.num;
    });
    this.tagesgeldForm.controls["zinssatz"].valueChanges.subscribe((value) => {
      this.logger.log('zinssatz changed ' + value);
      let pObj: IPipeObj = { num: 0, strNum: '0' };
      value = this.getDecimal(value, pObj);
      this.tg.zinssatz = pObj.num;
    });
    this.tagesgeldForm.get("zinsperiode")?.valueChanges.subscribe((value) => {
      this.logger.log('zinsperiode changed ' + value);
      this.tg.zinzperiode = value;
    });
    this.tagesgeldForm.get("zinstage")?.valueChanges.subscribe((value) => {
      this.logger.log('zinstage changed ' + value);
      let pObj: IPipeObj = { num: 0, strNum: '0' };
      value = this.getDecimal(value, pObj);
      this.tg.zinstage = pObj.num;
    });
    this.tagesgeldForm.get("steuern")?.valueChanges.subscribe((value) => {
      this.tg.steuern.aktiv = value;
    });
    this.tagesgeldForm.controls["steuersatz"].valueChanges.subscribe((value) => {
      this.logger.log('steuersatz changed ' + value);
      let pObj: IPipeObj = { num: 0, strNum: '0' };
      value = this.getDecimal(value, pObj);
      this.tg.steuern.steuersatz = pObj.num;
    });
    this.tagesgeldForm.get("freibetrag")?.valueChanges.subscribe((value) => {
      this.logger.log('freibetrag changed ' + value);
      let pObj: IPipeObj = { num: 0, strNum: '0' };
      value = this.getDecimal(value, pObj);
      this.tg.steuern.steuerfreibetrag = pObj.num;
    });

    this.setFormValues();
  }

  getDecimal(val: any, nObj?: IPipeObj): string {
    this.logger.log('getDecimal in ' + val);
    let checkP = new LocalNumberPipe(this.session);
    val = checkP.transform({ value: val, numPObj: nObj });
    this.logger.log('getDecimal out ' + val);
    return val;
  }

  setFormValues()
  {
    let val = maskitoTransform(this.tg.anlagekapital.toString(), this.currencyMaskOption);
    this.tagesgeldForm.get("anlagekapital")?.setValue(val);
    val = maskitoTransform(this.tg.zinssatz.toString(), this.percentMaskOption4);
    this.tagesgeldForm.controls["zinssatz"].setValue(val);
    this.tagesgeldForm.controls["zinsperiode"].setValue(this.tg.zinzperiode.toString());
    val = maskitoTransform(this.tg.zinstage.toString(), this.decimalMaskOption);
    this.tagesgeldForm.controls["zinstage"].setValue(val);
    val = maskitoTransform(this.tg.steuern.steuersatz.toString(), this.percentMaskOption4);
    this.tagesgeldForm.controls["steuersatz"].setValue(val);
    val = maskitoTransform(this.tg.steuern.steuerfreibetrag.toString(), this.currencyMaskOption);
    this.tagesgeldForm.controls["freibetrag"].setValue(val);

    this.ertrag = maskitoTransform(this.tg.zinsertrag.toString(), this.currencyMaskOption);
    this.steuern = maskitoTransform(this.tg.steuern.steuern.toString(), this.currencyMaskOption);
  }

  onSubmit() {
    this.tg.zinsertrag = this.tgC.berechneZinsertragNachSteuern();
    this.ertrag = maskitoTransform(this.tg.zinsertrag.toString(), this.currencyMaskOption);
    this.steuern = maskitoTransform(this.tg.steuern.steuern.toString(), this.currencyMaskOption);
    this.tgC.generateSteuerTabelle();
    this.table.renderRows();
  }
}
