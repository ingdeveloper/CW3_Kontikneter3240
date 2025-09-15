var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    // #Quelle - https://stackoverflow.com/questions/18395976/how-to-display-a-json-array-in-table-format
    var TabBuilder = /** @class */ (function () {
        function TabBuilder() {
            this.data = [];
        }
        TabBuilder.prototype.headData = function () {
            var e_1, _a;
            try {
                for (var _b = __values(this.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var row = _c.value;
                    // nur erste Zeile abarbeiten als Head
                    if (this.headArr.length !== 0) {
                        break;
                    }
                    // #Head-Daten füllen
                    for (var key in row) {
                        if (row.hasOwnProperty(key)) {
                            this.headArr.push(key);
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return this.headArr;
        };
        TabBuilder.prototype.getHeadData = function (data) {
            var len = data.length;
            if (!len || len < 1) {
                return [];
            }
            this.headArr = [];
            this.data = data;
            return this.headData();
        };
        TabBuilder.prototype.bodyData = function () {
            var e_2, _a;
            try {
                // alle Elemente durchlaufen
                for (var _b = __values(this.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var row = _c.value;
                    // const row: any = this.data[i];
                    // #Body-Daten füllen
                    var rows = [];
                    for (var key in row) {
                        if (row.hasOwnProperty(key)) {
                            rows.push(row[key]);
                        }
                    }
                    // verhindern das NULL Zeilen eingefügt werden.
                    !rows.every(function (element) { return element === null; }) && this.bodyArr.push(rows);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return this.bodyArr;
        };
        TabBuilder.prototype.getBodyData = function (data) {
            var len = data.length;
            if (!len || len < 1) {
                return [];
            }
            this.bodyArr = [];
            this.data = data;
            return this.bodyData();
        };
        return TabBuilder;
    }());
    return TabBuilder;
});
//# sourceMappingURL=tabBuilder.js.map