import dialog = require("plugins/dialog");
import MsgBox = require("../../cowi/dialoge/cwRezDlg");
import { rezService } from "../../cowi/services/rezService";

class CwRezDlgLogInOut {
  private user: KnockoutObservable<string> = ko.observable();
  private pass: KnockoutObservable<string> = ko.observable();
  private respValues = {} as IDlgRespLogInOut;
  /** Indikator "Beschäftigt */
  protected busy: KnockoutObservable<boolean> = ko.observable(false);

  protected accept() {
    this.busy(true);
    rezService
      .GetUserRights(this.user(), this.pass())
      .then((res) => {
        if (!res.GetUserRightsResult.Succeed)
          throw "Benutzer bzw. Passwort ist falsch";

        this.respValues.state = 1;
        this.respValues.vorname = "***";
        this.respValues.nachname = "***";
        this.respValues.usid =
          res.GetUserRightsResult.Data.Usid.toString() || "";
        this.respValues.usberez =
          res.GetUserRightsResult.Data.Usberez.toString() || "";
        dialog.close(this, this.respValues);
      })
      .catch(async (ex) => {
        // dialog.show(new MsgBox("Fehler bei der Anmeldung", ex, false));
        let [response, dispose] = await dialog.show(
          new MsgBox("Fehler bei der Anmeldung", ex, "Tomato")
        );
        dispose();
        this.busy(false);
      });
  }

  protected close() {
    this.respValues = {
      state: 0,
      vorname: "",
      nachname: "",
      usid: "",
      usberez: "",
    };
    dialog.close(this, this.respValues);
  }
}
export = CwRezDlgLogInOut;
