import { Color } from "d3";
import dialog = require("plugins/dialog");

interface ICwDlgBtn {
  name: string;
  text: string;
  btnClassName: string;
}
class CwRezDlg {
  private componentName: string;
  private id: KnockoutObservable<number>;
  private txtHead: string;
  private txtBody: string;
  private headColor: KnockoutObservable<Color>;
  private buttons: KnockoutObservableArray<ICwDlgBtn>;

  constructor(
    txtHead: string,
    txtBody: string,
    headColor?: string,
    buttons?: ICwDlgBtn[]
  ) {
    this.txtHead = txtHead;
    this.txtBody = txtBody;
    this.headColor = headColor
      ? ko.observable(d3.rgb(`${headColor}`))
      : ko.observable(d3.rgb("LightGray"));

    this.buttons = buttons
      ? ko.observableArray(buttons)
      : ko.observableArray([
          {
            name: "Default",
            text: "Ok",
            btnClassName: "btn btn-default",
          },
        ]);

    this.initialize();
  }

  protected initialize() {
    this.id = ko.observable(Date.now());
    this.componentName = "dialog-content" + ko.unwrap(this.id);

    ko.components.register(this.componentName, {
      viewModel: () => {},
      template: "<div/>",
    });
  }

  protected close(param) {
    dialog.close(this, [param, this.dispose.bind(this)]);
  }

  protected dispose() {
    ko.components.unregister(this.componentName);
    
    $(document)
      .find("#modal-dialog-container-" + ko.unwrap(this.id))
      .remove();
  }
}
export = CwRezDlg;
