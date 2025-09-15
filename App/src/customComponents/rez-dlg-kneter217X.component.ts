import Logger = require("../services/logger");
import RezBase = require("./component-rezept-base.model");
import rezUtils from "../viewModels/cowi/services/rezUtils";
import { FnktKennung, LogType } from "../viewModels/cowi/rezepturEnums";
import { isArray } from "durandal/system";

class RezeptDialogKneter217X<T extends IRezDlgValueParams> extends RezBase<T> {
  constructor(params: T) {
    params.kennung = FnktKennung.standard;
    super(params);
  }

  /** (Override) Rez. relevante Variablen laden */
  protected async loadVarListe() {
    const self: this = this;
    this.statusRezVarUI.descrp("Lade Rezeptvariablen…");
    try {
      // Filter auf das erste Element begrenzen
      self.RezValues.cmd.asWfFilter = isArray(self.filter)
        ? self.filter[0]
        : self.filter;

      self.varListe = await self.RezValues.getVarListe();
      await self.fillTable();

      this.statusRezVarUI.loaded(true);
    } catch (error) {
      Logger.errorToast(rezUtils.msgCut(error.message, 100) + "...");
      this.AddLog(error.message, LogType.Abbruch_durch_Programmfehler);

      this.statusRezVarUI.error(true);
      this.statusRezVarUI.descrp(error);
      throw error;
    }
  }
}

export = RezeptDialogKneter217X;
