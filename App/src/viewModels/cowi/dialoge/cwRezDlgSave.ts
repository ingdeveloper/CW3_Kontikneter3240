import dialog = require("plugins/dialog");
import { rezService } from "../services/rezService";

class CwRezDlgSave {
  private autocompleteItems = ko.observableArray([]);
  private rezNr: KnockoutObservable<number> = ko.observable();
  private rezVer: KnockoutObservable<number> = ko.observable();
  private rezName: KnockoutObservable<string> = ko.observable();
  private versionierung: KnockoutObservable<boolean> = ko.observable();

  private lastInputRezNr: number;
  private lastInputVer: number;

  private anlagenKennung: IAnlagenKennung;
  private btnDefaultState = {
    title: "",
    text: "Speichern",
    class: "btn btn-default",
  };
  private btnSaveState: KnockoutObservable<any> = ko.observable(
    this.btnDefaultState
  );

  constructor(
    rezNr: any,
    rezVer: any,
    rezName: string,
    anlKennung: IAnlagenKennung,
    versioning: boolean
  ) {
    this.rezNr(rezNr);
    this.rezVer(rezVer || 0);
    this.rezName(rezName);
    this.anlagenKennung = anlKennung;
    this.versionierung(versioning);
  }

  protected compositionComplete() {
    const self: this = this;

    _.delay(() => {
      $("#inNum").focus();
    }, 100);

    // beim ersten Laden der Maske
    self.getAuautocompleteItems();

    const debounce = _.debounce(async () => {
      self.getAuautocompleteItems();
    }, 600);

    $("#inNum").on("input", function () {
      this.setCustomValidity("");
      debounce();
    });

    if (self.versionierung()) {
      $("#inVer").on("input", function () {
        debounce();
      });
    }
  }

  // setzt führende Nullen ins Rez.Nr. Eingabefeld
  private format(elem: number) {
    return elem.toString().trim().padStart(9, "0");
  }

  // erstellt eine Autocomplete-Rez.Namenliste
  private async getAuautocompleteItems() {
    const self = this;
    const rzNummer = Number($("#inNum").val());
    const rzVer = Number($("#inVer").val());

    if (rzNummer === self.lastInputRezNr && rzVer === self.lastInputVer) {
      return;
    }
    if ($("#inNum").is(":invalid") || $("#inVer").is(":invalid")) {
      self.btnSaveState(self.btnDefaultState); // Button-Speichern defaultwerte einspielen
      return;
    }

    self.lastInputRezNr = rzNummer;
    self.lastInputVer = rzVer;

    try {
      const resp = await rezService.GetRezNamen(self.format(rzNummer));

      self.autocompleteItems(resp.GetRezNamenResult.Data);
      self.ctrlBtnSave(self);
    } catch (error) {
      if (error) {
        throw error;
      } else {
        throw new Error(
          "Fehler in cwRezDlgSave/getAuautocompleteItems(obj, elem)"
        );
      }
    }
  }

  /** ctrl SaveBtn */
  private async ctrlBtnSave(obj: this) {
    const self = obj;
    let state = null;

    // Abfrage ob gewählte Rez. vorhanden
    try {
      const resp = await rezService.IstRezeptVorhanden({
        rezNr: self.format(self.lastInputRezNr),
        verNr: self.lastInputVer,
        werk: this.anlagenKennung.werk,
        abteiNr: this.anlagenKennung.abteiNr,
        halle: this.anlagenKennung.halle,
        etage: this.anlagenKennung.etage,
        linie: this.anlagenKennung.linie,
        maschine: this.anlagenKennung.maschine,
      });

      if (!resp.IstRezeptVorhandenResult.Succeed) {
        throw new Error(resp.IstRezeptVorhandenResult.Msg);
      }

      if (!resp.IstRezeptVorhandenResult.Data) {
        // speichern
        state = {
          class: "btn btn-success",
          text: "Speichern",
          title: "Rezept wird angelegt",
        };
      } else {
        // überschreiben
        state = {
          class: "btn btn-danger",
          text: "Überschreiben",
          title: "Rezept existiert bereits und wird überschrieben!",
        };
      }
      self.btnSaveState(state);
    } catch (error) {
      if (error) {
        throw error;
      } else {
        throw new Error("Fehler in cwRezDlgSave/ctrlBtnSave(obj)");
      }
    }
  }

  protected save() {
    const inputElement = $("#inNum")[0] as HTMLInputElement;
    const pattern = /^\d[0-9]+$/; // Dein Muster hier

    if (!pattern.test(inputElement.value) || Number(inputElement.value) <= 0) {
      inputElement.setCustomValidity(
        "Rezeptnummer 0 oder alphanumerische Zeichen sind nicht zulässig."
      );
      (inputElement as any).reportValidity();
      return;
    }
    inputElement.setCustomValidity(""); // Setzt die benutzerdefinierte Fehlermeldung zurück

    dialog.close(this, {
      state: "save",
      rezNr: this.format(Number(inputElement.value)),
      rezVer: this.rezVer(),
      rezName: this.rezName().trim(),
    });
  }
  protected close() {
    dialog.close(this, { state: "close" });
  }
}

export = CwRezDlgSave;
