import { ITagesgeld, Zinsmethoden, Zinzperioden, ISteuerListe, ISteuerDisplay } from "../models/tagesgeld";
import { Big } from 'big.js';
import { SessionService } from "../services/session.service";
import { MaskitoOptions, maskitoTransform } from '@maskito/core';
import { maskCurrencyOptionsLocal } from "../directives/maskito-masks";

export class Tagesgeld {
    [x: string]: any;

    private _tg!: ITagesgeld;
    get tg() {
        return this._tg;
    }

    private _steuernListe! : ISteuerListe;
    get steuernListe() {
        return this._steuernListe;
    }

    private _steuerTabelle! : ISteuerDisplay[];
    get steuerTabelle() {
        return this._steuerTabelle;
    }

    currencyMaskOption!: MaskitoOptions;

    constructor(private session: SessionService, tg?: ITagesgeld) {
        
        this._tg = tg ? tg :
        {
            anlagekapital: 0.00,
            zinsstaffel: [],
            zinssatz: 0.0000,
            zinzperiode: Zinzperioden.ohneZinseszins,
            datumsbereich: { aktiv: false, anfangmitzaehlen: false, endmitzaehlen: false },
            zinstage: 0,
            zinsertrag: 0.00,
            zinsmethode: Zinsmethoden.DeutscheZinsmethode,
            steuern: { aktiv: false, steuersatz: 26.375, steuerfreibetrag: 1000.00, steuern: 0.00 }
        }

        this._steuernListe = {
            perioden : 0,
            tage : 0,
            kapital : [],
            frei : []
        }

        this._steuerTabelle = [];
        this.currencyMaskOption = maskCurrencyOptionsLocal(this.session);
    }

    berechneZinsertrag():number {

        // Zinsformel (30E/360 Deutsche Zinsmethode)
        // Z=K0 * p/100 * t/Tjahr
        // Z    : Zinsertrag
        // K0	: angelegtes Anfangskapital
        // p	: Zinssatz in Prozent
        // t    : Anlagezeit in Tagen
        // Tjahr: Tage eines Jahres
        //
        // Zinseszinsformel für unterjährige Verzinsung (30E/360 Deutsche Zinsmethode)
        // Kn = K0 * ((p/m / 100) + 1)^n*m
        // Kn	: Endkapital inkl. Zinsen nach n Jahren
        // K0	: angelegtes Anfangskapital
        // p	: Zinssatz in Prozent
        // n	: Anzahl der Jahre
        // m	: Anzahl der Zinsperioden pro Jahr

        if (this.tg.steuern.aktiv) return this.berechneZinsertragNachSteuern();

        let betrag = new Big(0.0);
        let betrag1 = new Big(0.0);
        let betrag2 = new Big(0.0);
        let betrag3 = new Big(0.0);
        
        let periodentage = new Big(0.0);
        let tage = new Big(this._tg.zinstage);
        let perioden = new Big(0.0);
        let anzJahre = new Big(0.0);
        let zp = new Big(this._tg.zinzperiode.toString());
        let zinssatz = new Big(0.0);

        zinssatz = Big(this._tg.zinssatz);
        this._tg.steuern.steuern = 0.00;
        this.clearSteuerListe();

        switch (zp.toNumber()) {
        case 1:
            periodentage = Big(360);
            break;
        case 2:
            periodentage = Big(180);
            break;
        case 4:
            periodentage = Big(90);
            break;
        case 12:
            periodentage = Big(30);
            break;
        case 360:
            periodentage = Big(1);
            break;
        default:
            periodentage = Big(0);
        }
        
        while (tage.gte(periodentage)) {
            if (tage.lte(Big(0)) || periodentage.lte(Big(0))) break;
            perioden = perioden.add(1);
            tage = tage.sub(periodentage);
        }
        
        if (perioden.gt(0)) {
            anzJahre = Big(perioden.mul(periodentage.div(360)));
            betrag1 = Big(this._tg.anlagekapital).mul((Big(this._tg.zinssatz).div(zp).div(100).add(1)).pow(anzJahre.mul(zp).toNumber()));
        }
        
        if (tage.gt(0)) {
            betrag3 = betrag1;
            if (betrag3.eq(0)) betrag3 = Big(this._tg.anlagekapital);
            betrag2 = betrag3.mul(Big(this._tg.zinssatz).div(100).mul(tage.div(360)));
        }
        
        if (betrag1.eq(0)) betrag1 = Big(this._tg.anlagekapital);

        betrag = betrag1.add(betrag2);     
        return betrag.sub(Big(this._tg.anlagekapital)).round(2,1).toNumber();   
    }

    berechneZinsertragNachSteuern():number {
        let betrag = new Big(0.0);
        let betrag1 = new Big(0.0);
        let betrag2 = new Big(0.0);
        let betrag3 = new Big(0.0);
        let betragTmp = new Big(0.0);
        let betragDiff = new Big(0.0);
        let steuern = new Big(0.0);
        let steuernTmp = new Big(0.0);
        let frei = new Big(this._tg.steuern.steuerfreibetrag);
        let steuernHlp = new Big(0.0);
    
        let periodentage = new Big(0.0);
        let tage = new Big(this._tg.zinstage);
        let perioden = new Big(0.0);
        let zp = new Big(this._tg.zinzperiode.toString());
        let zinssatz = new Big(this._tg.zinssatz);
        let steuersatz = Big(this._tg.steuern.steuersatz);
        let anlagekapital = Big(this._tg.anlagekapital);

        let periodeNr = 0;

        this.clearSteuerListe();
        this._tg.steuern.steuern = steuern.round(2,1).toNumber();

        switch (zp.toNumber()) {
        case 1:
            periodentage = Big(360);
            break;
        case 2:
            periodentage = Big(180);
            break;
        case 4:
            periodentage = Big(90);
            break;
        case 12:
            periodentage = Big(30);
            break;
        case 360:
            periodentage = Big(1);
            break;
        default:
            periodentage = Big(0);
        }
        
        while (tage.gte(periodentage)) {
            if (tage.lte(Big(0)) || periodentage.lte(Big(0))) break;
            perioden = perioden.add(1);
            tage = tage.sub(periodentage);
        }
        
        this._steuernListe.tage = tage.toNumber();
        this._steuernListe.perioden = perioden.toNumber();
        
        if (perioden.gt(0)) {
            betragTmp = anlagekapital;

            while (perioden.gt(0)) {
                periodeNr++;
               
                betragDiff = betragTmp.mul(zinssatz).div(100).mul(periodentage.div(360));

                this._steuernListe.kapital.push({periode:periodeNr,
                                                 anlage:betragTmp.round(2,1).toNumber(),
                                                 ertrag:0.00,
                                                 anlageneu:0.00});
                this._steuernListe.frei.push({periode:periodeNr,
                                              frei:this.tg.steuern.aktiv?frei.round(2,1).toNumber():0.00,
                                              steuer:0.00,
                                              steuerverlust:0.00});

                perioden = perioden.sub(1);

                if (this.tg.steuern.aktiv) {
                    steuernTmp = betragDiff;
                    steuernTmp = steuernTmp.mul(steuersatz.div(100));
                    steuernHlp = steuernTmp;
                    if (frei.gt(0)) {
                        if (frei.gt(steuernHlp)) {
                            frei = frei.sub(steuernHlp.round(2,1));
                            steuernTmp = Big(0.0);
                        }
                        else {
                            steuernTmp = steuernHlp.sub(frei);
                            frei = Big(0.0);
                        }
                    }
                    this._steuernListe.frei[periodeNr-1].steuer = steuernHlp.round(2,1).toNumber();
                    this._steuernListe.frei[periodeNr-1].steuerverlust = steuernTmp.round(2,1).toNumber();
                }

                steuern = steuern.add(steuernTmp);
                betragDiff = betragDiff.sub(steuernTmp);

                betragDiff = betragDiff.round(2,1);
                betragTmp = betragTmp.add(betragDiff);

                this._steuernListe.kapital[periodeNr-1].ertrag = betragDiff.toNumber();
                this._steuernListe.kapital[periodeNr-1].anlageneu = betragTmp.toNumber();
            }
            betrag1 = betragTmp;
        }
        
        if (tage.gt(0)) {
            betrag3 = betrag1;
            if (betrag3.eq(0)) betrag3 = anlagekapital;
            betrag2 = betrag3.mul(zinssatz.div(100).mul(tage.div(360)));
            
            this._steuernListe.kapital.push({periode:-1,
                                             anlage:betrag3.round(2,1).toNumber(),
                                             ertrag:0.00,
                                             anlageneu:0.00});
            this._steuernListe.frei.push({periode:-1,
                                          frei:this.tg.steuern.aktiv?frei.round(2,1).toNumber():0.00,
                                          steuer:0.00,
                                          steuerverlust:0.00});

            if (this.tg.steuern.aktiv) {
                steuernHlp = steuernTmp = betrag2.mul(steuersatz.div(100));
                if (frei.gt(0.0)) {
                    if (frei.gt(steuernHlp)) {
                        frei = frei.sub(steuernHlp.round(2,1));
                        steuernTmp = Big(0.0);
                    }
                    else {
                        steuernTmp = steuernHlp.sub(frei);
                        frei = Big(0.0);
                    }
                }

                this._steuernListe.frei[periodeNr].steuer = steuernHlp.round(2,1).toNumber();
                this._steuernListe.frei[periodeNr].steuerverlust = steuernTmp.round(2,1).toNumber();
            }

            steuern = steuern.add(steuernTmp);
            betrag2 = betrag2.sub(steuernTmp);
            betrag2 = betrag2.round(2,1); 

            this._steuernListe.kapital[periodeNr].ertrag = betrag2.round(2,1).toNumber();
        }
        
        if (betrag1.eq(0)) betrag1 = anlagekapital;

        betrag = betrag1.add(betrag2); 
        if (tage.gt(0)) this._steuernListe.kapital[periodeNr].anlageneu = betrag.round(2,1).toNumber();
        
        this._tg.steuern.steuern = steuern.round(2,1).toNumber();

        return betrag.sub(anlagekapital).round(2,1).toNumber();   
    }

    clearSteuerListe() {
        this._steuernListe.perioden = this._steuernListe.tage = 0;
        this._steuernListe.kapital.length = 0;
        this._steuernListe.frei.length = 0;
        this.clearSteuerTabelle();
    }

    clearSteuerTabelle() {
        this._steuerTabelle.length = 0;
    }

    generateSteuerTabelle() {
        let str : string;
        let periode : string;

        let anz = this._steuernListe.perioden;
        if (this._steuernListe.tage > 0) anz++;

        this.clearSteuerTabelle();

        for(var _i = 0; _i < anz; _i++) {
            if (this._steuernListe.kapital[_i].periode > 0) periode = (_i+1).toString();
            else  {
                if (this._steuernListe.tage > 1) periode = this._steuernListe.tage.toString() + ' Resttage'
                else periode = '1 Resttag';
            }

            this._steuerTabelle.push({
                periode: periode,
                anlage: maskitoTransform(this._steuernListe.kapital[_i].anlage.toString(), this.currencyMaskOption),
                ertrag : maskitoTransform(this._steuernListe.kapital[_i].ertrag.toString(), this.currencyMaskOption),
                anlageneu : maskitoTransform(this._steuernListe.kapital[_i].anlageneu.toString(), this.currencyMaskOption),
                freibetrag : maskitoTransform(this._steuernListe.frei[_i].frei.toString(), this.currencyMaskOption),
                steuer : maskitoTransform(this._steuernListe.frei[_i].steuer.toString(), this.currencyMaskOption),
                steuerverlust : maskitoTransform(this._steuernListe.frei[_i].steuerverlust.toString(), this.currencyMaskOption)
            });
        }
    }
}
