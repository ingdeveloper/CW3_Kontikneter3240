const CANCEL = Symbol();

export class CancellationToken {

    private cancelled: boolean;
    public abort: () => void;

    constructor() {
        this.cancelled = false;
    }

    public throwIfCancelled() {
        if (this.isCancelled()) {
            throw "Cancelled";
        }
    }

    public isCancelled() {
        return this.cancelled === true;
    }

    [CANCEL]() {
        this.cancelled = true;
        if (this.abort)
            this.abort();
    }

}

export class CancellationTokenSource {

    public token: CancellationToken;

    constructor() {
        this.token = new CancellationToken();
    }

    public cancel() {
        this.token[CANCEL]();
    }

}