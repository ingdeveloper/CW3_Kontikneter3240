import RezHttpApi = require("./rezHttpApi");
import { ServiceWahl } from "../rezepturEnums";

declare const window: any;
// hier Flag setzten, ob es sich um eine Testumgebung handelt z.B. Testphase OPUS/SAP usw.
const isTestEnv = false;
// const rootUrl = window.rootUrlPrefix; // lokaler Server
const rootUrl = "https://app-visu-01-p"; // z.B. zentraler Server
// const rootUrl = "https://wf-ersatz-w2k-1"; // z.B. zentraler Server

class RezServiceApi extends RezHttpApi {
  protected timeout: number = 15000;
  constructor() {
    super();
  }

  // Mapping-Tabelle
  protected WsPfad: { [key in ServiceWahl]: string } = {
    // [ServiceWahl.wcfSiem]: "http://localhost:22284/WcfPlcRezept",
    [ServiceWahl.wcfSiem]: `${rootUrl}/wcfSiemV2/WcfPlcRezept`,
    // [ServiceWahl.wcfSiem]: `${rootUrl}/wcfSiem/V2/WcfPlcRezept`,

    // [ServiceWahl.WcfRezept]: "http://localhost:22284/WsRezept",
    [ServiceWahl.WcfRezept]: `${rootUrl}/WcfRezeptV2/WsRezept`,
    // [ServiceWahl.WcfRezept]: `${rootUrl}/WcfRezept/V2/WsRezept`,

    // [ServiceWahl.WsCwSAP]: "http://localhost:21240/CwSAPService",
    [ServiceWahl.WsCwSAP]: `${rootUrl}/WsCwSAPV2/CwSAPService`,
    // [ServiceWahl.WsCwSAP]: `${rootUrl}/WsCwSAP/V2/CwSAPService`,

    // [ServiceWahl.WsCcwBde]: "http://localhost:18713/CcwBdeService",
    [ServiceWahl.WsCcwBde]: `${rootUrl}/WsCcwBdeV2/CcwBdeService`,
    // [ServiceWahl.WsCcwBde]: `${rootUrl}/WsCcwBde/V2/CcwBdeService`,
  };

  /** liefert Versionsinfo vom jeweiligen Webservice */
  public getVersion = async (Pfad: ServiceWahl) => {
    return await this.http<IGetVersion>(
      this.WsPfad[Pfad],
      "GetVersion",
      "GET",
      null,
      this.timeout
    );
  };

  /** getServerTime liefert aktuelle Serverzeit */
  public getServerTime = async (Pfad: ServiceWahl) => {
    let resp: any;
    return await this.http<any>(
      this.WsPfad[Pfad],
      "serverTime",
      "GET"
      // null,
      // this.timeout
    );

    // resp = await this.http(this.WsPfad.WcfRezept, "serverTime", "GET");
    // return resp;
    // return this.get<IServerTime>(
    //   this.WsPfad.WcfRezept,
    //   "serverTime",
    //   this.timeout
    // );
    //  default:
    //   console.error("getServerTime() - falsche Parameter");
    //   return Promise.reject<any>(
    //     new Error("getServerTime() - falsche Parameter")
    //   );
    // }
  };

  // Zufällige Verzögerung für Testzwecke
  // private getDelay(info: string): number {
  //   // var t = Math.round(Math.random() * 2);
  //   var t = Math.random() > 0.5 ? 1 : 0;
  //   console.log(info + ": " + t);
  //   return t;
  // }

  /** liefert Konfigurationsdaten für Rez.Dlg. */
  public getRezConfig = async (AnlagenNr: string) => {
    return await this.http<IGetRezConfigResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "getRezConfig",
      "GET",
      { AnlagenNr }
      // this.timeout
    );
  };

  public Ablieferzone = async (AnlagenNr: string, PaNr: any) => {
    return await this.http<IAblieferzoneResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "Ablieferzone",
      "GET",
      {
        AnlagenNr,
        PaNr,
      },
      this.timeout
    );

    // return this.post<IAblieferzoneResult>(
    //   this.WsPfad.WcfRezept,
    //   "Ablieferzone",
    // {
    //   AnlagenNr: AnlagenNr,
    //   PaNr: PaNr,
    // },
    //   this.timeout
    // );
  };

  /**
   * liefert eine Liste mit entsprechenden PA-Aufträgen
   * @param AnlagenNr Anlagennummer
   */
  public PaNr = async (AnlagenNr: number) => {
    type IResult = typeof isTestEnv extends true
      ? IPaNrTestEnvResult
      : IPaNrResult;
    return await this.http<IResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      isTestEnv ? "PaNrTestEnv" : "PaNr",
      "GET",
      {
        AnlagenNr,
      },
      this.timeout
    );

    // return this.post<IPaNr>(
    //   this.WsPfad.WcfRezept,
    //   "PaNr",
    //   {
    //     AnlagenNr: AnlagenNr,
    //   },
    //   this.timeout
    // );
  };

  // /** @param Command SQL-Befehl */
  // public ReadDatabase = async (Command: string) => {
  //   const resp = await this.http(this.WsPfad.WcfRezept, "ReadDatabase", "GET", {
  //     odbcCmd: Command,
  //   });
  //   return resp;
  // };

  /** Überprüft, ob ein Rezept vorhanden ist. */
  public IstRezeptVorhanden = async (param: IIstRezeptVorhRequest) => {
    return await this.http<IIstRezeptVorhandenResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "IstRezeptVorhanden",
      "GET",
      {
        RezNr: param.rezNr,
        RezVer: param.verNr,
        Abteilung: param.abteiNr,
        Werk: param.werk,
        Halle: param.halle,
        Etage: param.etage,
        Linie: param.linie,
        Maschine: param.maschine,
      },
      this.timeout
    );
  };

  /** liefert Userlevel */
  public GetUserRights = async (user: string, pass: string) => {
    return await this.http<IGetUserRightsResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "GetUserRights",
      "GET",
      { user, pass },
      this.timeout
    );
  };

  /** gibt eine Liste von Rezepten (RezList) zurück */
  public GetRezList = async (Command: {}) => {
    return await this.http<IGetRezListResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "GetRezList",
      "GET",
      Command,
      this.timeout
    );
  };

  /** gibt den Namen eines Rezepts zurück */
  public GetRezNamen = async (reznr: {}) => {
    return await this.http<IGetRezNamenResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "GetRezNamen",
      "GET",
      reznr
    );
  };

  /**
   * @param Command SQL-Befehl
   */
  public WriteDatabase = async (Command: string) => {
    return await this.http<IWriteDatabase>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "WriteDatabase",
      "POST",
      {
        odbcCmd: Command,
      },
      this.timeout
    );

    // return this.post<IWriteDatabase>(
    //   this.WsPfad.WcfRezept,
    //   "WriteDatabase",
    //   {
    //     odbcCmd: Command,
    //   },
    //   this.timeout
    // );
  };

  public SetDeletedRez = async (param: ISetDeletedRezRequest) => {
    return await this.http<ISetDeletedRezResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "SetDeletedRez",
      "PUT",
      {
        User: param.User,
        RezNr: param.RezNr,
        RezVer: param.RezVer,
        Werk: param.werk,
        Halle: param.halle,
        Etage: param.etage,
        Linie: param.linie,
        Abteilung: param.abteiNr,
        Maschine: param.maschine,
      },
      this.timeout
    );
  };

  public WriteToSpsRez = async (args: IWriteToSpsRezParams) => {
    // ------------------------------
    // Ausführung mit remote Service
    // ------------------------------
    return await this.http<IWriteToSpsRez>(
      this.WsPfad[ServiceWahl.wcfSiem],
      "WriteToSpsRez",
      "POST",
      {
        asWfServer: args.WfServer,
        asWfDb: args.WfDb,
        aiWerk: args.Werk,
        aiHalle: args.Halle,
        aiEtage: args.Etage,
        aiLinie: args.Linie,
        aiAbteil: args.Abteil,
        aiMasch: args.Maschine,
        asRezNr: args.RezeptNr,
        asRezVer: args.RezeptVer,
        asWfFilter: args.WfFilter,
      },
      this.timeout
    );

    // -----------------------------
    // Ausführung mit local Service
    // -----------------------------
    // const resp = await fetch('http://localhost:8011/WcfPlcRezept.svc/js/WriteToSpsRez', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     asWfServer: WfServer,
    //     asWfDb: WfDb,
    //     aiWerk: Werk,
    //     aiHalle: Halle,
    //     aiEtage: Etage,
    //     aiLinie: Linie,
    //     aiAbteil: Abteil,
    //     aiMasch: Maschine,
    //     asRezNr: RezeptNr,
    //     asRezVer: RezeptVer,
    //     asWfFilter: WfFilter,
    //   }),
    //   headers: { "Content-Type": "application/json; charset=utf-8" },
    // });
    // return resp;

    // ------------------------
    // Alte Ausführung mit XHR
    // ------------------------
    // return this.post<IWriteToSpsRez>(
    //   this.WsPfad.wcfSiem,
    //   "WriteToSpsRez",
    //   {
    //     asWfServer: WfServer,
    //     asWfDb: WfDb,
    //     aiWerk: Werk,
    //     aiHalle: Halle,
    //     aiEtage: Etage,
    //     aiLinie: Linie,
    //     aiAbteil: Abteil,
    //     aiMasch: Maschine,
    //     asRezNr: RezeptNr,
    //     asRezVer: RezeptVer,
    //     asWfFilter: WfFilter,
    //   },
    //   this.timeout
    // );
  };

  public WriteToDB = async (args: IWriteToDBParams) => {
    return await this.http<IWriteToDB>(
      this.WsPfad[ServiceWahl.wcfSiem],
      "WriteToDB",
      "POST",
      {
        aData: args.Data,
        asUserName: args.User,
        aiWerk: args.Werk,
        aiHalle: args.Halle,
        aiEtage: args.Etage,
        aiLinie: args.Linie,
        aiAbteil: args.Abteil,
        aiMasch: args.Maschine,
        asRezNr: args.RezeptNr,
        asRezVer: args.RezeptVer,
        asRezName: args.RezeptName,
      },
      this.timeout
    );

    // return this.post<IWriteToDB>(
    //   this.WsPfad.wcfSiem,
    //   "WriteToDB",
    //   {
    //     aData: Data,
    //     asUserName: User,
    //     aiWerk: Werk,
    //     aiHalle: Halle,
    //     aiEtage: Etage,
    //     aiLinie: Linie,
    //     aiAbteil: Abteil,
    //     aiMasch: Maschine,
    //     asRezNr: RezeptNr,
    //     asRezVer: RezeptVer,
    //     asRezName: RezeptName,
    //   },
    //   120000
    // );
  };

  public UpdateRezDB = async (args: IUpdateRezDBParams) => {
    return await this.http<IUpdateRezDB>(
      this.WsPfad[ServiceWahl.wcfSiem],
      "UpdateRezDB",
      "POST",
      {
        aData: args.Data,
        asUserName: args.User,
        aiWerk: args.Werk,
        aiHalle: args.Halle,
        aiEtage: args.Etage,
        aiLinie: args.Linie,
        aiAbteil: args.Abteil,
        aiMasch: args.Maschine,
        asRezNr: args.RezeptNr,
        asRezVer: args.RezeptVer,
        asRezName: args.RezeptName,
      },
      this.timeout
    );
  };

  /** startet bzw. stoppt die Produktionsaufträge */
  // hier eine Ausnahme: da OPUS auch 500-er Status zurücksendet wird es weitergeleitet
  // bitte nicht auf Standardmethode wie this.http umstellen
  public PaStartStop = async (args: IPaStartStopParams) => {
    type IResult = typeof isTestEnv extends true
      ? IPaStartStopTestEnvResult
      : IPaStartStopResult;
    return await this.post<IResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      isTestEnv ? "PaStartStopTestEnv" : "PaStartStop",
      {
        aAnlagenNr: args.AnlagenNr,
        aProdAufNummer: args.ProdAufNummer,
        aStatus: args.Status,
        aAblieferZone: args.AblieferZone,
        aAnswerRework: args.AnswerRework,
        userName: args.userName,
        callId: "OPUSDATA->OP " + moment().format("DD.MM.YYYY HH:mm:ss"),
        prodTyp: args.prodTyp,
      }
    );
  };

  /** liest Rez.Log. aus DB */
  public ReadRezActivity2 = async (args: IReadRezActivityArgs) => {
    const { AnlagenNr, startDt, stopDt } = args;
    return await this.http<IRezLogsResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "ReadRezActivity2",
      "GET",
      {
        AnlagenNr,
        startDt,
        stopDt,
      },
      this.timeout
    );
  };

  /** hollt die Gebindemenge */
  public Gebindemenge = async (ArtikelNr: string) => {
    return await this.http<IGebindemengeResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "Gebindemenge",
      "GET",
      {
        ArtikelNr,
      },
      this.timeout
    );
  };

  /** schreibt Rez.Log. in DB */
  public WriteRezActivity = async ({
    Zeitstempel,
    AnlagenNr = 0,
    AnlagenName = "undefiniert",
    Bediener = "unbekannt",
    MldTyp = 0,
    Meldung = "undefiniert",
    PaNr = 0,
    ArtNr = 0,
    Altern = 0,
    Variant = 0,
  }: IWriteActivityParams) => {
    return await this.http<void>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "WriteRezActivity",
      "POST",
      {
        Zeitstempel,
        AnlagenNr,
        AnlagenName,
        Bediener: Bediener.replace(/[\n]/gm, "; ").slice(0, 1000),
        MldTyp,
        Meldung: Meldung.slice(0, 1000),
        PaNr,
        ArtNr,
        Altern,
        Variant,
      },
      this.timeout
    );
  };

  /** schreibt Rez.Log. in DB */
  public WriteRezActivity2 = async (data: IWriteActivityParamsWithDate) => {
    return await this.http<void>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "WriteRezActivity2",
      "POST",
      data,
      this.timeout
    );
  };

  /** Liest und Sortiert die rezeptrelevante Variablen aus WF-Datenbank */
  public GetSortedRezVarnames = async (args: IGetRezVarnamesParams) => {
    const { WfServer, WfDb, WfFilter } = args;
    return await this.http<IGetSortedRezVarnames>(
      this.WsPfad[ServiceWahl.wcfSiem],
      "GetSortedRezVarnames",
      "GET",
      {
        asWfServer: WfServer,
        asWfDb: WfDb,
        asWfFilter: WfFilter,
      },
      this.timeout
    );
  };

  /** Liest und Sortiert die rezeptrelevante Variablen aus WF-Datenbank */
  public GetVirtualRezVarnames = async (args: IGetRezVarnamesParams) => {
    const { WfServer, WfDb, WfFilter } = args;
    return await this.http<IGetVirtualRezVarnames>(
      this.WsPfad[ServiceWahl.wcfSiem],
      "GetVirtualRezVarnames",
      "GET",
      {
        asWfServer: WfServer,
        asWfDb: WfDb,
        asWfFilter: WfFilter,
      },
      this.timeout
    );
  };

  public GetClientIP = async () => {
    return await this.http<IGetClientIPResult>(
      this.WsPfad[ServiceWahl.wcfSiem],
      "GetClientIP",
      "GET",
      null,
      this.timeout
    );
  };

  public GetClientName = async () => {
    return await this.http<IGetClientNameResult>(
      this.WsPfad[ServiceWahl.wcfSiem],
      "GetClientName",
      "GET",
      null,
      this.timeout
    );

    // return this.get<IClientNameResult>(
    //   this.WsPfad.wcfSiem,
    //   "GetClienName",
    //   this.timeout
    // );
  };

  /** liest die angefragten Daten aus der SPS (direkte Verbindung)*/
  public async ReadFromSpsTransl(WfDb: string, Data: IaData[]) {
    const requestData = {
      asWfServer: window.location.hostname,
      asWfDb: WfDb,
      aData: Data,
    };

    return await this.http<IReadFromSpsTransl>(
      this.WsPfad[ServiceWahl.wcfSiem],
      "ReadFromSpsTransl",
      "GET",
      requestData,
      this.timeout
    );
  }

  /**
   * Schreibt Daten in SPS (direkte Verbindung)
   * @param WfDb DB-Name
   * @param Data Nutzdaten, die geschrieben werden sollen
   * @param WfServPath Server\DBPfad (optional) z.B. 'WF-Verp3250\\I4SCADA',
   * bei nicht Vergabe des Parameters wird der lokaler Servernamen und als
   * Pfad 'WEBFACTORY2010' eingesetzt
   * @returns IWriteToSpsTransl
   */
  public WriteToSpsTransl = async (args: IWriteToSpsTranslParams) => {
    const pfad = !args.WfServPath ? window.location.hostname : args.WfServPath;
    return await this.http<IWriteToSpsTransl>(
      this.WsPfad[ServiceWahl.wcfSiem],
      "WriteToSpsTransl",
      "POST",
      {
        // asWfServer: 'WF-Verp3250\\I4SCADA',
        asWfServer: pfad,
        asWfDb: args.WfDb,
        aData: args.Data,
      },
      this.timeout
    );
  };

  /** Betriebsdatenerfassung (BDE)*/
  public AddBetriebsdaten = async (args: IAddBetriebsdatenRequest) => {
    const { config } = args;
    return await this.http<IAddBetriebsdatenResponse>(
      this.WsPfad[ServiceWahl.wcfSiem],
      "AddBetriebsdaten",
      "POST",
      {
        // obwohl die WebMethode "AddBetriebsdaten" mehrere configs verarbeiten kann
        // wird es an der Stelle nur einmal realisiert
        config: [{ ...config }],
      },
      this.timeout
    );
  };

  /**
   * gibt die Länge von DB2-DB zurück
   * @example {Promise}
   * <CountDataTableResponse xmlns="http://tempuri.org/">
   * <CountDataTableResult>620</CountDataTableResult>
   * </CountDataTableResponse>
   * @returns {Promise} Anzahl Zeilen
   */
  public checkRecipeDb = async (args: ICheckRecipeDbParams) => {
    return await this.http<ICountDataTableResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "CountDataTable",
      "GET",
      {
        RezNr: args.rezNr,
        RezVer: args.rezVer,
        Werk: args.config.werk,
        Halle: args.config.halle,
        Etage: args.config.etage,
        Linie: args.config.linie,
        Maschine: args.config.maschine,
        Abteilung: args.config.abteiNr,
      },
      this.timeout
    );
  };

  /**
   * liefert Assembly Version u. BuildDate
   * @returns {Promise}
   */
  public GetWsSapVer = async () => {
    return await this.http<IWcfResult>(
      this.WsPfad[ServiceWahl.WsCwSAP],
      "GetVersion",
      "GET",
      null,
      this.timeout
    );
  };

  /** Ruft die BDE_Lobster-Tabelle ab.
   * @returns {Promise} GetBdeLobstResult
   */
  public GetBdeLobst = async () => {
    return await this.http<IWcfResult>(
      this.WsPfad[ServiceWahl.WsCwSAP],
      "GetBdeLobst",
      "GET",
      null,
      this.timeout
    );
  };

  /**
   * Setzt die BdeLobsterData-Daten basierend auf den bereitgestellten BdeLobsterValues-Daten.
   * @returns {Promise} SetBdeLobstResult
   */
  public SetBdeLobst = async (data: ISetBdeLobst) => {
    return await this.http<ISetBdeLobstResult>(
      this.WsPfad[ServiceWahl.WsCwSAP],
      "SetBdeLobst",
      "POST",
      {
        data,
      },
      this.timeout
    );
  };

  /**
   * Setzt die Werte für StoerBdeLobst.
   * @returns {Promise} SetBdeLobstResult
   */
  public SetStoerBdeLobst = async (args: ISetBdeLobst) => {
    return await this.http<ISetStoerBdeLobstResult>(
      this.WsPfad[ServiceWahl.WsCwSAP],
      "SetStoerBdeLobst",
      "POST",
      { data: { args } },
      this.timeout
    );
  };

  /**
   * Beendet alle nicht abgeschlossenen Aufträge unter einer bestimmten Ressourcennummer.
   * @param {number} RessNr - Die Ressourcennummer, unter der die Aufträge laufen.
   * @param {number} ZaehlNr - Die Zählernummer, unter der die BDE läuft.
   * @returns {Promise<IStopAllBdeLobstResponse>} Ein Promise, das ein IStopAllBdeLobstResponse-Objekt zurückgibt, das den Erfolgsstatus, die verstrichene Zeit und eine Liste der beendeten Auftragsnummern enthält.
   */
  public StopAllBdeLobst = async (
    RessNr: number,
    ZaehlNr: number
  ): Promise<IStopAllBdeLobstResponse> => {
    return await this.http<IStopAllBdeLobstResponse>(
      this.WsPfad[ServiceWahl.WsCwSAP],
      "StopAllBdeLobst",
      "POST",
      { ressNr: RessNr, zaehlNr: ZaehlNr },
      this.timeout
    );
  };

  /**
   * Ruft gestartete und nicht abgeschlossene PA-Aufträge ab, basierend auf der bereitgestellten PaNr.
   * @returns {Promise} Gibt ein WsCwSAPResult-Objekt zurück, das die abgerufenen BdeLobsterData-Daten enthält.
   */
  public GetBdeLobstUncomp = async (PaNr: number, RessNr: number) => {
    return await this.http<IGetBdeLobstUncompResponse>(
      this.WsPfad[ServiceWahl.WsCwSAP],
      "GetBdeLobstUncomp",
      "GET",
      { PaNr, RessNr },
      this.timeout
    );
  };

  /**
   * Diese Methode liefert liefert Anzahl nicht kommentierten Störungsmeldungen
   * Sie führt eine gespeicherte Prozedur in der Datenbank aus und gibt das Ergebnis zurück.
   * Im Falle eines Fehlers während der Ausführung wird eine Fehlermeldung zurückgegeben.
   * @returns {Promise} GetFaultDurationResult
   */
  // public GetFaultCount = async (ressnr: number): Promise<any> => {
  // await rezUtils.sleep(100); // Simuliert eine Verzögerung für Testzwecke
  // return {
  //   "GetFaultCountResult": {
  //     "Data": Math.random() < 0.5 ? 0 : 1,
  //     "ErrorMsg": ressnr,
  //     "ErrorNr": 0,
  //     "Msg": "00:00:00",
  //     "Succeed": true
  //   }
  // };
  public GetFaultCount = async (ressnr: number): Promise<any> => {
    return await this.http<IGetFaultCountResult>(
      this.WsPfad[ServiceWahl.WsCcwBde],
      "GetFaultCount",
      "GET",
      { ressnr },
      this.timeout
    );
  };

  /**
   * Diese Methode liefert die Dauer aufsummierten Störungen basierend auf der Ressourcen-ID, der PaNr und der RezNr.
   * Sie führt eine gespeicherte Prozedur in der Datenbank aus und gibt das Ergebnis zurück.
   * Im Falle eines Fehlers während der Ausführung wird eine Fehlermeldung zurückgegeben.
   * @returns {Promise} GetFaultDurationResult
   */
  public GetFaultDuration = async (args: ISetBdeLobst) => {
    return await this.http<IWcfResult>(
      this.WsPfad[ServiceWahl.WsCcwBde],
      "GetFaultDuration",
      "GET",
      { data: { args } },
      this.timeout
    );
  };

  public async GetSignRecipeDifferences(config: any) {
    return await this.http<any>(
      this.WsPfad[ServiceWahl.wcfSiem],
      "GetSignalRezInfo",
      "GET",
      config,
      this.timeout
    );
  }

  public async GetSignRecipeValues(config: any) {
    return await this.http<any>(
      this.WsPfad[ServiceWahl.wcfSiem],
      "GetSignalRezValue",
      "GET",
      config,
      this.timeout
    );
  }

  public async GetSignalProperty(config: any) {
    return await this.http<any>(
      this.WsPfad[ServiceWahl.wcfSiem],
      "GetSignalProperty",
      "GET",
      config,
      this.timeout
    );
  }

  public async GetRezSpsConfig(AnlagenNr: number) {
    return await this.http<IGetRezSpsConfigResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "GetRezSpsConfig",
      "GET",
      { AnlagenNr },
      this.timeout
    );
  }

  public async GetRezDlgConfig(AnlagenNr: number) {
    return await this.http<IGetRezDlgConfigResult>(
      this.WsPfad[ServiceWahl.WcfRezept],
      "GetRezDlgConfig",
      "GET",
      { AnlagenNr },
      this.timeout
    );
  }
}
export = RezServiceApi;
