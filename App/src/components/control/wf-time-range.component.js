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
define(["require", "exports", "../component-base.model", "../services/time-range.service"], function (require, exports, ComponentBaseModel, time_range_service_1) {
    "use strict";
    var WfTimeRangeComponent = /** @class */ (function (_super) {
        __extends(WfTimeRangeComponent, _super);
        function WfTimeRangeComponent(params) {
            return _super.call(this, params) || this;
        }
        WfTimeRangeComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            this.hideTimeRangeSelector = this.settings.hideTimeRangeSelector ? this.settings.hideTimeRangeSelector : false;
            this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours" "days", "weeks", "months", "years"
            this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 15;
            this.endOffset = ko.unwrap(this.settings.endOffset) ? ko.unwrap(this.settings.endOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
            this.endOffsetIntervall = ko.unwrap(this.settings.endOffsetIntervall) ? ko.unwrap(this.settings.endOffsetIntervall) : 0;
            this.startDateInput = this.settings.startDateInput ? this.settings.startDateInput : ko.observable();
            this.endDateInput = this.settings.endDateInput ? this.settings.endDateInput : ko.observable();
            this.timeRangeDateInput = this.settings.timeRangeDateInput ? this.settings.timeRangeDateInput : ko.observable();
            this.selectedRangeInput = this.settings.selectedRangeInput ? this.settings.selectedRangeInput : ko.observable();
            this.selectedRange = ko.observable(CalendarTimeRanges.Custom);
            this.ranges = [];
            this.initRanges();
            this.setTimeRangeDateInput();
            this.timeRangeChanged();
            this.timeRangeLabel = ko.computed(function () {
                var range = _.findWhere(_this.ranges, { id: _this.selectedRangeInput() });
                return range !== undefined ? range.text : "";
            }, this);
            this.showTimerangeCalendar = ko.computed(function () {
                return _.contains([CalendarTimeRanges.Year, CalendarTimeRanges.Month, CalendarTimeRanges.Week, CalendarTimeRanges.Day], _this.selectedRangeInput());
            }, this);
            this.shouldDisableRangeChange = ko.pureComputed(function () {
                return ko.unwrap(_this.hideTimeRangeSelector) || _this.selectedRangeInput() !== CalendarTimeRanges.Custom;
            }, this);
            this.showDateTimeSelectors = ko.computed(function () {
                return _.contains([CalendarTimeRanges.Custom], _this.selectedRangeInput());
            }, this);
            this.timeRangeCalendarView = ko.computed(function () {
                if (_this.selectedRangeInput() === CalendarTimeRanges.Year)
                    return 'years';
                if (_this.selectedRangeInput() === CalendarTimeRanges.Month)
                    return 'months';
                return "days";
            }, this);
            this.timeRangeCalendarFormat = ko.computed(function () {
                if (_this.selectedRangeInput() === CalendarTimeRanges.Year)
                    return 'YYYY';
                if (_this.selectedRangeInput() === CalendarTimeRanges.Month)
                    return 'MMMM YYYY';
                return "DD.MM.YYYY";
            }, this);
            this.timeRangeDateInput.subscribe(this.timeRangeChanged, this);
            this.timeRangeCalendarWeeks = ko.computed(function () {
                return _this.selectedRangeInput() === CalendarTimeRanges.Week;
            }, this);
        };
        WfTimeRangeComponent.prototype.timeRangeChanged = function () {
            this.startDateInput(time_range_service_1.TimeRangeService.getRangeStartDate(this.selectedRangeInput(), this.timeRangeDateInput() || new Date(), this.startDateInput(), this.startOffsetIntervall, this.startOffset));
            this.endDateInput(time_range_service_1.TimeRangeService.getRangeEndDate(this.selectedRangeInput(), this.timeRangeDateInput() || new Date(), this.endDateInput(), this.endOffsetIntervall, this.endOffset));
        };
        WfTimeRangeComponent.prototype.setTimeRangeDateInput = function () {
            this.timeRangeDateInput(time_range_service_1.TimeRangeService.getRangeStartDate(this.selectedRangeInput(), this.timeRangeDateInput() || new Date(), this.startDateInput(), this.startOffsetIntervall, this.startOffset));
        };
        WfTimeRangeComponent.prototype.initRanges = function () {
            this.ranges.push({ id: CalendarTimeRanges.Custom, text: this.connector.translate("I4SCADA_Custom_Range") });
            this.ranges.push({ id: CalendarTimeRanges.Year, text: this.connector.translate("I4SCADA_Year") });
            this.ranges.push({ id: CalendarTimeRanges.Month, text: this.connector.translate("I4SCADA_Month") });
            this.ranges.push({ id: CalendarTimeRanges.Week, text: this.connector.translate("I4SCADA_Week") });
            this.ranges.push({ id: CalendarTimeRanges.Day, text: this.connector.translate("I4SCADA_Day") });
            this.ranges.push({ id: CalendarTimeRanges.Actual, text: this.connector.translate("I4SCADA_Current") });
            this.ranges.push({ id: CalendarTimeRanges.Yesterday, text: this.connector.translate("I4SCADA_Yesterday") });
            this.ranges.push({ id: CalendarTimeRanges.Today, text: this.connector.translate("I4SCADA_Current_Day") });
        };
        WfTimeRangeComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfTimeRangeComponent;
    }(ComponentBaseModel));
    return WfTimeRangeComponent;
});
//# sourceMappingURL=wf-time-range.component.js.map