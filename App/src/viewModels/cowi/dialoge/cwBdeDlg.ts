import dialog = require("plugins/dialog");
import MsgBox = require("./cwRezDlg");
import { rezService } from "../services/rezService";

class CwBdeDlg {
  protected response: IAddBetriebsdatenResponse;
  protected bdeRequest: IAddBetriebsdatenRequest;
  protected liste: KnockoutObservableArray<string> = ko.observableArray([]);
  protected plusComment: KnockoutObservable<string>;
  protected title: string;
  /** Indikator "Beschäftigt" */
  protected busy: KnockoutObservable<boolean>;

  constructor(
    config: IAddBetriebsdatenRequest,
    liste?: string[],
    title?: string
  ) {
    this.bdeRequest = config;
    this.busy = ko.observable(true);
    this.plusComment = ko.observable("");
    this.title =
      title !== void 0 ? title : "&nbsp;Grundeingabe - Wechsel, Rücksetzung..";

    this.response = {
      AddBetriebsdatenResult: {
        Data: [""],
        ErrorMsg: "",
        ErrorNr: 0,
        Msg: "",
        Succeed: false,
      },
    };

    this.listInit(liste);
  }

  private async listInit(liste?: string[]) {
    if (liste !== void 0) {
      this.liste(liste);
    } else {
      let lst = await this.getList();
      if (lst.length == 0) {
        // ToDo
      } else {
        this.liste(lst);
      }
    }

    this.busy(false);
  }

  private async getList(): Promise<string[]> {
    // hier soll die Abfrage des Datenbankes erfolgen
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
    return ["Param 1", "Param 2", "Param 3", "Param 4", "Param 5"];
  }

  protected async compositionComplete() {
    // leere Dummy-Option hinzufügen u. selektieren
    // $("<option/>").val("").text("").appendTo("#list-select");
    // $("#list-select option[value='']").attr("selected", "true");
  }

  protected async accept() {
    let self: this = this;
    self.busy(true);
    // Zusatzkommentar
    if (self.plusComment().length > 0) {
      self.bdeRequest.config.DetailDaten.push({
        FieldName: "Kommentar",
        FieldValue: self.plusComment(),
      });
    }
    // Grund aus dem Auswahlmenü
    self.bdeRequest.config.DetailDaten.push({
      FieldName: "Grund",
      FieldValue: $("#input-select").val(),
    });

    try {
      // BD Schreiben
      self.response = await rezService.AddBetriebsdaten(self.bdeRequest);
      if (!self.response.AddBetriebsdatenResult.Succeed) {
        throw self.response.AddBetriebsdatenResult.Msg;
      }
    } catch (error) {
      // dialog.show(new MsgBox("Fehler beim Schreiben BDE", error, false));
      let [response, dispose] = await dialog.show(
        new MsgBox("Error", "Fehler beim Schreiben BDE", "Tomato")
      );
      dispose();
    } finally {
      self.close();
    }
  }

  protected checkInputs() {
    // const listSelect = document.getElementById("list-select") as HTMLInputElement;
    // if (!$("#list-select option:selected").text()) {
    const listSelect = document.getElementById(
      "input-select"
    ) as HTMLInputElement;
    if (listSelect.value.length <= 0) {
      listSelect.setCustomValidity("bitte geben Sie Grund ein");
    } else {
      listSelect.setCustomValidity("");
    }
  }

  protected close() {
    let self = this;
    dialog.close(self, self.response);
  }
}
export = CwBdeDlg;
