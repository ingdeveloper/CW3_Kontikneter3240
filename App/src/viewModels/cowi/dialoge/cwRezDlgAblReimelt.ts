import AblieferzoneBase = require("./cwRezDlgAblieferzone");
import dialog = require("plugins/dialog");

class cwRezDlgAblReimelt extends AblieferzoneBase {
  protected visibReimelt = ko.observable();
  protected freigabeReimelt = ko.observable(false);
  protected visib = ko.pureComputed(() => (this.visibReimelt() == 'true') && !(this.freigabeReimelt()));

  constructor(
    AnlagenNr: string,
    PaData: any,
    frgReimelt: KnockoutObservable<boolean>
  ) {
    super(AnlagenNr, PaData);
    this.freigabeReimelt = frgReimelt;
  }

  protected accept(): void {
    dialog.close(this, [
      "accept",
      {
        start: this.DateTimeUtil.startZeit,
        stop: this.DateTimeUtil.stoppZeit,
        leistung: $("#inPaLeistung").val(),
        zone: this.ablieferNr,
        grundrezept: $("#sendRezept").is(":checked"),
        rework: false, // programmmäßig n. implementiert
      },
    ]);
  }
}
export = cwRezDlgAblReimelt;
