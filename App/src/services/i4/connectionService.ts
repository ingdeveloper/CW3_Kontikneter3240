import MeasurementService = require("./measurementService");
import ProxyClient = require("./proxyClient");
import Logger = require("../logger");

const enum SignalRConnectionState {
    connecting = 0,
    connected = 1,
    reconnecting = 2,
    disconnected = 4
}

class ConnectionService {

    public proxyState = ko.observable<number>();
    public proxies = ko.observableArray<ProxyClient>([]);
    private hub;

    private static instance: ConnectionService = null;

    public static getInstance(): ConnectionService {
        if (!ConnectionService.instance) {
            ConnectionService.instance = new ConnectionService();
        }

        return ConnectionService.instance;
    }

    constructor() {
        if (!window.usei4Connector) return;
        this.hub = ($ as any).connection.hub;
        this.hub.url = window.resolveUrl(window.signalRUrl);
        Logger.info(this, "SignalR Hub Url" + this.hub.url);
        this.hub.qs = { "access_token": sessionStorage["accessToken"] || localStorage["accessToken"] };
        this.hub.stateChanged(this.onProxyStateChanged);
        this.proxies.push(new MeasurementService());
        // this.hub.start({ transport: 'webSockets' });
        console.info("Starting hub");
        // var connection = ($ as any).hubConnection();
        // connection.logging = true;
        // this.hub.start({ transport: 'longPolling' });
        // this.hub.logging = true;
        this.hub.start();
    }

    private onProxyStateChanged = (state: any) => {
        this.proxyState(state.newState);
        let proxy: ProxyClient;
        switch (state.newState) {
            case SignalRConnectionState.connected:
                for (proxy of this.proxies()) {
                    this.onConnected(proxy);
                }
                break;
            case SignalRConnectionState.connecting:
            case SignalRConnectionState.reconnecting:
                for (proxy of this.proxies()) {
                    proxy.onDisconnected();
                }
                break;
            case SignalRConnectionState.disconnected:
                // Try to restart connection after 1 second.
                setTimeout(() => {
                    if (this.hub && this.hub.state === SignalRConnectionState.disconnected) {
                        this.hub.logging = true;
                        console.info("Starting hub with timeout");
                        this.hub.start();
                    }
                }, 1000);
                break;
        }
    };

    private onConnected(proxy: ProxyClient): void {
        // execute after 1 second.
        setTimeout(() => {
            proxy.onConnected();
        }, 1000);
    }

    public getMeasurementService(): MeasurementService {
        return _.find(this.proxies(), proxy => proxy.name === "measurementhub") as MeasurementService;
    }
}

export = ConnectionService;