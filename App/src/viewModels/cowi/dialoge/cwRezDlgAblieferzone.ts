import dialog = require("plugins/dialog");
import Logger = require("../../../services/logger");
import Tab = require("../services/tabBuilder");
import { rezService } from "../services/rezService";
import DateTimeUtil = require("../../../viewModels/cowi/services/dtHandle");

class CwRezDlgAblieferzone {
  /** Netzpfad zu WcfRezept */
  protected AnlagenNr: string;
  protected PaData: any = {};

  /** Head-Zeile für PA-Auftragstabelle */
  protected ablieferHead: KnockoutObservableArray<any>;
  /** Body-Zeilen für PA-Auftragstabelle */
  protected ablieferRows: KnockoutObservableArray<any>;

  protected Tab: Tab;
  protected DateTimeUtil: DateTimeUtil;
  protected ablieferNr: number;

  /** Dialog mit der Eingabe von:
   * - Ablieferzone
   * - Produktion Start/Stopp -Zeiten
   * - Produktionsmenge
   * - Rezeptbeschreibung
   */
  constructor(AnlagenNr: string, PaData: any) {
    this.AnlagenNr = AnlagenNr;
    this.PaData.paNr = this.checkParams(PaData.PaNr); // .PaNr
    this.PaData.paPlan = this.checkParams(PaData.Planleistung);
    this.PaData.rezInfo = !isNullOrUndefined(PaData.Rezeptbeschreibung)
      ? `Grundrezept: ${this.checkParams(PaData.Rezeptbeschreibung)}`
      : null;
    this.PaData.startDt = PaData.Start;
    this.PaData.stopDt = PaData.Stop;
    this.ablieferNr = 0;

    this.init();
  }

  protected init(): any {
    this.ablieferHead = ko.observableArray([]);
    this.ablieferRows = ko.observableArray([]);

    this.Tab = new Tab();
  }

  private checkParams = (val: any): any => (!isNullOrUndefined(val) ? val : 0);

  protected compositionComplete(): void {
    this.getDeliver().then((count) => {
      if (!count || count === 1) {
        this.zoneSelect(null, true);
      }
    });
    this.DateTimeUtil = new DateTimeUtil(
      "dtPickerStart",
      "dtPickerStop",
      this.PaData.startDt,
      this.PaData.stopDt
    );
    this.initPaLeistung();
  }

  protected checkZone(): void {
    const ablZone = document.getElementById(
      "ablZonenValid"
    ) as HTMLInputElement;
    if (!this.ablieferNr) {
      ablZone.setCustomValidity("bitte wählen Sie die Ablieferzone aus");
    } else {
      ablZone.setCustomValidity("");
    }
  }

  protected initPaLeistung(): void {
    $("#inPaLeistung")
      .val(this.PaData.paPlan)
      .prop("disabled", this.PaData.paPlan > 0 ? true : false);
  }

  protected close = (): void => dialog.close(this, ["close"]);

  protected accept(): void {
    dialog.close(this, [
      "accept",
      {
        start: this.DateTimeUtil.startZeit,
        stop: this.DateTimeUtil.stoppZeit,
        leistung: $("#inPaLeistung").val(),
        zone: this.ablieferNr,
        grundrezept: $("#sendRezept").is(":checked"),
        rework: false, // noch n. implementiert
      },
    ]);
  }

  /** selektiert eine Zeile in der PA-Tabelle */
  protected zoneSelect(zone: any, selectFirst?: boolean): void {
    // sucht alle Elemente in den Tabellen nach Klasse 'selected' und löscht die
    $("#ablieferZonen")
      .children()
      .each(function () {
        $(this).removeClass("selected");
      });
    if (selectFirst) {
      zone = $("#ablieferZonen")
        .children()
        .first()
        .toggleClass("selected")
        .attr("id");
    } else {
      $("#" + zone).toggleClass("selected");
    }
    this.ablieferNr = zone;
  }

  /** Ablieferzonen einlesen */
  protected async getDeliver(): Promise<number> {
    const self: this = this;
    try {
      const response = await rezService.Ablieferzone(
        self.AnlagenNr,
        self.PaData.paNr
      );

      let headArr: any;
      let bodyArr: any;

      if (response.AblieferzoneResult.length > 0) {
        headArr = self.Tab.getHeadData(response.AblieferzoneResult);
        bodyArr = self.Tab.getBodyData(response.AblieferzoneResult);
      } else {
        headArr = ["Ablieferzone", "Bezeichnung"];
        bodyArr = [["-1", "Default - Ablieferzone"]];
      }
      // Head
      self.ablieferHead.push({ cells: headArr });
      // Zeilen
      for (const bodyCell of bodyArr) {
        self.ablieferRows.push({ cells: bodyCell });
      }

      return response.AblieferzoneResult.length;
    } catch (error) {
      if (error) {
        throw error;
      } else {
        Logger.error(self, error.message, error.stack);
        throw new Error("Fehler in Ablieferzone()");
      }
    }
  }
}
export = CwRezDlgAblieferzone;
