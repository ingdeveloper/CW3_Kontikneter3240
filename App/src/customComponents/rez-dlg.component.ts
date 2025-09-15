import { FnktKennung } from "../viewModels/cowi/rezepturEnums";
import RezBase = require("./component-rezept-base.model");
// --------------------------------------------
// Standardrezeptdialog mit PA- und Rez- Liste
// --------------------------------------------
class RezeptDialogStd<T extends IRezDlgValueParams> extends RezBase<T> {
  constructor(params: T) {
    params.kennung = FnktKennung.standard;
    super(params);
  }
}

export = RezeptDialogStd;
