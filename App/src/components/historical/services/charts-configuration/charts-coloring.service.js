define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartsColoringService = void 0;
    var ChartsColoringService = /** @class */ (function () {
        function ChartsColoringService() {
        }
        ChartsColoringService.GetColor = function (name, secondary) {
            if (name === void 0) { name = uuid.v4(); }
            if (secondary === void 0) { secondary = ""; }
            var hash = ChartsColoringService.hashEntry(name, secondary);
            var index = hash % ChartsColoringService.DefaultSheme.length;
            return ChartsColoringService.DefaultSheme[index];
        };
        ChartsColoringService.hashEntry = function (name, secondary) {
            if (name === void 0) { name = uuid.v4(); }
            if (secondary === void 0) { secondary = ""; }
            var entryString = name.toString() + "|" + secondary.toString();
            var hash = 0;
            for (var i = 0; i < entryString.length; i++) {
                var charCode = entryString.charCodeAt(i);
                hash += charCode;
            }
            return hash;
        };
        ChartsColoringService.DefaultSheme = ["#fdb36b", "#f4744c", "#d9342b", "#a00025", "#780000", "#c6e9f2", "#7ec5e0", "#5298c6", "#3d689f", "#2c3188", "#daef8d", "#a5d967", "#61ba5e", "#188848", "#006436"];
        return ChartsColoringService;
    }());
    exports.ChartsColoringService = ChartsColoringService;
});
//# sourceMappingURL=charts-coloring.service.js.map