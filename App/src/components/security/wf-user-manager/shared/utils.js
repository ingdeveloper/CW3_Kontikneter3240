define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Utils = void 0;
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.isNullOrUndefined = function (value) {
            return value === undefined || value === null;
        };
        Utils.isNullUndefOrEmpty = function (value) {
            return value === undefined || value === null || value.toString().trim() === '';
        };
        Utils.filterArray = function (arrayData, property, value) {
            return arrayData.filter(function (item) { return Utils.getObjValue(item[property]).toString().toLowerCase().indexOf(value.toString().toLowerCase()) > -1; });
        };
        Utils.getObjValue = function (value) {
            if (ko.isObservable(value)) {
                return value();
            }
            else {
                return value;
            }
        };
        Utils.filterArrayMultiple = function (arrayData, properties, value) {
            return arrayData.filter(function (item) {
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    if (Utils.getObjValue(item[property]).toString().toLowerCase().indexOf(value.toString().toLowerCase()) > -1) {
                        return true;
                    }
                }
                return false;
            });
        };
        // sort array by field and criteria descending/ascending
        // default order is ascending
        Utils.sortArray = function (property, descending) {
            return function (a, b) {
                var a_value = Utils.getObjValue(a[property]);
                var b_value = Utils.getObjValue(b[property]);
                var value1 = !Utils.isNullOrUndefined(a_value) ? a_value.toString().toLowerCase() : a_value;
                var value2 = !Utils.isNullOrUndefined(b_value) ? b_value.toString().toLowerCase() : b_value;
                if (value1 < value2) {
                    return (descending) ? 1 : -1;
                }
                if (value1 > value2) {
                    return (descending) ? -1 : 1;
                }
                return 0;
            };
        };
        Utils.findObjInArray = function (arrayData, property, value) {
            for (var i = 0; i < arrayData.length; i++) {
                if (arrayData[i][property] === value) {
                    return arrayData[i];
                }
            }
            return null;
        };
        Utils.findIndexInArray = function (arrayData, property, value) {
            for (var i = 0; i < arrayData.length; i++) {
                if (arrayData[i][property] === value) {
                    return i;
                }
            }
            return -1;
        };
        Utils.removeObjectFromArray = function (arrayData, property, value) {
            var searchIndex = -1;
            for (var i = 0; i < arrayData.length; i++) {
                var objValue = arrayData[i][property];
                if (objValue === value) {
                    searchIndex = i;
                    break;
                }
            }
            if (searchIndex > -1) {
                arrayData.splice(searchIndex, 1);
            }
        };
        return Utils;
    }());
    exports.Utils = Utils;
});
//# sourceMappingURL=utils.js.map