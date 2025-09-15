import Signal = require("./signal");

class NullSignal extends Signal {
    public value = ko.pureComputed<any>(
        {
            read: (): any => null,
            write: (value: any) => {
            }
        });

    constructor() {
        super(null, null);
    }
}

export = NullSignal;