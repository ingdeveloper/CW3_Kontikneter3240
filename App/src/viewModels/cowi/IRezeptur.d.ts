interface IAblieferzoneResult {
  AblieferzoneResult: any[];
}

interface IGetVersionResult {
  buildDate: string;
  version: string;
}
interface IGetVersion {
  GetVersionResult: IGetVersionResult;
}
interface IGetCurrDateTime {
  GetCurrDateTimeResult: any;
}

interface IServerTime {
  serverTimeResult: any;
}

interface IPaNrResult {
  PaNrResult: IWcfResult;
}
interface IPaNrTestEnvResult {
  PaNrResult: IWcfResult;
}

interface IWriteDatabase {
  WriteDatabaseResult: string;
}

interface IWriteToSpsRez {
  WriteToSpsRezResult: IWcfResult;
}

interface IWriteToDB {
  WriteToDBResult: IWcfResult;
}

interface IUpdateRezDB {
  UpdateRezDBResult: IWcfResult;
}

interface IGetSortedRezVarnames {
  GetSortedRezVarnamesResult: IWcfResult;
}
interface IGetVirtualRezVarnames {
  GetVirtualRezVarnamesResult: IWcfResult;
}

interface IGetFaultCountResult {
  GetFaultCountResult: IWcfResult;
}

interface IGetClientIPResult {
  GetClientIPResult: IClientResultWithData;
}

interface IGetClientNameResult {
  GetClientNameResult: IClientResultWithData;
}
interface IClientResultWithData extends IWcfResult {
  Data: string;
}
interface ICountDataTableResult {
  CountDataTableResult: IWcfResult;
}

interface IGetRezSpsConfigResult extends IWcfResult { GetRezSpsConfigResult: IWcfResult; }

interface IGetRezDlgConfigResult extends IWcfResult { GetRezDlgConfigResult: IWcfResult; }

interface IWcfResult {
  Data: any;
  ErrorMsg: any;
  ErrorNr: number;
  Msg: string;
  Succeed: boolean;
}

interface IDlgRespLogInOut {
  state: number; // 0 = close; 1 = login; 2 = logout;
  vorname: string;
  nachname: string;
  usid: string;
  usberez: string;
}

interface IDlgRezEdit {
  state: number; // 0 = close; 1 = login; 2 = logout;
  vorname: string;
  nachname: string;
  /** User ID */
  usid: string;
  /** Userbechtigung */
  usberez: string;
}

interface IXOpusMsg {
  UserMsg: string;
  CallId: string;
  DBRqID: string;
}

interface ICheckRecipeDbParams {
  rezNr: any;
  rezVer: any;
  config: IAnlagenKennung;
}
interface IWriteToSpsTranslParams {
  WfDb: string;
  Data: IaData[];
  WfServPath?: string;
}
interface IGetRezVarnamesParams {
  WfServer: string;
  WfDb: string;
  WfFilter: string;
}
interface IWriteActivityParams {
  Zeitstempel: DateTime;
  AnlagenNr: number;
  AnlagenName: string;
  Bediener: string;
  MldTyp: any;
  Meldung: string;
  PaNr: number;
  ArtNr: number;
  Altern: number;
  Variant: number;
}
interface IWriteActivityParams2 {
  AnlagenNr: number;
  Anlagenname: string;
  Zeitstempel: DateTime;
  MeldungsTyp: any;
  Bediener: string;
  Meldung: string;
  PaNr: number;
  ArtikelNr: number;
  Altern: string | number;
  Variante: number;
}
interface IWriteActivityParamsWithDate {
  meldungenList: IWriteActivityParams2[]
}
interface IWriteToSpsRezParams {
  WfServer: string;
  WfDb: string;
  Werk: number;
  Halle: number;
  Etage: number;
  Linie: number;
  Abteil: number;
  Maschine: number;
  RezeptNr: any;
  RezeptVer: any;
  WfFilter: string;
}
interface IWriteToDBParams {
  Data: any;
  User: string;
  Werk: number;
  Halle: number;
  Etage: number;
  Linie: number;
  Abteil: number;
  Maschine: number;
  RezeptNr: any;
  RezeptVer: any;
  RezeptName: any;
}
interface IUpdateRezDBParams extends IWriteToDBParams { }
interface IPaStartStopParams {
  AnlagenNr: number;
  ProdAufNummer: any;
  Status: number;
  AblieferZone: number;
  AnswerRework: boolean;
  userName: string;
  prodTyp: string;
}

interface IPaStartStopResult {
  PaStartStopResult: IXOpusMsg;
}
interface IPaStartStopTestEnvResult {
  PaStartStopResult: IXOpusMsg;
}

interface IAnlagenKennung {
  werk: number;
  halle: number;
  etage: number;
  linie: number;
  maschine: number;
  anlagenNr: number;
  abteiNr: number;
}

interface ISetDeletedRezRequest extends IAnlagenKennung {
  User: string;
  RezNr: string;
  RezVer: string;
  anlagenNr?: number;
}

interface ISetDeletedRezResult {
  SetDeletedRezResult: ISetDeletedRezResultWithData;
}

interface ISetDeletedRezResultWithData extends IWcfResult {
  Data: boolean;
}

interface IIstRezeptVorhRequest extends IAnlagenKennung {
  anlagenNr?: number;
  rezNr: string;
  verNr: number;
}
interface IIstRezeptVorhandenResultWithData extends IWcfResult {
  Data: boolean;
}
interface IIstRezeptVorhandenResult {
  IstRezeptVorhandenResult: IIstRezeptVorhandenResultWithData;
}

interface IGetRezConfigResult {
  GetRezConfigResult: IGetRezConfigResultWithData;
}

interface IGetRezList extends IAnlagenKennung {
  reznr: number | string;
  rezver: number | string;
  abteiNr?: number | string;
  anlagenNr?: number | string;
}

interface IGetRezListResult {
  GetRezListResult: IGetRezListResultWithArray;
}

interface IGetRezListResultWithArray extends IWcfResult {
  Data: string[];
}

interface IGetRezNamenResult {
  GetRezNamenResult: IGetRezNamenResultWithArray;
}

interface IGetRezNamenResultWithArray extends IWcfResult {
  Data: string[];
}
interface IGetUserRightsResult {
  GetUserRightsResult: IGetUserRightsResultWithData;
}

interface IGetUserRightsResultWithData extends IWcfResult {
  Data: {
    Usberez: number;
    Usid: number;
  };
}

/** Abliferzonen Dialog Interface
 * @start Datum und Uhrzeit Produktionsstart
 * @ende Datum und Uhrzeit Produktionsende
 * @grundrezept Beschreibt ob das gewählte Rezept übertragen werden soll
 */
interface IDlgAblieferzone {
  start: string;
  stop: string;
  leistung: number;
  zone: number;
  grundrezept: boolean;
  rework: boolean;
  ofenautostart?: boolean;
}

// interface IGebindemenge {
//   Stueck: string;
//   EAN: string;
// }

interface IGebindemengeResult {
  GebindemengeResult: IWcfResult;
}

interface ISetBdeLobstResult {
  SetBdeLobstResult: IWcfResult;
}

interface ISetStoerBdeLobstResult {
  SetStoerBdeLobstResult: IWcfResult;
}


interface IRezDlgKonfig {
  LbstSvc_Enabl: boolean;
  LbstRngMld_Enabl: boolean;
  Auftr_33333_Enabl: boolean;
  Auftr_77777_Enabl: boolean;
  Auftr_88888_Enabl: boolean;
  Auftr_99999_Enabl: boolean;
  TestEnv_Enabl: boolean;
  ServicePfad: string;
}

interface IRezDlgValueParams extends IComponentBaseParams {
  serverName: string;
  databaseName: string;
  filter: string[];

  signalNameRezNr: string;
  signalNamePaNr: string;
  signalNameVerNr: string;
  signalNamePaAktiv: string;
  signalNameProdTyp: string;
  signalNameSpsCnfg: string;
  signalNameRework: string;
  signalNameNetzNr: string;

  signalNamePaStart: string;
  signalNamePaStop: string;

  signalNameOfenStartCalc: string;
  signalNameSollNachlauf: string;
  signalNameIstNachlauf: string;

  lobsterServiceEnabled: boolean;

  signalNameGebindeanzahl: string;

  signalNamePlanLeistung: string;
  signalNamePilotLevel: string;

  signalNameFaktor: string;

  signalNameFreigabeLaden: string;
  grundFreigabeLaden: string;

  signalNameAnlagenNr: string;
  signalNameZaehlerNr: string;

  werk: number;
  halle: number;
  etage: number;
  linie: number;
  maschine: number;
  anlagenNr: number | string;
  zaehlerNr: number | string;
  abteiNr: number;

  kennung: FnktKennung;

  fn: {
    vmContext: any;
    paAktiviert: any;
    rezGesendet: any;
    rezGespeichert: any;
    rezLog: any;
  };
}

interface IRezLogsResult {
  ReadRezActivity2Result: IWcfResult;
}

interface IReadRezActivityArgs {
  AnlagenNr: number;
  startDt: string;
  stopDt: string;
}

interface IaData {
  AliasName: string;
  Adresse: string;
  Factor: string;
  Description: string;
  Value: string;
}

interface resultData {
  Data: string[];
  ErrorMsg: string;
  ErrorNr: number;
  Msg: string;
  Succeed: boolean;
}

interface IReadFromSpsTransl {
  ReadFromSpsTranslResult: resultData;
}
interface IWriteToSpsTransl {
  WriteToSpsTranslResult: resultData;
}

interface IAddBetriebsdatenRequest {
  config: IBdeConfig;
}

interface IBdeConfig {
  Werk: number;
  Halle: number;
  Etage: number;
  Linie: number;
  Maschine: number;
  Abteilung: number;
  PaNr: number;
  Bereich: LogBereich;
  DetailDaten: DetailDaten[];
}

interface DetailDaten {
  FieldName: string;
  FieldValue: string;
}

declare enum LogBereich {
  Chargen = 2,
  Betrieb = 3,
  Logdaten = 4,
  Anlagendaten = 5,
}

interface IAddBetriebsdatenResponse {
  AddBetriebsdatenResult: resultData;
}

interface ISetBdeLobst {
  AuftArt: eAuftArt;
  Fnkt: number;
  PaNr: number;
  RessNr: number;
  ZaehlNr: number;
  RezNr: number;
  Wert: number;
  VorgNr: number;
  RueckNr: number;
}

interface IData {
  AuftArt: number;
  CrTS: string;
  Fnkt: number;
  GrpID: number;
  ID: number;
  LbstStat: number;
  PaNr: number;
  RessNr: number;
  RezNr: number;
  RueckNr: number;
  VorgNr: number;
  Wert: number;
  ZaehlNr: number;
}

interface IGetBdeLobstUncompResult {
  Data: {
    Data: IData[];
  };
  ErrorMsg: null | string;
  ErrorNr: number;
  Msg: string;
  Succeed: boolean;
}

interface IGetBdeLobstUncompResponse {
  GetBdeLobstUncompResult: IGetBdeLobstUncompResult;
}

interface IStopAllBdeLobstResult {
  Data: number[];
  ErrorMsg: null | string;
  ErrorNr: number;
  Msg: string;
  Succeed: boolean;
}

interface IStopAllBdeLobstResponse {
  StopAllBdeLobstResult: IStopAllBdeLobstResult;
}
