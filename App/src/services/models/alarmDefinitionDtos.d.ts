interface AlarmDefinitionsDTO {
    Definitions: AlarmDefinitionDTO[];
    HasMore: boolean;
}

interface SignalDTO extends DTO {
    Name: string;
    AliasName: string;
    Description: string;
}

interface AlarmDefinitionDTO extends TranslatableDTO {

    Signal: SignalDTO;
    Tag: string;
    Active: boolean;
    Type: TranslatableDTO;
    Group: TranslatableDTO;
    Cond: NameDTO;
    Replace: number;
    Prio: number;
    PLCOn: number;
    PLCSignal: SignalDTO;
    PLCValue?: number;
    Link: string;
    Online: boolean;
    ExecScript: boolean;
    ScriptPath: string;
    EnableLP: boolean;
    Symbol: number;
    Status: number;
    ReactTime: Date;
    Suppression: number;
    DeactivationSignal: SignalDTO;

    RSig1: SignalDTO;
    RSig2: SignalDTO;
    RSig3: SignalDTO;
    RSig4: SignalDTO;
    RSig5: SignalDTO;
    RSig6: SignalDTO;
    RSig7: SignalDTO;
    RSig8: SignalDTO;
    RSig9: SignalDTO;
    RSig10: SignalDTO;
    RSig11: SignalDTO;
    RSig12: SignalDTO;
    RSig13: SignalDTO;
    RSig14: SignalDTO;
    RSig15: SignalDTO;
    RSig16: SignalDTO;
    RSig17: SignalDTO;
    RSig18: SignalDTO;
    RSig19: SignalDTO;
    RSig20: SignalDTO;

    Cause: TranslatableDTO;
    Effect: TranslatableDTO;
    Repair: TranslatableDTO;
    Ep1: string;
    Ep2: string;
    Ep3: string;
    Ep4: string;
    Ep5: string;
    Ep6: string;
    Ep7: string;
    Ep8: string;
    Ep9: string;
    Ep10: string;
    Ep11: string;
    Ep12: string;
    Ep13: string;
    Ep14: string;
    Ep15: string;
    Ep16: string;
    Ep17: string;
    Ep18: string;
    Ep19: string;
    Ep20: string;
    Ep21: string;
    Ep22: string;
    Ep23: string;
    Ep24: string;
    Ep25: string;
    Ep26: string;
    Ep27: string;
    Ep28: string;
    Ep29: string;
    Ep30: string;
    Ep31: string;
    Ep32: string;

    NavSrc: string
    NavTarget: string
    Comment: string
    Custom: boolean;
    I4Enabled: boolean;
}

interface RangeDTO<T> {
    Minimum: T;
    Maximum: T;
}

interface AlarmDefinitionFilterDTO extends DTO {

    UserName: string;
    IsDomainUser: boolean;
    LangID: number;
    Tag: string;
    Signal: string;
    Active?: boolean;
    Custom?: boolean;
    Online?: boolean;
    Groups: string[];
    Types: string[];
    CondIDs: Guid[]
    Prio: RangeDTO<number>;
    Text: string;
    Link: string;
    Suppression: RangeDTO<number>;
    PlcOn?: boolean;
    PlcSignal: string;
    ExecScript?: boolean;
    ScriptPath: string;
    EnableLP?: boolean;
    NavSrc: string;
    NavTarget: string;
    Comment: string;
    FilterAlarmGroupsByUser: boolean;
    DeactivationSignal: string;

    RSig1: string;
    RSig2: string;
    RSig3: string;
    RSig4: string;
    RSig5: string;
    RSig6: string;
    RSig7: string;
    RSig8: string;
    RSig9: string;
    RSig10: string;
    RSig11: string;
    RSig12: string;
    RSig13: string;
    RSig14: string;
    RSig15: string;
    RSig16: string;
    RSig17: string;
    RSig18: string;
    RSig19: string;
    RSig20: string;

    Ep1: string;
    Ep2: string;
    Ep3: string;
    Ep4: string;
    Ep5: string;
    Ep6: string;
    Ep7: string;
    Ep8: string;
    Ep9: string;
    Ep10: string;
    Ep11: string;
    Ep12: string;
    Ep13: string;
    Ep14: string;
    Ep15: string;
    Ep16: string;
    Ep17: string;
    Ep18: string;
    Ep19: string;
    Ep20: string;
    Ep21: string;
    Ep22: string;
    Ep23: string;
    Ep24: string;
    Ep25: string;
    Ep26: string;
    Ep27: string;
    Ep28: string;
    Ep29: string;
    Ep30: string;
    Ep31: string;
    Ep32: string;
    Translation: string;
    Cause: string;
    Effect: string;
    Repair: string;
    Replace?: boolean;

    Start: number;
    Count: number;
    IsI4Enabled?: boolean;
    AlarmIDs: Guid[];
}