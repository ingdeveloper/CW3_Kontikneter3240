import RezBase = require("./component-rezept-base.model");
import { FnktKennung } from "../viewModels/cowi/rezepturEnums";

class RezeptDialogOfen<T extends IRezDlgValueParams> extends RezBase<T> {
  constructor(params: T) {
    params.kennung = FnktKennung.ofen;
    super(params);
  }
}

export = RezeptDialogOfen;
