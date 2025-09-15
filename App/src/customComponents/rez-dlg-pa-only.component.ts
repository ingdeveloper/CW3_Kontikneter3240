import * as dialog from "plugins/dialog";
import RezBase from "./component-rezept-base.model";
import Logger = require("../services/logger"); // Toaster-Service
import DlgAblieferZone from "../viewModels/cowi/dialoge/cwRezDlgAblieferzone";
import { rezService } from "../viewModels/cowi/services/rezService";
import {
  FnktKennung,
  PaStatus,
  eAuftArt,
  eProdTyp,
  eAuftFn,
  LogType,
} from "../viewModels/cowi/rezepturEnums";

class RezeptDialogPaOnly<T extends IRezDlgValueParams> extends RezBase<T> {
  constructor(params: T) {
    params.kennung = FnktKennung.paOnly;
    super(params);
  }

  /** Komposition vollständig aufgebaut */
  protected async compositionComplete() {
    const self: this = this;

    $("#paFilter").on("keyup", () => {
      self.changeFilter("#paFilter");
    });

    self.initUser();
    self.initSpsSignals();
    self.connector.getOnlineUpdates();

    // db2Status freigeben
    self.db2State(true);

    self.handleUnsetProperties();

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

  /** sendet Rezept zur SPS */
  protected async sendRecipe(DlgRes: IDlgAblieferzone) {
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
          this.selectedPaData.PaNr(),
          this.selectedPaData.RezNr(),
          this.selectedPaData.ProdTyp(),
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
          !["33333", "77777", "88888", "99999"].includes(
            this.selectedPaData.PaNr()
          ) // es dürfen keine 'dummys' behandelt werden
        ) {
          const format = "DD.MM.YYYY HH:mm:ss";
          const diffInSeconds = moment(DlgRes.stop, format).diff(
            moment(DlgRes.start, format),
            "seconds"
          );
          const AuftArt =
            eAuftArt[this.selectedPaData.ProdTyp() as keyof typeof eAuftArt] ||
            eProdTyp[this.selectedPaData.ProdTyp() as keyof typeof eProdTyp];
          const respLobst = (
            await rezService
              .SetBdeLobst({
                AuftArt,
                Fnkt: eAuftFn.Start,
                PaNr: parseFloat(this.selectedPaData.PaNr().toString()),
                RessNr: this.anlage(),
                ZaehlNr: this.zaehler() || this.anlage(),
                RezNr: parseFloat(this.selectedPaData.RezNr().toString()),
                Wert: diffInSeconds,
                VorgNr: this.selectedPaData.ActivNr(),
                RueckNr: this.selectedPaData.RespnNr(),
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
        DlgRes.leistung
      ).catch((error) => {
        throw error;
      });

      Logger.successToast(paToSps[0]);
    } catch (error) {
      this.showError(error, "Rezept wurde nicht zur SPS übertragen.");
    } finally {
      // PA-Tabelle refreshen. Dies ist notwendig, falls das Rezept nicht erfolgreich gesendet wurde.
      await this.makePaList();
    }
  }

  /** (Html-Button-Action) Rezept zur SPS senden */
  protected async btnSendRecipe() {
    this.AddLog("*** Btn. 'Rez.Senden' geklickt ***", this.logTyp);
    try {
      // -------------------------------------------------
      // 2. - gewählte PA-Daten holen.
      // -------------------------------------------------
      const paDaten: any = {
        PaNr: this.selectedPaData.PaNr().toString(),
        Planleistung: this.selectedPaData.Planleistung(),
        Start: this.selectedPaData.Start(),
        Stop: this.selectedPaData.Stop(),
      };
      if (!paDaten) return;

      // ---------------------------------------------
      // 3. - Dialog Ablieferzone, PA-Startdatum usw.
      // ---------------------------------------------
      let dialogResult: IDlgAblieferzone[];

      dialogResult = await dialog.show(
        new DlgAblieferZone(this.anlage().toString(), paDaten)
      );

      if (dialogResult[0].toString().toLowerCase() !== "accept") return;

      this.isLoading(true); // Lade-Spinner zeigen

      // ---------------------------
      // 4. - Rezeptsenden starten.
      // ---------------------------
      await this.sendRecipe(dialogResult[1] as IDlgAblieferzone);
    } finally {
      this.isLoading(false); // Lade-Spinner ausblenden
    }
  }
}

export = RezeptDialogPaOnly;
