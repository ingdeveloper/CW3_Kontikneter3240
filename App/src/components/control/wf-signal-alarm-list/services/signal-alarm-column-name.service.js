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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalAlarmColumnNameService = void 0;
    var SignalAlarmColumnNameService = /** @class */ (function () {
        function SignalAlarmColumnNameService(params) {
            var _this = this;
            this.getSymbolicText = function (column) {
                var columnMapping = _this.columns.find(function (x) { return x.name === column; });
                if (columnMapping) {
                    return "I4SCADA_signal_alarm_list_column_" + columnMapping.text;
                }
                else {
                    return "I4SCADA_signal_alarm_list_column_" + column;
                }
            };
            var mappings = ko.unwrap(params.columns) || this.getDefaultColumnItems();
            this.columnMappings = mappings.map(this.defaultText);
            this.columns = mappings.map(this.defaultText);
        }
        SignalAlarmColumnNameService.prototype.defaultText = function (item) {
            if (!item.text) {
                item.text = item.name;
            }
            return item;
        };
        SignalAlarmColumnNameService.prototype.getDefaultColumnItem = function (item) {
            return {
                name: item,
                text: item
            };
        };
        SignalAlarmColumnNameService.prototype.onSettingsApplied = function (columnsOrder) {
            var e_1, _a;
            this.columns = [];
            var _loop_1 = function (column) {
                var columnMapping = this_1.columnMappings.find(function (x) { return x.name === column; });
                this_1.columns.push(columnMapping || this_1.getDefaultColumnItem(column));
            };
            var this_1 = this;
            try {
                for (var columnsOrder_1 = __values(columnsOrder), columnsOrder_1_1 = columnsOrder_1.next(); !columnsOrder_1_1.done; columnsOrder_1_1 = columnsOrder_1.next()) {
                    var column = columnsOrder_1_1.value;
                    _loop_1(column);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (columnsOrder_1_1 && !columnsOrder_1_1.done && (_a = columnsOrder_1.return)) _a.call(columnsOrder_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        SignalAlarmColumnNameService.prototype.loadConfig = function (columns) {
            var e_2, _a;
            this.columns = [];
            columns = columns.map(this.defaultText);
            var _loop_2 = function (column) {
                var columnMapping = this_2.columnMappings.find(function (x) { return x.name === column.name; });
                this_2.columns.push(columnMapping || column);
            };
            var this_2 = this;
            try {
                for (var columns_1 = __values(columns), columns_1_1 = columns_1.next(); !columns_1_1.done; columns_1_1 = columns_1.next()) {
                    var column = columns_1_1.value;
                    _loop_2(column);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (columns_1_1 && !columns_1_1.done && (_a = columns_1.return)) _a.call(columns_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        SignalAlarmColumnNameService.prototype.getColumnNames = function () {
            return this.columns.map(function (x) { return x.name; });
        };
        SignalAlarmColumnNameService.prototype.getDefaultColumnItems = function () {
            return ["AliasName", "Description", "Value", "Unit", "AlarmStatus", "AlarmProcessingAndDisplayStatus"].map(this.getDefaultColumnItem);
        };
        return SignalAlarmColumnNameService;
    }());
    exports.SignalAlarmColumnNameService = SignalAlarmColumnNameService;
});
//# sourceMappingURL=signal-alarm-column-name.service.js.map