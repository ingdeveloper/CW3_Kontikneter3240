import dialog = require("plugins/dialog");
import Logger = require("../services/logger");
import MsgBox = require("../viewModels/cowi/dialoge/cwRezDlg");
import RezBase = require("./component-rezept-base.model");
import { FnktKennung } from "../viewModels/cowi/rezepturEnums";

class RezeptDialogRezOnly<T extends IRezDlgValueParams> extends RezBase<T> {
  constructor(params: T) {
    params.kennung = FnktKennung.rezOnly;
    super(params);
  }

  protected async makeRezList(row: any) {
    await super.makeRezList(row);
    // Rez.Liste aufklappen
    setTimeout(() => {
      $(`#${this.idCollapseRezList()}`).collapse("show");
    }, 200);
  }

  /** (Html-Button-Action) Rezept zur SPS senden */
  protected async btnSendRecipe() {
    this.isLoading(true); // Lade-Spinner zeigen
    try {
      this.AddLog("*** Btn. 'Rez.Senden' geklickt ***", this.logTyp);
      // -----------------------
      // 1. - Freigaben prüfen.
      // -----------------------
      if (
        !(await this.checkCountDataTable()) ||
        !(await this.checkExtFreigabe())
      ) {
        return;
      }
      // -------------------------------------------------
      // 2. - gewählte PA/Rez- Nr. Plausibilitätsprüfung.
      // -------------------------------------------------
      this.selectedPaData.ProdTyp("DU");
      this.selectedPaData.RezNr(this.selectedRecipe.Nr());
      this.selectedPaData.PaNr("99999");
      const paDaten = await this.RezPaPlausibility();
      if (!paDaten) return;

      // -----------------------------------
      // 3. - Rezeptvariablen -> SPS senden
      // -----------------------------------
      await this.sendToSps(this.selectedRecipe.Nr(), this.selectedRecipe.Vers());

      const sResp = await this.rezGesendet({
        id: null,
        paNr: this.selectedPaData.RezNr(),
        rzNr: this.selectedRecipe.Nr(),
        rzVer: this.selectedRecipe.Vers(),
        rzName: this.selectedRecipe.Descrp(),
      });
    } catch (error) {
      if (error) {
        Logger.errorToast(error);
        let [response, dispose] = await dialog.show(
          new MsgBox("Error", "Vorgang abgebrochen", "Tomato")
        );
        dispose();
      } else {
        Logger.errorToast("Fehler in sendRecipe()");
        Logger.error(this, "Fehler in sendRecipe()");
      }
    } finally {
      this.isLoading(false); // Lade-Spinner ausblenden
    }
  }
}

export = RezeptDialogRezOnly;
