var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
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
define(["require", "exports", "../../../services/connector", "../../component-base.model", "./models/signal-alarm-list-fields.model"], function (require, exports, Connector, ComponentBaseModel, signal_alarm_list_fields_model_1) {
    "use strict";
    var WfSignalAlarmListConfigurationDialogComponent = /** @class */ (function (_super) {
        __extends(WfSignalAlarmListConfigurationDialogComponent, _super);
        function WfSignalAlarmListConfigurationDialogComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.dialog = ko.observable(false);
            _this.connector = new Connector();
            _this.maxSignalCount = ko.observable();
            _this.columnsOrder = ko.observableArray([]);
            _this.defaultColumnNames = ko.observableArray([
                { name: signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AliasName, checked: ko.observable(false) },
                { name: signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.Description, checked: ko.observable(false) },
                { name: signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.Value, checked: ko.observable(false) },
                { name: signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.Unit, checked: ko.observable(false) },
                { name: signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AlarmStatus, checked: ko.observable(false) },
                { name: signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AlarmProcessingAndDisplayStatus, checked: ko.observable(false) }
            ]);
            _this.dragItem = null;
            return _this;
        }
        WfSignalAlarmListConfigurationDialogComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
            this.onSettingsApplied = this.settings.onSettingsApplied || (function (columnsOrder, maxSignals) { });
            this.getColumnName = this.settings.getColumnName || (function (name) { return name; });
            this.isModalDialogsDraggable = this.settings.isModalDialogsDraggable !== undefined ? this.settings.isModalDialogsDraggable : true;
        };
        WfSignalAlarmListConfigurationDialogComponent.prototype.onClose = function () {
            this.dialog(false);
        };
        WfSignalAlarmListConfigurationDialogComponent.prototype.onDialog = function () {
            this.onSettingsApplied(this.columnsOrder(), this.maxSignalCount());
            this.onClose();
        };
        WfSignalAlarmListConfigurationDialogComponent.prototype.onOpen = function () {
            var e_1, _a;
            this.dialog(true);
            var columnsOrder = ko.unwrap(this.settings.columnsOrder);
            this.columnsOrder(__spread(columnsOrder) || []);
            try {
                for (var _b = __values(this.defaultColumnNames()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var iterator = _c.value;
                    iterator.checked(_.contains(this.columnsOrder(), iterator.name));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.maxSignalCount(ko.unwrap(this.settings.maxSignalCount) || 100);
        };
        WfSignalAlarmListConfigurationDialogComponent.prototype.onChecked = function (data, event) {
            if (event.target.checked) {
                this.columnsOrder.push(data.name);
            }
            else {
                this.columnsOrder.remove(data.name);
            }
            return true;
        };
        WfSignalAlarmListConfigurationDialogComponent.prototype.dragenter = function (item, event) {
            event.originalEvent.dataTransfer.dropEffect = "move";
        };
        WfSignalAlarmListConfigurationDialogComponent.prototype.dragstart = function (item, event) {
            this.dragItem = item;
            $(event.target).addClass("active");
            event.originalEvent.dataTransfer.effectAllowed = "move";
            var img = new Image();
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
            event.originalEvent.dataTransfer.setDragImage(img, 0, 0);
            return true;
        };
        WfSignalAlarmListConfigurationDialogComponent.prototype.dragend = function (item, event) {
            this.dragItem = null;
            $(event.target).removeClass("active");
            return true;
        };
        WfSignalAlarmListConfigurationDialogComponent.prototype.dragover = function (item, event) {
            var _this = this;
            event.preventDefault();
            event.originalEvent.dataTransfer.dropEffect = "move";
            if (item === null) {
                return;
            }
            if (this.dragItem) {
                var currentIndex = this.columnsOrder().indexOf(item);
                var currentIndexDragItem = this.columnsOrder().indexOf(this.dragItem);
                currentIndex = currentIndex > currentIndexDragItem ? currentIndex + 1 : currentIndex - 1;
                var newOrder = this.columnsOrder().map(function (x, i) {
                    if (_this.dragItem == x)
                        return { index: currentIndex, value: x };
                    return { index: i, value: x };
                });
                this.columnsOrder(newOrder.sort(function (a, b) { return a.index - b.index; }).map(function (x) { return x.value; }));
            }
        };
        WfSignalAlarmListConfigurationDialogComponent.prototype.drop = function (item, event) {
            var _this = this;
            event.preventDefault();
            if (this.dragItem) {
                var currentIndex = this.columnsOrder().indexOf(item);
                var currentIndexDragItem = this.columnsOrder().indexOf(this.dragItem);
                currentIndex = currentIndex > currentIndexDragItem ? currentIndex + 1 : currentIndex - 1;
                var newOrder = this.columnsOrder().map(function (x, i) {
                    if (_this.dragItem == x)
                        return { index: currentIndex, value: x };
                    return { index: i, value: x };
                });
                this.columnsOrder(newOrder.sort(function (a, b) { return a.index - b.index; }).map(function (x) { return x.value; }));
            }
        };
        WfSignalAlarmListConfigurationDialogComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var dialog;
                return __generator(this, function (_a) {
                    dialog = $(document).find('#modal-dialog-' + ko.unwrap(this.id));
                    dialog.remove();
                    return [2 /*return*/];
                });
            });
        };
        return WfSignalAlarmListConfigurationDialogComponent;
    }(ComponentBaseModel));
    return WfSignalAlarmListConfigurationDialogComponent;
});
//# sourceMappingURL=wf-signal-alarm-list-configuration-dialog.component.js.map