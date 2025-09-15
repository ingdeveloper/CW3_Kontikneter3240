import dialog = require("plugins/dialog");

class cwRezDlgPersonal {
  private reinigpersonal: KnockoutObservable<string> = ko.observable();

  public compositionComplete() {
    const self: this = this;

    // Timeout auf Focus setzen, weil sonst der Befehl zu früh gesetzt wird, Problem ist Bootstrap
    setTimeout(function () {
      $("#personal4711").focus();
    }, 300);

    // Btn. enable´n nur wenn Valide Eingabe war
    var $input = $("#personal4711"); //[0]// as HTMLInputElement;
    var $button = $('.modal-footer .btn[type="submit"]');
    $input.on("input", function () {
      $button.prop("disabled", !this.checkValidity());
    });

    $("#form").submit((event) => {
      event.preventDefault();
      dialog.close(this, this.reinigpersonal().replace(",", "."));
    });
  }

  public close() {
    dialog.close(this, null);
  }
}
export = cwRezDlgPersonal;
