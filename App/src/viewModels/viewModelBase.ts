import Logger = require("../services/logger");

class ViewModelBase {
    public info = (message: string, ...args: any[]) => {
        Logger.info(this, message, args);
    };

    public warn = (message: string, ...args: any[]) => {
        Logger.info(this, message, args);
    };

    public error = (message: string, ...args: any[]) => {
        Logger.info(this, message, args);
    };

    public handleError = Logger.handleError(this);
}

export = ViewModelBase;