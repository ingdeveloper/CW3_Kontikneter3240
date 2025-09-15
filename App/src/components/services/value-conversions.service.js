define(["require", "exports"], function (require, exports) {
    "use strict";
    var ValueConversionsService = /** @class */ (function () {
        function ValueConversionsService() {
        }
        ValueConversionsService.prototype.linearScale = function (x, xMin, xMax, yMin, yMax) {
            //(y - y1) / (x - x1) = (y2 - y1) / (x2-x1)
            x = x * 1;
            xMin = xMin * 1;
            xMax = xMax * 1;
            yMin = yMin * 1;
            yMax = yMax * 1;
            var y = (((yMax - yMin) * (x - xMin)) / (xMax - xMin)) + yMin;
            return y;
        };
        return ValueConversionsService;
    }());
    return ValueConversionsService;
});
//# sourceMappingURL=value-conversions.service.js.map