/*
 *************************************************
 * Viewmodel für das modale Fenster Rezepteditor *
 *************************************************
 */
import MsgBox = require("./cwRezDlg");
import dialog = require("plugins/dialog");
import Logger = require("../../../services/logger");
import Log = require("../../../viewModels/cowi/services/rezLog");
import LoginDialog = require("./cwRezDlgLogInOut");
import Connector = require("../../../services/connector");
import { rezService } from "../../../viewModels/cowi/services/rezService";
import {
  FnktKennung,
  ServiceWahl,
  LogType,
  PaStatus,
} from "../../../viewModels/cowi/rezepturEnums";

class cwDlgRezEdit {
  /** Indikator "Beschäftigt" */
  protected busy: KnockoutObservable<boolean> = ko.observable(false);
  /** Datenpool für die anstehende Änderungen */
  protected changedElements = ko.observableArray([]);

  protected response: IDlgRezEdit;
  protected title: string;
  protected txtBody: string;
  protected spsAlias: string;
  protected spsValue: string;
  protected db2Alias: string;
  protected factor: string;
  protected user: string;
  protected connector: Connector;
  protected ident: JSON;

  constructor(html: string, item: JSON, ident) {
    this.ident = Array.isArray(ident) ? ident[ident.length - 1] : ident;
    this.connector = new Connector();
    this.spsValue = this.connector.getSignal(item["alias"]).value().toString();

    this.txtBody = html;
    let description = item["description"] ? " - " + item["description"] : "";
    this.title = item["alias"] + description;
    this.spsAlias = item["alias"];
    this.db2Alias = item["db2Alias"];
    this.factor = item["factor"];
    this.user = item["user"];
  }

  protected async compositionComplete() {
    this.parseVal();
  }

  // /** schreibt Log in die Datenbank
  //  * @param msg Log-Message
  //  * @param logType Meldungstyp
  //  */
  // protected AddLog(msg: string, logType: LogType): void {
  //   const self: this = this;

  //   Log.Add(
  //     parseInt(self.spsValue),
  //     JSON.stringify(self.ident),
  //     "`${self.userInfo()}; Admin: ${self.adminName()}`",
  //     logType,
  //     msg,
  //     "self.selectedPaNr()",
  //     "self.selectedRecipe.Nr()",
  //     "",
  //     "self.selectedRecipeVer()"
  //   ).catch((error) => Logger.errorToast(error));
  // }

  private parseVal() {
    const self: this = this;

    // SPS-Aktualwert in HTML-Konstrukt einbauen
    $("input[type='search']").after(
      `<div class="pull-right">SPS-Aktualwert: ${self.spsValue}</div>`
    );

    // keine Input-Elemente einbauen, wenn der Faktor von 1 abweicht
    if (self.factor !== "1") {
      // Infotext in HTML-Konstrukt einbauen
      $("input[type='search']").after(
        `<div style="color:tomato;" class="pull-right">Die Bearbeitung n. möglich, der Wert ist skaliert</div>`
      );
      return;
    }

    $("[id^=rezVal_]").each((i, e) => {
      let val = e.textContent;
      let title = `DB-Wert: ${val}; SPS-Wert: ${self.spsValue}`;
      let discr = val !== self.spsValue ? "diff" : "equal";

      // dataset erweitern um Alias-Namen
      $(e).data("rezparam")["alias"] = self.db2Alias || self.spsAlias;
      let rezparams = JSON.stringify($(e).data("rezparam"));
      $(e).html(
        `<input type="number" class="editable ${discr}" value="${val}" title="${title}" data-signalinfo=${rezparams} data-bind="event:{change:function(data, event){valChanged(data, event)}}">`
      );
      // dynamisch erzuegte HTML-Elemente mit Bindungen aktivieren
      ko.applyBindings(self, e);
    });
  }

  protected async valChanged(...any: any[]) {
    /** Triggerobjekt */
    const $elem: JQuery = $(any[1].currentTarget);

    // Values zwischenspeichern
    const newValue = $elem.val();
    const oldValue = $elem.prop("defaultValue");

    //  Visuelle classe 'changed' setzen/rücksetzen
    newValue !== oldValue
      ? $elem.addClass("changed")
      : $elem.removeClass("changed");

    // prüfen ob das Element in der Liste vorhanden
    let index = this.changedElements().findIndex(
      (obj) => obj[0].dataset.signalinfo === $elem[0].dataset.signalinfo
    );

    if (index !== -1) {
      // wenn die alt/neu -Werte übereinstimmen, dann aus dem Array löschen
      if (newValue === oldValue)
        this.changedElements.remove(this.changedElements()[index]);
      // wenn alt/neu -Werte unterschiedlich, dann ersetzen
      else this.changedElements.replace($elem, $elem);
      // wenn das changedElements-Array noch leer ist, dann push'en
    } else this.changedElements.push($elem);
  }

  protected async save() {
    const self: this = this;

    self.busy(true);

    let values = [];
    self.changedElements().forEach((element) => {
      /** Triggerobjekt */
      let $elem: JQuery = $(element[0]);
      let newValue = $elem.val();
      let dataSet = $elem.data("signalinfo");

      values.push({
        AliasName: dataSet.alias,
        Value: newValue,
        RezNr: dataSet.reznr,
        RezVer: dataSet.rezver,
      });
    });

    const response = await rezService.UpdateRezDB({
      Data: values,
      User: self.user,
      Werk: self.ident["werk"],
      Halle: self.ident["halle"],
      Etage: self.ident["etage"],
      Linie: self.ident["linie"],
      Abteil: self.ident["abteiNr"],
      Maschine: self.ident["maschine"],
      RezeptNr: "",
      RezeptVer: "",
      RezeptName: "",
    });

    if (!response.UpdateRezDBResult.Succeed) {
      await dialog.show(
        new MsgBox("Error", response.UpdateRezDBResult.Msg, "Tomato")
      );
      this.abort();
    }
    // Eingabe auf alten ungeänderten Wert zurücksetzen
    self.changedElements().forEach((element) => {
      /** Triggerobjekt */
      let $elem: JQuery = $(element[0]);
      let newValue = $elem.val();
      // 1. - Klasse 'changed' löschen
      // 2. - Fokus aus den Eingabe-Elementen wegnehemen.
      // 3. - da die Titelinformation zu kompliziert
      //      zu refresh'en ist wird's nach dem 'Save' gelöscht.
      $elem.removeClass("changed").blur().attr("title", "");
      newValue !== self.spsValue
        ? $elem.removeClass("equal").addClass("diff")
        : $elem.removeClass("diff").addClass("equal");
    });

    self.changedElements.removeAll();
    self.busy(false);
  }

  protected abort() {
    this.response = {
      state: 0,
      nachname: this.user,
      usberez: window.UserLevel().toString(),
      usid: "1",
      vorname: this.user,
    };
    this.close();
  }

  protected close() {
    const self: this = this;
    self.connector.unregisterSignals(self.spsAlias);

    dialog.close(self, self.response);
  }
}
export = cwDlgRezEdit;
