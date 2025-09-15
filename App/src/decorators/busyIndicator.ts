import Logger = require("../services/logger");

class BusyIndicator {
    private context: any;
    private counter = ko.observable(0);
    public active = ko.pureComputed(() => this.counter() === 0);

    constructor(context: any) {
        this.context = context;
    }

    private startBusyAction(hint: string): string {
        let counter = this.counter();
        ++counter;
        this.counter(counter);

        Logger.info(this.context, `Starting action: ${hint} [nesting: ${counter}]`);
        return hint;
    }

    private endBusyAction(hint: string) {
        let counter = this.counter();
        --counter;

        Logger.info(this.context, `Ending action: ${hint} [nesting: ${counter}]`);

        if (counter < 0) {
            Logger.warn(this.context, "Nesting is negative => more long running actions are closed than started!");
            counter = 0;
        }
        this.counter(counter);
    }

    private endAllBusyActions() {
        const counter = this.counter();
        if (counter > 0) {
            Logger.warn(this.context, `Forced end of ${counter} long running operations`);
        }

        this.counter(0);
    }

    public async runLongAction<T>(hint: string, action: () => any): Promise<T> {
        this.startBusyAction(hint);
        try {
            return await Promise.resolve(action());
        } finally {
            this.endBusyAction(hint);
        }
    }
}

export = BusyIndicator