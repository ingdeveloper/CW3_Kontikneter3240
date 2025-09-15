define(["require", "exports", "./operationDiarySource"], function (require, exports, OperationDiarySource) {
    "use strict";
    var OperationDiaryService = /** @class */ (function () {
        function OperationDiaryService() {
        }
        OperationDiaryService.getWFEvents = function (filter) {
            return new OperationDiarySource(filter);
        };
        return OperationDiaryService;
    }());
    return OperationDiaryService;
});
//# sourceMappingURL=operationDiaryService.js.map