import ChangedFieldAnimationService = require("../components/services/changed-field-animation.service");
import VisualStatesService = require("../components/services/visual-states.service");
import Signal = require("../services/models/signal");

import ComponentBaseModel = require("../components/component-base.model");
import SignalArrayService = require("../components/services/signal-array.service");

import { rezService } from "../viewModels/cowi/services/rezService";
// declare let uuid: { v4: () => any };

interface IRezInfoValueParams
  extends IComponentBaseParams,
  IChangedFieldAnimationParams,
  IState,
  ISignalArrayParams {
  signalNameRezNr: string;
  signalNameVerNr: string;
  signalNamePaNr: string;
  signalNameProdTyp: string;

  werk: number;
  halle: number;
  etage: number;
  linie: number;
  maschine: number;
}

class RezInfo<T extends IRezInfoValueParams> extends ComponentBaseModel<T> {
  protected cssDisplayClass: KnockoutComputed<string>;
  protected statusCssClass: KnockoutComputed<string>;
  protected states: VisualStatesService;

  protected changedFieldAnimationService: ChangedFieldAnimationService;
  protected cssClass: KnockoutComputed<string> | string;

  protected signalArraySrvc: SignalArrayService[];

  protected signalRezNameValue: KnockoutObservable<any> = ko.observable();

  protected signalRezNrValue: KnockoutObservable<any> | string;
  protected signalVerNrValue: KnockoutObservable<any> | string;
  protected signalPaNrValue: KnockoutObservable<any> | string;
  protected signalProdTypValue: KnockoutObservable<any> | string;

  protected signalNameRezNr: string;
  protected signalNameVerNr: string;
  protected signalNamePaNr: string;
  protected signalNameProdTyp: string;

  protected signalRezNr: Signal;
  protected signalVerNr: Signal;
  protected signalPaNr: Signal;
  protected signalProdTyp: Signal;

  protected werk: number;
  protected halle: number;
  protected etage: number;
  protected linie: number;
  protected maschine: number;
  protected uid = ko.observable(
    // uuid.v4()
    "uid-" + Math.random().toString(36).slice(2, 9)
  );

  constructor(params: T) {
    super(params);
    this.signalArraySrvc = [];

    this.signalRezNr = this.signalNameRezNr
      ? this.connector.getSignal(this.signalNameRezNr)
      : null;
    this.signalVerNr = this.signalNameVerNr
      ? this.connector.getSignal(this.signalNameVerNr)
      : null;
    this.signalPaNr = this.signalNamePaNr
      ? this.connector.getSignal(this.signalNamePaNr)
      : null;
    this.signalProdTyp = this.signalNameProdTyp
      ? this.connector.getSignal(this.signalNameProdTyp)
      : null;

    this.initializeSignalArray();
    this.initializeSignals();
    this.initializeStates();
    this.initializeChangedFieldAnimation();
    this.connector.getOnlineUpdates();
  }

  protected initializeSettings() {
    super.initializeSettings();

    this.signalNameRezNr = (
      ko.unwrap(this.settings.signalNameRezNr) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.signalRezNrValue = "";

    this.signalNameVerNr = (
      ko.unwrap(this.settings.signalNameVerNr) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.signalVerNrValue = "";

    this.signalNamePaNr = (
      ko.unwrap(this.settings.signalNamePaNr) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.signalPaNrValue = "";

    this.signalNameProdTyp = (
      ko.unwrap(this.settings.signalNameProdTyp) || ""
    ).stringPlaceholderResolver(this.objectID);
    this.signalProdTypValue = "";

    this.werk = ko.unwrap(this.settings.werk);
    this.halle = ko.unwrap(this.settings.halle);
    this.etage = ko.unwrap(this.settings.etage);
    this.linie = ko.unwrap(this.settings.linie);
    this.maschine = ko.unwrap(this.settings.maschine);
  }

  private initializeSignalArray() {
    this.signalNameRezNr
      ? (this.signalArraySrvc[this.signalNameRezNr] = new SignalArrayService(
        this.settings,
        this.signalRezNr
      ))
      : null;
    this.signalNameVerNr
      ? (this.signalArraySrvc[this.signalNameVerNr] = new SignalArrayService(
        this.settings,
        this.signalVerNr
      ))
      : null;
    this.signalNamePaNr
      ? (this.signalArraySrvc[this.signalNamePaNr] = new SignalArrayService(
        this.settings,
        this.signalPaNr
      ))
      : null;
    this.signalNameProdTyp
      ? (this.signalArraySrvc[this.signalNameProdTyp] = new SignalArrayService(
        this.settings,
        this.signalProdTyp
      ))
      : null;
  }

  private initializeChangedFieldAnimation() {
    this.changedFieldAnimationService = new ChangedFieldAnimationService(
      this.settings,
      this.signalRezNrValue as KnockoutObservable<any>,
      this.cssDisplayClass
    );
    this.cssClass = ko.computed(() => {
      return this.changedFieldAnimationService.cssClass() || "btn btn-default";
    }, this);
  }

  protected initializeStates() {
    this.states = new VisualStatesService(this.settings);
    this.statusCssClass = this.states.statusCssClass;
    this.cssDisplayClass = this.states.css;
  }
  protected waitForElement(
    selector: string,
    callback: { (elem: any): void; (arg0: JQuery): void }
  ) {
    const interval = setInterval(() => {
      const elem = $(selector);
      if (elem.length) {
        clearInterval(interval);
        callback(elem);
      }
    }, 500); // Überprüft alle 500ms
  }

  /** Durchlaufen der relevanten Elemente und Setzen von Symbolen entsprechend dem Status */
  private symbolStatePaTyp(sig: number, elem: JQueryStatic): void {
    // Vorherige Klassen gegebenenfalls entfernen.
    $(elem).removeClass(
      "paTypPV paTypPB paTypPF paTypPU paTypPL paTypRR paTypOF paTypDU paTypNL paTypProduktion"
    );
    // Prod.Typ-Symbol für Head Infobereich
    const statusText = $(elem).next(".pastatus.text");
    // Animation zurücksetzen
    statusText.css("animation", "none");
    switch (sig) {
      case -1:
      case 1:
      case 3:
        $(elem)
          .addClass("paTypProduktion")
          .attr("title", `Produktionsauftrag. SPS-Statusbyte [${sig}]`);
        statusText.text("gestartet").css("color", "limegreen");
        break;
      case 9:
        $(elem)
          .addClass("paTypRR")
          .attr("title", `Reinigungsauftrag. SPS-Statusbyte [${sig}]`);
        statusText.text("Reinigung").css("color", "#74c0fc");
        break;
      case 125:
        $(elem)
          .addClass("paTypOF")
          .attr("title", `Produktion Ofen. SPS-Statusbyte [${sig}]`);
        statusText
          .text("Ofen-Autostart/Aufheizprogramm")
          .css("color", "#d35500")
          .css("animation", "animation-fade 1.75s linear infinite alternate");
        break;
      case 253:
        $(elem)
          .addClass("paTypNL")
          .attr("title", `Nachlauf-/Trocknungszeit SPS-Statusbyte [${sig}]`);
        statusText
          .text("Nachlauf-/Trocknungszeit")
          .css("color", "#672AC4")
          .css("animation", "animation-fade 2.0s infinite");
        break;
      case 255:
        $(elem)
          .addClass("paTypDU")
          .attr("title", `Produktion DUMMY. SPS-Statusbyte [${sig}]`);
        statusText
          .text("Dummy")
          .css("color", "#ffcc00")
          .css("animation", "animation-fade 2.0s infinite");
        break;
      default:
        $(elem).attr("title", `Prod.Typ gestoppt. SPS-Statusbyte [${sig}]`);
        statusText.text("gestoppt").css("color", "tomato");
        break;
    }
  }

  private initializeSignals() {
    const self = this;

    // PA-Nummer
    this.signalPaNrValue = ko.computed(() => {
      return this.signalPaNr
        ? this.signalPaNr.value() *
        this.signalArraySrvc[this.signalNamePaNr].signalValueFactor
        : "";
    }, this);

    // Prod.Typ
    this.signalProdTypValue = ko.computed(() => {
      const resp = this.signalProdTyp
        ? this.signalProdTyp.value() *
        this.signalArraySrvc[this.signalNameProdTyp].signalValueFactor
        : 0;
      if (Number(resp) || Number(resp) == 0) {
        /** bei Änderung des Prod.-Status CSS updaten */
        this.waitForElement(".clRezeptDlg #" + this.uid(), (elem) =>
          this.symbolStatePaTyp(Number(resp), elem)
        );
      }
      return resp;
    }, this);

    // Rezeptnummer
    const setRezName = (nr: any, ver: any) => {
      const self = this;
      // Rezeptname auflösen
      self
        .callService(nr, ver)
        .then((res) => {
          let vn = res.toString().split("|");
          if (ver) {
            return vn.length > 2 ? `V${vn[1]} - ${vn[2]}` : "n/a";
          } else {
            return vn.length > 2 ? `${vn[2]}` : "n/a";
          }
        })
        .then((name) => self.signalRezNameValue(name));
    };
    this.signalRezNrValue = ko
      .computed(() => {
        const value = this.signalRezNr
          ? this.signalRezNr.value() *
          this.signalArraySrvc[this.signalNameRezNr].signalValueFactor
          : "";
        if (value) {
          setRezName(value, ko.unwrap(this.signalVerNrValue));
        }
        return value;
      }, this)
      .extend({ numeralNumber: "000000000" });

    this.signalVerNrValue = ko.computed(() => {
      const value = this.signalVerNr
        ? this.signalVerNr.value() *
        this.signalArraySrvc[this.signalNameVerNr].signalValueFactor
        : "";
      if (value) {
        ko.unwrap(this.signalRezNrValue), value;
      }
      return value;
    }, this);
  }

  /**
   * Liefert eine Rezeptliste.
   * @param rezNr optional, wenn angegeben, dann Info über gewählte Rezeptur.
   * @param rezVer optional, wenn angegeben, dann Info über gewählte Rezepturversion.
   * @returns Promise<string[]> Eine Promise, die ein Array von Strings zurückgibt.
   */
  protected async callService(rezNr?: any, rezVer?: any): Promise<string[]> {
    try {
      const ret = await rezService.GetRezList({
        werk: this.werk,
        halle: this.halle,
        etage: this.etage,
        linie: this.linie,
        maschine: this.maschine,
        reznr: rezNr,
        rezver: rezVer,
      });

      return ret.GetRezListResult.Data;
    } catch (ex) {
      throw ex;
    }
  }

  protected async dispose() {
    await super.dispose();
    this.changedFieldAnimationService.dispose();
    await this.states.unregisterSignals();

    const signals: any = [];
    for (const iSignal of [
      this.signalRezNr,
      this.signalPaNr,
      this.signalProdTyp,
    ]) {
      if (iSignal) {
        signals.push(iSignal);
      }
    }
    await this.connector.unregisterSignals(signals);
  }
}

export = RezInfo;
