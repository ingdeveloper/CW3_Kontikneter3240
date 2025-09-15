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
define(["require", "exports", "../component-base.model", "../services/value-conversions.service"], function (require, exports, ComponentBaseModel, ValueConversionsService) {
    "use strict";
    var WfLogTagArcComponent = /** @class */ (function (_super) {
        __extends(WfLogTagArcComponent, _super);
        function WfLogTagArcComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.currentSignalValue = ko.observable();
            _this.initializeObservable();
            _this.connector.getOnlineUpdates();
            _this.getLogId();
            return _this;
        }
        WfLogTagArcComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
            this.logTagName = (ko.unwrap(this.settings.logTagName) || '').stringPlaceholderResolver(this.objectID);
            this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";
            this.width = ko.unwrap(this.settings.width) !== undefined ? ko.unwrap(this.settings.width) : 200;
            this.height = ko.unwrap(this.settings.height) !== undefined ? ko.unwrap(this.settings.height) : 200;
            this.paddings = ko.unwrap(this.settings.paddings) ? ko.unwrap(this.settings.paddings) : { top: 10, right: 10, bottom: 10, left: 10 };
            this.innerRadius = ko.unwrap(this.settings.innerRadius) ? ko.unwrap(this.settings.innerRadius) : 0.7;
            this.marginBottom = ko.unwrap(this.settings.marginBottom) !== undefined ? ko.unwrap(this.settings.marginBottom) : (this.height * 0.25);
            this.strokeWidth = ko.unwrap(this.settings.strokeWidth) !== undefined ? ko.unwrap(this.settings.strokeWidth) : 1;
            this.valueConversionsService = new ValueConversionsService();
            this.r2d = Math.PI / 180;
            this.majorTicks = ko.unwrap(this.settings.majorTicks) !== undefined ? ko.unwrap(this.settings.majorTicks) : 10;
            this.showTickLines = ko.unwrap(this.settings.showTickLines) !== undefined ? ko.unwrap(this.settings.showTickLines) : true;
            this.showTickLabels = ko.unwrap(this.settings.showTickLabels) !== undefined ? ko.unwrap(this.settings.showTickLabels) : false;
            this.hideFirstTickLabel = ko.unwrap(this.settings.hideFirstTickLabel) !== undefined ? ko.unwrap(this.settings.hideFirstTickLabel) : false;
            this.hideLastTickLabel = ko.unwrap(this.settings.hideLastTickLabel) !== undefined ? ko.unwrap(this.settings.hideLastTickLabel) : false;
            this.labelFormat = ko.unwrap(this.settings.labelFormat) || d3.format('g');
            this.minRange = ko.unwrap(this.settings.minRange) !== undefined ? ko.unwrap(this.settings.minRange) : 0;
            this.maxRange = ko.unwrap(this.settings.maxRange) !== undefined ? ko.unwrap(this.settings.maxRange) : 100;
            this.startAngle = ko.unwrap(this.settings.startAngle) !== undefined ? ko.unwrap(this.settings.startAngle) : -120;
            this.endAngle = ko.unwrap(this.settings.endAngle) !== undefined ? ko.unwrap(this.settings.endAngle) : 120;
            this.showValueLabel = ko.unwrap(this.settings.showValueLabel) !== undefined ? ko.unwrap(this.settings.showValueLabel) : true;
            this.showSignalUnit = ko.unwrap(this.settings.showSignalUnit) !== undefined ? ko.unwrap(this.settings.showSignalUnit) : true;
            this.backgroundColor = ko.unwrap(this.settings.backgroundColor) ? ko.unwrap(this.settings.backgroundColor) : "#CCCCCC";
            this.foregroundColor = ko.unwrap(this.settings.foregroundColor) ? ko.unwrap(this.settings.foregroundColor) : "#880000";
            this.foregroundStrokeColor = ko.unwrap(this.settings.foregroundStrokeColor) ? ko.unwrap(this.settings.foregroundStrokeColor) : "#FFFFFF";
            this.backgroundStrokeColor = ko.unwrap(this.settings.backgroundStrokeColor) ? ko.unwrap(this.settings.backgroundStrokeColor) : "#FFFFFF";
            this.iconClass = ko.unwrap(this.settings.iconClass) != null ? ko.unwrap(this.settings.iconClass) : 'wf wf-speed-gauge wf-2x';
            this.iconColor = ko.unwrap(this.settings.iconColor) ? ko.unwrap(this.settings.iconColor) : this.foregroundColor;
            this.iconStyle = ko.unwrap(this.settings.iconStyle) || "";
            this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "days"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
            this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) !== undefined ? ko.unwrap(this.settings.startOffsetIntervall) : 1;
            this.fromDate = ko.observable(moment().startOf('minute').subtract(this.startOffsetIntervall, this.startOffset).toDate());
            this.toDate = ko.observable(moment());
            this.valueType = ko.unwrap(this.settings.valueType) !== undefined ? ko.unwrap(this.settings.valueType) : "Max"; //calues: Max, Min, Avg
        };
        WfLogTagArcComponent.prototype.initializeObservable = function () {
            var _this = this;
            this.maxRangeSignalName = ko.unwrap(this.settings.maxRangeSignalName) ? ko.unwrap(this.settings.maxRangeSignalName) : null;
            if (this.maxRangeSignalName)
                this.maxRangeSignal = this.connector.getSignal(this.maxRangeSignalName);
            this.minRangeSignalName = ko.unwrap(this.settings.minRangeSignalName) ? ko.unwrap(this.settings.minRangeSignalName) : null;
            if (this.minRangeSignalName)
                this.minRangeSignal = this.connector.getSignal(this.minRangeSignalName);
            this.maxRangeValue = ko.computed(function () {
                return _this.maxRangeSignal ? _.isNumber(_this.maxRangeSignal.value()) ? _this.maxRangeSignal.value() : _this.maxRange : _this.maxRange;
            }, this);
            this.minRangeValue = ko.computed(function () {
                return _this.minRangeSignal ? _.isNumber(_this.minRangeSignal.value()) ? _this.minRangeSignal.value() : _this.minRange : _this.minRange;
            }, this);
            // The formated value will be used for value display
            this.formattedSignalValue = this.currentSignalValue.extend({ numeralNumber: this.format });
            this.currentAngle = ko.computed(function () {
                var value = _this.currentSignalValue();
                // Prevent the angle to be out of the predefined range
                if (value > _this.maxRangeValue()) {
                    return _this.endAngle;
                }
                if (value < _this.minRangeValue()) {
                    return _this.startAngle;
                }
                // Otherwise calculate and return the angle
                var degree = _this.valueConversionsService.linearScale(_this.currentSignalValue(), _this.minRangeValue(), _this.maxRangeValue(), _this.startAngle, _this.endAngle);
                return degree;
            }, this);
        };
        WfLogTagArcComponent.prototype.getLogId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var definition, logs, log, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            if (!this.logTagName)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.connector.getSignalDefinition(this.signalName)];
                        case 1:
                            definition = _a.sent();
                            if (!definition)
                                return [2 /*return*/];
                            logs = definition.Logs;
                            log = _.findWhere(logs, { LogTag: this.logTagName, Active: true });
                            if (!log)
                                return [2 /*return*/];
                            this.logId = log.ID;
                            this.getData();
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.connector.handleError(WfLogTagArcComponent)(error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfLogTagArcComponent.prototype.getData = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filter, logValues, logValue, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = {
                                LogIDs: [this.logId],
                                StartDate: moment(this.fromDate()).toMSDateTimeOffset(),
                                EndDate: moment(this.toDate()).toMSDateTimeOffset()
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.connector.getLogStatistics(filter)];
                        case 2:
                            logValues = _a.sent();
                            if (!logValues || logValues.length === 0)
                                return [2 /*return*/];
                            logValue = logValues[0];
                            switch (this.valueType) {
                                case "Max":
                                    if (logValue.Maximum) {
                                        this.currentSignalValue(logValue.Maximum.Value.EditedValue ? logValue.Maximum.Value.EditedValue : logValue.Maximum.Value.Value);
                                        break;
                                    }
                                case "Min":
                                    if (logValue.Minimum) {
                                        this.currentSignalValue(logValue.Minimum.Value.EditedValue ? logValue.Minimum.Value.EditedValue : logValue.Minimum.Value.Value);
                                        break;
                                    }
                                case "Avg":
                                    if (logValue.Average) {
                                        this.currentSignalValue(logValue.Average.Value.EditedValue ? logValue.Average.Value.EditedValue : logValue.Average.Value.Value);
                                        break;
                                    }
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            this.connector.handleError(WfLogTagArcComponent)(error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         *  Place here signal cleanup functionality.
         *
         * @protected
         * @returns
         *
         * @memberOf WfInputComponent
         */
        WfLogTagArcComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.visualSecurityService)
                        this.visualSecurityService.dispose();
                    if (this.maxRangeSignal)
                        this.connector.unregisterSignals(this.maxRangeSignal);
                    if (this.minRangeSignal)
                        this.connector.unregisterSignals(this.minRangeSignal);
                    return [2 /*return*/];
                });
            });
        };
        return WfLogTagArcComponent;
    }(ComponentBaseModel));
    return WfLogTagArcComponent;
});
//# sourceMappingURL=wf-logtag-arc.component.js.map