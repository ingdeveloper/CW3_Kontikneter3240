import { Color } from "d3";
import dialog = require("plugins/dialog");

class CwLogInOutMsg {
  private param1;
  private param2;
  private bckCl: KnockoutObservable<Color> = ko.observable(d3.rgb("tomato"));

  constructor(txtHead: string, txtBody: string, bckColor?: string) {
    this.param1 = txtHead;
    this.param2 = txtBody;
    // optionale Farbe
    if (bckColor !== void 0) {
      this.bckCl(d3.rgb(bckColor));
    }
  }

  public close() {
    dialog.close(this, "close");
  }
}
export = CwLogInOutMsg;
