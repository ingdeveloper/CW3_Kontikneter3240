import dialog = require("plugins/dialog");
import MsgBox = require("src/viewModels/cowi/dialoge/cwLogInOutMsg");
import http = require("../../../services/http");
// import Logger = require("../../../services/logger");


declare let window: any;

interface ICwLogInOut {
  usnname: string;
  usvname: string;
  usberez: string;
  usid: string;
}

interface IReadDatabaseCwLogInOut {
  ReadDatabaseResult: string[];
}

class CwLogInOut {
  private user: KnockoutObservable<string> = ko.observable();
  private pass: KnockoutObservable<string> = ko.observable();
  private userNname: KnockoutObservable<string> = ko.observable();
  private userVname: KnockoutObservable<string> = ko.observable();
  private userBerRez: KnockoutObservable<string> = ko.observable();
  private userID: KnockoutObservable<string> = ko.observable();
  /** Netzpfad zu WcfRezept */
  private webServPath1 = `${window.rootUrlPrefix}/WcfRezept/WsRezept.svc/js/`;
  private respValues = {} as ICwLogInOut;

  public compositionComplete() {
    const self: this = this;

    $("#loginoutname").focusin(function () {
      $("#loginoutname").css("background-color", "#F3F781");
    });
    $("#loginoutname").focusout(function () {
      $("#loginoutname").css("background-color", "transparent");
    });
    $("#loginoutpw").focusin(function () {
      $("#loginoutpw").css("background-color", "#F3F781");
    });
    $("#loginoutpw").focusout(function () {
      $("#loginoutpw").css("background-color", "transparent");
    });
    //--Timeout auf Focus setzen, weil sonst der Befehl zu früh gesetzt wird, Problem ist Bootstrap
    setTimeout(function () {
      $('#loginoutname').focus()
    }, 300);

    $("#form").submit(event => {
      event.preventDefault();

      self
        .getUserRights()
        .then(res => {
          dialog.close(self, res);
        })
        .catch(ex => {
          dialog.show(new MsgBox("Fehler bei der Anmeldung", ex));
        });
    });
  }

  private close() {
    const self: this = this;

    self.respValues.usnname = "";
    self.respValues.usvname = "";
    self.respValues.usberez = "";
    self.respValues.usid = "";
    dialog.close(self, this.respValues);
  }



  private async getUserRights(): Promise<ICwLogInOut> {
    const self: this = this;

    const cmd = {
      odbcCmd: `SELECT usnname, usvname, usberez, usid FROM cwprddta.wfuserpf1 WHERE
      ususer = '${self.user()}' AND uspass = '${self.pass()}'`
    };
    try {
      const response = (await http.post(
        `${self.webServPath1}ReadDatabase`,
        cmd
      )) as IReadDatabaseCwLogInOut;
      if (response.ReadDatabaseResult.length === 0) {
        // tslint:disable-next-line:no-string-throw
        throw `Benutzer '${self.user()}' bzw. Passwort ist falsch`;
      }
      const res = response.ReadDatabaseResult[0].split("|");
      self.respValues.usnname = res[0] || "";
      self.respValues.usvname = res[1] || "";
      self.respValues.usberez = res[2] || "";
      self.respValues.usid = res[3] || "";
      return self.respValues;
    } catch (error) {
      // Logger.error(self, error);
      throw new Error(error);
    }
  }
}
export = CwLogInOut;
