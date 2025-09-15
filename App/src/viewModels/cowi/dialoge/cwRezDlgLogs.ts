//  *********************************************
//  * Model für das modale Fenster RFID History *
//  *********************************************

import dialog = require("plugins/dialog");
import rezUtils from "../services/rezUtils";
import Log = require("../../../viewModels/cowi/services/rezLog");
import Tab = require("../../../viewModels/cowi/services/tabBuilder");
import DateTimeUtil = require("../../../viewModels/cowi/services/dtHandle");

declare let uuid: any;

class cwRezDlgLogs {
  // UID für die eindeutige Identifizierung des Moduls
  protected uid: KnockoutObservable<string> = ko.observable(uuid.v4());

  protected idDtPickerLogStart: KnockoutObservable<string> = ko.observable(
    "idDtPickerLogStart_" + this.uid()
  );
  protected idDtPickerLogStop: KnockoutObservable<string> = ko.observable(
    "idDtPickerLogStop_" + this.uid()
  );
  protected idLogTable: KnockoutObservable<string> = ko.observable(
    "idLogTable_" + this.uid()
  );
  /** Status Log Lesen/Schreiben */
  protected logBusy: KnockoutObservable<boolean> = ko.observable(false);
  /** Head-Zeile Tabelle-Logs */
  protected logListeHead = ko.observableArray([]);

  /** Body-Zeilen Tabelle-Logs */
  protected logListeRows = ko.observableArray([]);

  protected Tab = new Tab();
  protected DateTimeUtil: DateTimeUtil;
  protected AnlagenNr: number;

  constructor(anlagen_nr) {
    this.AnlagenNr = anlagen_nr;
  }

  public async compositionComplete() {
    this.initDT()
    this.GetLog()
  }

  /** Lädt die Rez.Logbuch */
  protected async GetLog(): Promise<void> {
    this.logBusy(true);

    if (this.logListeRows().length) {
      this.logListeRows.removeAll();
    }

    let list = await Log.Get(
      this.AnlagenNr,
      this.DateTimeUtil.startZeit,
      this.DateTimeUtil.stoppZeit
    );

    // Log-Einträge zählen -> anzeigen
    $("#LogRange").text(Object.keys(list).length + " Einträge ");

    // Abfrage ob Rückgabeobj. leer ist
    if (!Object.keys(list).length) {
      this.logBusy(false);
      $(".fallout").css("visibility", "visible");
      return;
    } else $(".fallout").css("visibility", "hidden");

    // Head
    let head: any = { cells: this.Tab.getHeadData(list) };
    this.logListeHead(head);

    // Rows
    let rows = this.Tab.getBodyData(list);

    for (const bodyCell of rows) {
      // Bediener Information unleserlich machen
      bodyCell[8] = rezUtils.stringUgly(bodyCell[8]);
      this.logListeRows.push({ cells: bodyCell });

      // künstlich bremsen damit UI nicht einfriert bei großen Datenmengen
      await rezUtils.sleep(1);
    }
    // Tabelle einfärben
    $(`#${this.idLogTable()} tbody tr`).each(function () {
      const td2 = $(this).find('td').eq(2); // Zugriff auf die 2. Spalte 'Meldung'
      const td7 = $(this).find('td').eq(7); // Zugriff auf die 7. Spalte 'MeldungsTyp'
      // Button-Events Hintergrund einfärben
      if (td2.text().trim().startsWith('***')) {
        $(this)
          .css('font-weight', 600) // Text fett darstellen
          .css('color', 'dodgerblue'); // ganze Zeile einfärben
      }
      const mldTyp = td7.text().trim().toLowerCase();
      switch (true) {
        case mldTyp.startsWith('abbruch'): // Abbruch Rot einfärben
          $(this).css('color', 'tomato');
          break;
        case mldTyp.startsWith('login'): // Login Grün einfärben
          $(this).css('color', 'green');
          break;
        case mldTyp.startsWith('logout'): // Logout Oliv einfärben
          $(this).css('color', 'olive');
          break;
        default:
          break;
      }
    });

    this.logBusy(false);
  }

  /** DateAndTime Elemente initialisieren */
  protected initDT(): void {
    this.DateTimeUtil = new DateTimeUtil(
      this.idDtPickerLogStart(),
      this.idDtPickerLogStop()
    );
  }

  public async activate() { }
  public async detached() { }
  protected async close() {
    // Unregister Signals
    this.detached();

    dialog.close(this, Promise.resolve());
  }
}
export = cwRezDlgLogs;
