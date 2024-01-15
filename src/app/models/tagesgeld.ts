export enum Zinzperiode {
    ohneZinseszins = 0,
    monatlich,
    vierteljaehrlich,
    halbjaehrlich,
    jaehrlich,
    taeglich
}

export enum Zinsmethode {
    DeutscheZinsmethode = 0,    // 30/360
    Eurozinsmethode,            // act/360
    EnglischeZinsmethode,       // act/365
    TaggenaueZinsmethode        // act/act
}

export interface IZinsstaffel {
    guthaben : number,
    zinssatz : number
}

export interface IDatumsbereich {
    aktiv : boolean,
    anfangsdatum? : Date,
    anfangmitzaehlen : boolean
    enddatum? : Date,
    endmitzaehlen : boolean
}

export interface ISteuern {
    aktiv : boolean,
    steuersatz : number,
    steuerfreibetrag : number
}

export interface ITagesgeld {
    anlagekapital : number,
    zinsstaffel? : Array<IZinsstaffel>,
    zinssatz : number,
    zinzperiode : Zinzperiode,
    datumsbereich : IDatumsbereich,
    zinstage : number,
    zinsertrag : number,
    zinsmethode : Zinsmethode,
    steuern : ISteuern
}
  