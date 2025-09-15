import RezServiceApi from "./rezServiceApi";
import { ServiceWahl } from "../rezepturEnums";
import CryptoJS = require("./CryptoJS");

class RezService {
  public static serviceApi = new RezServiceApi();

  public static getVersion(ws: ServiceWahl) {
    return this.serviceApi.getVersion(ws);
  }

  public static getServerTime(ws: ServiceWahl) {
    return this.serviceApi.getServerTime(ws);
  }

  public static Ablieferzone(AnlagenNr: string, PaNr: any) {
    return this.serviceApi.Ablieferzone(AnlagenNr, PaNr);
  }

  /**
   * liefert eine Liste mit entsprechenden PA-Aufträgen
   * @param AnlagenNr Anlagennummer
   */
  public static PaNr(AnlagenNr: number) {
    return this.serviceApi.PaNr(AnlagenNr);
  }

  private static Encrypte(plaintext: string, _key: string): string {
    let key = CryptoJS.enc.Utf8.parse(_key);
    // Verschlüsseln
    let iv = CryptoJS.lib.WordArray.random(16); // Generiere einen 16-Byte-IV Initialisierungsvektor
    let encrypted = CryptoJS.AES.encrypt(plaintext, key, { iv: iv });
    return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64); // IV + Chiffretext
  }

  /** liefert Userrechte */
  public static GetUserRights(user: string, pass: string) {
    let key = "gpV4tPzwMhuoZBf1";
    return this.serviceApi.GetUserRights(
      this.Encrypte(user, key),
      this.Encrypte(pass, key)
    );
  }

  /** Überprüft, ob ein Rezept vorhanden ist. */
  public static IstRezeptVorhanden(param: IIstRezeptVorhRequest) {
    return this.serviceApi.IstRezeptVorhanden(param);
  }

  // /** @param Command SQL-Befehl */
  // public static ReadDatabase(Command: string) {
  //   return this.serviceApi.ReadDatabase(Command);
  // }

  // /** @param Command SQL-Befehl */
  // public static WriteDatabase(Command: string) {
  //   return this.serviceApi.WriteDatabase(Command);
  // }

  /** liefert Rezeptliste */
  public static SetDeletedRez(args: ISetDeletedRezRequest) {
    return this.serviceApi.SetDeletedRez(args);
  }

  /** liefert Rezeptliste */
  public static WriteToSpsRez(args: IWriteToSpsRezParams) {
    return this.serviceApi.WriteToSpsRez(args);
  }

  /** gibt eine Liste von Rezepten (RezList) zurück */
  public static GetRezList(args: IGetRezList) {
    return this.serviceApi.GetRezList({
      Werk: args.werk,
      Halle: args.halle,
      Etage: args.etage,
      Linie: args.linie,
      Maschine: args.maschine,
      RezNr: args.reznr ? args.reznr.toString().trim().padStart(9, "0") : "",
      RezVer: args.rezver ? args.rezver : -1,
      Abteilung: args.abteiNr ? args.abteiNr : -1,
    });
  }

  /** gibt den Namen eines Rezepts zurück */
  public static GetRezNamen(renNr: string) {
    return this.serviceApi.GetRezNamen({ RezNr: renNr });
  }

  public static WriteToDB(args: IWriteToDBParams) {
    return this.serviceApi.WriteToDB(args);
  }

  public static UpdateRezDB(args: IUpdateRezDBParams) {
    return this.serviceApi.UpdateRezDB(args);
  }

  /** Stoppt/Startet PA-Aufträge */
  public static PaStartStop(args: IPaStartStopParams) {
    return this.serviceApi.PaStartStop(args);
  }

  /** Liest Log-Eintrag */
  public static ReadActivity(arg: IReadRezActivityArgs) {
    return this.serviceApi.ReadRezActivity2(arg);
  }

  /** Gebindemenge */
  public static async Gebindemenge(ArtikelNr: string) {
    return this.serviceApi.Gebindemenge(ArtikelNr);
  }

  /** Schreibt Log-Eintrag */
  public static WriteActivity(args: IWriteActivityParams) {
    return this.serviceApi.WriteRezActivity(args);
  }

  /** Schreibt Log-Eintrag */
  public static WriteActivity2(args: IWriteActivityParamsWithDate) {
    return this.serviceApi.WriteRezActivity2(args);
  }

  /** Liest und Sortiert die rezeptrelevante Variablen aus WF-Datenbank */
  public static GetRezVarnames(args: IGetRezVarnamesParams) {
    return this.serviceApi.GetSortedRezVarnames(args);
  }
  /** Liest virtuelle rezeptrelevante Variablen aus WF-Datenbank */
  public static GetVirtRezVarnames(args: IGetRezVarnamesParams) {
    return this.serviceApi.GetVirtualRezVarnames(args);
  }
  /** Client IP */
  public static GetClentIp() {
    return this.serviceApi.GetClientIP();
  }

  /** Client Name */
  public static GetClientName() {
    return this.serviceApi.GetClientName();
  }
  /** liest die angefragten Daten aus der SPS (direkte Verbindung)*/
  public static ReadFromSps(WfDb: string, Data: IaData[]) {
    return this.serviceApi.ReadFromSpsTransl(WfDb, Data);
  }

  /** schreibt Daten in SPS (direkte Verbindung E.Siem. WS)*/
  public static WriteToSpsTransl(args: IWriteToSpsTranslParams) {
    return this.serviceApi.WriteToSpsTransl(args);
  }

  /** Betriebsdatenerfassung (DBE)*/
  public static AddBetriebsdaten(config: IAddBetriebsdatenRequest) {
    return this.serviceApi.AddBetriebsdaten(config);
  }

  /**
   * gibt die Länge von DB2-DB zurück
   * @example {Promise}
   * <CountDataTableResponse xmlns="http://tempuri.org/">
   * <CountDataTableResult>620</CountDataTableResult>
   * </CountDataTableResponse>
   * @returns {Promise} Anzahl Zeilen
   */
  public static CheckRecipeDb(args: ICheckRecipeDbParams): Promise<ICountDataTableResult> {
    return this.serviceApi.checkRecipeDb(args);
  }

  /** liefert Assembly Version u. BuildDate */
  public static GetWsSapVer(): Promise<IWcfResult> {
    return this.serviceApi.GetWsSapVer();
  }

  /** Ruft die BDE_Lobster-Tabelle ab. */
  public static GetBdeLobst() {
    return this.serviceApi.GetBdeLobst();
  }

  /** Setzt die BdeLobsterData-Daten basierend auf den bereitgestellten BdeLobsterValues-Daten. */
  public static SetBdeLobst(args: ISetBdeLobst) {
    return this.serviceApi.SetBdeLobst(args);
  }

  /** Setzt die Werte für StoerBdeLobst. */
  public static SetStoerBdeLobst(data: ISetBdeLobst) {
    return this.serviceApi.SetBdeLobst(data);
  }

  /** liefert die Daten für n. beendete PA's in Lobster-Tabelle
   * @param {number} [PaNr=0] - Der erste Parameter für die `GetBdeLobstUncomp`-Methode.
   * @param {number} [RessNr=0] - Der zweite Parameter für die `GetBdeLobstUncomp`-Methode.
   * @returns {any} Das Ergebnis der `GetBdeLobstUncomp`-Methode des `serviceApi`-Objekts.
   */
  public static GetBdeLobstUncomp(PaNr: number = 0, RessNr: number = 0) {
    return this.serviceApi.GetBdeLobstUncomp(PaNr, RessNr);
  }

  /**
   * Beendet alle nicht abgeschlossenen Aufträge unter einer bestimmten Ressourcennummer.
   * @param {number} RessNr - Die Ressourcennummer, unter der die Aufträge laufen.
   * @returns {Promise<IStopAllBdeLobstResponse>} Ein Promise, das ein IStopAllBdeLobstResponse-Objekt zurückgibt, das den Erfolgsstatus, die verstrichene Zeit und eine Liste der beendeten Auftragsnummern enthält.
   */
  public static StopAllBdeLobst(
    RessNr: number,
    ZaehlNr: number
  ): Promise<IStopAllBdeLobstResponse> {
    return this.serviceApi.StopAllBdeLobst(RessNr, ZaehlNr);
  }

  /** Diese Methode liefert liefert Anzahl nicht kommentierten Störungsmeldungen */
  public static GetFaultCount(args: number) {
    return this.serviceApi.GetFaultCount(args);
  }

  /** Diese Methode liefert die SPS-Konfiguration. Abhängigkeiten von der PA-Typ->SPS-Bitspur */
  public static GetRezSpsConfig(AnlagenNr: number) {
    return this.serviceApi.GetRezSpsConfig(AnlagenNr);
  }

  /** Diese Methode liefert die Rez.Dlg.-Konfiguration. */
  public static GetRezDlgConfig(AnlagenNr: number) {
    return this.serviceApi.GetRezDlgConfig(AnlagenNr);
  }

  public static GetSignRecipeDifferences(config: any) {
    return this.serviceApi.GetSignRecipeDifferences(config);
  }

  public static GetSignalProperty(config: any) {
    return this.serviceApi.GetSignalProperty(config);
  }

  public static GetSignRecipeValues(config: any) {
    return this.serviceApi.GetSignRecipeValues(config);
  }
}
export const rezService = RezService;

