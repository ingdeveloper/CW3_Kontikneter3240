define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeriesConfigurationSettingsFactory = void 0;
    var SeriesConfigurationSettingsFactory = /** @class */ (function () {
        function SeriesConfigurationSettingsFactory() {
        }
        SeriesConfigurationSettingsFactory.prototype.create = function (configuration) {
            return _.defaults(configuration, {
                initialConfiguration: null,
                configurationName: null,
                configurationNamespace: "",
                clientsideConfiguration: false
            });
        };
        return SeriesConfigurationSettingsFactory;
    }());
    exports.SeriesConfigurationSettingsFactory = SeriesConfigurationSettingsFactory;
});
//# sourceMappingURL=series-configuration-settings.factory.js.map