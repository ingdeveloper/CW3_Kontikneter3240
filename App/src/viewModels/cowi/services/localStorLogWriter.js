define(["require", "exports"], function (require, exports) {
    "use strict";
    var localStorLogWriter = /** @class */ (function () {
        function localStorLogWriter() {
            this.logQueue = [];
        }
        localStorLogWriter.prototype.addToLogQueue = function (key, log) {
            // Füge den Log-Eintrag zur Warteschlange hinzu
            this.logQueue.push({ key: key, log: log });
        };
        // Warteschlange
        localStorLogWriter.prototype.processLogQueue = function () {
            var url = window.location.href;
            // Überprüfe, ob es Log-Einträge in der Warteschlange gibt
            if (this.logQueue.length > 0) {
                // Entferne den ersten Log-Eintrag aus der Warteschlange
                var _a = this.logQueue.shift(), key = _a.key, log = _a.log;
                var event_1 = new StorageEvent("storage", { key: key, newValue: log, url: url });
                // Speichere den Log-Eintrag im LocalStorage
                localStorage.setItem(key, log);
                window.dispatchEvent(event_1); // dies ist notwendig um 'storage'-Event anzustoßen
            }
        };
        localStorLogWriter.prototype.startProcessing = function () {
            var _this = this;
            // Rufe die processLogQueue-Methode regelmäßig auf
            this.intervalId = setInterval(function () { return _this.processLogQueue(); }, 500);
        };
        localStorLogWriter.prototype.stopProcessing = function () {
            // Lösche den Interval
            clearInterval(this.intervalId);
        };
        return localStorLogWriter;
    }());
    return localStorLogWriter;
});
//# sourceMappingURL=localStorLogWriter.js.map