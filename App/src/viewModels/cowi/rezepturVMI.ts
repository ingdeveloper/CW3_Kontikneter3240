import { userLogHandle } from "./services/logonHandling";
import CcwContextmenu = require("../../../src/viewModels/cowi/services/ccw-contextmenu");
import Connector = require("../../services/connector");
import Signal = require("../../services/models/signal");

declare let window: any;

class rezepturVMI {
  private signal: Signal;
  private signalName: string = "VMI3240DB580B17";
  private connector: Connector = new Connector();

  protected alarmCount: KnockoutObservable<string | number> = ko.observable(0);
  protected alarmTxt = ko.pureComputed(() => {
    return Number(this.alarmCount()) > 0 ? `${this.alarmCount()} unkommentierten Störungen` : 'Keine unkommentierten Störungen';
  });
  constructor() {
    try {
      this.signal = this.connector.getSignal(this.signalName); //Signal-Objekt mit dem SignalName erstellen
    } catch (error) {
      console.log(`Error: ${error}`);
      this.alarmCount(`Signal '${this.signalName}' konnte nicht initialisiert werden!`); //Knockout-Computed-Variable aktualisieren
    }
    this.alarmCount(this.signal.value()); //Knockout-Computed-Variable aktualisieren
    this.signal.value.subscribe((val) => {
      this.alarmCount(val)
    }); //SignalValue abonnieren und den Button-Text aktualisieren
    this.connector.getOnlineUpdates(); //Online-Updates von der WF-Datenbank abrufen
  }


  public activate(ub: string) {
    userLogHandle.login(ub);

    CcwContextmenu.AddIdent({
      wfServername: window.rootUrlPrefix + "\\I4SCADA",
      wfDbName: "broet3240",
      werk: 2,
      halle: 3,
      etage: 2,
      linie: 4,
      abteiNr: 250,
      maschine: 11,
      anlagenNr: 7324020,
    });
  }

  protected deactivate() {
    if (!this.signal)
      return;
    return this.connector.unregisterSignals(this.signal);
  };
}
export = rezepturVMI;