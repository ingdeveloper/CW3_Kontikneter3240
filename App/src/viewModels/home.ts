import ViewModelBase = require("./viewModelBase");
import SignalsConnector = require("../services/connector");

declare global {
    interface Window { buildDate: any; }
}

class Home extends ViewModelBase {
    public connector: SignalsConnector;

    public async activate() {
        this.connector = new SignalsConnector();
    };
    public async attached() {
        window.routerConfig(0);
    };
    public compositionComplete() {
        $('#appVersion').html(window.appVersion);
        $('#buildDate').html(moment(window.buildDate).format('DD-MM-YYYY  HH:mm'));

    }
}

export = Home;