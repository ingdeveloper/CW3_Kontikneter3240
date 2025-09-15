import ViewModelBase = require("./viewModelBase");

class Footer extends ViewModelBase {
    private date = moment();
    private version = window.appVersion;
}

export = Footer;