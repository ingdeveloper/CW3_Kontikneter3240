define(["require", "exports"], function (require, exports) {
    "use strict";
    var SerializationService = /** @class */ (function () {
        function SerializationService() {
        }
        SerializationService.retrocycle = function (obj) {
            // ReSharper disable once TsResolvedFromInaccessibleModule
            JSON.retrocycle(obj);
            return obj;
        };
        SerializationService.decycle = function (obj) {
            // ReSharper disable once TsResolvedFromInaccessibleModule
            return JSON.decycle(obj);
        };
        SerializationService.deserialize = function (val) {
            var object = this.parseJson(val);
            object = this.retrocycle(object);
            return object;
        };
        SerializationService.serialize = function (obj) {
            return JSON.stringify(obj);
        };
        SerializationService.serializeWithIndentation = function (obj, indentation) {
            return JSON.stringify(obj, null, indentation);
        };
        SerializationService.parseJson = function (val) {
            if (JSON && JSON.parse)
                return JSON.parse(val);
            return eval("(" + val + ")");
        };
        return SerializationService;
    }());
    return SerializationService;
});
//# sourceMappingURL=serialization.js.map