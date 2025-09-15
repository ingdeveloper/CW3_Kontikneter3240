abstract class ProxyClient {

    public name: string;
    public serverState = ko.observable<number>(5);

    constructor(accessor: IProxyAccessor) {
        if (accessor) {
            this.name = accessor.hubName;
            accessor.client.onServerStateChanged = this.onServerStateChanged;    
        }
    }

    public onServerStateChanged = (state: number): void => {
        // we reverse the 3 and 4 states to make the states match with the proxy states
        if (state === 3) state = 4;
        else if (state === 4) state = 3;
        this.serverState(state);
    }

    public onDisconnected() {
        this.onServerStateChanged(5);
    }

    public abstract onConnected();
}
export = ProxyClient;