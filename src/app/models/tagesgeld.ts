export enum Zinzperioden {
    ohneZinseszins = 0,
    monatlich = 12,
    vierteljährlich = 4,
    halbjährlich = 2,
    jährlich = 1,
    täglich = 360
}

export enum Zinsmethoden {
    DeutscheZinsmethode = 0,    // 30E/360
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
    steuerfreibetrag : number,
    steuern : number
}

export interface ITagesgeld {
    anlagekapital : number,
    zinsstaffel? : Array<IZinsstaffel>,
    zinssatz : number,
    zinzperiode : Zinzperioden,
    datumsbereich : IDatumsbereich,
    zinstage : number,
    zinsertrag : number,
    zinsmethode : Zinsmethoden,
    steuern : ISteuern
}

export interface IKapitalElement {
    periode : number,
    anlage : number,
    ertrag : number
    anlageneu : number,
}

export interface ISteuerElement {
    periode : number,
    frei : number,
    steuer : number,
    steuerverlust : number
}

export interface ISteuerListe {
    perioden : number,
    tage : number,
    kapital : IKapitalElement[],
    frei : ISteuerElement[]
}

export interface ISteuerDisplay {
    periode : string,
    anlage : string,
    ertrag : string,
    anlageneu : string,
    freibetrag : string,
    steuer : string,
    steuerverlust : string   
}