define(["require", "exports"], function (require, exports) {
    "use strict";
    var UniqueIdGenerator = /** @class */ (function () {
        function UniqueIdGenerator() {
        }
        UniqueIdGenerator.ids = [];
        UniqueIdGenerator.generateId = function (namespace) {
            UniqueIdGenerator.ids[namespace] = (UniqueIdGenerator.ids[namespace] || 0) + 1;
            return namespace + UniqueIdGenerator.ids[namespace];
        };
        return UniqueIdGenerator;
    }());
    return UniqueIdGenerator;
});
//# sourceMappingURL=uniqueIdGenerator.js.map