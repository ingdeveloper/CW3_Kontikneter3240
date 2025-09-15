define(["require", "exports"], function (require, exports) {
    "use strict";
    var StandaloneParametersReplacementService = /** @class */ (function () {
        function StandaloneParametersReplacementService(settings) {
            this.parameters = ko.unwrap(settings.parameters) !== undefined ? ko.unwrap(settings.parameters) : null;
        }
        StandaloneParametersReplacementService.prototype.replaceConfigurationParameters = function (configuration) {
            if (this.parameters != null) {
                var keys = Object.keys(this.parameters);
                if (_.any(keys)) {
                    for (var i = 0; i < keys.length; i++) {
                        if (this.parameters[keys[i]] != null) {
                            configuration = configuration.split("[PC:" + keys[i] + "]").join(this.parameters[keys[i]]);
                        }
                    }
                }
                return configuration;
            }
            return configuration;
        };
        return StandaloneParametersReplacementService;
    }());
    return StandaloneParametersReplacementService;
});
//# sourceMappingURL=standalone-parameters-replacement.service.js.map