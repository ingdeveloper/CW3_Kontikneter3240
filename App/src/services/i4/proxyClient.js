define(["require", "exports"], function (require, exports) {
    "use strict";
    var ProxyClient = /** @class */ (function () {
        function ProxyClient(accessor) {
            var _this = this;
            this.serverState = ko.observable(5);
            this.onServerStateChanged = function (state) {
                // we reverse the 3 and 4 states to make the states match with the proxy states
                if (state === 3)
                    state = 4;
                else if (state === 4)
                    state = 3;
                _this.serverState(state);
            };
            if (accessor) {
                this.name = accessor.hubName;
                accessor.client.onServerStateChanged = this.onServerStateChanged;
            }
        }
        ProxyClient.prototype.onDisconnected = function () {
            this.onServerStateChanged(5);
        };
        return ProxyClient;
    }());
    return ProxyClient;
});
//# sourceMappingURL=proxyClient.js.map