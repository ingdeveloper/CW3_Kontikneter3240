var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define(["require", "exports", "./measurementService", "../logger"], function (require, exports, MeasurementService, Logger) {
    "use strict";
    var ConnectionService = /** @class */ (function () {
        function ConnectionService() {
            var _this = this;
            this.proxyState = ko.observable();
            this.proxies = ko.observableArray([]);
            this.onProxyStateChanged = function (state) {
                var e_1, _a, e_2, _b;
                _this.proxyState(state.newState);
                var proxy;
                switch (state.newState) {
                    case 1 /* connected */:
                        try {
                            for (var _c = __values(_this.proxies()), _d = _c.next(); !_d.done; _d = _c.next()) {
                                proxy = _d.value;
                                _this.onConnected(proxy);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        break;
                    case 0 /* connecting */:
                    case 2 /* reconnecting */:
                        try {
                            for (var _e = __values(_this.proxies()), _f = _e.next(); !_f.done; _f = _e.next()) {
                                proxy = _f.value;
                                proxy.onDisconnected();
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        break;
                    case 4 /* disconnected */:
                        // Try to restart connection after 1 second.
                        setTimeout(function () {
                            if (_this.hub && _this.hub.state === 4 /* disconnected */) {
                                _this.hub.logging = true;
                                console.info("Starting hub with timeout");
                                _this.hub.start();
                            }
                        }, 1000);
                        break;
                }
            };
            if (!window.usei4Connector)
                return;
            this.hub = $.connection.hub;
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
        ConnectionService.getInstance = function () {
            if (!ConnectionService.instance) {
                ConnectionService.instance = new ConnectionService();
            }
            return ConnectionService.instance;
        };
        ConnectionService.prototype.onConnected = function (proxy) {
            // execute after 1 second.
            setTimeout(function () {
                proxy.onConnected();
            }, 1000);
        };
        ConnectionService.prototype.getMeasurementService = function () {
            return _.find(this.proxies(), function (proxy) { return proxy.name === "measurementhub"; });
        };
        ConnectionService.instance = null;
        return ConnectionService;
    }());
    return ConnectionService;
});
//# sourceMappingURL=connectionService.js.map