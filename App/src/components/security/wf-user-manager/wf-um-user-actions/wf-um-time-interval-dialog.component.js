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
define(["require", "exports", "../../../component-base.model", "../../../../decorators/busyIndicator", "../shared/wf-um-events-filter-obs-model"], function (require, exports, ComponentBaseModel, BusyIndicator, EventsFilterObs) {
    "use strict";
    var WfUMTimeIntervalDialogComponent = /** @class */ (function (_super) {
        __extends(WfUMTimeIntervalDialogComponent, _super);
        function WfUMTimeIntervalDialogComponent(params) {
            return _super.call(this, params) || this;
        }
        WfUMTimeIntervalDialogComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.busyContext = new BusyIndicator(this);
            this.customSubscriptions = [];
            this.showModal = ko.observable(false);
            // input settings
            this.showModalFromOutside = this.settings.showModalFromOutside;
            this.confirmCallBackMethod = this.settings.confirmCallBackMethod;
            this.userActionFilter = new EventsFilterObs();
            // date range
            this.startDateInput = ko.observable(null);
            this.endDateInput = ko.observable(null);
            // methods
            this.initializeComputeds();
        };
        WfUMTimeIntervalDialogComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.showModalFromOutside.extend({ notify: 'always' });
            var showModalSubscription = this.showModalFromOutside.subscribe(function (newValue) {
                if (newValue) {
                    _this.showModal(true);
                    _this.initializeData();
                }
                else {
                    _this.showModal(false);
                }
            });
            this.customSubscriptions.push(showModalSubscription);
        };
        WfUMTimeIntervalDialogComponent.prototype.initializeData = function () {
            this.userActionFilter.fromDto(this.settings.userActionFilter.toDto()); //copies the elements from the settings
            this.startDateInput(moment(this.userActionFilter.Time().Start()));
            this.endDateInput(moment(this.userActionFilter.Time().End()));
        };
        WfUMTimeIntervalDialogComponent.prototype.onSaveClick = function () {
            this.settings.userActionFilter.fromDto(this.userActionFilter.toDto());
            this.settings.userActionFilter.Time().Start(moment(this.startDateInput()).toMSDate());
            this.settings.userActionFilter.Time().End(moment(this.endDateInput()).toMSDate());
            this.confirmCallBackMethod();
            this.close();
        };
        WfUMTimeIntervalDialogComponent.prototype.close = function () {
            this.showModalFromOutside(false);
        };
        WfUMTimeIntervalDialogComponent.prototype.clearCustomSubscriptions = function () {
            for (var i = 0; i < this.customSubscriptions.length; i++) {
                this.customSubscriptions[i].dispose();
            }
        };
        WfUMTimeIntervalDialogComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.clearCustomSubscriptions();
                            return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfUMTimeIntervalDialogComponent;
    }(ComponentBaseModel));
    return WfUMTimeIntervalDialogComponent;
});
//# sourceMappingURL=wf-um-time-interval-dialog.component.js.map