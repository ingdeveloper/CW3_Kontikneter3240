define(["require", "exports", "../../../services/connector"], function (require, exports, Connector) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Cursor = void 0;
    var Cursor = /** @class */ (function () {
        function Cursor(lines, item) {
            var _this = this;
            if (item === void 0) { item = {}; }
            this.lines = lines;
            this.connector = new Connector();
            this.name = ko.observable(null)
                .extend({
                required: true,
                validation: [
                    {
                        validator: function (value) { return _this.isUnique(value); },
                        message: this.connector.translate("I4SCADA_is_not_unique")()
                    }
                ]
            });
            this.timestamp = ko.observable(null);
            this.offsetInterval = ko.observable(null);
            this.offset = ko.observable("minutes");
            var name = "cursor_" + Math.random().toString(36).substr(2, 3);
            this.name(item.name == undefined ? name : item.name);
            this.timestamp(item.timestamp == undefined ? null : moment(item.timestamp).toDate());
            this.offsetInterval(item.offsetInterval == undefined ? null : item.offsetInterval.toString());
            this.offset(item.offset == undefined ? "minutes" : item.offset);
            this.timestamp.extend({ required: { onlyIf: function () { return _this.offsetInterval() == null; } } });
            this.offsetInterval.extend({ required: { onlyIf: function () { return _this.timestamp() == null; } } });
            this.offset.extend({ required: { onlyIf: function () { return _this.timestamp() == null; } } });
        }
        Cursor.prototype.isUnique = function (value) {
            var axisItem = this;
            var item = _.find(this.lines.peek(), function (x) {
                if (axisItem !== x) {
                    return x.name.peek() === value;
                }
                return false;
            });
            return !item;
        };
        Object.defineProperty(Cursor.prototype, "configuration", {
            get: function () {
                return {
                    name: this.name(),
                    timestamp: this.timestamp() == undefined ? null : moment(this.timestamp()).toDate(),
                    offsetInterval: parseInt(this.offsetInterval()),
                    offset: this.offset(),
                };
            },
            enumerable: false,
            configurable: true
        });
        Cursor.prototype.notifySubscribers = function () {
            this.name.notifySubscribers();
        };
        return Cursor;
    }());
    exports.Cursor = Cursor;
});
//# sourceMappingURL=cursor.model.js.map