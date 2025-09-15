/*
 ********************************************************
 * ViewModel für das modale Fenster Dlg.Rez.Vergleichen *
 ********************************************************
 */
import "contextMenu";
import "uiPosition";
import dialog = require("plugins/dialog");
import MsgBox = require("../viewModels/cowi/dialoge/cwRezDlg");
import RezBase = require("./component-rezept-base.model");
import { IConnector } from "../services/_connector";
import CcwContextmenu = require("../viewModels/cowi/services/ccw-contextmenu");

declare const $: IContextMenu;
declare const uuid: { v4: () => any };

/**
 * @interface IContextMenu
 * @description Erweitert JQueryStatic um contextMenu
 */
interface IContextMenu extends JQueryStatic {
  contextMenu: any;
}

/**
 * @interface IVergleich
 * @description Definiert die Struktur für Vergleichsobjekte
 */
interface IVergleich {
  parentId: string;
  kindId: string;
  signal: string;
  value: string;
}

/**
 * @interface IRezeptWerteVergleichen
 * @description Erweitert IRezDlgValueParams um toreload
 */
interface IRezeptWerteVergleichen extends IRezDlgValueParams {
  /** Trigger um die Vergleichsanzeige zu reloaden */
  toreload: string;
}

/**
 * @class RezeptWerteVergleichen
 * @description ViewModel für das Vergleichen von Rezeptwerten
 * @extends RezBase
 */
class RezeptWerteVergleichen<
  T extends IRezeptWerteVergleichen
> extends RezBase<T> {
  /** Vergleichsrelevante Elemente */
  protected _compareElements: IVergleich[];
  /** Status Vergleicher */
  protected isCompare: KnockoutObservable<boolean> = ko.observable(false);
  /** Status Editierbar */
  protected editable: KnockoutObservable<boolean> = ko.observable(false);
  /** Countdown Anzeigewert vorformatiert "{mm:ss}" */
  protected seessionTime: KnockoutObservable<string> = ko.observable("");
  /** Trigger um die Vergleichsanzeige zu reloaden */
  protected toreload: string;
  /** letzter Wert für 'toreload' anzustossen */
  protected lastTab: string = "";
  /** letzte gewählte Rez.Nr. um 'toreload' anzustossen */
  protected lastSelectedRez: string = "";
  /** disposed die computed-Funktion */
  protected disposeComputed = ko.observable(false);

  /**
   * @constructor
   * @param {T} params - Parameter für den Konstruktor
   */
  constructor(params: T) {
    super(params);

    const self: this = this;
    self._compareElements = [];

    self.toreload = (
      ko.unwrap(self.settings.toreload) || ""
    ).stringPlaceholderResolver(self.objectID);
  }

  /**
   * @method compositionComplete
   * @description Initialisiert die Sidebar und überwacht Änderungen
   */
  protected async compositionComplete() {
    await super.compositionComplete();

    this.initSidebar();

    // überwacht die Änderung der toreload-Variable und ggf.löst das Reload aus
    ko.computed(() => {
      if (this.toreload) {
        const params = this.fn.vmContext[this.toreload];

        if (this.lastTab != params()) {
          this.lastTab = params();
          this.reload(this);
        }
      }
    });

    // um die mehrfache Triggerung zu unterbinden, weil die
    // computed-Änderungsüberwachung sich über 2 Variablen erstreckt,
    // wird ein Zeitfilter über 160 ms. eingesetzt.
    const reloadDebounce = _.debounce(() => this.reload(this), 160);
    // überwacht die Änderung des Rez. und Vers. Nr. und ggf. löst das Reload aus
    ko.computed(() => {
      const newSelectedNr =
        this.selectedRecipe.Nr() + this.selectedRecipe.Vers();

      if (this.lastSelectedRez != newSelectedNr) {
        this.lastSelectedRez = newSelectedNr;
        reloadDebounce();
      }
    });

    document.addEventListener("mousemove", this.logKey(this));
  }

  /**
   * @method logKey
   * @description Startet die Sitzung neu bei Mausbewegung
   * @param {this} self - Kontext der Klasse
   */
  private logKey = (self: this) =>
    _.throttle((e: MouseEvent) => self.sessionCount.restart(), 3000);

  /**
   * @method initSidebar
   * @description Initialisiert die Sidebar
   */
  private initSidebar = () => {
    // zIndex setzen
    $("#sidebar").css("zIndex", CcwContextmenu.zMax() + 1);

    $("#dismiss, .overlay, #sidebar ul li a").on("click", () => {
      $("#sidebar").removeClass("active");
      $(".overlay").fadeOut();
    });

    $("#sidebarCollapse").on("click", () => {
      $("#sidebar").addClass("active");
      $(".overlay").fadeIn();
      $(".collapse.in").toggleClass("in");
      $("a[aria-expanded=true]").attr("aria-expanded", "false");
    });
  };

  /**
   * @method sidebarOn
   * @description Fährt die Sidebar aus
   */
  private sidebarOn = () => {
    $("#sidebarCollapse").trigger("click");
  };

  /**
   * @method sidebarOff
   * @description Fährt die Sidebar ein
   */
  private sidebarOff = () => {
    $("#dismiss, .overlay, #sidebar ul li a").trigger("click");
  };

  /**
   * @method loadVarListe
   * @description Lädt relevante Variablen für das Rezept (Überschreibt die Methode der Basisklasse)
   */
  protected async loadVarListe() {}

  /**
   * @method makePaList
   * @description Erstellt eine Liste von PA-Elementen (Überschreibt die Methode der Basisklasse)
   */
  protected async makePaList() {}

  /**
   * @method compareStatus
   * @description Gibt den Status des Vergleichers zurück
   * @returns {Object} Ein Objekt mit Symbol, Farbe und Text basierend auf dem Vergleichsstatus
   */
  protected compareStatus = ko.pureComputed(() => {
    const self = this;
    return {
      symbol: self.isCompare() ? "fa fa-stop" : "fa fa-play",
      color: self.isCompare() ? "tomato" : "dodgerblue",
      text: self.isCompare()
        ? `<i class="fa fa-stop" style="margin-right: 0.5em; font-size: larger;"></i>Vergleich stoppen ${self.seessionTime()}`
        : '<i class="fa fa-play" style="margin-right: 0.5em; font-size: larger;"></i>Vergleich starten',
    };
  });

  /**
   * @method initCtxtmenu
   * @description Initialisiert das Kontextmenü
   * @param {string} rezNr - Rezeptnummer
   * @param {string} rezVer - Rezeptversion
   * @param {IConnector} conn - Verbindungsobjekt
   * @returns {Promise<boolean>} Gibt 'true' zurück, wenn die Ausführung erfolgreich war
   */
  protected async initCtxtmenu(
    rezNr: string,
    rezVer: string,
    conn: IConnector
  ): Promise<boolean> {
    const self: this = this;
    let q: IVergleich[] = [];
    // Liste von eingetragenen in contextmenu Selectoren
    try {
      // 1. Elemente im DOM suchen und Signalparameter
      Object.keys($.contextMenu.menus).forEach((menuName) => {
        $($.contextMenu.menus[menuName].selector).each((i, item) => {
          let parentId: string, kindId: string;
          if ($(item).length > 0) {
            if (
              $(item).attr("id") && // da die 'ID' n. immer vorhanden
              $(item).attr("id").length > 0 // nur Elemente mit ID zulassen
            ) {
              parentId = item.id;
              kindId = "positionable_" + item.id;
            } else {
              let _id = uuid.v4();
              // sonst ID zuweisen
              $(item).attr("id", _id);

              parentId = _id;
              kindId = "positionable_" + _id;
            }
            q.push({
              parentId,
              kindId,
              signal: CcwContextmenu.getAliasName($(item))[0],
              value: null,
            });
          }
        });
      });

      // 2. Werte holen
      let data = await CcwContextmenu.GetSignRecipeValues(
        CcwContextmenu.GetIdent(),
        q.map((item) => item.signal),
        rezNr,
        parseInt(rezVer, 10)
      );

      // 3. Werte zuweisen
      q.map((val) => {
        data.map((v) => {
          if (v.aliasName == val.signal) val.value = v.recipeValue;
        });
      });

      // 4. Liste nur auf Value-vorhandene Items reduzieren
      self._compareElements = q.filter((val) => val.value);

      const editable: boolean = self.editable();
      // 5. Visuelle Elemente einfügen
      self._compareElements.forEach((item) => {
        let spsValue = conn.getSignal(item.signal).value();
        let title = `DB-Wert: ${item.value}; SPS-Wert: ${spsValue}`;
        let discr = item.value != spsValue ? "diff" : "equal";
        let alias = JSON.stringify({ alias: item.signal });
        editable
          ? $(
              `<input type="number" class="positionable ${discr}" title="${title}" id="${item.kindId}" value="${item.value}" data-signalinfo=${alias} data-bind="event:{change:function(data,event){valChanged(data, event)}}">`
            ).insertAfter("#" + item.parentId)
          : $(
              `<div class="positionable ${discr}" title="${title}" id="${item.kindId}"><p>${item.value}</p></div>`
            ).insertAfter("#" + item.parentId);

        // 6. Positionieren
        // @ts-ignore
        $("#" + item.kindId).position({
          of: $("#" + item.parentId),
          my: "left top",
          at: "left top",
          offset: "0 0",
          collision: "flip flip",
        });

        // 7. zIndex zuweisen
        $("#" + item.kindId).css(
          "zIndex",
          CcwContextmenu.zIndex($("#" + item.kindId)) + 1
        );
        editable && ko.applyBindings(self, $("#" + item.kindId)[0]);
      });
      return true;
    } catch (ex) {
      alert(ex);
      return Promise.reject(ex);
    }
  }

  /**
   * @method removeCompareElements
   * @description Löscht vorhandene Rezeptvergleichselemente
   */
  protected removeCompareElements() {
    this._compareElements.forEach((value) => $("#" + value.kindId).remove());
  }

  /**
   * @method reload
   * @description Initialisiert das Kontextmenü ohne den Timer zu beeinflussen
   * @param {this} context - Kontext der Klasse
   */
  protected async reload(context: this) {
    const self: this = context;
    if (!self.isCompare()) return;
    self.isLoading(true); // Lade-Spinner on

    self.removeCompareElements();
    await self.initCtxtmenu(
      self.selectedRecipe.Nr(),
      self.selectedRecipe.Vers(),
      self.connector
    );

    self.isLoading(false); // Lade-Spinner off
  }

  /**
   * @method cmpBtn
   * @description Funktion für den Vergleichsbutton
   */
  protected async cmpBtn() {
    const self: this = this;
    // 1. Prüfen ob etwas aus der Liste gewählt wurde
    if (!!!self.selectedRecipe.Nr()) {
      dialog.show(new MsgBox("Info", "kein Rezept ausgewählt", "Orange"));
      return;
    }

    // 2. Prüfen ob Editierfnk. an ist
    // und ggf. Login durchführen
    if (self.editable()) {
      if (!(await self.userLog())) return;
    }

    // Lade-Spinner on
    self.isLoading(true);

    // Toggle Status
    self.isCompare(!self.isCompare());

    self.compare().then(
      () => self.isLoading(false) // Lade-Spinner off;
    );
  }

  /**
   * @method compare
   * @description Startet/Stoppt den Vergleicher
   * @returns {Promise<boolean>} Gibt 'true' zurück, wenn die Ausführung erfolgreich war
   */
  private async compare(): Promise<boolean> {
    const self: this = this;

    if (!self.isCompare()) {
      self.sessionCount.stop();
      self.removeCompareElements();
      return true;
    }

    if (
      await self.initCtxtmenu(
        self.selectedRecipe.Nr(),
        self.selectedRecipe.Vers(),
        self.connector
      )
    ) {
      self.sessionCount.start(self.sessionTimeCtrl.bind(self));
      self.sidebarOff();
    } else {
      self.sessionCount.stop();
      self.removeCompareElements();
      self.isCompare(false);
    }
    return true;
  }

  /**
   * @property tostr
   * @description Steuert den Toaster
   */
  protected tostr = {
    toastrCnfg: null,
    on: () => {
      if (!this.tostr.toastrCnfg) {
        this.tostr.toastrCnfg = toastr.options;

        toastr.options = {
          positionClass: "toast-top-center",
          timeOut: 0,
          extendedTimeOut: 0,
          progressBar: false,
          closeButton: true,
          onCloseClick: () => {
            // Vergleicher beenden, wenn auf Toast-Leiste gelickt wird.
            this.isCompare(false);
            this.compare();
            this.sidebarOff();
          },
          onclick: () => this.sidebarOn(), // Vergleicher Dlg ausfahren, wenn auf Toast-Leiste gelickt wird.
          tapToDismiss: false,
          showDuration: 0,
          hideDuration: 0,
        };
      }
      toastr.remove();
      let version = this.rezVer() ? ` V${this.rezVer()}` : "";
      toastr.warning(
        `<pre>Vergleichsrezept : ${this.rezInfo()}<br />SPS (gegenwärtig): ${this.rezNr()}${version} - ${this.rezName()}</pre>`,
        `Rezeptwertvergleicher an! <div class="pull-right">${this.seessionTime()}</div>`
      );
      return true;
    },

    off: () => {
      // zwischengespeicherte Toastr-Config zurückspielen
      if (!!this.tostr.toastrCnfg) {
        toastr.options = this.tostr.toastrCnfg;
        this.tostr.toastrCnfg = null;
      }
      toastr.remove();
      toastr.success("Rezeptewertvergleicher beendet!", "Vergeleicher");

      return true;
    },
  };

  /**
   * @method sessionTimeCtrl
   * @description Steuert die Restlaufzeit für den Toaster
   * @param {string} value - Restlaufzeit in {"mm:ss"}
   * @param {boolean} isOn - Timerstatus
   */
  protected sessionTimeCtrl(value: string, isOn: boolean) {
    this.seessionTime(value);

    if (isOn) {
      this.tostr.on();
      return;
    }
    this.tostr.off();
    // falls Zeit abgelaufen
    if (!!this.isCompare()) {
      this.isCompare(false);
      this.compare();
    }
  }

  /**
   * @property sessionCount
   * @description Steuert die Restlaufzeit des Timers
   */
  protected sessionCount = {
    _tId: null, // zugewiesene Timer - ID
    _cb: null, // callback - Fnkt.
    _duration: null, // berechnete Restlaufzeit
    _min: 3, // init. Zeit 00:03:00
    _sec: 0,

    /**
     * @method start
     * @description Startet den Timer für die Restlaufzeit
     * @param {Function} cb - Callback-Funktion, die nach Ablauf der Zeit ausgeführt wird
     */
    start: (cb: Function) => {
      const self = this.sessionCount;

      self.stop();
      self._cb = cb;

      self._duration = moment.duration({
        seconds: self._sec,
        minutes: self._min,
      });
      let isOnFlag = true;
      self._tId = setInterval(() => {
        self._duration = moment.duration(
          self._duration.asSeconds() - 1,
          "seconds"
        );

        if (self._duration.asMilliseconds() <= 0) {
          isOnFlag = false;
          self.stop();
        }
        // Callback-Fnkt. aufrufen
        cb(moment(self._duration.asMilliseconds()).format("mm:ss"), isOnFlag);
      }, 1000);
    },
    /**
     * @method restart
     * @description Startet den Timer für die Restlaufzeit neu
     */
    restart: () => {
      const self = this.sessionCount;
      if (self._cb) {
        self._duration = moment.duration({
          seconds: self._sec,
          minutes: self._min,
        });
      }
    },
    /**
     * @method stop
     * @description Stoppt den Timer für die Restlaufzeit
     */
    stop: () => {
      const self = this.sessionCount;

      clearInterval(self._tId);
      self._tId = null;
      if (!!self._cb) {
        self._cb("", false);
        self._cb = null;
      }
    },
  };

  /**
   * @method dispose
   * @description Bereinigt die Instanz
   * @returns {Promise<any>} Eine Promise, die signalisiert, dass die Bereinigung abgeschlossen ist
   */
  protected async dispose(): Promise<any> {
    await super.dispose();

    !!this.isCompare() && this.sessionTimeCtrl("", false);

    this.logKey(this).cancel();
    document.removeEventListener("mousemove", this.logKey(this));

    if (this.toreload) this.disposeComputed(true);
  }
}
export = RezeptWerteVergleichen;
