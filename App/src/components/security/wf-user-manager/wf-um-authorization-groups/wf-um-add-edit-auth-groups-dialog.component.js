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
define(["require", "exports", "../../../component-base.model", "../../../../services/sessionService", "../../../../services/api", "../../../../services/alarmsService", "../../../../services/authorizationGroupService", "../../../../decorators/busyIndicator", "../../../../services/logger", "../shared/wf-um-authorization-group-obs-model", "../shared/wf-um-check-box-obs-model"], function (require, exports, ComponentBaseModel, SessionService, Api, AlarmsService, AuthorizationGroupService, BusyIndicator, Logger, AuthorizationGroupObs, CheckBoxObs) {
    "use strict";
    var WfUMAddEditAuthGroupsDialogComponent = /** @class */ (function (_super) {
        __extends(WfUMAddEditAuthGroupsDialogComponent, _super);
        function WfUMAddEditAuthGroupsDialogComponent(params) {
            var _this = _super.call(this, params) || this;
            // localizations 
            _this.projectAuthorizationsLoc = _this.connector.translate('I4SCADA_UM_ProjectAuthorizations');
            _this.systemAuthorizationsLoc = _this.connector.translate('I4SCADA_UM_SystemAuthorizations');
            _this.writeGroupsLoc = _this.connector.translate('I4SCADA_UM_WriteGroups');
            _this.alarmTypesLoc = _this.connector.translate('I4SCADA_UM_AlarmTypes');
            _this.alarmGroupsLoc = _this.connector.translate('I4SCADA_UM_AlarmGroups');
            _this.accessGroupsLoc = _this.connector.translate('I4SCADA_UM_AccessGroups');
            _this.schedulerLocationsLoc = _this.connector.translate('I4SCADA_UM_SchedulerLocations');
            return _this;
        }
        WfUMAddEditAuthGroupsDialogComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.busyContext = new BusyIndicator(this);
            this.projectAuthorizations = ko.observableArray([]);
            this.systemAuthorizations = ko.observableArray([]);
            this.writeGroups = ko.observableArray([]);
            this.alarmTypes = ko.observableArray([]);
            this.alarmGroups = ko.observableArray([]);
            this.accessGroups = ko.observableArray([]);
            this.schedulerLocations = ko.observableArray([]);
            this.authorizationGroupObs = new AuthorizationGroupObs();
            this.showModal = ko.observable(false);
            // input settings
            this.showModalFromOutside = this.settings.showModalFromOutside;
            this.actionType = this.settings.actionType;
            this.authorizationGroup = this.settings.authorizationGroup;
            this.confirmCallBackMethod = this.settings.confirmCallBackMethod;
            // methods
            this.initializeComputeds();
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.initializeComputeds = function () {
            var _this = this;
            this.showModalFromOutside.extend({ notify: 'always' });
            this.showModalFromOutside.subscribe(function (newValue) {
                if (newValue) {
                    _this.showModal(true);
                    _this.initializeData();
                }
                else {
                    _this.showModal(false);
                }
            });
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.initializeData = function () {
            // new
            if (isNullOrUndefined(this.authorizationGroup())) {
                this.authorizationGroupObs.initialize();
                // edit
            }
            else {
                this.authorizationGroupObs.fromDto(this.authorizationGroup());
            }
            this.getAllProjectAuthorization();
            this.getAllSystemAuthorization();
            this.getAllWriteGroup();
            this.getAlarmTypes();
            this.getAlarmGroups();
            this.getAllAccessGroups();
            this.getAllSchedulerLocations();
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.getAllProjectAuthorization = function () {
            var _this = this;
            this.busyContext.runLongAction('Loading project authorizations...', function () { return __awaiter(_this, void 0, void 0, function () {
                var response, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.projectAuthorizations([]); // reset array data
                            return [4 /*yield*/, Api.securityService.getAllProjectAuthorization(SessionService.getSecurityToken(), 1000)];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                response.forEach(function (item) {
                                    var checkBoxObsItem = new CheckBoxObs(item);
                                    if (_this.actionType() === 'edit' && _this.authorizationGroupObs.ProjectAuthorizationIDs().indexOf(item.ID) > -1) {
                                        checkBoxObsItem.Selected(true);
                                    }
                                    _this.projectAuthorizations.push(checkBoxObsItem);
                                });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.getAllSystemAuthorization = function () {
            var _this = this;
            this.busyContext.runLongAction('Loading system authorizations...', function () { return __awaiter(_this, void 0, void 0, function () {
                var response, error_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.systemAuthorizations([]); // reset array data 
                            return [4 /*yield*/, Api.securityService.getAllSystemAuthorization(SessionService.getSecurityToken(), 1000)];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                response.forEach(function (item) {
                                    var checkBoxObsItem = new CheckBoxObs(item);
                                    if (_this.actionType() === 'edit' && _this.authorizationGroupObs.SystemAuthorizationIDs().indexOf(item.ID) > -1) {
                                        checkBoxObsItem.Selected(true);
                                    }
                                    _this.systemAuthorizations.push(checkBoxObsItem);
                                });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.getAllWriteGroup = function () {
            var _this = this;
            this.busyContext.runLongAction('Loading write groups...', function () { return __awaiter(_this, void 0, void 0, function () {
                var response, error_3;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.writeGroups([]); // reset array data  
                            return [4 /*yield*/, Api.signalsService.getAllWriteGroup(SessionService.getSecurityToken(), 1000)];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                response.forEach(function (item) {
                                    var checkBoxObsItem = new CheckBoxObs(item);
                                    if (_this.actionType() === 'edit' && _this.authorizationGroupObs.WriteGroupIDs().indexOf(item.ID) > -1) {
                                        checkBoxObsItem.Selected(true);
                                    }
                                    _this.writeGroups.push(checkBoxObsItem);
                                });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.getAlarmTypes = function () {
            var _this = this;
            this.busyContext.runLongAction('Loading alarm types...', function () { return __awaiter(_this, void 0, void 0, function () {
                var response, error_4;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.alarmTypes([]); // reset array data   
                            return [4 /*yield*/, AlarmsService.getAlarmTypes(this.connector.currentLanguageId())];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                response.forEach(function (item) {
                                    var checkBoxObsItem = new CheckBoxObs(item, 'SymbolicTextTranslation');
                                    if (_this.actionType() === 'edit' && _this.authorizationGroupObs.AlarmTypeIDs().indexOf(item.ID) > -1) {
                                        checkBoxObsItem.Selected(true);
                                    }
                                    _this.alarmTypes.push(checkBoxObsItem);
                                });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error_4);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.getAlarmGroups = function () {
            var _this = this;
            this.busyContext.runLongAction('Loading alarm groups...', function () { return __awaiter(_this, void 0, void 0, function () {
                var response, error_5;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.alarmGroups([]); // reset array data  
                            return [4 /*yield*/, AlarmsService.getAlarmGroups(this.connector.currentLanguageId())];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                response.forEach(function (item) {
                                    var checkBoxObsItem = new CheckBoxObs(item, 'SymbolicTextTranslation');
                                    if (_this.actionType() === 'edit' && _this.authorizationGroupObs.AlarmGroupIDs().indexOf(item.ID) > -1) {
                                        checkBoxObsItem.Selected(true);
                                    }
                                    _this.alarmGroups.push(checkBoxObsItem);
                                });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error_5);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.getAllAccessGroups = function () {
            var _this = this;
            this.busyContext.runLongAction('Loading access groups types...', function () { return __awaiter(_this, void 0, void 0, function () {
                var response, error_6;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.accessGroups([]); // reset array data   
                            return [4 /*yield*/, Api.securityService.getAllAccessGroup(SessionService.getSecurityToken(), 1000)];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                response.forEach(function (item) {
                                    var checkBoxObsItem = new CheckBoxObs(item);
                                    if (_this.actionType() === 'edit' && _this.authorizationGroupObs.AccessGroupIDs().indexOf(item.ID) > -1) {
                                        checkBoxObsItem.Selected(true);
                                    }
                                    _this.accessGroups.push(checkBoxObsItem);
                                });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_6 = _a.sent();
                            this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error_6);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.getAllSchedulerLocations = function () {
            var _this = this;
            this.busyContext.runLongAction('Loading scheduler locations types...', function () { return __awaiter(_this, void 0, void 0, function () {
                var response, error_7;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.schedulerLocations([]); // reset array data  
                            return [4 /*yield*/, Api.securityService.getAllSchedulerLocation(SessionService.getSecurityToken(), 1000)];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                response.forEach(function (item) {
                                    var checkBoxObsItem = new CheckBoxObs(item);
                                    if (_this.actionType() === 'edit' && _this.authorizationGroupObs.LocationIDs().indexOf(item.ID) > -1) {
                                        checkBoxObsItem.Selected(true);
                                    }
                                    _this.schedulerLocations.push(checkBoxObsItem);
                                });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_7 = _a.sent();
                            this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error_7);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.onSaveClick = function () {
            // set selected items
            this.authorizationGroupObs.ProjectAuthorizationIDs(this.projectAuthorizations().filter(function (item) { return item.Selected(); }).map(function (item) { return item.ID; }));
            this.authorizationGroupObs.SystemAuthorizationIDs(this.systemAuthorizations().filter(function (item) { return item.Selected(); }).map(function (item) { return item.ID; }));
            this.authorizationGroupObs.WriteGroupIDs(this.writeGroups().filter(function (item) { return item.Selected(); }).map(function (item) { return item.ID; }));
            this.authorizationGroupObs.AlarmTypeIDs(this.alarmTypes().filter(function (item) { return item.Selected(); }).map(function (item) { return item.ID; }));
            this.authorizationGroupObs.AlarmGroupIDs(this.alarmGroups().filter(function (item) { return item.Selected(); }).map(function (item) { return item.ID; }));
            this.authorizationGroupObs.AccessGroupIDs(this.accessGroups().filter(function (item) { return item.Selected(); }).map(function (item) { return item.ID; }));
            this.authorizationGroupObs.LocationIDs(this.schedulerLocations().filter(function (item) { return item.Selected(); }).map(function (item) { return item.ID; }));
            if (this.actionType() === 'edit') {
                this.updateAuthGroup();
            }
            else {
                this.insertAuthGroup();
            }
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.insertAuthGroup = function () {
            var _this = this;
            this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusySavingAuthGroup')(), function () { return __awaiter(_this, void 0, void 0, function () {
                var authorizationGroupDto, isInserted, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            authorizationGroupDto = this.authorizationGroupObs.toDto();
                            return [4 /*yield*/, AuthorizationGroupService.insertAuthorizationGroup(authorizationGroupDto)];
                        case 1:
                            isInserted = _a.sent();
                            if (isInserted) {
                                this.confirmCallBackMethod(authorizationGroupDto);
                                Logger.successToast(this.connector.translate('I4SCADA_UM_AuthGroupSuccessfullyAdded')().replace(new RegExp("##name##", "ig"), authorizationGroupDto.Name));
                            }
                            this.close();
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _a.sent();
                            this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error_8);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.updateAuthGroup = function () {
            var _this = this;
            this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyUpdatingAuthGroup')(), function () { return __awaiter(_this, void 0, void 0, function () {
                var authorizationGroupDto, isUpdated, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            authorizationGroupDto = this.authorizationGroupObs.toDto();
                            return [4 /*yield*/, AuthorizationGroupService.updateAuthorizationGroup(authorizationGroupDto)];
                        case 1:
                            isUpdated = _a.sent();
                            if (isUpdated) {
                                this.confirmCallBackMethod(authorizationGroupDto);
                                Logger.successToast(this.connector.translate('I4SCADA_UM_AuthGroupSuccessfullyUpdated')().replace(new RegExp("##name##", "ig"), authorizationGroupDto.Name));
                            }
                            this.close();
                            return [3 /*break*/, 3];
                        case 2:
                            error_9 = _a.sent();
                            this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error_9);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.close = function () {
            this.showModalFromOutside(false);
        };
        WfUMAddEditAuthGroupsDialogComponent.prototype.dispose = function () {
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
        return WfUMAddEditAuthGroupsDialogComponent;
    }(ComponentBaseModel));
    return WfUMAddEditAuthGroupsDialogComponent;
});
//# sourceMappingURL=wf-um-add-edit-auth-groups-dialog.component.js.map