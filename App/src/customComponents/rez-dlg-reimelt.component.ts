import dialog = require("plugins/dialog");
import Logger = require("../services/logger");
import RezBase = require("./component-rezept-base.model");
import cwRezDlgAblReimelt = require("../viewModels/cowi/dialoge/cwRezDlgAblReimelt");
import {
  FnktKennung,
  LogType,
  PaStatus,
} from "../viewModels/cowi/rezepturEnums";

class RezeptDialogReimelt<T extends IRezDlgValueParams> extends RezBase<T> {
  constructor(params: T) {
    params.kennung = FnktKennung.standard;
    super(params);
  }

  /** sendet Rezept zur SPS */
  protected async sendRecipe() {
    const self: this = this;

    if (!(await self.checkCountDataTable())) return;

    const paDaten = await this.RezPaPlausibility();
    if (!paDaten) return;

    const dialogResult = await dialog.show(
      new cwRezDlgAblReimelt(
        self.anlage().toString(),
        paDaten,
        self.freigabeLaden
      )
    );
    if (dialogResult[0] !== "accept") return;

    const DlgRes = dialogResult[1]; // as IDlgAblieferzone;

    // Lade-Spinner zeigen
    self.isLoading(true);

    let fltr: string | string[] = "";

    try {
      // falls PA-Aktiv u. vorher n. gestoppt, dann stoppen
      let start = performance.now();
      if (self.paAktiv()) await self.stopPa();

      console.info(
        "%cAusführung in " + (performance.now() - start).toFixed(2) + " ms.",
        "color:blue"
      );

      // 1 - PA-Starten -> OPUS(WebService)
      await self.sendPaToOpus(
        PaStatus.start,
        self.selectedPaData.PaNr(),
        self.selectedPaData.RezNr(),
        self.selectedPaData.ProdTyp(),
        DlgRes.zone,
        DlgRes.rework
      );

      // 2 - PA-Nr. -> SPS senden
      let paToSps = async () =>
        self.writePaDatSps(true, DlgRes.start, DlgRes.stop, DlgRes.leistung);

      fltr = Array.isArray(self.filter) ? [...self.filter] : self.filter; // Original beibehalten

      if (!self.freigabeLaden() && Array.isArray(fltr)) fltr.pop(); // falls keine Freigabe -> Reimelt Block löschen

      DlgRes.grundrezept &&
        !self.freigabeLaden() &&
        self.AddLog("Option Rezept übertragen ohne Reimelt/Schüttgut gewählt!", LogType.OK);

      // 3 - Rezeptvariablen -> SPS senden
      let sndToSps = async () =>
        DlgRes.grundrezept
          ? self.sendToSps(self.selectedRecipe.Nr(), self.selectedRecipe.Vers(), fltr)
          : self.writeRezDatSps(
            self.selectedRecipe.Nr(),
            self.selectedRecipe.Vers()
          );

      // Pos. 2 bis 3 parallel verarbeiten
      let [paData, dat] = await Promise.all([paToSps(), sndToSps()]);
      Logger.successToast(paData[0] + dat[0]);

      // if (DlgRes.grundrezept && self.freigabeLaden()) {
      const sResp = await self.rezGesendet({
        id: null,
        paNr: self.selectedPaData.PaNr(),
        rzNr: self.selectedRecipe.Nr(),
        rzVer: self.selectedRecipe.Vers(),
        rzName: "",
      });
      console.info("%c" + sResp, "background:purple");
    } catch (error) {
      self.showError(error, "Rezept wurde nicht zur SPS übetragen.");
    } finally {
      // PA-Tabelle refreshen
      this.makePaList();
      // Lade-Spinner ausblenden
      self.isLoading(false);
    }
  }
}

export = RezeptDialogReimelt;
