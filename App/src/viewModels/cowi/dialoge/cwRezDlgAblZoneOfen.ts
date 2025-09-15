import AblieferzoneBase = require("./cwRezDlgAblieferzone");
import dialog = require("plugins/dialog");

class cwRezDlgAblZoneOfen extends AblieferzoneBase {
  /** Verbindungstatus zur WF-Datenbank */
  protected visibGrundrezept: KnockoutObservable<boolean> = ko.observable(true);

  constructor(AnlagenNr: string, PaData: any) {
    super(AnlagenNr, PaData);
  }

  public compositionComplete() {
    super.compositionComplete();
    const self = this;
    $("input[name='ofenautostart']").on("change", function (e) {
      // Alle Radio-Buttons in der Gruppe
      $("input[name='ofenautostart']").each(function () {
        const ch: boolean = $("#ofenStart").is(":checked");
        $("#sendRezept").prop("checked", ch);


        // Bedienbarkeit des Grundrezeptes anpassen
        const cssVal = ch ? "none" : "auto";

        $("#sendRezept").closest(".input-group")
          .css("pointer-events", cssVal)
          .css("user-select", cssVal);
        $("#sendRezept").closest(".row")
          .attr("title", ch ? "beim Ofenstart-Autostart nur die Option 'Übertragen' erlaubt." : "");
        // Sichtbarkeit des Grundrezeptes anpassen
        self.visibGrundrezept(!ch);
      });
    });
    // Vorbelegen auf 'kein Autostart'
    $("#keinOfenStart").prop("checked", true).trigger("change");
  }

  protected accept(): void {
    dialog.close(this, [
      "accept",
      {
        start: this.DateTimeUtil.startZeit,
        stop: this.DateTimeUtil.stoppZeit,
        leistung: $("#inPaLeistung").val(),
        zone: this.ablieferNr,
        grundrezept: $("#sendRezept").length
          ? $("#sendRezept").is(":checked")
          : !this.visibGrundrezept(),
        rework: false, // programmmäßig n. implementiert
        ofenautostart: $("#ofenStart").is(":checked"),
      },
    ]);
  }
}
export = cwRezDlgAblZoneOfen;
