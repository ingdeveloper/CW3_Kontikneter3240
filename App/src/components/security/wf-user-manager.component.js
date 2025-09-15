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
define(["require", "exports", "../component-base.model", "../../services/usersService", "../../services/connectorEnums", "./wf-user-manager/shared/wf-um-enyms", "./wf-user-manager/shared/utils", "./wf-user-manager/shared/wf-um-events-filter-obs-model", "../services/time-range.service"], function (require, exports, ComponentBaseModel, UsersService, connectorEnums_1, wf_um_enyms_1, utils_1, EventsFilterObs, time_range_service_1) {
    "use strict";
    var WfUserManagerComponent = /** @class */ (function (_super) {
        __extends(WfUserManagerComponent, _super);
        function WfUserManagerComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.Pages = wf_um_enyms_1.Pages;
            // main drop down
            _this.dropDownItems = [
                { value: wf_um_enyms_1.Pages.Users, text: '' },
                { value: wf_um_enyms_1.Pages.AuthorizationGroups, text: '' },
                { value: wf_um_enyms_1.Pages.ProjectAuthorizations, text: '' },
                { value: wf_um_enyms_1.Pages.AccessGroups, text: '' },
                { value: wf_um_enyms_1.Pages.AccessAuthorizations, text: '' },
                { value: wf_um_enyms_1.Pages.UserActions, text: '' }
            ];
            _this.dropDownSelectedItem = ko.observable(_this.dropDownItems[0]);
            _this.setLocalizations();
            return _this;
        }
        WfUserManagerComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.controlType = connectorEnums_1.ConfigControlType.UserManager;
            // user action auto refresh btn
            this.autoUpdate = this.settings.autoUpdate ? this.settings.autoUpdate : false;
            this.updateRate = (this.settings.updateRate && this.settings.updateRate >= 1000) ? this.settings.updateRate : 2000;
            this.startOffset = ko.unwrap(this.settings.startOffset) ? ko.unwrap(this.settings.startOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
            this.startOffsetIntervall = ko.unwrap(this.settings.startOffsetIntervall) ? ko.unwrap(this.settings.startOffsetIntervall) : 30;
            this.endOffset = ko.unwrap(this.settings.endOffset) ? ko.unwrap(this.settings.endOffset).trim().toLowerCase() : "minutes"; //"seconds", "minutes", "hours", "days", "weeks", "months", "years"
            this.endOffsetIntervall = ko.unwrap(this.settings.endOffsetIntervall) ? ko.unwrap(this.settings.endOffsetIntervall) : 0;
            // users dialogs
            this.showDefaultSettingsDialog = ko.observable(false);
            this.showPasswordPolicyDialog = ko.observable(false);
            // action dialogs
            this.showTimeIntervalDialog = ko.observable(false);
            this.showfilterDialog = ko.observable(false);
            this.activeUserActionConfigName = ko.observable(null);
            this.userActionFilter = new EventsFilterObs();
            this.refreshPageTrigger = ko.observable(null);
            this.setDefaultUserActionFilter();
            this.addCustomExtenders();
        };
        WfUserManagerComponent.prototype.addCustomExtenders = function () {
            ko.extenders['required'] = function (target) {
                //add some sub-observables to our observable
                target.isFieldEmpty = ko.observable(true);
                //define a function to do validation
                function validate(newValue) {
                    if (utils_1.Utils.isNullUndefOrEmpty(newValue)) {
                        target.isFieldEmpty(true);
                    }
                    else {
                        target.isFieldEmpty(false);
                    }
                }
                //initial validation
                validate(target());
                //validate whenever the value changes
                target.subscribe(validate);
                //return the original observable
                return target;
            };
        };
        WfUserManagerComponent.prototype.setDefaultUserActionFilter = function () {
            return __awaiter(this, void 0, void 0, function () {
                var defaultTimeRange, filter;
                return __generator(this, function (_a) {
                    defaultTimeRange = time_range_service_1.TimeRangeService.getRangeDates(CalendarTimeRanges.Today, new Date(), new Date(), new Date(), this.startOffsetIntervall, this.startOffset, this.endOffsetIntervall, this.endOffset);
                    filter = {
                        ShouldFilterByUsers: true,
                        Users: [],
                        Time: {
                            Start: moment(defaultTimeRange.startDate).toMSDate(),
                            End: moment(defaultTimeRange.endDate).toMSDate()
                        },
                        MaximumCount: 20,
                        EventTypes: [
                            WFEventType.UserCreated,
                            WFEventType.UserDeleted,
                            WFEventType.UserLoggedIn,
                            WFEventType.UserLoggedOut,
                            WFEventType.UserModified,
                            WFEventType.UserPasswordChanged,
                            WFEventType.UserWroteSignal
                        ],
                        AutoUpdate: this.autoUpdate,
                        SelectedRangeInput: CalendarTimeRanges.Today,
                        TimeRangeDateInput: new Date(),
                        EndOffset: this.endOffset,
                        EndOffsetIntervall: this.endOffsetIntervall,
                        StartOffset: this.startOffset,
                        StartOffsetIntervall: this.startOffsetIntervall
                    };
                    this.userActionFilter.fromDto(filter);
                    return [2 /*return*/];
                });
            });
        };
        WfUserManagerComponent.prototype.getAllUsers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, UsersService.getAllUsers()];
                        case 1:
                            response = _a.sent();
                            if (!isNullOrUndefined(response)) {
                                return [2 /*return*/, response.map(function (item) {
                                        return {
                                            ID: item.ID,
                                            Name: item.Name
                                        };
                                    })];
                            }
                            else {
                                return [2 /*return*/, []];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfUserManagerComponent.prototype.getConfig = function () {
            return this.userActionFilter.toDto();
        };
        WfUserManagerComponent.prototype.loadConfig = function (content, config) {
            this.userActionFilter.fromDto(content);
            this.activeUserActionConfigName(config.Name);
        };
        WfUserManagerComponent.prototype.setLocalizations = function () {
            this.dropDownItems[0].text = this.connector.translate('I4SCADA_UM_Users');
            this.dropDownItems[1].text = this.connector.translate('I4SCADA_UM_AuthorizationGroups');
            this.dropDownItems[2].text = this.connector.translate('I4SCADA_UM_ProjectAuthorizations');
            this.dropDownItems[3].text = this.connector.translate('I4SCADA_UM_AccessGroups');
            this.dropDownItems[4].text = this.connector.translate('I4SCADA_UM_AccessAuthorizations');
            this.dropDownItems[5].text = this.connector.translate('I4SCADA_UM_UserActions');
        };
        WfUserManagerComponent.prototype.onClickSelectItem = function (item) {
            this.dropDownSelectedItem(item);
        };
        WfUserManagerComponent.prototype.onClickRefreshPage = function () {
            this.refreshPageTrigger(this.dropDownSelectedItem().value);
        };
        // users dialogs
        WfUserManagerComponent.prototype.onDefaultSettingsClick = function () {
            this.showDefaultSettingsDialog(true);
        };
        WfUserManagerComponent.prototype.onPasswordPolicyClick = function () {
            this.showPasswordPolicyDialog(true);
        };
        // action dialogs
        WfUserManagerComponent.prototype.onTimeIntervalClick = function () {
            this.showTimeIntervalDialog(true);
        };
        WfUserManagerComponent.prototype.onClickAutoRefresh = function () {
            this.userActionFilter.AutoUpdate(!this.userActionFilter.AutoUpdate());
        };
        WfUserManagerComponent.prototype.onFilterClick = function () {
            this.showfilterDialog(true);
        };
        WfUserManagerComponent.prototype.dispose = function () {
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
        return WfUserManagerComponent;
    }(ComponentBaseModel));
    return WfUserManagerComponent;
});
//# sourceMappingURL=wf-user-manager.component.js.map