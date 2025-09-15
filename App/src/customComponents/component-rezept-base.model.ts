import * as ko from "knockout";
import dialog = require("plugins/dialog");
import Logger = require("../services/logger"); // Toaster
import UserService = require("../services/usersService");
import Tab = require("../viewModels/cowi/services/tabBuilder");
import Log = require("../viewModels/cowi/services/rezLog");
import LocalStorLogWriter = require("../viewModels/cowi/services/localStorLogWriter");
import RezValues = require("../viewModels/cowi/services/rezValues");
import MsgBox = require("../viewModels/cowi/dialoge/cwRezDlg");
import SaveDialog = require("../viewModels/cowi/dialoge/cwRezDlgSave");
import ComponentBaseModel = require("../components/component-base.model");
import LoginDialog = require("../viewModels/cowi/dialoge/cwRezDlgLogInOut");
import DlgAblieferZone = require("../viewModels/cowi/dialoge/cwRezDlgAblieferzone");
import DlgAblZoneOfen = require("../viewModels/cowi/dialoge/cwRezDlgAblZoneOfen");
import PersonalDialog = require("../viewModels/cowi/dialoge/cwRezDlgPersonal");
import { rezService } from "../viewModels/cowi/services/rezService";
import {
  FnktKennung,
  LogType,
  PaStatus,
  ServiceWahl,
  eAuftArt,
  eProdTyp,
  eAuftFn,
  eProdTypCode,
} from "../viewModels/cowi/rezepturEnums";
import { ClientInfo } from "../viewModels/cowi/services/getClientInfo";
import rezUtils from "../viewModels/cowi/services/rezUtils";

import WsWatchdog = require("../viewModels/cowi/services/wsWatchdog");
import cwRezDlgLogs = require("../viewModels/cowi/dialoge/cwRezDlgLogs");
import cwRezDlgSetup = require("../viewModels/cowi/dialoge/cwRezDlgSetup");
import { getCachedSpsKonfig } from "../viewModels/cowi/services/rezSpsKonfigCache";
import { getCachedDlgKonfig } from "../viewModels/cowi/services/rezDlgKonfigCache";

declare let window: any;
declare let uuid: any;

class RezDlg<T extends IRezDlgValueParams> extends ComponentBaseModel<T> {
  // die Vers.Nr. wird mit dem Gulp-Task 'update-version' aus der 'package.json' entnommen
  protected kompVersion: string = "4.1.4";
  protected serverName: string;
  protected databaseName: string;

  protected logTyp: LogType = LogType.Debug;
  protected localStorLogWriter = new LocalStorLogWriter();

  // Flag für Debugging
  protected debugFlag: boolean = true;
  /** Filterwort, wonach die rezeptrelevante Variablen gesucht werden */
  protected filter: string[];
  /** Signalalias -> aktuelle Rezeptnummer in SPS */
  protected signalNameRezNr: string;
  /** Signalalias -> aktuelle Rezeptversion in SPS */
  protected signalNameVerNr: string;
  /** Signalalias -> aktuelle PA-Nummer in SPS */
  protected signalNamePaNr: string;
  /** Signalalias -> Merker - PA-Aktiv */
  protected signalNamePaAktiv: string;
  /** Signalalias -> Merker - siehe OneNote: Festlegung Produktionstypen (DB4 Byte26) */
  protected signalNameProdTyp: string;
  /** Signalalias -> Merker - siehe OneNote: Festlegung Produktionstypen (DB4 Int38) */
  protected signalNameSpsCnfg: string;
  /** Signalalias -> Merker - Rework (bei nicht Verwendung mit NULL initialisieren) */
  protected signalNameRework: string;
  /** Signalalias -> Zeitstempel PA-Start in SPS */
  protected signalNamePaStart: any;
  /** Signalalias -> Zeitstempel PA-Stopp in SPS */
  protected signalNamePaStop: any;
  /** Signalalias -> Gebindeanzahl aktuellen PA-Auftrages in SPS */
  protected signalNameGebindeanzahl: string;
  /** Signalalias -> Planleistung aktuellen PA-Auftrages in SPS */
  protected signalNamePlanLeistung: string;
  /** Signalalias -> Pilotlevel in SPS (bei nicht Verwendung mit NULL initialisieren) */
  protected signalNamePilotLevel: string;
  /** Signalalias -> Berechnungfaktor Massenberechnung (bei nicht Verwendung mit NULL initialisieren) */
  protected signalNameFaktor: string;
  /** Signalalias -> externes Signal zum Freigeben von 'Rezept Laden' (bei nicht Verwendung mit NULL initialisieren) */
  protected signalNameFreigabeLaden: string;
  /** Signalalias -> Netznummer aus dem PA-Auftrag */
  protected signalNameNetzNr: string;
  /** Signalalias -> errechnete Ofenstartzeit aus der SPS in DateTime-Format */
  protected signalNameOfenStartCalc: string;
  /** Signalalias -> in SPS gesetzte Soll-Nachlaufzeit */
  protected signalNameSollNachlauf: string;
  /** Signalalias -> in SPS errechnete Ist-Nachlaufzeit */
  protected signalNameIstNachlauf: string;

  /** Beschreibungstext bei fehlender Freigabe 'Rezept Laden' (bei nicht Verwendung mit NULL initialisieren) */
  protected grundFreigabeLaden: string;

  protected werk: number;
  protected halle: number;
  protected etage: number;
  protected linie: number;
  protected maschine: number;
  protected abteiNr: number;

  /** Anlagennummer */
  protected anlage: KnockoutObservable<number> = ko.observable();
  /** Settingsvariable für Anlagennummer */
  protected anlagenNr: number | string;
  /** Zählernummer */
  protected zaehler: KnockoutObservable<number> = ko.observable();
  /** Settingsvariable für Zählernummer */
  protected zaehlerNr: number | string;

  // protected remoteIISServer: string = window.document.location.hostname;

  /** aktuell gewählte Rezept aus der Rezeptliste-Tabelle */
  protected rezInfo = ko.pureComputed(() => {
    let ret: string;
    if (!isNullOrUndefined(this.rezVer())) {
      ret = this.selectedRecipe.Nr()
        ? this.selectedRecipe.Nr() +
        " V" +
        this.selectedRecipe.Vers() +
        " - " +
        this.selectedRecipe.Descrp()
        : "";
    } else {
      ret = this.selectedRecipe.Nr()
        ? this.selectedRecipe.Nr() + " - " + this.selectedRecipe.Descrp()
        : "";
    }
    return ret;
  });

  protected selectedRecipe = {
    /** ausgewählte RezNr. in der 'Rezept'-Tabelle Rezeptnummer */
    Nr: ko.observable<string>(),
    /** ausgewählte RezVersion. in der 'Rezept'-Tabelle Rezeptnummer */
    Vers: ko.observable<string>(),
    /** ausgewählte Beschrebung in der 'Rezept'-Tabelle Rezeptnummer */
    Descrp: ko.observable<string>(),
  };

  /** ausgewählte in der 'PA-Aufträge'-Tabelle sonstige Infos wie PA-Start, PA-Stop, Planleistung ect. */
  protected selectedPaData = {
    Status: ko.observable(),
    /** ausgewählte in der 'PA-Aufträge'-Tabelle PA-Nummer */
    PaNr: ko.observable<string>(),
    /** ausgewählte in der 'PA-Aufträge'-Tabelle Rezeptnummer */
    RezNr: ko.observable<string>(),
    /** ausgewählte in der 'PA-Aufträge'-Tabelle Rezeptbeschreibung */
    Name: ko.observable(),
    /** ausgewählte in der 'PA-Aufträge'-Tabelle Produktionstyp */
    ProdTyp: ko.observable<string>(),
    /** ausgewählte in der 'PA-Aufträge'-Tabelle Startzeit des PA-Auftrages */
    Stop: ko.observable<string>(),
    /** ausgewählte in der 'PA-Aufträge'-Tabelle Stoppzeit des PA-Auftrages */
    Start: ko.observable(),
    /** ausgewählte in der 'PA-Aufträge'-Tabelle Planleistung */
    Planleistung: ko.observable(),
    /** ausgewählte in der 'PA-Aufträge'-Tabelle Netznummer */
    NetzNr: ko.observable(),
    /** OPUS-Feld (nur als Durchreicher) */
    ActivNr: ko.observable<number>(),
    /** OPUS-Feld (nur als Durchreicher) */
    RespnNr: ko.observable<number>(),
  };

  /** Zeiten, die für Ofenstart und Nachlaufzeit relevant sind */
  protected ProcessTimingData = {
    /** SPS-Value PA-Start/Stopp in DateTime-Format */
    paStart: ko.observable(null),
    paStartArr: ko.observableArray([]),
    paStop: ko.observable(null),
    paStopArr: ko.observableArray([]),
    /** SPS-Value errechnete Ofenstartzeit in DateTime-Format */
    ofenStartCalc: ko.observable(null),
    /** SPS-Value Sollnachlaufzeit in TimeOfDay-Format */
    sollNachlauf: ko.observable(null),
    /** SPS-Value Istnachlaufzeit in TimeOfDay-Format */
    istNachlauf: ko.observable(null),
  };
  /** aktuelle Rezeptnummer in der SPS */
  protected rezNr = ko.observable(null);
  /** aktuelle Rezeptversion in der SPS */
  protected rezVer = ko.observable(null);
  /** aktuelle Rework-Status in der SPS */
  protected rework = ko.observable(null);
  /** aktuelle PlanLeistung in der SPS */
  protected planLeistung = ko.observable(null);
  /** aktuelle Gebindeanzahl in der SPS */
  protected gebindeanzahl = ko.observable(null);
  /** aktueller Faktor in der SPS */
  protected faktor: KnockoutObservable<number> = ko.observable();
  /** aktueller Pilotlevel in der SPS */
  protected pilotLevel: KnockoutObservable<number> = ko.observable();
  /** aktuelle Pa-Nummer in der SPS */
  protected paNr = ko.observable(null);
  /** aktueller Pa-Status Aktiv/Inaktiv in der SPS */
  protected paAktiv = ko.observable(null);
  /** aktueller Pa-Produktionstyp Aktiv/Inaktiv in der SPS */
  protected paTyp = ko.observable(null);
  /** Merker Übergang von 'RR' -> 0 um die Nachlaufzeit zu setzen */
  protected isRRToZero = false;
  /** aktuelle SPS Konfigurationswort in der SPS */
  protected SpsCfg = ko.observable(null);
  /** aktueller Pa-Netznummer in der SPS */
  protected netzNr = ko.observable(null);
  /** aktueller Lade/Freigabe-Status in der SPS */
  protected freigabeLaden: KnockoutObservable<boolean> = ko.observable();

  /** Context des ViewModels (siehe https://knockoutjs.com/documentation/binding-context.html) */
  protected vmContext: any;
  /** Callback-Funktion für eine Interaktion mit ViewModel */
  protected fn: any;

  /** Verbindungstatus zur WF-Datenbank */
  protected dbState: KnockoutObservable<boolean> = ko.observable(false);
  /** Verbindungstatus zur DB2-Datenbank */
  protected db2State: KnockoutObservable<boolean> = ko.observable(false);

  /** Verbindungstatus zu wcfSiem */
  protected ws1State: KnockoutObservable<boolean> = ko.observable(false);

  private ws1CallbackId: number;
  private ws2CallbackId: number;
  private ws3CallbackId: number;
  private ws4CallbackId: number;

  protected commonWsUISatate = ko.pureComputed(() => {
    return {
      state:
        this.ws1State() &&
        this.ws2State() &&
        this.ws3State() &&
        this.ws4State(),
    };
  });

  /** Status-Obj. für UI */
  protected ws1StateUI = ko.pureComputed(() => {
    const pfad = "..wcfSiem//WcfPlcRezept.svc";
    return {
      version:
        (this.ws1State() ? `Verbunden ${pfad}` : `k. Verbindung ${pfad}`) +
        "\n" +
        this.ws1Version(),
      state: this.ws1State(),
    };
  });
  protected ws1Version: KnockoutObservable<string> = ko.observable("");

  /** Verbindungstatus zu WcfRezept */
  protected ws2State: KnockoutObservable<boolean> = ko.observable(false);
  /** Status-Obj. für UI */
  protected ws2StateUI = ko.pureComputed(() => {
    const pfad = "..WcfRezept//WsRezept.svc";
    return {
      version:
        (this.ws2State() ? `Verbunden ${pfad}` : `k. Verbindung ${pfad}`) +
        "\n" +
        this.ws2Version(),
      state: this.ws2State(),
    };
  });
  protected ws2Version: KnockoutObservable<string> = ko.observable("");

  /** Verbindungstatus zu WsCwSAP */
  protected ws3State: KnockoutObservable<boolean> = ko.observable(false);
  /** Status-Obj. für UI */
  protected ws3StateUI = ko.pureComputed(() => {
    const pfad = "..WsCwSAP//CwSAPService.svc";
    return {
      version:
        (this.ws3State() ? `Verbunden ${pfad}` : `k. Verbindung ${pfad}`) +
        "\n" +
        this.ws3Version(),
      state: this.ws3State(),
    };
  });
  protected ws3Version: KnockoutObservable<string> = ko.observable("");

  /** Verbindungstatus zu WsCcwBde */
  protected ws4State: KnockoutObservable<boolean> = ko.observable(false);
  /** Status-Obj. für UI */
  protected ws4StateUI = ko.pureComputed(() => {
    const pfad = "..WsCcwBde//CcwBdeService.svc";
    return {
      version:
        (this.ws4State() ? `Verbunden ${pfad}` : `k. Verbindung ${pfad}`) +
        "\n" +
        this.ws4Version(),
      state: this.ws4State(),
    };
  });
  protected ws4Version: KnockoutObservable<string> = ko.observable("");
  /** Status Benutzerrechte */
  protected userState: KnockoutObservable<boolean> = ko.observable(false);
  /** Status Funktionsausführung */
  protected fnExecutionTime: KnockoutObservable<boolean> = ko.observable(false);
  /** Status Laden beim Laden von PA-Liste */
  protected paListStateBusy: KnockoutObservable<boolean> = ko.observable(false);
  /** Status Timeout beim Laden von PA-Liste */
  protected paListStateTimeout: KnockoutObservable<boolean> =
    ko.observable(false);
  /** Status PA-Liste */
  protected paListStateConnect = ko.pureComputed(() => {
    return {
      text: this.paListStateTimeout()
        ? "Zeitüberschreitung beim Verbinden mit Webservice"
        : "Lade die PA-Aufträge",
      busy: this.paListStateBusy(),
      timeout: this.paListStateTimeout(),
    };
  });

  /** bei Änderung des PA-Status in SPS die PA-Liste updaten */
  protected _q = ko
    .pureComputed(() => {
      let pa = this.paNr();
      let aktiv = this.paAktiv();
      let typ = this.paTyp();

      // Überprüfe, ob alle Variablen gültige Werte haben
      if (
        (pa !== null && pa !== undefined && pa !== "n/a") ||
        (aktiv !== null && aktiv !== undefined && aktiv !== "n/a") ||
        (typ !== null && typ !== undefined && typ !== "n/a")
      ) {
        console.debug("PA-Änderung wurde registriert", "[" + moment().format("D.M.YYYY, HH:mm:ss.SSS") + "]",
          "- PaNr.:", pa, "; Aktiv:", aktiv, "; PA-Typ:", typ);
        this.makePaList();
      }
      return undefined;
    }, this)
    .extend({ throttle: 800 });

  // #endregion Status PA-Liste

  // #region Status Rezept-Liste

  /** Status Laden beim Laden von Rezept-Liste */
  protected rezListStateBusy: KnockoutObservable<boolean> =
    ko.observable(false);
  /** Status Timeout beim Laden von Rezept-Liste */
  protected rezListStateTimeout: KnockoutObservable<boolean> =
    ko.observable(false);
  /** Status Rezept-Liste zusammengefasst */
  protected rezListStateConnect = ko.pureComputed(() => {
    return {
      text: this.rezListStateTimeout()
        ? "Zeitüberschreitung beim Verbinden mit Webservice"
        : "Lade die Rezeptliste",
      busy: this.rezListStateBusy(),
      timeout: this.rezListStateTimeout(),
    };
  });

  // #endregion Status Rezept-Liste

  protected userName = ko.observable("anonymous");
  protected clientName = ko.observable("anonymous");
  protected clientDescription = ko.observable("n/a");
  protected clientIp = ko.observable("n/a");
  protected userLevel: KnockoutObservable<number> = ko.observable();
  protected userInfo = ko.pureComputed(() => {
    return (
      `UserLevel: ${this.userLevel()}` +
      "\n" +
      `Clientname: ${this.clientName()}` +
      "\n" +
      `IP: ${this.clientIp()}`
    );
  }, this);

  protected _exTimer = ko.pureComputed(() => {
    if (this.fnExecutionTime()) {
      this.fnExecutionTime(false);
    }
    return undefined;
  }, this).extend({ throttle: 5000 });

  /** gemeinsame Rechte */
  protected commonPermission = ko.pureComputed(() => {
    let ret: string = "";
    ret += !this.fnExecutionTime() ? "" : "Daten werden sicher geschrieben. Bitte warten.\n";
    ret += !this.userState() ? "Keine Benutzerrechte.\n" : "";
    ret += !this.dbState() ? "Keine Verbindung zur WF-Datenbank.\n" : "";
    ret += !this.db2State() ? "Keine Verbindung zur DB2-Datenbank.\n" : "";
    ret +=
      !this.ws1State() ||
        !this.ws2State() ||
        !this.ws3State() ||
        !this.ws4State()
        ? "Webservice nicht erreichbar.\n"
        : "";
    return ret;
  }, this);
  /** Freigabe/Titel Button - PA-/Rez starten */
  protected btnStartTitle = ko.pureComputed(() => {
    let ret: string = this.commonPermission();

    if (this.kennung() !== FnktKennung.rezOnly) {
      ret += !this.selectedPaData.PaNr() ? "Kein PA-Auftrag ausgewählt.\n" : "";
    }
    if (this.kennung() !== FnktKennung.paOnly) {
      ret +=
        this.varListeRows().length === 0
          ? "Keine Rezeptvariablen vorhanden.\n"
          : "";
      ret += !this.rezInfo() ? "Kein Rezept ausgewählt.\n" : "";
    }
    return ret || "Starten";
  }, this);

  /** Freigabe/Titel Button - PA-Stoppen */
  protected btnStopTitle = ko.pureComputed(() => {
    let ret: string = this.commonPermission();

    if (this.kennung() !== FnktKennung.rezOnly) {
      ret += !(
        this.paTyp() ||
        this.paAktiv() ||
        (this.selectedPaData.PaNr() &&
          Number(this.selectedPaData.Status()) === 1)
      )
        ? "Kein PA-Auftrag aktiv oder ausgewählt.\n"
        : "";
    }
    return ret || "PA Stoppen";
  }, this);
  /** Freigabe/Titel Button - Rezept Speichern */
  protected btnSaveRecipeTitle = ko.pureComputed(() => {
    let ret: string = this.commonPermission();

    ret =
      this.varListeRows().length === 0
        ? ret + "Keine Rezeptvariablen vorhanden.\n"
        : ret + "";
    return ret || "Rezept speichern";
  }, this);
  /** Freigabe/Titel Button - Rezept Löschen */
  protected btnDeleteTitle = ko.pureComputed(() => {
    let ret: string = this.commonPermission();

    ret = !this.rezInfo() ? ret + "Kein Rezept ausgewählt.\n" : ret + "";
    return ret || "Rezept löschen";
  }, this);
  /** Aktueller Rezeptname, aufgelöst anhand der Rezeptnummer */
  protected rezName = ko.observable("...");
  /** Head-Zeile für PA-Auftragstabelle */
  protected paHead = ko.observableArray([]);
  /** Body-Zeilen für PA-Auftragstabelle */
  protected paRows = ko.observableArray([]);
  /** bei Änderung der von PA-Daten Symbole updaten */
  protected _paRowsChanged = ko.pureComputed(() => {
    let _pa = this.paRows();
    let _paTyp = this.paTyp();
    let _paActiv = this.paAktiv();
    this.symbolStatusPa();
    return undefined;
  }, this).extend({ throttle: 100 });

  /** Head-Zeile für Rezeptetabelle */
  protected rezHead = ko.observableArray([]);

  /** Body-Zeilen für Rezeptetabelle */
  protected rezRows = ko.observableArray([]);

  /** Ladestatus */
  protected isLoading: KnockoutObservable<boolean> = ko.observable(false);

  /** temporäre Variablenliste wird Später in varListeRows einfliessen */
  protected varListe = [];

  /** Head-Zeile Tabelle-Rezeptrelevantenvariablen */
  protected varListeHead = ko.observableArray([]);

  /** Body-Zeilen Tabelle-Rezeptrelevantenvariablen */
  protected varListeRows = ko.observableArray([]);

  protected statusRezVarUI = {
    loaded: ko.observable<boolean>(false),
    error: ko.observable<boolean>(false),
    descrp: ko.observable<string>("Status"),
  };

  protected adminIsLogged: KnockoutObservable<boolean> = ko.observable(false);
  protected adminName: KnockoutObservable<string> = ko.observable("");
  protected nIntervId: any;

  /** lebenszeichen */
  protected isAlive = false;

  /** überwachte Knockout-Variablen */
  private subscriptions: KnockoutSubscription[] = [];

  protected Tab = new Tab();

  protected RezValues: RezValues;
  protected kennung: KnockoutObservable<FnktKennung> = ko.observable();
  /** Methode wird zu aufgerufeden Context von modalen Fenster gebunden
   * um die progr. schließen zu können
   */
  protected CloseModal: any;

  // UID für die eindeutige Identifizierung des Moduls
  protected uid: KnockoutObservable<string> = ko.observable(uuid.v4());

  // ShortUID 3-stellig für die eindeutige Identifizierung im Logbuch.
  // Die Spalte "Altern" wird dafür verwendet um zusammenhängende Einträge gruppieren zu können.
  protected shortUid: number = rezUtils.uidToShortId(this.uid());

  protected idPaFltr: KnockoutObservable<string> = ko.observable(
    "idPaFilter_" + this.uid()
  );
  protected idRezFltr: KnockoutObservable<string> = ko.observable(
    "idRezFilter_" + this.uid()
  );
  protected idSigFltr: KnockoutObservable<string> = ko.observable(
    "idSigFltr_" + this.uid()
  );
  protected idPaTable: KnockoutObservable<string> = ko.observable(
    "idPaTable_" + this.uid()
  );
  protected idRezTable: KnockoutObservable<string> = ko.observable(
    "idRezTable_" + this.uid()
  );
  protected idCollapseRezList: KnockoutObservable<string> = ko.observable(
    "idCollapseRezList_" + this.uid()
  );
  protected idCollapsePaList: KnockoutObservable<string> = ko.observable(
    "idCollapsePaList_" + this.uid()
  );
  protected idCountdown: KnockoutObservable<string> = ko.observable(
    "idCountdown_" + this.uid()
  );
  protected WsWatchdog = WsWatchdog.getInstance();

  protected rezDlgProperties: object;
  protected configDataSpsCfg: object;
  protected configDataDlgCfg: IRezDlgKonfig;
  protected dynamicProdTypToSpsCfg: Map<number, number> = new Map();
  protected lobsterServiceEnabled: KnockoutObservable<boolean> = ko.observable(false);

  constructor(params: T) {
    super(params);
    const self = this;

    self.kennung(params.kennung || FnktKennung.standard);
    self.activate();
    // compositionComplete wird erst aufgerufen, wenn die View vollständig aufgebaut ist
    $(document).ready(function () {
      self.compositionComplete();
    });
  }

  protected initializeSettings(): void {
    super.initializeSettings();

    this.filter = ko.unwrap(this.settings.filter);

    this.serverName = (
      ko.unwrap(this.settings.serverName) || window.rootUrlPrefix
    ).stringPlaceholderResolver(this.objectID);

    this.databaseName = (
      ko.unwrap(this.settings.databaseName) || ""
    ).stringPlaceholderResolver(this.objectID);

    this.signalNameRezNr = (
      ko.unwrap(this.settings.signalNameRezNr) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.signalNameVerNr = (
      ko.unwrap(this.settings.signalNameVerNr) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.signalNamePaNr = (
      ko.unwrap(this.settings.signalNamePaNr) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.signalNamePaAktiv = (
      ko.unwrap(this.settings.signalNamePaAktiv) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.signalNameProdTyp = (
      ko.unwrap(this.settings.signalNameProdTyp) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.signalNameSpsCnfg = (
      ko.unwrap(this.settings.signalNameSpsCnfg) || ""
    ).stringPlaceholderResolver(this.objectID);

    this.signalNameRework = (
      ko.unwrap(this.settings.signalNameRework) || ""
    ).stringPlaceholderResolver(this.objectID);

    this.signalNamePlanLeistung = (
      ko.unwrap(this.settings.signalNamePlanLeistung) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.signalNamePilotLevel = (
      ko.unwrap(this.settings.signalNamePilotLevel) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.signalNameFaktor = (
      ko.unwrap(this.settings.signalNameFaktor) || ""
    ).stringPlaceholderResolver(this.objectID);

    this.signalNameGebindeanzahl = (
      ko.unwrap(this.settings.signalNameGebindeanzahl) || ""
    ).stringPlaceholderResolver(this.objectID);

    this.signalNameFreigabeLaden = (
      ko.unwrap(this.settings.signalNameFreigabeLaden) || ""
    ).stringPlaceholderResolver(this.objectID);

    this.signalNameNetzNr = (
      ko.unwrap(this.settings.signalNameNetzNr) || ""
    ).stringPlaceholderResolver(this.objectID);

    this.grundFreigabeLaden = ko.unwrap(this.settings.grundFreigabeLaden) || "";

    this.werk = ko.unwrap(this.settings.werk);
    this.halle = ko.unwrap(this.settings.halle);
    this.etage = ko.unwrap(this.settings.etage);
    this.linie = ko.unwrap(this.settings.linie);
    this.maschine = ko.unwrap(this.settings.maschine);
    this.abteiNr = ko.unwrap(this.settings.abteiNr);
    this.anlagenNr = ko.unwrap(this.settings.anlagenNr);
    this.zaehlerNr = ko.unwrap(this.settings.zaehlerNr);

    this.signalNamePaStart = this.fillPaTimeStamp(
      ko.unwrap(this.settings.signalNamePaStart) || ""
    );
    this.signalNamePaStop = this.fillPaTimeStamp(
      ko.unwrap(this.settings.signalNamePaStop) || ""
    );
    this.signalNameOfenStartCalc = ko.unwrap(this.settings.signalNameOfenStartCalc) || "";
    this.signalNameSollNachlauf = ko.unwrap(this.settings.signalNameSollNachlauf) || "";
    this.signalNameIstNachlauf = ko.unwrap(this.settings.signalNameIstNachlauf) || "";

    /** Check Type */
    const chkType = (obj: any, type: string): any => {
      return !!this.settings.fn && !!obj && typeof ko.unwrap(obj) === type
        ? ko.unwrap(obj)
        : null;
    };

    // fn initialisieren
    if (!!this.settings.fn) {
      this.fn = {
        vmContext: chkType(this.settings.fn.vmContext, "object"),
        paAktiviert: chkType(this.settings.fn.paAktiviert, "string"),
        rezGesendet: chkType(this.settings.fn.rezGesendet, "string"),
        rezGespeichert: chkType(this.settings.fn.rezGespeichert, "string"),
      };
    }
  }

  /**
   * Überprüft, ob die aufgelisteten Eigenschaften im aktuellen Kontext gesetzt sind.
   * Gibt eine Warnmeldung in der Konsole aus, wenn eine Eigenschaft nicht gesetzt ist.
   * Dies dient rein informativen Zwecken für den Programmierer bei der Inbetriebnahme.
   */
  handleUnsetProperties() {
    this.rezDlgProperties = {
      signalNameRezNr: {
        name: this.signalNameRezNr,
        value: this.rezNr,
      },
      signalNameVerNr: {
        name: this.signalNameVerNr,
        value: this.rezVer,
      },
      signalNamePaNr: {
        name: this.signalNamePaNr,
        value: this.paNr,
      },
      signalNamePaAktiv: {
        name: this.signalNamePaAktiv,
        value: this.paAktiv,
      },
      signalNameProdTyp: {
        name: this.signalNameProdTyp,
        value: this.paTyp,
      },
      signalNameSpsCnfg: {
        name: this.signalNameSpsCnfg,
        value: this.SpsCfg,
      },
      signalNameRework: {
        name: this.signalNameRework,
        value: this.rework,
      },
      signalNamePlanLeistung: {
        name: this.signalNamePlanLeistung,
        value: this.planLeistung,
      },
      signalNamePilotLevel: {
        name: this.signalNamePilotLevel,
        value: this.pilotLevel,
      },
      signalNameFaktor: {
        name: this.signalNameFaktor,
        value: this.faktor,
      },
      signalNameGebindeanzahl: {
        name: this.signalNameGebindeanzahl,
        value: this.gebindeanzahl,
      },
      signalNameFreigabeLaden: {
        name: this.signalNameFreigabeLaden,
        value: this.freigabeLaden,
      },
      signalNameNetzNr: {
        name: this.signalNameNetzNr,
        value: this.netzNr,
      },
      grundFreigabeLaden: {
        name: this.grundFreigabeLaden,
        value: this.grundFreigabeLaden,
      },
      signalNameOfenStartCalc: {
        name: this.signalNameOfenStartCalc,
        value: this.ProcessTimingData.ofenStartCalc,
      },
      signalNameSollNachlauf: {
        name: this.signalNameSollNachlauf,
        value: this.ProcessTimingData.sollNachlauf,
      },
      signalNameIstNachlauf: {
        name: this.signalNameIstNachlauf,
        value: this.ProcessTimingData.istNachlauf,
      },
      signalNamePaStart: {
        name: this.signalNamePaStart,
        value: typeof this.signalNamePaStart === "string" ? this.ProcessTimingData.paStart : this.ProcessTimingData.paStartArr,
      },
      signalNamePaStop: {
        name: this.signalNamePaStop,
        value: typeof this.signalNamePaStop === "string" ? this.ProcessTimingData.paStop : this.ProcessTimingData.paStopArr,
      },
      filter: {
        name: this.filter,
        value: null,
      },
      serverName: {
        name: this.serverName,
        value: null,
      },
      databaseName: {
        name: this.databaseName,
        value: null,
      },
      werk: {
        name: this.werk,
        value: null,
      },
      halle: {
        name: this.halle,
        value: null,
      },
      etage: {
        name: this.etage,
        value: null,
      },
      linie: {
        name: this.linie,
        value: null,
      },
      abteiNr: {
        name: this.abteiNr,
        value: null,
      },
      maschine: {
        name: this.maschine,
        value: null,
      },
      anlagenNr: {
        name: this.anlagenNr,
        value: this.anlage,
      },
      zaehlerNr: {
        name: this.zaehlerNr,
        value: this.zaehler,
      },
      // lobsterServiceEnabled: {
      //   name: this.lobsterServiceEnabled,
      //   value: null,
      // },
    };
  }

  /**
   * Startet einen Countdown mit einer gegebenen Dauer in Minuten und Sekunden.
   * Wenn der Countdown abläuft, wird die Admin-Sitzung beendet und das Modalfenster (falls geöffnet) geschlossen.
   * @param {number} nMinutes - Die Anzahl der Minuten für den Countdown.
   * @param {number} nSeconds - Die Anzahl der Sekunden für den Countdown.
   */
  protected countdown(nMinutes: number, nSeconds: number): void {
    let duration = moment.duration({ seconds: nSeconds, minutes: nMinutes });

    // Vorherigen Countdown stoppen, falls vorhanden
    if (this.nIntervId) {
      clearInterval(this.nIntervId);
    }

    this.nIntervId = setInterval(() => {
      duration = moment.duration(duration.asSeconds() - 1, "seconds");

      // Countdown am HTML-Element ausgeben
      $(`#${this.idCountdown()}`).text(
        moment.utc(duration.asMilliseconds()).format("mm:ss")
      );

      if (duration.asMilliseconds() <= 0) {
        clearInterval(this.nIntervId);

        this.adminIsLogged(false);
        this.adminName("");
        this.CloseModal();

        this.AddLog(
          "User-Session abgelaufen",
          LogType.Abbruch_durch_Zeitüberschreitung
        );
      }
    }, 1000);
  }

  /**
   * Ein Objekt, das eine Methode zum Schließen eines Kind-Objekts bereitstellt.
   * Die Methode überprüft, ob das Kind-Objekt existiert und eine `close`-Methode hat, bevor es geschlossen wird.
   */
  protected closeChild = {
    /**
     * Schließt das Kind-Objekt, wenn es existiert und eine `close`-Methode hat.
     */
    close: function () {
      if (this && typeof this.close === "function") {
        this.close();
      }
    },
  };

  /** Aktivierungslogik */
  protected activate(): void {
    this.isAlive = true;

    this.initWs();
    this.watchdog();
    this.serverStatus();
    // this.getConfig();

    /** Rez.Variablen hollen */
    this.RezValues = new RezValues(
      this.serverName,
      this.databaseName,
      this.filter,
      this.connector
    );
  }

  /** Komposition vollständig aufgebaut */
  protected async compositionComplete(): Promise<void> {
    $(`#${this.idPaFltr()}`).on("keyup", () => {
      this.changeFilter(this.idPaFltr());
    });
    $(`#${this.idRezFltr()}`).on("keyup", () => {
      this.changeFilter(this.idRezFltr());
    });
    $(`#${this.idSigFltr()}`).on("keyup", () => {
      this.changeFilter(this.idSigFltr());
    });

    // Änderung der Amdin-Anmeldung überwachen
    this.subscriptions.push(
      this.adminIsLogged.subscribe((state) => {
        if (state) {
          this.countdown(3, 0);
          // _.throttle(() => this.countdown(1, 30), 1999)
          $(".clRezeptDlg").on("mousemove", () => this.countdown(3, 0));
        } else {
          this.countdown(0, 0);
          $(".clRezeptDlg").off("mousemove");
        }
      })
    );

    this.initUser();
    this.initSpsSignals();
    this.connector.getOnlineUpdates();

    this.localStorLogWriter.startProcessing();

    if (this.debugFlag) {
      this.loadFromLStorage();

      window.addEventListener("storage", this.addToLogPanel, false);
    }

    // Hilfsfunktion um Fehler zu behandeln
    const handleErrors = async (promise: Promise<void>) => {
      try {
        await promise;
      } catch (ex) {
        console.log(ex);
      }
    };

    // Führen die Aufgaben parallel aus
    Promise.all([
      // PA-Liste laden
      // handleErrors(this.makePaList()),
      // Rez.-Liste laden
      handleErrors(this.loadRezList()),
      // Variablenliste laden
      handleErrors(this.loadVarListe()),
    ]);

    this.handleUnsetProperties();

    const self = this;
    // Initialisierung SPS/Dlg.-Konfiguration
    self.loadDlgKonfig(self.anlage() || 0).then((dlg) => {
      self.configDataDlgCfg = dlg;
      // die 'lobsterServiceEnabled' Eigenschaft hat Priorität,
      // falls die fest im HTML-Konstrukt gesetzt wird.
      if (typeof self.settings.lobsterServiceEnabled === "boolean")
        self.lobsterServiceEnabled(ko.unwrap(self.settings.lobsterServiceEnabled));
      else
        // falls nicht, wird die Konfiguration verwendet.
        self.lobsterServiceEnabled(self.configDataDlgCfg.LbstSvc_Enabl);
    });

    // Initialisierung SPS/Dlg.-Konfiguration
    self.loadSpsKonfig(self.anlage() || 0).then((sps) => {
      self.configDataSpsCfg = sps;

      // Umwandlung der SPS-Konfiguration in Map für einfache Zugriffe
      sps.forEach((entry: { ProdTyp: number; SpsCfgLiEnd: number }) => {
        self.dynamicProdTypToSpsCfg.set(entry.ProdTyp, entry.SpsCfgLiEnd);
      });

    }).catch((err) => {
      self.AddLog(err.message, LogType.Abbruch_durch_Programmfehler);
    })

    this.AddLog(`Start Dlg. "${this.kennung()}", UID: ${this.uid().slice(0, 6)}..`, LogType.Login);
  }

  /** Rez. relevante Variablen laden */
  protected async loadVarListe() {
    try {
      this.statusRezVarUI.descrp("Lade Rezeptvariablen…");
      this.varListe = await this.RezValues.getVarListe();
      await this.fillTable();

      this.statusRezVarUI.loaded(true);
    } catch (error) {
      Logger.errorToast(rezUtils.msgCut(error.message, 100) + "...");
      this.AddLog(error.message, LogType.Abbruch_durch_Programmfehler);

      this.statusRezVarUI.error(true);
      this.statusRezVarUI.descrp(error);
      throw error;
    }
  }

  private fillPaTimeStamp(paTimeStamp: any): any {
    if (!Array.isArray(paTimeStamp)) {
      return paTimeStamp;
    }
    if (paTimeStamp.length !== 6) {
      Logger.errorToast("Abbruch! Falsche Parametrierung 'signalNamePaStart'…");
      return;
    }
    const retJson: string = `{
                "tag":{"name":"${paTimeStamp[0]}","value":0},
                "monat":{"name":"${paTimeStamp[1]}", "value":0},
                "jahr":{"name":"${paTimeStamp[2]}", "value":0},
                "stunde":{"name":"${paTimeStamp[3]}", "value":0},
                "minute":{"name":"${paTimeStamp[4]}", "value":0},
                "sekunde":{"name":"${paTimeStamp[5]}", "value":0}
            }`;
    return JSON.parse(retJson);
  }

  /** Initialisiert den Benutzer, indem es sich auf Änderungen des aktuell angemeldeten Benutzers abonniert. */
  protected initUser(): void {
    const self: this = this;
    // Änderung der User-Anmeldung überwachen
    self.subscriptions.push(
      self.connector.currentLoggedInUser.subscribe((usrName) => {
        self.userChanged(usrName);
      })
    );
    const name: string = self.connector.currentLoggedInUser();
    self.userChanged(name);
  }

  /** aktualisiert die Benutzerdetails basierend auf dem übergebenen Namen.
   *  Wenn ein Name vorhanden ist, werden die aktuellen Benutzerdetails abgerufen
   *  und die entsprechenden Eigenschaften des Objekts aktualisiert */
  protected userChanged(name: string) {
    if (name) {
      UserService.getCurrentUserDetails()
        .then((userDetails) => {
          this.userName(userDetails.Name);
          this.clientDescription(userDetails.Description);
          this.userLevel(userDetails.UserLevel);
          // User-Symbol in der Statusleiste ansteuern
          this.userState(Number.isInteger(userDetails.UserLevel));
        })
        .catch((ex) => {
          Logger.errorToast(ex);
        });
    } else {
      this.userName("unbekannt");
      this.clientDescription("n/a");
      this.userLevel(-1);
      this.userState(false);
    }
    Promise.all([ClientInfo.Name(), ClientInfo.Ip()])
      .then((values) => {
        this.clientName(values[0]);
        this.clientIp(values[1]);
      })
      .catch((error) => {
        Logger.errorToast(error);
      });
  }

  /** hollt die Versionsinfos von WebServices */
  protected initWs() {
    const services = [
      { service: ServiceWahl.wcfSiem, setVersion: this.ws1Version },
      { service: ServiceWahl.WcfRezept, setVersion: this.ws2Version },
      { service: ServiceWahl.WsCwSAP, setVersion: this.ws3Version },
      { service: ServiceWahl.WsCcwBde, setVersion: this.ws4Version },
    ];

    services.forEach(({ service, setVersion }) => {
      rezService
        .getVersion(service)
        .then((value) => {
          setVersion(
            `Version: ${value.GetVersionResult[0].version}\nBuild: ${value.GetVersionResult[0].buildDate}`
          );
        })
        .catch((reason) => {
          Logger.errorToast(reason);
        });
    });
  }

  private signalTimeouts: { [signalName: string]: any } = {};

  protected subscribeSignal = (
    signalName: string,
    callback: (value: any) => void,
    timeoutMs: number = 6000,
    fallback?: () => void
  ) => {
    if (!!signalName.length) {
      const signal = this.connector.getSignal(signalName).value;

      // Falls bereits ein Timer für dieses Signal läuft, abbrechen
      if (this.signalTimeouts[signalName]) {
        clearTimeout(this.signalTimeouts[signalName]);
      }

      let received = false;

      const timeout = setTimeout(() => {
        if (!received) {
          const warn = `Timeout: Signal "${signalName}" konnte nicht innerhalb von ${timeoutMs}ms initialisiert werden.`;
          Logger.errorToast(warn);
          this.AddLog(warn, LogType.Abbruch_durch_Zeitüberschreitung);
          if (fallback) {
            fallback();
          }
        }
      }, timeoutMs);

      // Timer speichern
      this.signalTimeouts[signalName] = timeout;

      const wrappedCallback = (value: any) => {
        if (value !== undefined && value !== null && value !== "n/a") {
          received = true;
          clearTimeout(this.signalTimeouts[signalName]);
          delete this.signalTimeouts[signalName];
          callback(value);
        }
      };

      // Initialer Wert
      wrappedCallback(signal());

      // Subscription
      this.subscriptions.push(signal.subscribe(wrappedCallback));
    }
  };

  protected initSpsSignals(): void {
    // Aktuelle PA-Nummer aus SPS auslesen
    this.subscribeSignal(this.signalNamePaNr, (value) => this.paNr(value));

    // PA-Nummer aktiv/inaktiv aus SPS auslesen
    this.subscribeSignal(this.signalNamePaAktiv, (value) =>
      this.paAktiv(value)
    );

    // ProdTyp aus SPS auslesen
    this.subscribeSignal(this.signalNameProdTyp, (value) => this.paTyp(value));

    // SPS Konfig. aus SPS auslesen
    this.subscribeSignal(this.signalNameSpsCnfg, (value) =>
      this.SpsCfg(value)
    );

    // Pilotlevel
    this.subscribeSignal(this.signalNamePilotLevel, (value) =>
      this.pilotLevel(value)
    );

    // Massenberechnungsfaktor
    this.subscribeSignal(this.signalNameFaktor, (value) => this.faktor(value));

    // externe Ladefreigabe
    this.subscribeSignal(this.signalNameFreigabeLaden, (value) =>
      this.freigabeLaden(value)
    );

    // Gebindeanzahl
    this.subscribeSignal(this.signalNameGebindeanzahl, (value) => this.gebindeanzahl(value));

    // PlanLeistung
    this.subscribeSignal(this.signalNamePlanLeistung, (value) => this.planLeistung(value));

    // Rework
    this.subscribeSignal(this.signalNameRework, (value) => this.rework(value));

    // Rezeptname
    this.subscribeSignal(this.signalNameRezNr, (nr) => this.getRezName(nr));

    // Rezeptversion
    this.subscribeSignal(this.signalNameVerNr, (vers) => this.getRezVersion(vers));

    // Netznummer
    this.subscribeSignal(this.signalNameNetzNr, (nr) => this.netzNr(nr));

    // DateTime - Formatierung
    const DTFormat = (originalDT: string): string => {
      // Prüfen, ob es sich um das Microsoft JSON-Datum handelt
      const msDateMatch = originalDT.match(/\/Date\((\d+)([+-]\d{4})?\)\//);
      if (msDateMatch) {
        const timestamp = parseInt(msDateMatch[1], 10);
        return moment(timestamp).format("DD.MM.YYYY HH:mm:ss");
      }
      // Standardformat verarbeiten
      return moment(originalDT, "YYYY-MM-DD-HH:mm:ss.SSS").format("DD.MM.YYYY HH:mm:ss");
    };

    // TimeOfDay - Formatierung
    const TODFormat = (originalTOD: string): string => {
      // Wenn der Wert eine Zahl oder eine Zahl als String ist, behandeln als Millisekunden
      if (!isNaN(Number(originalTOD))) { return moment.utc(Number(originalTOD)).format("HH:mm:ss"); }
      // Standardformat verarbeiten
      return moment(originalTOD, "HH:mm:ss.SSS").format("HH:mm:ss");
    };

    // PA-Start (Timestamp z.B. für Ofenstart)
    if (this.signalNamePaStart) {
      if (typeof this.signalNamePaStart === "string") {
        this.subscribeSignal(this.signalNamePaStart, (td) => this.ProcessTimingData.paStart(DTFormat(td)))
      } else { // der Fall für die Zeit als Byte-Array aus der SPS
        const setPaStart = () => {
          this.ProcessTimingData.paStart(DTFormat(
            `${this.ProcessTimingData.paStartArr()[0]}-${this.ProcessTimingData.paStartArr()[1]}-${this.ProcessTimingData.paStartArr()[2]}-${this.ProcessTimingData.paStartArr()[3]}:${this.ProcessTimingData.paStartArr()[4]}:${this.ProcessTimingData.paStartArr()[5]}`
          ));
        };
        this.subscribeSignal(this.signalNamePaStart.tag.name, (tag) => { this.ProcessTimingData.paStartArr()[0] = tag; setPaStart() });
        this.subscribeSignal(this.signalNamePaStart.monat.name, (monat) => { this.ProcessTimingData.paStartArr()[1] = monat; setPaStart() });
        this.subscribeSignal(this.signalNamePaStart.jahr.name, (jahr) => { this.ProcessTimingData.paStartArr()[2] = jahr; setPaStart() });
        this.subscribeSignal(this.signalNamePaStart.stunde.name, (stunde) => { this.ProcessTimingData.paStartArr()[3] = stunde; setPaStart() });
        this.subscribeSignal(this.signalNamePaStart.minute.name, (minute) => { this.ProcessTimingData.paStartArr()[4] = minute; setPaStart() });
        this.subscribeSignal(this.signalNamePaStart.sekunde.name, (sekunde) => { this.ProcessTimingData.paStartArr()[5] = sekunde; setPaStart() });
      }
    }
    if (this.signalNamePaStop) {
      if (typeof this.signalNamePaStop === "string") {
        this.subscribeSignal(this.signalNamePaStop, (td) => this.ProcessTimingData.paStop(DTFormat(td)))
      } else { // der Fall für die Zeit als Byte-Array aus der SPS
        const setPaStop = () => {
          this.ProcessTimingData.paStop(DTFormat(
            `${this.ProcessTimingData.paStopArr()[0]}-${this.ProcessTimingData.paStopArr()[1]} -${this.ProcessTimingData.paStopArr()[2]} -${this.ProcessTimingData.paStopArr()[3]}:${this.ProcessTimingData.paStopArr()[4]}:${this.ProcessTimingData.paStopArr()[5]}`
          ));
        };
        this.subscribeSignal(this.signalNamePaStop.tag.name, (tag) => { this.ProcessTimingData.paStopArr()[0] = tag; setPaStop() });
        this.subscribeSignal(this.signalNamePaStop.monat.name, (monat) => { this.ProcessTimingData.paStopArr()[1] = monat; setPaStop() });
        this.subscribeSignal(this.signalNamePaStop.jahr.name, (jahr) => { this.ProcessTimingData.paStopArr()[2] = jahr; setPaStop() });
        this.subscribeSignal(this.signalNamePaStop.stunde.name, (stunde) => { this.ProcessTimingData.paStopArr()[3] = stunde; setPaStop() });
        this.subscribeSignal(this.signalNamePaStop.minute.name, (minute) => { this.ProcessTimingData.paStopArr()[4] = minute; setPaStop() });
        this.subscribeSignal(this.signalNamePaStop.sekunde.name, (sekunde) => { this.ProcessTimingData.paStopArr()[5] = sekunde; setPaStop() });
      }
    }

    // errechnete Ofenstartzeit (Timestamp aus der SPS z.B. für Ofenstart)
    this.subscribeSignal(this.signalNameOfenStartCalc, (td) => this.ProcessTimingData.ofenStartCalc(DTFormat(td)));

    // Nachlaufzeit Soll
    this.subscribeSignal(this.signalNameSollNachlauf, (tod) => this.ProcessTimingData.sollNachlauf(TODFormat(tod)));

    // Verbliebene Zeit
    this.subscribeSignal(this.signalNameIstNachlauf, (tod) => this.ProcessTimingData.istNachlauf(TODFormat(tod)));

    // Anlagennummer
    switch (typeof this.anlagenNr) {
      case "number":
        this.anlage(Number(this.anlagenNr));
        break;
      case "string":
        this.subscribeSignal(this.anlagenNr.toString(), (nr) => this.anlage(Number(nr)));
        break;
      default:
        this.anlage(null);
        break;
    }

    // Zählernummer
    switch (typeof this.zaehlerNr) {
      case "number":
        this.zaehler(Number(this.zaehlerNr));
        break;
      case "string":
        this.subscribeSignal(this.zaehlerNr.toString(), (nr) => this.zaehler(Number(nr)));
        break;
      default:
        this.zaehler(null);
        break;
    }
  }

  /** WF-Server - Status Abfragen */
  protected serverStatus(): void {
    const keineVerbindung = () => {
      // fehelerhaftes Ansprechen nach dispose() verhindern
      if (!this.isAlive) return false;

      this.dbState(false);
      Logger.errorToast("keine Verbindung zu WF-Server!");
    };
    const wfServerState = _.debounce(keineVerbindung, 7000);

    const timeStamp = this.connector.getSignal("WFSInternal_AliveTimeStamp");

    this.connector.getOnlineUpdates();
    this.subscriptions.push(
      timeStamp.value.subscribe(() => {
        this.connector
          .readSignals(["WFSInternal_AliveStatus"])
          .then((signals) => {
            if (signals[0].Result === 0 || signals) {
              if (signals[0].Value === 13) {
                this.dbState(true);
                wfServerState();
              }
            }
          });
      })
    );
  }

  /**
   * Prüft, ob die ViewModel-Funktion erreichbar ist.
   * @param {any} data - Die Daten, die an die Funktion übergeben werden sollen.
   * @param {any} fnName - Der Name der Funktion, die aufgerufen werden soll.
   * @returns {Promise<any>} Ein Promise, das entweder den Rückgabewert der Funktion oder einen Fehler zurückgibt.
   */
  protected async extAction(data: any, fnName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (
          !this.fn ||
          !this.fn.vmContext ||
          typeof this.fn.vmContext[this.fn[fnName]] !== "function"
        ) {
          return resolve(`ViewModel bzw. Fn. ${fnName} n. definiert`);
        }

        this.fn.vmContext[this.fn[fnName]](
          function (cb: string) {
            return resolve(cb);
          },
          this.connector,
          data
        );

        // return new Promise((resolve) => {
        //   (this.fn.vmContext = (cb: string) => resolve(cb)), this.connector, data;
        // });
      } catch (error) {
        reject(error);
      }
    });
  }

  /** Funktion auf der ViewModel-Seite. PA wird für benutzerdefinierte Aktionen gestartet/gestoppt. */
  protected paAktion = (data: any) => this.extAction(data, "paAktiviert");

  /** Funktion auf der ViewModel-Seite. Rezepte werden zur SPS für benutzerdefinierte Aktionen gesendet. */
  protected rezGesendet = (data: any) => this.extAction(data, "rezGesendet");

  /** Funktion auf der ViewModel-Seite. Rezepte werden für benutzerdefinierte Aktionen gespeichert. */
  protected rezGespeichert = (data: any) =>
    this.extAction(data, "rezGespeichert");

  /**
   * Liest die aktuelle Rezeptnummer aus der SPS aus.
   * Wenn der Wert "n/a" ist oder kein numerischer Wert, wird die Funktion beendet.
   * Andernfalls wird die Rezeptnummer formatiert und gesetzt.
   *
   * @param {any} value - Der Wert, der aus der SPS gelesen wurde.
   */
  protected getRezName = (value: any) => {
    if (value.toString().toLowerCase().trim() === "n/a" || typeof value !== "number") return;

    const nummer: string = value.toString().padStart(9, "0");
    this.rezNr(nummer);
    this.setRezName(this.rezNr(), this.rezVer());
  };

  // Aktuelle Rezeptversion aus SPS auslesen
  protected getRezVersion = (value: any) => {
    if (value.toString().toLowerCase().trim() === "n/a" || typeof value !== "number") return;

    const nummer: string = value.toString();
    this.rezVer(nummer);
    this.setRezName(this.rezNr(), this.rezVer());
  };

  /**
   * liefert eine Rezeptliste
   * @param rezNr optional, wenn angegeben, dann Info über gewählte Rezeptur
   * @returns string[]
   */
  protected async callService(
    rezNr?: string,
    rezVer?: string
  ): Promise<string[]> {
    try {
      const ret = await rezService.GetRezList({
        werk: this.werk,
        halle: this.halle,
        etage: this.etage,
        linie: this.linie,
        abteiNr: this.abteiNr,
        maschine: this.maschine,
        reznr: rezNr,
        rezver: rezVer,
      });
      this.db2State(true);
      return ret.GetRezListResult.Data;
    } catch (ex) {
      this.db2State(false);
      Logger.errorToast(rezUtils.msgCut(ex.message, 100) + "...");
      this.AddLog(ex.message, LogType.Abbruch_durch_Programmfehler);
      throw ex;
    }
  }

  // Aktuelle Rezeptnummer aus SPS auslesen
  protected setRezName = async (nr: string, ver: string) => {
    try {
      const res = await this.callService(nr, ver);
      const vn = res.toString().split("|");
      const name =
        ver && vn.length > 2
          ? `V${vn[1]} - ${vn[2]}`
          : vn.length > 2
            ? `${vn[2]}`
            : "n/a";
      this.rezName(name);
    } catch (error) {
      console.error(error);
    }
  };

  /** Update Rezept (Datentabelle)
   * @param {number} rezNr Rezeptnummer
   * @param {number} del 0 - Update; 1 - Delete
   */
  protected async updateDataTable(
    rezNr: string,
    rezVer: string,
    del: number
  ): Promise<string> {
    try {
      const response = await rezService.SetDeletedRez({
        User: this.adminName(),
        RezNr: rezNr,
        RezVer: rezVer,
        werk: this.werk,
        halle: this.halle,
        etage: this.etage,
        linie: this.linie,
        abteiNr: this.abteiNr,
        maschine: this.maschine,
      });

      if (!response.SetDeletedRezResult.Succeed) {
        throw new Error(response.SetDeletedRezResult.ErrorMsg);
      }
      if (!response.SetDeletedRezResult.Data) {
        throw new Error(`Rezept - ${rezNr} konnte nicht gelöscht werden.`);
      }
      Logger.successToast(`Rezept - ${rezNr} erfolgreich gelöscht!`);
      return "positiv";
    } catch (error) {
      this.showError(error, `Rezept - ${rezNr} wurde nicht gelöscht!`);
      return "negativ";
    }
  }

  /** Stoppt PA in SPS, OPUS, Lobster */
  protected async stopPa(): Promise<void> {
    try {
      // selektierte in der Liste PA-/Rez-Nr. zwischenspeichern.
      // falls keine Zeile selektiert, dann die aktuelle PA aus der SPS nehmen
      const PaNr = this.getNumber(this.selectedPaData.PaNr, this.paNr);
      const RezNr = this.getNumber(this.selectedPaData.RezNr, this.rezNr);
      this.paSelect(PaNr.toString(), RezNr.toString());
      let dauer: number;

      // -----------------------------------------------------
      // 1. - prüfen ob es sich um Reinigungsauftrag handelt.
      // -----------------------------------------------------
      const _eProdTyp = eProdTypCode;
      if (this.configDataDlgCfg.LbstRngMld_Enabl && this.paTyp() === _eProdTyp.Reinigung) {
        const person = await dialog.show(new PersonalDialog());
        this.AddLog(`Usereingabe: Personen nach 'RR' = ${person}`, this.logTyp);
        if (!person || isNaN(person))
          throw new Error("Eingabe abgebrochen. Bitte wiederholen!");

        // Dezimalstellen verschieben um die Nachkommastellen zu entfernen
        dauer = Math.round(Number(person) * 10000) / 100;
        // wenn es sich nicht um Reinigung oder Nachlaufzeit handelt
      }

      // ------------------------------------------
      // 2. - PA-Werte in der SPS auf 0 schreiben.
      // ------------------------------------------
      await this.writePaDatSps(false).catch((error) => { throw error; });
      const info = "PA-Daten in SPS auf '0' gesetzt.";
      this.AddLog(info, this.logTyp);
      Logger.infoToast(info);

      // -----------------------------------------------------
      // 3. - aktive PA-Aufträge in OPUS suchen ggf. beenden.
      // -----------------------------------------------------
      this.AddLog("Aktive PA in OPUS-Tabelle suchen, ggf. beenden.", this.logTyp);
      let aktivePaOpus: { paNr: number; rezNr: number }[] = [];

      for (const zeile of this.paRows()) {
        // zeile.cells[0] -> Status
        if (Number(zeile.cells[0]) !== 1) continue;

        aktivePaOpus.push({ paNr: Number(zeile.cells[1]), rezNr: Number(zeile.cells[2]), });
        let info = `Es wird versucht, aktive PA: ${zeile.cells[1]} in OPUS zu beenden.`;
        this.AddLog(info, this.logTyp);
        Logger.infoToast(info);

        // --------------------
        // PA-Stoppen in OPUS.
        // --------------------
        await this.sendPaToOpus(
          PaStatus.ende,
          zeile.cells[1],
          zeile.cells[2],
          zeile.cells[3]
        ).catch((error) => {
          throw error;
        });
      }
      if (!aktivePaOpus.length) {
        this.AddLog("keine aktive PA in OPUS-Tabelle gefunden.", this.logTyp);

        // ---------------------------------------------------------------------------
        // PA-Stoppen in OPUS. als 'DUMMY' (alle PA-Variablen in der SPS auf 0 setzen)
        // ---------------------------------------------------------------------------
        if (PaNr > 0)
          await this.sendPaToOpus(PaStatus.ende, PaNr, RezNr, "DU").catch((error) => { throw error; });
      }

      // ------------------------------------
      // 4. - PA in Lobster-Tabelle beenden.
      // ------------------------------------
      // hier durchgelaufen obwohl bit aus war!!!
      if (this.lobsterServiceEnabled()) {
        await this.LobsterPaStopp(PaNr, RezNr, dauer).catch((error) => { throw error; });
      }
      // PA-Liste neu Laden damit man geändertes Status von PA-Aufträgen einholt
      // await this.makePaList();

      this.AddLog(`selektiere PA: ${PaNr}, Rez.: ${RezNr}`, this.logTyp);
      // selektiert eine PA-Zeile mit zwischengespeicherten Pa-/Rez-Nr
      this.paSelect(PaNr.toString(), RezNr.toString());
    } catch (error) {
      throw error;
    }
  }

  /** (Html-Button-Action) PA-Auftrag stoppen */
  protected async btnStopPa(): Promise<void> {
    this.AddLog("*** Btn. 'PA-Stop' geklickt ***", this.logTyp);
    const start = performance.now();
    // Lade-Spinner einblenden
    this.isLoading(true)
    try {
      // Stoppe PA in SPS, OPUS, Lobster
      await this.stopPa();
      this.AddLog("PA gestoppt!", this.logTyp);
    } catch (error) {
      this.showError(error, "PA konnte nicht gestoppt werden.");
    } finally {
      // Lade-Spinner ausblenden
      this.isLoading(false);

      const end = performance.now();
      if (end - start <= 6000) {
        console.log(`Ausführungszeit: von 'btnStopPa()' ${end - start} ms. Buttons blokieren für 5000 ms.`);
        this.fnExecutionTime(true);
      }
    }
  }

  // falls keine Zeile selektiert, dann die aktuelle PA aus der SPS nehmen
  private getNumber = (selectedFn: Function, defaultFn: Function) => {
    const value = parseFloat(selectedFn() || defaultFn());
    return isNaN(value) ? 0 : value;
  };

  /** vergleicht die gewählte PA/Rez- Nr. mit der gewählten Rez.Nr. */
  protected async RezPaPlausibility(): Promise<any> {
    // const prodTyp: string = this.selectedPaData.ProdTyp().toString();
    const prodTyp: string = this.selectedPaData.ProdTyp();
    const paNr: string = this.selectedPaData.PaNr().toString();

    if (
      this.selectedRecipe.Nr() !== this.selectedPaData.RezNr() &&
      !(
        ["33333", "77777", "88888", "99999"].includes(paNr) ||
        ["DU", "RR"].includes(prodTyp)
      )
    ) {
      const info: string =
        "(PA)Rez-Nummer passt nicht zu der gewählten Rez-Nummer!<br><br>Wählen Sie die entsprechende RezNr. aus oder legen Sie das Rezept neu an.";
      this.AddLog(info, LogType.Abbruch);
      const [response, dispose] = await dialog.show(
        new MsgBox(
          `Warnung PA-Rez(${this.selectedPaData
            .RezNr()
            .toString()}) <> Rez(${this.selectedRecipe.Nr()})`,
          info,
          "Orange"
        )
      );
      dispose();
      if (response !== "ok") {
        return;
      }
    } else if (
      "RR" !== prodTyp && // Zeitfensterwarnung bei Reinigungsauftrag nicht auswerten
      moment(new Date()).isAfter(moment(this.selectedPaData.Stop(), "DD.MM.YYYY HH:mm:ss"))
    ) {
      const info: string = `Zeitfenster des gewählten PA-Auftrags liegt in Vergangenheit!<br>${this.selectedPaData.Stop()}<br><br>Sie sind im Begriff, einen ungültigen PA-Auftrag zu starten.`;
      const [response, dispose] = await dialog.show(
        new MsgBox("PA-Auftrag abgelaufen", info, "Orange", [
          { name: "ok", text: "Weiter", btnClassName: "btn btn-warning" },
          {
            name: "cancel",
            text: "Abbrechen",
            btnClassName: "btn btn-default",
          },
        ])
      );
      dispose();
      if (response !== "ok") {
        this.AddLog(info, LogType.Abbruch_durch_Bediener);
        return;
      }
      this.AddLog(info, LogType.OK);
    }

    return {
      PaNr: this.selectedPaData.PaNr().toString(),
      Start: this.selectedPaData.Start(),
      Stop: this.selectedPaData.Stop(),
      // bei Reinigungsauftrag die Planleistung mit 1 vorbelegen, ToDo - Planleistung soll von MES kommen
      Planleistung: "RR" !== prodTyp ? this.selectedPaData.Planleistung() : "1",
      Rezeptbeschreibung: this.selectedRecipe.Descrp(),
    };
  }

  /** prüft ob die Längen zwischen WF-Db und DB2-Db unterschiedlich sind
   * @returns {boolean} true = Freigabe
   * @returns {boolean} false = keine Freigabe
   */
  protected async checkCountDataTable(): Promise<boolean> {
    // this.AddLog("Prüfen: Längen zwischen WF-DB und Rez.-DB", this.logTyp);
    let infoTxt = "",
      headTxt = "";
    let status = 0;
    try {
      const count = (
        await rezService.CheckRecipeDb({
          rezNr: this.selectedRecipe.Nr(),
          rezVer: this.selectedRecipe.Vers(),
          config: {
            werk: this.werk,
            halle: this.halle,
            etage: this.etage,
            linie: this.linie,
            maschine: this.maschine,
            abteiNr: this.abteiNr,
            anlagenNr: this.anlage(),
          },
        })
      ).CountDataTableResult;

      if (!count.Succeed) throw new Error("Fehler in checkCountDataTable()");

      if (count.Data > this.varListeRows().length) {
        headTxt = `Rezeptlänge DB2(${count.Data}) größer als WF-DB(${this.varListeRows().length
          })`;
        infoTxt = `Achtung!<br><br>das Rezept ${this.rezInfo()}<br>ist beschädigt, das Laden des Rezeptes wird verweigert.`;
        status = 2;
      }

      if (count.Data < this.varListeRows().length) {
        headTxt = `Rezeptlänge DB2(${count.Data}) kleiner als WF-DB(${this.varListeRows().length})`;
        infoTxt = `Rezept: ${this.rezInfo()}<br><br>Es gibt Unterschiede in der Länge der Rezepte zwischen der Datenbank und der Anlage. Bitte übertragen Sie das Grundrezept und speichern Sie es ab, damit das Rezept angeglichen wird.`;
        status = 3;
      }

      if (status > 0) {
        this.AddLog(`${headTxt}, ${infoTxt}`, status === 3 ? LogType.OK : LogType.Abbruch);
        const [response, dispose] = await dialog.show(
          new MsgBox(headTxt, infoTxt, status === 3 ? "Orange" : "Tomato")
        );
        dispose();
      }

      return status !== 2;
    } catch (error) {
      headTxt = "Error";
      infoTxt = error.message;
      status = 1;
      this.AddLog(infoTxt, LogType.Abbruch);
      return false;
    }
  }

  /** (Html-Button-Action) Rezept zur SPS senden */
  protected async btnSendRecipe() {
    this.AddLog("*** Btn. 'Rez.Senden' geklickt ***", this.logTyp);
    // -----------------------
    // 1. - Freigaben prüfen.
    // -----------------------
    const isCountValid = await this.checkCountDataTable();
    const isExtFreigabeValid = await this.checkExtFreigabe();
    const isFaultReportValid = this.selectedPaData.ProdTyp() !== "RR" // bei Reinigungsauftrag kein CheckFaultReport
      ? await this.checkFaultReport()
      : true;

    if (!isCountValid || !isExtFreigabeValid || !isFaultReportValid) {
      return;
    }

    // -------------------------------------------------
    // 2. - gewählte PA/Rez- Nr. Plausibilitätsprüfung.
    // -------------------------------------------------
    const paDaten = await this.RezPaPlausibility();
    if (!paDaten) return;

    // ---------------------------------------------
    // 3. - Dialog Ablieferzone, PA-Startdatum usw.
    // ---------------------------------------------
    let dialogResult: IDlgAblieferzone[];
    if (this.kennung() !== FnktKennung.ofen) {
      dialogResult = await dialog.show(
        new DlgAblieferZone(this.anlage().toString(), paDaten)
      );
    } else {
      dialogResult = await dialog.show(
        new DlgAblZoneOfen(this.anlage().toString(), paDaten)
      );
    }
    if (
      !dialogResult || dialogResult.length === 0 ||
      dialogResult[0].toString().toLowerCase() !== "accept"
    ) {
      this.AddLog("Dlg. 'Ablieferzone' Abgebrochen/Geschlossen", LogType.Abbruch_durch_Bediener);
      return;
    }

    // Alle Eigenschaften von dialogResult[1] loggen
    this.AddLog(
      `Dlg. 'Ablieferzone' akzeptiert. Eigenschaften: ${JSON.stringify(dialogResult[1])}`,
      this.logTyp
    );

    this.isLoading(true); // Lade-Spinner zeigen
    try {
      // ---------------------------
      // 4. - Rezeptsenden starten.
      // ---------------------------
      await this.sendRecipe(dialogResult[1] as IDlgAblieferzone);
    } finally {
      this.isLoading(false); // Lade-Spinner ausblenden
    }
  }

  /** Check ob in BdeLobster-Tabelle einen nicht beendeter Auftrag existiert ggf. beenden */
  protected async LobsterPaStopp(paNr: number, rezNr: number, dauer = 0) {
    const PaNr = paNr;
    const RezNr = rezNr;
    const Dauer = dauer;
    try {
      const handleError = (resp: any, errorMsg: string) => {
        if (!resp.Succeed) {
          let exMsg: string;
          // ---------------------------------------------
          // 1. - es handelt sich um behandelten Fehler.
          // ---------------------------------------------
          if (resp.ErrorMsg) {
            const match = JSON.stringify(resp.ErrorMsg).match(
              /(?!System.*?\:)(.*?)(?=\;\\r\\n)/gm
            );
            exMsg =
              match && match.length >= 1
                ? match[0].toString().trim()
                : errorMsg;
          }
          // ---------------------------------------------
          // 2. - es handelt sich um unbehandelten Fehler
          //      z.B. nach try..catch exeption.
          // ---------------------------------------------
          if (resp.message) {
            exMsg = resp.message;
          }
          this.AddLog(exMsg, this.logTyp);
          throw new Error(exMsg);
        }
      };

      // ------------------------------------------------
      //  1. - Suche unbeendete PA's in Lobster-Tabelle.
      // ------------------------------------------------
      if (PaNr > 0) {
        let respLobst = (
          await rezService
            .GetBdeLobstUncomp(undefined, this.anlage())
            .catch((error) => {
              throw error;
            })
        ).GetBdeLobstUncompResult;
        handleError(respLobst, "Fehler in 'GetBdeLobstUncomp'");

        // -------------------------------------
        //  2. - PA Beenden in Lobster-Tabelle.
        // -------------------------------------
        if (
          Array.isArray(respLobst.Data.Data) &&
          respLobst.Data.Data.length > 0
        ) {
          for (const e of respLobst.Data.Data) {
            this.AddLog(`stoppe PA ${e.PaNr} in Lobster-Tabelle`, this.logTyp);
            try {
              respLobst = (
                await rezService
                  .SetBdeLobst({
                    AuftArt: e.AuftArt,
                    Fnkt: eAuftFn.Ende,
                    PaNr: e.PaNr,
                    RessNr: this.anlage(),
                    ZaehlNr: this.zaehler() || this.anlage(),
                    RezNr: e.RezNr,
                    Wert: Dauer,
                    VorgNr: e.VorgNr,
                    RueckNr: e.RueckNr,
                  })
              ).SetBdeLobstResult;
              handleError(respLobst, "Fehler in 'SetBdeLobst' beim PA beenden");
              this.AddLog(
                `PA ${e.PaNr} in Lobster-Tabelle gestoppt`,
                this.logTyp
              );
            } catch (error) {
              handleError(error, "Fehler in 'SetBdeLobst' beim PA beenden");
            }
          }
        }
      } else {
        // ---------------------------------------------------------------------
        //  Alle gestarteten PA's unter der RessNr. in Lobster-Tabelle stoppen.
        // ---------------------------------------------------------------------
        this.AddLog(
          `andere nicht beendete PAs unter RessNr. ${this.anlage()} ZählNr. ${this.zaehler()} in Lobster-Tabelle beenden`,
          this.logTyp
        );
        let respStopLobst = (
          await rezService
            .StopAllBdeLobst(this.anlage(), this.zaehler())
            .catch((error) => {
              throw error;
            })
        ).StopAllBdeLobstResult;
        handleError(respStopLobst, "Fehler in 'GetBdeLobstUncomp'");
        if (respStopLobst.Data.length)
          this.AddLog(
            `PA ${respStopLobst.Data.join(", ")} in Lobster-Tabelle gestoppt`,
            this.logTyp
          );
        else
          this.AddLog(
            `Keine aktiven PAs in Lobster-Tabelle gefunden.`,
            this.logTyp
          );
      }
    } catch (ex) {
      throw ex;
    }
  }

  /** sendet Rezept zur SPS */
  protected async sendRecipe(DlgRes: IDlgAblieferzone) {
    // Rez-/Version-Nummer zwischenspeichern, da es Probleme mit der Selektion geben kann.
    const PaNr = this.selectedPaData.PaNr();
    const RezNr = this.selectedRecipe.Nr();
    const RezVer = this.selectedRecipe.Vers();
    const ProdTyp = this.selectedPaData.ProdTyp();
    const RezName = this.selectedRecipe.Descrp();
    const VorgNr = this.selectedPaData.ActivNr();
    const RueckNr = this.selectedPaData.RespnNr();
    try {
      // ---------------------------------------
      // 1. - PA in SPS, OPUS, Lobster stoppen.
      // ---------------------------------------
      await this.stopPa().catch((error) => {
        throw error;
      });

      if (!DlgRes.ofenautostart) {
        // ------------------------
        // 2 - PA-Starten in OPUS.
        // ------------------------
        await this.sendPaToOpus(
          PaStatus.start,
          PaNr,
          RezNr,
          ProdTyp,
          DlgRes.zone,
          DlgRes.rework
        ).catch((error) => {
          throw error;
        });

        // ------------------------------------
        // 3. - PA Starten in Lobster-Tabelle.
        // ------------------------------------
        if (
          this.lobsterServiceEnabled() &&
          !["33333", "77777", "88888", "99999"].includes(PaNr) // es dürfen keine 'dummys' behandelt werden
        ) {
          const format = "DD.MM.YYYY HH:mm:ss";
          const diffInSeconds = moment(DlgRes.stop, format).diff(
            moment(DlgRes.start, format),
            "seconds"
          );
          const AuftArt =
            eAuftArt[ProdTyp as keyof typeof eAuftArt] ||
            eProdTyp[ProdTyp as keyof typeof eProdTyp];
          const respLobst = (
            await rezService
              .SetBdeLobst({
                AuftArt,
                Fnkt: eAuftFn.Start,
                PaNr: parseFloat(PaNr.toString()),
                RessNr: this.anlage(),
                ZaehlNr: this.zaehler() || this.anlage(),
                RezNr: parseFloat(RezNr.toString()),
                Wert: diffInSeconds,
                VorgNr: VorgNr,
                RueckNr: RueckNr,
              })
              .catch((error) => { throw error; })
          ).SetBdeLobstResult;
          if (!respLobst.Succeed) {
            const match = JSON.stringify(respLobst.ErrorMsg).match(
              /(?!System.*?\:)(.*?)(?=\;\\r\\n)/gm
            );
            throw new Error(
              match && match.length >= 1 ? match[0] : "Fehler in 'SetBdeLobst'"
            );
          }
        }
      }

      // -------------------------------------------
      // 3. - PA-Nr., Planlstg. ect. -> SPS senden.
      // -------------------------------------------
      const paToSps = await this.writePaDatSps(
        true,
        DlgRes.start,
        DlgRes.stop,
        DlgRes.leistung,
        this.kennung() === FnktKennung.ofen && DlgRes.ofenautostart,
        PaNr,
        RezNr
      ).catch((error) => {
        throw error;
      });

      // ------------------------------------
      // 4. - Rezeptvariablen -> SPS senden.
      // ------------------------------------
      let sndToSpsResult: any[] | WEBfactory.DWH.Data.Exchange.ActionResult;
      if (DlgRes.grundrezept)
        sndToSpsResult = await this.sendToSps(RezNr, RezVer);
      else
        sndToSpsResult = await this.writeRezDatSps(RezNr, RezVer || 0).catch((error) => { throw error; });

      await this.rezGesendet({
        id: null,
        paNr: PaNr,
        rzNr: RezNr,
        rzVer: RezVer,
        rzName: RezName,
      });

      Logger.successToast(paToSps[0] + sndToSpsResult[0]);
    } catch (error) {
      this.showError(error, "Rezept wurde nicht zur SPS übertragen.");
    } finally {
      // PA-Tabelle refreshen. Dies ist notwendig, falls das Rezept nicht erfolgreich gesendet wurde.
      await this.makePaList();
    }
  }

  /** aktiviert/deaktiviert PA-Nr. */
  protected async sendPaToOpus(
    status: PaStatus,
    paNummer: any,
    rezNummer: any,
    prodTyp: string,
    ablieferZone?: number,
    rework?: boolean
  ): Promise<string> {
    const paNr: string =
      typeof paNummer !== "string" ? paNummer.toString() : paNummer;
    try {
      // ------------------------------------------------------
      // -- Option 1 -- es handelt sich um die Dummy-Aufträge.
      // ------------------------------------------------------
      if (
        ["33333", "77777", "88888", "99999", "0"].includes(paNr) ||
        prodTyp == "DU"
      ) {
        const txt: string = `Auftrag: ${paNr} in SPS`;
        let ret:
          | [string, string, LogType]
          | PromiseLike<[string, string, LogType]>[] =
          status === PaStatus.start
            ? [txt + " gestartet!", "LimeGreen", LogType.OK]
            : [txt + " beendet!", "Orange", LogType.OK];
        this.AddLog(ret[0], status === PaStatus.start ? LogType.PA_Start : LogType.PA_Stopp);

        // weil es sich um Dummy-Auftr. handelt hier ende
        const sResp = await this.paAktion({ paNr, rzNr: rezNummer || 0, status: PaStatus[status], });
        console.info("%c" + sResp, "color:orange");
        // weil es sich um Dummy-Auftr. handelt hier ende
        return ret[0];
      }
      // -----------------------------------------------------
      // -- Option 2 -- es handelt sich um die OPUS-Aufträge.
      // -----------------------------------------------------
      // optionale Parameter verarbeiten
      rework = rework || false;
      ablieferZone = ablieferZone || -1;

      const _t = await rezService.PaStartStop({
        AnlagenNr: this.anlage(),
        ProdAufNummer: paNummer,
        Status: status,
        AblieferZone: ablieferZone,
        AnswerRework: rework,
        userName: this.userName(),
        prodTyp,
      });
      const resp: IXOpusMsg =
        _t["PaStartStopResult"] || _t["PaStartStopTestEnvResult"];
      this.AddLog(
        `OPUS -> UserMsg: ${resp.UserMsg}, CallId: ${resp.CallId}, DBRqID: ${resp.DBRqID}`,
        status === PaStatus.start ? LogType.PA_Start : LogType.PA_Stopp
      );

      const sResp = await this.paAktion({
        paNr,
        rzNr: rezNummer || 0,
        status: PaStatus[status],
      });
      console.info("%c" + sResp, "color:orange");

      return `OPUS -> UserMsg: ${resp.UserMsg}, CallId: ${resp.CallId}, DBRqID: ${resp.DBRqID}`;
    } catch (error) {
      // da OPUS bei n. gefundenen PA's Antwort 500 zurücksendet, wird an der Stelle Zusatzinfo ausgewertet
      console.log("OPUS -> Error\n" + JSON.stringify(error));
      const ex = JSON.stringify(rezUtils.xmlToJson($(error.responseText)[0]));
      console.log(ex);

      const msg = JSON.parse(ex).REASON.TEXT["#text"];
      this.AddLog(msg, LogType.Abbruch);

      throw new Error(`OPUS -> ${msg}`);
    }
  }

  // Filtere die Objekteigenschaften und prüfe die Schlüssel
  protected filteredValues = (obj: {
    [key: string]: any;
  }): { [key: string]: any } => {
    const filteredObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (
        obj[key] !== undefined &&
        key !== null &&
        key !== undefined &&
        key !== ""
      ) {
        filteredObj[key] = obj[key];
      }
    }
    return filteredObj;
  };

  /** sendet ausgewählte Rezeptdaten zur SPS */
  protected async sendToSps(
    RezNr: string,
    RezVer: string,
    fltr: string | string[] = this.filter
  ) {
    const self: this = this;
    let filter: string[] = [];
    Array.isArray(fltr) ? (filter = filter.concat(fltr)) : filter.push(fltr);

    const start = performance.now();

    this.AddLog(
      `Sende ${this.varListeRows().length} Rez. Var. über LibNoDave zur SPS. Rez.Nr.: ${RezNr}, Vers.: ${RezVer}, Filter: ${filter}`,
      LogType.OK
    );
    try {
      // Rez.Nr. + Rez.Version zur SPS senden
      let response = await Promise.all(
        filter.map(async (fltr) => {
          return await rezService.WriteToSpsRez({
            WfServer: self.serverName,
            WfDb: self.databaseName,
            Werk: self.werk,
            Halle: self.halle,
            Etage: self.etage,
            Linie: self.linie,
            Abteil: self.abteiNr,
            Maschine: self.maschine,
            RezeptNr: RezNr,
            RezeptVer: RezVer,
            WfFilter: fltr,
          });
        })
      );

      response.map(async (res) => {
        if (!res.WriteToSpsRezResult.Succeed) {
          // throw new Error(res.WriteToSpsRezResult.ErrorMsg.toString());
          console.error(res.WriteToSpsRezResult.ErrorMsg.toString());
        }
        // falls virtuelle Variablen zurückgegeben werden,
        // die Signale/Werte zusammensetzen um durch wf-connector schreiben
        if (Array.isArray(res.WriteToSpsRezResult.Data)) {
          const values: { [key: string]: any } = {};
          const [name, value] = [...res.WriteToSpsRezResult.Data]
            .toString()
            .split("|");
          values[name] = value;

          // virtuelle Variablen mittels WF-Connector in SPS schreiben
          const toSendValues = this.filteredValues(values);
          this.AddLog(`Sende Virtuelle Var. | ${JSON.stringify(toSendValues)}`, this.logTyp);
          await this.connector.writeSignals(toSendValues);
        }
      });

      // neue Werte in SPS schreiben
      const ret = await self.writeRezDatSps(RezNr, RezVer);

      const info = `Rezept: ${self.rezInfo()} erfolgreich zur SPS übertragen!`;
      Logger.successToast(info);
      this.AddLog(info, LogType.OK);
      return ret;
    } catch (error) {
      Logger.error(self, error.message, error.stack);
      self.AddLog(
        "Fehler - " + error.message,
        LogType.Abbruch_durch_Programmfehler
      );
      throw error;
    } finally {
      const end = performance.now();
      if (end - start <= 5000) {
        console.log(`Ausführungszeit: von 'sendToSps()' ${end - start} ms. Buttons blokieren für 5000 ms.`);
        this.fnExecutionTime(true);
      }
    }
  }

  /** führt Login aus um die Schreibrechte für DB2(IBM) zu erlangen */
  protected async userLog(): Promise<boolean> {
    const self: this = this;
    if (self.adminIsLogged()) {
      return true; // Promise.resolve()
    }
    try {
      const promise = await dialog.show(new LoginDialog());
      const dlgResult = promise as IDlgRespLogInOut;
      if (dlgResult.state === 1) {
        self.adminIsLogged(true);
        self.adminName(`${dlgResult.vorname} ${dlgResult.nachname}`);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      self.showError(error, "Fehler beim User-Logging");
      self.AddLog(
        "Fehler beim Anmelden" + " - " + error.toString(),
        LogType.Abbruch_durch_Programmfehler
      );
      return false;
    }
  }

  /** fargt Faktor u. Pilotlevel ab um das Speichern zu erlauben/verbieten
   * @returns  true = Freigabe
   * @returns false = keine Freigabe
   */
  protected async checkFactor(): Promise<boolean> {
    const self: this = this;
    let infoHead: string = "";
    let infoTxt: string = "";

    let showBox = async function (): Promise<boolean> {
      let info = `Speichern untersagt! ${infoHead}%`;
      self.AddLog(info, LogType.Abbruch);
      let [response, dispose] = await dialog.show(
        new MsgBox(
          info,
          `Die Sollwerte sind durch die Änderung des ${infoTxt} geändert.<br>Es wird empfohlen, das Rezept neu zu laden!`,
          "Orange"
        )
      );
      dispose();
      return false;
    };

    // Check Pilotlevel
    if (!isNullOrUndefined(self.pilotLevel()) && self.pilotLevel() !== 0) {
      infoHead = `Pilotlevel = ${self.pilotLevel()}`;
      infoTxt = "Pilotlevels";

      return Promise.resolve(showBox());
    }
    // Check Massenberechnungsfaktor
    if (!isNullOrUndefined(self.faktor()) && self.faktor() !== 100) {
      infoHead = `Faktor = ${self.faktor()}`;
      infoTxt = "Massenberechnungsfaktors";

      return Promise.resolve(showBox());
    }
    return Promise.resolve(true);
  }

  /** Überprüft das externe Freigabebit, um das Laden zu erlauben oder zu verweigern
   * @returns {boolean} true = Freigabe
   * @returns {boolean} false = keine Freigabe
   */
  protected async checkExtFreigabe(): Promise<boolean> {
    // this.AddLog("Prüfen: Externe-Ladefreigabe?", LogType.Debug);
    // Check ext. Ladefreigabe
    if (!isNullOrUndefined(this.freigabeLaden()) && !this.freigabeLaden()) {
      let infoTxt = !this.grundFreigabeLaden
        ? "Das Laden wird von externem Signal blockiert."
        : this.grundFreigabeLaden;

      let info = `Laden untersagt! Freigabe Laden = ${this.freigabeLaden()}`;
      this.AddLog(info, LogType.Abbruch);

      let [, dispose] = await dialog.show(new MsgBox(info, infoTxt, "Tomato"));
      dispose();
      return false;
    }
    return Promise.resolve(true);
  }

  /**
   * Überprüft, ob unkommentierte Störungen vorliegen
   * @returns {boolean} true = Freigabe
   * @returns {boolean} false = keine Freigabe
   */
  protected async checkFaultReport(): Promise<boolean> {
    // this.AddLog("Prüfen: unkommentierte Störungen?", LogType.Debug);
    let ret: boolean = false;
    let respFaultCount: IWcfResult;
    try {
      respFaultCount = (
        await rezService.GetFaultCount(this.zaehler() || this.anlage())
      ).GetFaultCountResult;

      if (!respFaultCount.Succeed) {
        throw new Error(respFaultCount.Msg);
      }

      this.AddLog(
        `${respFaultCount.Data} - unkommentierte Störungen.`,
        LogType.Debug
      );
      // Überprüfen Sie, ob respFaultCount.Data eine Zahl ist und nicht null
      if (typeof respFaultCount.Data === "number" && respFaultCount.Data !== 0) {
        // Todo: Link zur Störmeldungsseite. An der Stelle hat man das Problem, dass beim Klick auf den Link
        // das modaleFenster nicht geschlossen wird.
        // const lnk = `<p style="margin-top:1em;"><a style="color:blue;text-decoration:underline;font-style:italic;font-size:smaller;"
        //  href="https://app-visu-02-p/ccwfaultcommit/index.html?resid=7251124" target="_blank" rel="noopener noreferrer"
        //  onclick="alert($data);eval('close();');"> Link zur Störmeldungsseite </a></p>`
        //  onclick="event.preventDefault();document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));"> Link zur Störmeldungsseite </a></p>`
        const infoTxt = "Bitte kommentieren Sie die anstehenden Störmeldungen. ";
        const info = `Laden untersagt! Anzahl unkommentierter Störungen: ${respFaultCount.Data}`;
        const msg = new MsgBox(info, infoTxt, "Tomato")
        // this.CloseModal = this.closeChild.close.bind(msg);
        await dialog.show(msg);

        ret = false;
      } else
        ret = true;
    } catch (ex) {
      this.AddLog(
        `Fehler: ${ex.message}`,
        LogType.Abbruch_durch_Programmfehler
      );
      await dialog.show(new MsgBox("Fehler", ex.message, "Tomato"));
    }
    return ret;
  }
  /** (Html-Button-Action) Zeige Rez. Logs. */
  protected async btnShowLogs(e) {
    70
    e.preventDefault(); // verhindert das Standardverhalten des Buttons
    e.target.blur(); // remove focus from button
    if (this.CloseModal) this.CloseModal();
    try {
      const dlg = new cwRezDlgLogs(this.anlage());
      // Hier wird die `close`-Methode des `closeChild`-Objekts an das `dlg`-Objekt gebunden und `this.CloseModal` zugewiesen.
      this.CloseModal = this.closeChild.close.bind(dlg);
      await dialog.show(dlg);
    } catch (error) {
      this.showError(error, "Fehler beim Anzeigen der Rezept-Logs");
    }
  }
  /** (Html-Button-Action) Zeige Setup Dlg. */
  protected async btnShowSetup(e) {
    e.preventDefault(); // verhindert das Standardverhalten des Buttons
    e.target.blur(); // remove focus from button
    if (this.CloseModal) this.CloseModal();
    try {
      const dlg = new cwRezDlgSetup([this.configDataSpsCfg, this.configDataDlgCfg, this.rezDlgProperties]);
      // Hier wird die `close`-Methode des `closeChild`-Objekts an das `dlg`-Objekt gebunden und `this.CloseModal` zugewiesen.
      this.CloseModal = this.closeChild.close.bind(dlg);
      await dialog.show(dlg);
    } catch (error) {
      this.showError(error, "Fehler beim Anzeigen der Rezept-Setup");
    }
  }

  /** (Html-Button-Action) schreibt Rezept (Datentabelle) */
  protected async btnSaveRecipe() {
    this.AddLog("*** Btn. 'Rez. Speichern' geklickt ***", this.logTyp);
    if (!(await this.checkFactor()) || !(await this.userLog())) return;

    try {
      const dlg = new SaveDialog(
        this.selectedRecipe.Nr(),
        this.selectedRecipe.Vers(),
        this.selectedRecipe.Descrp(),
        {
          werk: this.werk,
          halle: this.halle,
          etage: this.etage,
          linie: this.linie,
          maschine: this.maschine,
          abteiNr: this.abteiNr,
          anlagenNr: this.anlage(),
        },
        !!this.rezVer()
      );
      // Hier wird die `close`-Methode des `closeChild`-Objekts an das `dlg`-Objekt gebunden und `this.CloseModal` zugewiesen.
      this.CloseModal = this.closeChild.close.bind(dlg);
      const dialogResult: any = await dialog.show(dlg);
      if (
        dialogResult.state !== "save" ||
        !(dialogResult.rezNr || dialogResult.rezName)
      ) {
        Logger.warn(
          this,
          "Rezept-Dlg. Abbruch!",
          dialogResult.state,
          dialogResult.rezNr,
          dialogResult.rezName
        );
        this.AddLog(
          "Rezept-Dlg. wurde geschlossen, ohne zu speichern",
          LogType.Abbruch_durch_Bediener
        );
        // throw new Error("Rezept-Dlg. Abbruch!")
        return;
      }
      // Lade-Spinner zeigen
      this.isLoading(true);

      // Variablenvalues erfrischen
      this.varListe = await this.RezValues.getRezValues(this.varListe);

      const tmpRequest: any[] = [];
      for (const iVarListeRow of this.varListe) {
        // Variablen in JSON-Formatieren
        tmpRequest.push({
          // falls die globale Variable vorhanden, dann Aliasname mit der globalen Var.Namen
          // AliasName: iVarListeRow.AliasGlobal != "" ? iVarListeRow.AliasGlobal : iVarListeRow.Aliasname,
          AliasName: iVarListeRow.AliasGlobal || iVarListeRow.Aliasname,
          Adresse: iVarListeRow.Name,
          Factor: iVarListeRow.Factor,
          Description: iVarListeRow.Description,
          Value: iVarListeRow.Value,
        });
      }

      const response = await rezService.WriteToDB({
        Data: tmpRequest,
        User: this.adminName(),
        Werk: this.werk,
        Halle: this.halle,
        Etage: this.etage,
        Linie: this.linie,
        Abteil: this.abteiNr,
        Maschine: this.maschine,
        RezeptNr: dialogResult.rezNr,
        RezeptVer: dialogResult.rezVer,
        RezeptName: dialogResult.rezName,
      });

      if (!response.WriteToDBResult.Succeed) {
        throw new Error(response.WriteToDBResult.ErrorMsg.toString());
      }

      await this.rezGespeichert({
        id: null,
        paNr: this.selectedPaData.PaNr() || 0,
        rzNr: dialogResult.rezNr,
        rzVer: dialogResult.rezVer,
        rzName: dialogResult.rezName,
      });

      let info = `Rezept ${dialogResult.rezNr} - ${dialogResult.rezName} gespeichert!`;
      Logger.successToast(info);
      this.AddLog(info, LogType.OK);
      // neue Werte in SPS schreiben
      let resp = await this.writeRezDatSps(
        dialogResult.rezNr,
        dialogResult.rezVer
      );
      this.loadRezList(160);
      return resp;
    } catch (error) {
      let info: string = "Rezept wurde nicht gespeichert.";
      this.showError(error, info);
      this.AddLog(info + " -> " + error, LogType.Abbruch);
    } finally {
      // Lade-Spinner ausblenden
      this.isLoading(false);
    }
  }

  /** Fehleranzeige */
  protected async showError(ex: Error, msg: string): Promise<void> {
    const info: string = `${rezUtils.msgCut(msg)}<br><br>${rezUtils.msgCut(
      ex
    )}<br>${rezUtils.msgCut(ex.message)}`;
    this.AddLog(info, LogType.Abbruch);
    let [response, dispose] = await dialog.show(
      new MsgBox("Vorgang abgebrochen", info, "Tomato")
    );
    dispose();
    this.AddLog(ex.message, this.logTyp);
  }

  /** schreibt Signale mittels WF-Connector Rez.-Nr., Pilotlevel, Faktor und Gebindeanzahl in SPS */
  protected async writeRezDatSps(
    rezNummer: any,
    rezVersion: any
  ): Promise<WEBfactory.DWH.Data.Exchange.ActionResult> {
    try {
      if (!rezNummer || (rezVersion !== 0 && !rezVersion)) {
        throw new Error("Rez-/Versionsnummer fehlt.");
      }
      const values: { [key: string]: any } = {};
      // Rezeptnummer falls Var. deklariert schreiben
      values[this.signalNameRezNr] = rezNummer;
      // Rezeptversion falls Var. deklariert schreiben
      values[this.signalNameVerNr] = rezVersion;
      // Netznummer falls Var. deklariert schreiben
      values[this.signalNameNetzNr] = this.selectedPaData.NetzNr();
      // Pilotlevel falls eingegeben auf 0 schreiben
      values[this.signalNamePilotLevel] = 0;
      // Faktor falls eingegeben auf 100% schreiben
      values[this.signalNameFaktor] = 100;

      // Werte mittels WF-Connector in SPS schreiben
      const toSendValues = this.filteredValues(values);
      this.AddLog(`Sende Rez-/PA-/V- Nr. zur SPS: ${JSON.stringify(toSendValues)}`, this.logTyp);

      return await this.connector.writeSignals(toSendValues);
    } catch (error) {
      this.AddLog(`${error.message}, ${error.stack}`, this.logTyp);
      throw error;
    }
  }

  /**
   * Weist die SPS-Konfigurationsnummer basierend auf dem Produkttyp (`ProdTyp`) zu.
   *
   * Diese Methode überprüft, ob der aktuelle Produkttyp (`ProdTyp`) in der dynamischen
   * Zuordnungstabelle `dynamicProdTypToSpsCfg` vorhanden ist. Falls ja, wird die entsprechende
   * SPS-Konfigurationsnummer zusammen mit dem Produkttyp zurückgegeben.
   * Andernfalls wird ein Logeintrag mit einer Fehlermeldung erzeugt.
   *
   * @param {any} prodTyp - Der Produkttyp-Wert, der überprüft und zugeordnet werden soll.
   * @returns {{ prodTyp: number, cfg: number }} Ein Objekt mit Produkttyp und zugewiesener Konfigurationsnummer.
   */
  private assignSpsCfg(rawProdTyp: any): { prodTyp: number, cfg: number } {
    let result = { prodTyp: 0, cfg: 0 };

    const parsedProdTyp = Number(rawProdTyp);

    result.prodTyp = parsedProdTyp;

    if (this.dynamicProdTypToSpsCfg.has(parsedProdTyp)) {
      result.cfg = this.dynamicProdTypToSpsCfg.get(parsedProdTyp)!;
    } else {
      this.AddLog(
        `[assignSpsCfg] Kein Eintrag für Produkttyp '${parsedProdTyp}' in der dynamischen Konfiguration gefunden.`,
        this.logTyp
      );
    }

    return result;
  }

  /**
   * PA-Nr. & PA-Aktiv sowie PA-Zeitstempel (falls vorhanden) in SPS schreiben
   * @param paAktivFlag true = Aktivieren; false = Deaktivieren @example "YYY-M-DD HH:mm:ss" => "2000-01-01 00:00:00.000"
   * @param paStartDT (optional) Zeitstempel für PA-Sart in DT-Format
   * @param paStopDT (optional) Zeitstempel für PA-Sopp in DT-Format
   * @param paLeistung (optional) Planleistung
   */
  protected async writePaDatSps(
    paAktivFlag: boolean,
    paStartDT?: string,
    paStopDT?: string,
    paLeistung?: number,
    ofenstart?: boolean,
    PaNr?: string,
    RezNr?: string
  ): Promise<WEBfactory.DWH.Data.Exchange.ActionResult> {
    const values: { [key: string]: any } = {};
    if (paAktivFlag) {
      values[this.signalNamePaNr] = this.selectedPaData.PaNr() || PaNr;
      values[this.signalNameRezNr] = this.selectedPaData.RezNr() || RezNr;
      values[this.signalNameNetzNr] = this.selectedPaData.NetzNr();
      values[this.signalNamePaAktiv] = -1;

      // optionale Parameter
      if (paStartDT !== void 0 && this.signalNamePaStart) {
        if (typeof this.signalNamePaStart === "string") {
          values[this.signalNamePaStart] = moment(
            paStartDT,
            "DD.MM.YYYY HH:mm:ss"
          ).format("YYYY-MM-DD HH:mm:ss");
        } else {
          const dt: any = moment(moment(paStartDT, "DD.MM.YYY HH:mm:ss"));
          values[this.signalNamePaStart.tag.name] = dt.date();
          values[this.signalNamePaStart.monat.name] = dt.month() + 1;
          values[this.signalNamePaStart.jahr.name] = dt.year();
          values[this.signalNamePaStart.stunde.name] = dt.hour();
          values[this.signalNamePaStart.minute.name] = dt.minute();
          values[this.signalNamePaStart.sekunde.name] = dt.second();
        }
      }
      if (paStopDT !== void 0 && this.signalNamePaStop) {
        if (typeof this.signalNamePaStop === "string") {
          values[this.signalNamePaStop] = moment(
            paStopDT,
            "DD.MM.YYYY HH:mm:ss"
          ).format("YYYY-MM-DD HH:mm:ss");
        } else {
          const dt: any = moment(moment(paStopDT, "DD.MM.YYY HH:mm:ss"));
          values[this.signalNamePaStop.tag.name] = dt.date();
          values[this.signalNamePaStop.monat.name] = dt.month() + 1;
          values[this.signalNamePaStop.jahr.name] = dt.year();
          values[this.signalNamePaStop.stunde.name] = dt.hour();
          values[this.signalNamePaStop.minute.name] = dt.minute();
          values[this.signalNamePaStop.sekunde.name] = dt.second();
        }
      }
      if (paLeistung !== void 0 && this.signalNamePlanLeistung) {
        values[this.signalNamePlanLeistung] = paLeistung;
      }

      // Gebindeanzahl falls eingegeben schreiben
      if (this.signalNameGebindeanzahl != "") {
        // let resolve = (await rezService.Gebindemenge(rezNummer)).GebindemengeResult;
        let resolve = (await rezService.Gebindemenge(this.selectedPaData.RezNr())).GebindemengeResult;
        if (!resolve.Succeed) throw new Error(resolve.ErrorMsg);
        values[this.signalNameGebindeanzahl] = resolve.Data.Stueck;
      }
    } else {
      // Merker Übergang Prod.Typ 'RR' -> 0 bilden.
      this.isRRToZero =
        this.paTyp() == 9 && this.selectedPaData.ProdTyp() == "RR";
      if (this.isRRToZero) {
        this.AddLog("Merker Übergang von 'RR' -> 0 für Nachlaufzeit gesetzt.", this.logTyp);
      }
      if (this.signalNamePaStart) {
        if (typeof this.signalNamePaStart === "string") {
          values[this.signalNamePaStart] = "2000-01-01 00:00:00";
        } else {
          values[this.signalNamePaStart.tag.name] = "1";
          values[this.signalNamePaStart.monat.name] = "1";
          values[this.signalNamePaStart.jahr.name] = "0";
          values[this.signalNamePaStart.stunde.name] = "0";
          values[this.signalNamePaStart.minute.name] = "0";
          values[this.signalNamePaStart.sekunde.name] = "0";
        }
      }
      if (this.signalNamePaStop) {
        if (typeof this.signalNamePaStop === "string") {
          values[this.signalNamePaStop] = "2000-01-01 00:00:00";
        } else {
          values[this.signalNamePaStop.tag.name] = "1";
          values[this.signalNamePaStop.monat.name] = "1";
          values[this.signalNamePaStop.jahr.name] = "0";
          values[this.signalNamePaStop.stunde.name] = "0";
          values[this.signalNamePaStop.minute.name] = "0";
          values[this.signalNamePaStop.sekunde.name] = "0";
        }
      }
      // alle PA-Values in  der SPS auf 0 schreiben
      values[this.signalNamePaNr] = 0;
      values[this.signalNamePaAktiv] = 0;
      values[this.signalNameProdTyp] = 0;
      values[this.signalNameNetzNr] = 0;
      values[this.signalNameSpsCnfg] = 0;

      // Rez. Nummer- Version auf 0 schreiben
      values[this.signalNameRezNr] = 0;
      values[this.signalNameVerNr] = 0;

      values[this.signalNamePlanLeistung] = 0;
      values[this.signalNameGebindeanzahl] = 0;
      values[this.signalNamePilotLevel] = 0;
      values[this.signalNameFaktor] = 100;
      values[this.signalNameRework] = 0;
    }

    try {
      // Werte mittels WF-Connector in SPS schreiben
      let toSendValues = this.filteredValues(values);
      this.AddLog(`Sende ${paAktivFlag ? "Rez. Werte" : "Default 0-Werte"} zur SPS: ${JSON.stringify(toSendValues)}`, this.logTyp);
      let start = performance.now();

      const data: WEBfactory.DWH.Data.Exchange.ActionResult = await this.connector.writeSignals(toSendValues);

      if (!data.successful) {
        let info: string = "";
        for (const key in values) {
          if (values.hasOwnProperty(key))
            info += key + "=" + values[key] + "</br>";
        }
        // da errorMessage bei WF V3.6 keine brauchbare Infos liefert, wird hier die Custom-Info ausgeben.
        // Um die Fehlerdetails zu sehen, WF Activity Analyser auf dem Server benutzen.
        // throw data.errorMessage + info;
        throw "Fehler beim Schreiben: " + "</br>" + info;
      }

      if (!(this.isRRToZero || paAktivFlag)) return data;

      Object.keys(values).forEach(key => delete values[key]); // Werte-Objekt leeren
      let config: { prodTyp: number, cfg: number } = null;

      if (this.isRRToZero) {
        this.isRRToZero = false;
        config = this.assignSpsCfg(eProdTyp.NL);
      } else if (ofenstart) {
        config = this.assignSpsCfg(eProdTyp.OF);
      } else {
        const typ = this.selectedPaData.ProdTyp();
        config = this.assignSpsCfg(eProdTyp[typ]);
      }
      values[this.signalNameProdTyp] = config.prodTyp;
      values[this.signalNameSpsCnfg] = config.cfg;

      // setTimeout(async () => {
      // Werte mittels WF-Connector in SPS schreiben
      toSendValues = this.filteredValues(values);
      this.AddLog(`Sende Konfig. zur SPS: ${JSON.stringify(toSendValues)}`, this.logTyp);

      await this.connector.writeSignals(toSendValues);
      // }, 1000);

      return data;
    } catch (error) {
      throw error;
    }
  }

  /** füllt die Variablentabelle */
  protected async fillTable(): Promise<void> {
    // Head
    const headArr: any = { cells: this.Tab.getHeadData(this.varListe) };
    this.varListeHead(headArr);
    // Rows
    this.varListeRows.removeAll();
    const bodyArr: any = this.Tab.getBodyData(this.varListe);

    await new Promise<void>((resolve, reject) => {
      try {
        const tmp: any[] = [];
        for (const bodyCell of bodyArr) {
          tmp.push({ cells: bodyCell });
        }

        const array: any[] = this.varListeRows();
        ko.utils.arrayPushAll(array, tmp);
        this.varListeRows.valueHasMutated();
        resolve();
      } catch (error) {
        this.AddLog("%c" + error, this.logTyp);
        reject(error);
      }
    });
  }

  /** erstellt Rezeptliste/Tabelle für aktuelle Anlage */
  protected async makeRezList(row: any) {
    // Rezept-Label Information löschen
    this.selectedRecipe.Nr("");
    this.selectedRecipe.Vers("");
    this.selectedRecipe.Descrp("");
    this.rezRows.removeAll();
    // diese Verzögerung nur f. Animation des "badge"-Anzeige notwendig
    await rezUtils.sleep(100);
    // Head
    let head: any = {
      cells: ["Nummer", "Version", "Beschreibung", "erstellt", "geändert"],
    };
    this.rezHead(head);
    // Zeilen
    for (const key in row) {
      if (row.hasOwnProperty(key)) {
        const splited = row[key].split("|");
        const bodyArr = this.Tab.getBodyData([
          {
            Nummer: splited[0],
            Version: splited[1],
            Beschreibung: splited[2],
            erstellt:
              "am " + splited[3] + " von " + rezUtils.stringUgly(splited[4]),
            geändert:
              "am " + splited[5] + " von " + rezUtils.stringUgly(splited[6]),
          },
        ]);
        for (const bodyCell of bodyArr) {
          this.rezRows.push({
            cells: bodyCell,
          });
        }
      }
    }
  }

  protected columnHideShow(id: string) {
    $(`#${id} .toggleDisplay`).toggle();
  }

  /** erstellt PA-Liste/Tabelle für aktuelle Anlage */
  protected async makePaList() {
    // this.selectedPaData.PaNr(null);
    // this.selectedPaData.RezNr(null);
    // this.selectedPaData.Name(null);
    this.paRows.removeAll();
    this.selectedFltrPa(null); // Filter zurücksetzen

    this.paListStateBusy(true);
    this.paListStateTimeout(false);
    const self: this = this;
    try {
      // IPaNrResult | IPaNrTestEnvResult
      const _t: IPaNrResult | IPaNrTestEnvResult = await rezService.PaNr(
        this.anlage()
      );
      const resp: IWcfResult = _t["PaNrResult"] || _t["PaNrTestEnvResult"];
      if (!resp.Succeed) throw resp.ErrorMsg;

      const headArr: any = {
        cells: this.Tab.getHeadData(resp.Data),
      };
      this.paHead(headArr);

      const bodyArr: any = this.Tab.getBodyData(resp.Data);
      this.paRows.push(
        ...bodyArr.map((bodyCell: any) => ({ cells: bodyCell }))
      );

      // PA.Liste aufklappen
      $(`#${this.idCollapsePaList()}`).collapse("show");

      // Konfiguration der Dummy-Aufträge auslesen
      let aDummys: string[] = [];
      this.configDataDlgCfg.Auftr_33333_Enabl && aDummys.push("33333");
      this.configDataDlgCfg.Auftr_77777_Enabl && aDummys.push("77777");
      this.configDataDlgCfg.Auftr_88888_Enabl && aDummys.push("88888");
      this.configDataDlgCfg.Auftr_99999_Enabl && aDummys.push("99999");
      // Dummy-Afträge in die PA-Tabelle laden
      if (aDummys.length !== 0) {
        aDummys.forEach((paNr) =>
          self.addDummy(
            paNr,
            paNr === (self.paNr() && self.paNr().toString())
              ? self.paAktiv() || self.paTyp()
              : 0
          )
        );
      }
      return;
    } catch (ex) {
      this.paListStateTimeout(true);

      Logger.errorToast(rezUtils.msgCut(ex.message, 100) + "...");
      this.AddLog(ex.message, LogType.Abbruch_durch_Programmfehler);
      throw ex;
    } finally {
      this.paListStateBusy(false);
    }
  }

  /** Überprüfen der relevanten Elemente und Setzen von Symbolen entsprechend ihrem Status */
  protected symbolStatusPa(): void {
    $(".clRezeptDlg [data-typ]").each(function (index, elem) {
      if (elem.getAttribute("data-typ") === "PaStatus") {
        // Vorherige Klassen gegebenenfalls entfernen.
        $(this).removeClass("paStart paPause paStop");
        const sig = Number(this.innerHTML);
        switch (sig) {
          case -1: // PA Aktiv als Bit ausgewertet wird (alte Art und Weise)
          case 1: // PA Aktiv als Byte ausgewertet wird (neue Art und Weise)
          case 9:
          case 253:
            $(this)
              .addClass("paStart")
              .attr("title", `OPUS-Status: PA-gestartet. Index [${sig}]`);
            break;
          case 2:
            $(this)
              .addClass("paPause")
              .attr("title", `OPUS-Status: PA-pausiert. Index [${sig}]`);
            break;
          case 3:
            $(this)
              .addClass("paStop")
              .attr("title", `OPUS-Status: PA-gestoppt. Index [${sig}]`);
            break;
          case 255:
            $(this)
              .addClass("paStart")
              .attr("title", `Dummyauftrag gestartet. Index [${sig}]`);
            break;
          default:
            $(this)
              .addClass("")
              .attr("title", `n. in Bearbeitung. Index [${sig}]`);
            break;
        }
      }
      if (elem.getAttribute("data-typ") === "ProdTyp") {
        // Vorherige Klassen gegebenenfalls entfernen.
        $(this).removeClass(
          "paTypPV paTypPB paTypPF paTypPU paTypPL paTypRR paTypOF paTypDU paTypNL paTypProduktion"
        );

        switch (this.innerHTML) {
          case "PV":
            $(this)
              .addClass("paTypPV")
              .attr("title", "Produktion Vorprodukt. Index [1]");
            break;
          case "PB":
            $(this)
              .addClass("paTypPB")
              .attr("title", "Produktion Basisartikel. Index [2]");
            break;
          case "PF":
            $(this)
              .addClass("paTypPF")
              .attr("title", "Produktion Fertigartikel. Index [3]");
            break;
          case "PU":
            $(this)
              .addClass("paTypPU")
              .attr("title", "Nachpackauftrag. Index [4]");
            break;
          case "PL":
            $(this)
              .addClass("paTypPL")
              .attr("title", "Produktion Linie. Index [5]");
            break;
          case "RR":
            $(this)
              .addClass("paTypRR")
              .attr("title", "Reinigungsauftrag. Index [9]");
            break;
          case "NL":
            $(this)
              .addClass("paTypNL")
              .attr("title", "Nachlauf-/Trocknungszeit Index [253]");
            break;
          case "DU":
            $(this)
              .addClass("paTypDU")
              .attr("title", "Dummyauftrag. Index [255]");
            break;
          default:
            // Prod.Typ-Symbol für Head Infobereich
            const sig = Number(this.innerHTML);
            const statusText = $(this).next(".pastatus.text");
            // Animation zurücksetzen
            statusText.css("animation", "none");
            switch (sig) {
              case -1:
              case 1:
              case 3:
                $(this)
                  .addClass("paTypProduktion")
                  .attr("title", `Produktionsauftrag. SPS-Statusbyte [${sig}]`);
                // Farbe - Lime Green
                statusText.text("gestartet").css("color", "limegreen");
                break;
              case 9:
                $(this)
                  .addClass("paTypRR")
                  .attr("title", `Reinigungsauftrag. SPS-Statusbyte [${sig}]`);
                // Farbe - Maya Blue
                statusText.text("Reinigung").css("color", "#74c0fc");
                break;
              case 125:
                $(this)
                  .addClass("paTypOF")
                  .attr("title", `Produktion Ofen. SPS-Statusbyte [${sig}]`);
                // Farbe - Tenne (Tawny)
                statusText
                  .text("Ofen-Autostart/Aufheizprogramm")
                  .css("color", "#d35500")
                  .css(
                    "animation",
                    "animation-fade 1.75s linear infinite alternate"
                  );
                break;
              case 253:
                $(this)
                  .addClass("paTypNL")
                  .attr(
                    "title",
                    `Nachlauf-/Trocknungszeit SPS-Statusbyte [${sig}]`
                  );
                // Farbe - Purple Heart
                statusText
                  .text("Nachlauf-/Trocknungszeit")
                  .css("color", "#672AC4")
                  .css("animation", "animation-fade 2.0s infinite");
                break;
              case 255:
                $(this)
                  .addClass("paTypDU")
                  .attr("title", `Produktion DUMMY. SPS-Statusbyte [${sig}]`);
                // Farbe - Tangerine Yellow
                statusText
                  .text("Dummy")
                  .css("color", "#ffcc00")
                  .css("animation", "animation-fade 2.0s infinite");
                break;
              default:
                $(this).attr(
                  "title",
                  `Prod.Typ gestoppt. SPS-Statusbyte [${sig}]`
                );
                // Farbe - Tomato
                statusText.text("gestoppt").css("color", "tomato");
                break;
            }
            break;
        }
      }
    });
  }

  /** (Html-Button-Action) gewähltes Rezept löschen */
  protected async btnDeleteRecipe(): Promise<void> {
    if (!this.rezInfo()) return;
    if (!(await this.userLog())) return;

    const dlg = new MsgBox("Rezept löschen?", this.rezInfo(), "Tomato", [
      { name: "delete", text: "Löschen", btnClassName: "btn btn-danger" },
      { name: "cancel", text: "Abbrechen", btnClassName: "btn btn-default" },
    ]);
    // Hier wird die `close`-Methode des `closeChild`-Objekts an das `dlg`-Objekt gebunden und `this.CloseModal` zugewiesen.
    this.CloseModal = this.closeChild.close.bind(dlg);

    dialog
      .show(dlg)
      .then(([response, dispose]) => {
        if (response !== "delete") {
          let info: string = "Rezept Löschen abgebrochen!";
          Logger.warn(this, info);
          this.AddLog(info, LogType.Abbruch_durch_Bediener);
        } else {
          this.updateDataTable(
            this.selectedRecipe.Nr().toString(),
            this.selectedRecipe.Vers().toString(),
            1
          ).then((success) => {
            this.AddLog("Rezept gelöscht!", LogType.OK);
            this.loadRezList(999);
          });
        }
        return dispose;
      })
      .then((dispose) => dispose());
  }

  /** Lebenszeichen von Webservices */
  protected watchdog(): void {
    this.ws1CallbackId = this.WsWatchdog.addWs1Callback((state: boolean) => {
      this.ws1State(state);
    });
    this.ws2CallbackId = this.WsWatchdog.addWs2Callback((state: boolean) => {
      this.ws2State(state);
    });
    this.ws3CallbackId = this.WsWatchdog.addWs3Callback((state: boolean) => {
      this.ws3State(state);
    });
    this.ws4CallbackId = this.WsWatchdog.addWs4Callback((state: boolean) => {
      this.ws4State(state);
    });
  }

  /** erzeugt Rezeptliste
   * @param ms Verzögerungszeit in ms
   */
  protected async loadRezList(ms = 0) {
    this.rezListStateBusy(true);
    this.rezListStateTimeout(false);

    // Filter löschen
    $(`#${this.idRezFltr()}`).val("");

    // Rezeptliste wird nach 'verz'-Zeit refresht
    await rezUtils.sleep(ms);
    try {
      let row = await this.callService();
      this.makeRezList(row);
    } catch (ex) {
      this.rezListStateTimeout(true);
    } finally {
      this.rezListStateBusy(false);
    }
  }

  /** Rezeptliste erfrischen */
  protected updateRez(): void {
    this.loadRezList();
  }

  /** Dummy-Eintrag in die PA-Tabelle setzten */
  protected addDummy(id: any, state?: any) {
    const _dt = moment().format("DD.MM.YYYY HH:mm:ss");
    let tmpArr: any[];
    // handelt es sich um Reinigungsauftrag?
    if (id === "33333") {
      tmpArr = [
        state || 0, // Akt
        id, // CCW PaNr
        "000000000", // Rezept
        "RR", // Produktionstyp
        0, // OPUS PaNr
        0, // Netz
        moment().startOf("year").format("DD.MM.YYYY HH:mm:ss"), // Start
        moment().endOf("year").format("DD.MM.YYYY HH:mm:ss"), // Ende
        1, // Planleistung
        0, // ALTERNAT
        0, // VARIANTE
        0, // SOLLMNGF
        0, // SOLLMNGB
        0, // CREATE_USR
        _dt, // CREATE_TS
        _dt, // MODIFY_TS
        0, // ISTMNGF
        0, // ISTMNGB
        0, // MNG_BINV
        -1, // BANDFAKTOR
        this.anlage().toString(), // ANLAGENNR
        0, // ASK_REWORK
        -1, // ACTIVITYNUMBER
        -1, // RESPONSENUMBER
        1, // FAKTOR
        //  ...new Array(15).fill(" "), // alle restl. Zellen bis 'ACTIVITYNUMBER' mit Leerzeichen füllen um das Tabellenkonstrukt zu erhalten
      ];
    } else
      tmpArr = [
        state || 0, // Akt
        id, // CCW PaNr
        "000000000", // Rezept
        "DU", // Produktionstyp
        0, // OPUS PaNr
        0, // Netz
        _dt, // Start
        moment().add(1, "days").format("DD.MM.YYYY HH:mm:ss"), // Ende
        1, // Planleistung
        0, // ALTERNAT
        0, // VARIANTE
        0, // SOLLMNGF
        0, // SOLLMNGB
        0, // CREATE_USR
        _dt, // CREATE_TS
        _dt, // MODIFY_TS
        0, // ISTMNGF
        0, // ISTMNGB
        0, // MNG_BINV
        -1, // BANDFAKTOR
        this.anlage().toString(), // ANLAGENNR
        0, // ASK_REWORK
        -1, // ACTIVITYNUMBER
        -1, // RESPONSENUMBER
        1, // FAKTOR
        //  ...new Array(15).fill(" "), // alle restl. Zellen bis 'ACTIVITYNUMBER' mit Leerzeichen füllen um das Tabellenkonstrukt zu erhalten
      ];
    this.paRows.push({
      cells: tmpArr,
    });
  }

  /** (Html-Table-Action) selektiert eine Zeile in der PA-Tabelle */
  protected paSelect(pa: string, rez: string): void {
    // selektierte Zeilen deselektieren
    this.rowRemoveSelect(`#${this.idPaTable()}`);

    // selektierte Zeile hervorheben
    $(`#${pa}_${this.uid()}`).toggleClass("selected");

    this.selectedPaData.PaNr(pa);
    this.selectedPaData.RezNr(rez);

    // Planleistung Informationen aus der selektierten Zeile herausholen
    for (const zeile of this.paRows()) {
      if (zeile.cells[1] === pa) {
        this.selectedPaData.Status(zeile.cells[0]);
        this.selectedPaData.PaNr(zeile.cells[1]);
        this.selectedPaData.RezNr(zeile.cells[2]);
        this.selectedPaData.ProdTyp(zeile.cells[3]);
        this.selectedPaData.NetzNr(zeile.cells[5]);
        this.selectedPaData.Start(zeile.cells[6]);
        this.selectedPaData.Stop(zeile.cells[7]);
        this.selectedPaData.Planleistung(zeile.cells[8]);
        this.selectedPaData.ActivNr(zeile.cells[22]);
        this.selectedPaData.RespnNr(zeile.cells[23]);
        break;
      }
    }

    if (this.kennung() === FnktKennung.paOnly) return; // keine Rez. Interaktion, nur PA-Liste

    // es handelt sich um Dummy/Reinig. -Aufträg, filter löschen
    if (["RR", "DU"].includes(this.selectedPaData.ProdTyp())) {
      $(`#${this.idRezFltr()}`).val("");
      this.changeFilter(this.idRezFltr());
      // Rez.Liste aufklappen
      $(`#${this.idCollapseRezList()}`).collapse("show");
      return;
    }

    $(`#${this.idRezFltr()}`).val(rez);
    this.changeFilter(this.idRezFltr());

    // die Anzahl der gleichen Rezeptnummern aus einer Rezeptliste herauszufinden
    let find = this.rezRows()
      .filter((cells) => cells.cells[0] == rez)
      .map((cells) => cells.cells[0] + "_" + cells.cells[1]);

    if (find.length === 1) {
      this.rezSelect(find[find.length - 1]);
    } else {
      // falls mehrere Einträge gefunden, dann Rez.Liste aufklappen
      $(`#${this.idCollapseRezList()}`).collapse("show");
      this.rezSelect(rez);
    }
  }

  /** selektiert eine Zeile in der Rezept-Tabelle */
  protected rezSelect(rez: string | number | string[]): void {
    this.rowRemoveSelect(`#${this.idRezTable()}`);
    $(`#${this.idRezTable()} tr#${rez}`).toggleClass("selected focus");
    this.selectedRecipe.Nr($("#" + rez + " td:eq(0)").text());
    this.selectedRecipe.Vers($("#" + rez + " td:eq(1)").text());
    this.selectedRecipe.Descrp($("#" + rez + " td:eq(2)").text());
  }

  /** Änderung des Filters in der Rez.Listentabelle */
  protected changeFilter(elem: string) {
    let tab: string;
    switch (elem) {
      case this.idPaFltr():
        tab = "#" + this.idPaTable();
        break;
      case this.idRezFltr():
        tab = "#" + this.idRezTable();
        break;
      default:
        tab = "#signalTable";
        break;
    }
    const value = $("#" + elem)
      .val()
      .toLowerCase();
    $(tab + " tr").each(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  }

  /** Dummy-Einträge aktiv-/inaktiv schalten */
  protected subDummy(): void {
    const newArr = this.paRows().map((ipaRow) => ipaRow.cells[1]); // zweite Spalte (PaNr)

    for (const iId of ["33333", "77777", "88888", "99999"]) {
      const index: number = newArr.indexOf(iId);
      $("#btn" + iId).prop("disabled", index > -1);
    }
  }

  /** sucht Class 'selected' und löscht die */
  protected rowRemoveSelect(elem: string): void {
    // sucht alle Elemente in den Tabellen nach Klasse 'selected' und löscht die
    const element = elem || "tbody";
    $(element).children().removeClass("selected");
  }

  /** fügt den Log zu dem Log-Panel auf der HTML-Testseite */
  public addToLogPanel = (e: StorageEvent) => {
    const $logElem = $("#txtLog5be15bd6705");
    if ($logElem.length) $logElem.prepend(e.newValue + "&#13;");
  };

  private loadFromLStorage = () => {
    // die Einträge in Array fassen um zu sortieren
    let arr = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.includes("rez_")) {
        arr.push(key);
      }
    }

    arr.sort(); // Array sortieren
    let url = window.location.href;
    for (let key of arr) {
      let nv = new StorageEvent("newValue", {
        newValue: localStorage.getItem(key),
        url,
      });
      this.addToLogPanel(nv);
    }
  };

  /** Logs Schreiben wärend Loader angezeigt wird.
   *  Die Logs werden im Hintergrund auch zu Localstorage hizugefügt */
  private writeLoaderLog(log: any) {
    const date = new Date();
    const logVal = `[${date.toLocaleString()}.${date
      .getMilliseconds()
      .toString()
      .padStart(3, "0")}] - ${log}`;

    // fügt die Log's zu LocalStorage
    const key = `rez_${date.getTime()}`;
    this.localStorLogWriter.addToLogQueue(key, logVal);
  }

  // Z-Ind. für Loader-Overlay löschen
  private clearZIndexOnLoader() {
    // return $(".clCssloadWrapper").css("z-index", "auto");
  }
  private setZIndexOnLoader() {
    // Z-Ind. für Loader-Overlay berechen
    // return $(".clCssloadWrapper").css("z-index", CcwContextmenu.zMax() + 1);
  }

  /** schreibt Log in die Datenbank
   * @param msg Log-Message
   * @param logType Meldungstyp
   */
  protected AddLog(msg: string, logType: LogType): void {
    this.debugFlag && this.writeLoaderLog(msg);

    // falls debugging an, dann hier ende
    // if (this.debugFlag && logType === this.logTyp) return;
    Log.Add({
      AnlagenNr: this.anlage(),
      Anlagenname: this.databaseName,
      Zeitstempel: null, // wird in 'RezLog' gesetzt
      MeldungsTyp: logType,
      Bediener: `v: ${this.kompVersion}; ${this.userInfo()};}`.replace(/[\n]/gm, "; ").slice(0, 1000), // max. 1000 Zeichen
      Meldung: msg.replace(/<[^>]*>/gm, " ").slice(0, 1000), // max. 1000 Zeichen
      PaNr: parseInt(this.selectedPaData.PaNr()) || 0,
      ArtikelNr: parseInt(this.selectedRecipe.Nr()) || 0,
      Altern: this.shortUid, // eindeutige Komp.-ID 3-stellig
      Variante: parseInt(this.selectedRecipe.Vers()) || 0
    });
  }

  /** (Html-RadioBox-Action) vordefinierte Filter setzen */
  protected selectedFltrPa(radioBox: JQuery) {
    // Auswahl rücksetzen
    if (!radioBox) {
      this.resetFltrPa();
      return;
    }

    // Text in Filter-Input setzen
    $(`#${this.idPaFltr()}`).val(radioBox.value);

    // da das checked-Event nicht gebunden werden konnte,
    // wird checked-Propery implizit eigneschaltet
    setTimeout(() => {
      $(radioBox).prop("checked", true);
    }, 10);

    // die PA-Tabelle filtern
    this.changeFilter(this.idPaFltr());
  }

  // Filter-Checkbox auf ersten Item setzen
  protected resetFltrPa() {
    // Text in Filter-Input auf leer setzen
    $(`#${this.idPaFltr()}`).val("");
    // Auswahl von Checkbox 'Alle' setzen
    $('input[name="produktion"]#pTypAlle').prop("checked", true);
    return true;
  }

  /**
   * Lädt die SPS--Konfigurationen für eine gegebene Anlagen-Nummer.
   *
   * @param {number} anlagenNr - Die Nummer der Anlage, für die die Konfigurationen geladen werden sollen.
   * @returns {Promise<any>} Ein Promise, das ein Tupel mit der SPS-Konfiguration zurückgibt.
   */
  protected async loadSpsKonfig(anlagenNr: number): Promise<any | undefined> {
    const { konfig, messages } = await getCachedSpsKonfig(anlagenNr);

    if (messages.length > 0) {
      messages.forEach(msg => this.AddLog(msg, LogType.Abbruch_durch_Programmfehler));
    }
    return konfig;
  }

  /**
 * Lädt die Dlg.-Konfigurationen für eine gegebene Anlagen-Nummer.
 *
 * @param {number} anlagenNr - Die Nummer der Anlage, für die die Konfigurationen geladen werden sollen.
 * @returns {Promise<any>} Ein Promise, das ein Tupel mit der Dlg.-Konfiguration zurückgibt.
 */
  protected async loadDlgKonfig(anlagenNr: number): Promise<any> {
    const { konfig, messages } = await getCachedDlgKonfig(anlagenNr);

    if (messages.length > 0) {
      messages.forEach(msg => this.AddLog(msg, LogType.Abbruch_durch_Programmfehler));
    }
    return konfig;
  }

  /** Cleanup */
  protected async dispose(): Promise<void> {
    await super.dispose();

    this.WsWatchdog.removeWs1Callback(this.ws1CallbackId);
    this.WsWatchdog.removeWs2Callback(this.ws2CallbackId);
    this.WsWatchdog.removeWs3Callback(this.ws3CallbackId);
    this.WsWatchdog.removeWs4Callback(this.ws4CallbackId);

    this.isAlive = false;
    this.localStorLogWriter.stopProcessing();
    clearTimeout(this.nIntervId);

    // clearAllSignalTimeouts
    Object.keys(this.signalTimeouts).forEach((signalName) => {
      clearTimeout(this.signalTimeouts[signalName]);
      delete this.signalTimeouts[signalName];
    });

    // Entsorgung von Computed Observables
    const observablesToDispose = [
      this.rezInfo,
      this.ws1StateUI,
      this.ws2StateUI,
      this.ws3StateUI,
      this.ws4StateUI,
      this.paListStateConnect,
      this.rezListStateConnect,
      this.userInfo,
      this.commonPermission,
      // this.btnLogTitle,
      this.btnStartTitle,
      this.btnStopTitle,
      this.btnSaveRecipeTitle,
      this.btnDeleteTitle
    ];
    observablesToDispose.forEach((observable) => observable.dispose());

    this.subscriptions.forEach((sub) => sub.dispose());

    const registeredNames: string[] = [];
    const extractNames = (obj: any, recursiveCall: boolean = false) => {
      for (const key in obj) {
        const prop = obj[key];

        // Rekursiver Aufruf, falls prop selbst ein Objekt ist (aber kein Observable)
        if (prop && typeof prop.name === 'object' && !ko.isObservable(prop)) {
          extractNames(prop.name, true);
        }

        // Prüfen, ob prop ein Objekt mit name und value ist
        if (prop && typeof prop === 'object' &&
          (ko.isObservable(prop.value) || recursiveCall) && // bei rekursivem Aufruf nicht beachten
          typeof prop.name === 'string' &&
          prop.name.trim() !== ''
        ) {
          registeredNames.push(prop.name);
        }
      }
    };

    extractNames(this.rezDlgProperties);
    this.connector.unregisterSignals(...registeredNames)
      .then((a) => console.log("unregisterSignals", a))
      .catch((e) => console.error("Err.unregisterSignals", e));

    this.debugFlag &&
      window.removeEventListener("storage", this.addToLogPanel, false);

    this.AddLog(`Cleanup Dlg. "${this.kennung()}", UID: ${this.uid().slice(0, 6)}..`, LogType.Logout);
  }
}
export = RezDlg;
