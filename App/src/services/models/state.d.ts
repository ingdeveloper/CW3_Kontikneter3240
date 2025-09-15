interface IState {
    stateSignalName1?: string | KnockoutObservable<string>;
    stateSignalName2?: string | KnockoutObservable<string>;
    stateSignalName3?: string | KnockoutObservable<string>;
    stateSignalName4?: string | KnockoutObservable<string>;
    stateSignalName5?: string | KnockoutObservable<string>;
    stateSignalName6?: string | KnockoutObservable<string>;
    stateSignalName7?: string | KnockoutObservable<string>;
    stateSignalName8?: string | KnockoutObservable<string>;
    stateSignalNames?: string[] | KnockoutObservable<string>[];

    conditionRule1?: string;
    conditionRule2?: string;
    conditionRule3?: string;
    conditionRule4?: string;
    conditionRule5?: string;
    conditionRule6?: string;
    conditionRule7?: string;
    conditionRule8?: string;
    conditionRules?: string[];

    maskSignal1?: string | number;
    maskSignal2?: string | number;
    maskSignal3?: string | number;
    maskSignal4?: string | number;
    maskSignal5?: string | number;
    maskSignal6?: string | number;
    maskSignal7?: string | number;
    maskSignal8?: string | number;
    maskSignals?: any[];

    operator1?: string;
    operator2?: string;
    operator3?: string;
    operator4?: string;
    operator5?: string;
    operator6?: string;
    operator7?: string;
    operator8?: string;
    operators?: string[];

    objectID?: string;
    writeToBuffer: boolean;
    states?: IStateModel[];
}

interface IStateModel {
    signalName?: string | KnockoutObservable<string>;
    maskSignal?: string | number;
    conditionRule?: string;
    operator?: string;
    cssClassName?: string;
    symbolicText?: string;
    isValid?: KnockoutObservable<boolean>;
}