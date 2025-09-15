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
define(["require", "exports", "../../../component-base.model", "../../../../services/sessionService", "../../../../services/api", "../../../../decorators/busyIndicator", "../../../../services/logger", "../shared/wf-um-access-group-obs-model", "../shared/wf-um-check-box-obs-model"], function (require, exports, ComponentBaseModel, SessionService, Api, BusyIndicator, Logger, AccessGroupObs, CheckBoxObs) {
    "use strict";
    var WfUMAddEditAccessGroupDialogComponent = /** @class */ (function (_super) {
        __extends(WfUMAddEditAccessGroupDialogComponent, _super);
        function WfUMAddEditAccessGroupDialogComponent(params) {
            var _this = _super.call(this, params) || this;
            // localizations 
            _this.accessRightsLoc = _this.connector.translate('I4SCADA_UM_AccessRights');
            return _this;
        }
        WfUMAddEditAccessGroupDialogComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.busyContext = new BusyIndicator(this);
            this.accessGroupObs = new AccessGroupObs();
            this.accessAuthorization = ko.observableArray([]);
            this.showModal = ko.observable(false);
            this.datePickerOpt = {
                locale: this.connector.getGenericCulture(ko.unwrap(this.connector.currentLanguageId)),
                format: 'HH:mm:ss'
            };
            // input settings
            this.showModalFromOutside = this.settings.showModalFromOutside;
            this.actionType = this.settings.actionType;
            this.accessGroup = this.settings.accessGroup;
            this.confirmCallBackMethod = this.settings.confirmCallBackMethod;
            // methods
            this.initializeComputeds();
        };
        WfUMAddEditAccessGroupDialogComponent.prototype.initializeComputeds = function () {
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
        WfUMAddEditAccessGroupDialogComponent.prototype.initializeData = function () {
            // new
            if (isNullOrUndefined(this.accessGroup())) {
                this.accessGroupObs.initialize();
                // edit
            }
            else {
                this.accessGroupObs.fromDto(this.accessGroup());
            }
            this.getAllAccessAuthorization();
        };
        WfUMAddEditAccessGroupDialogComponent.prototype.getAllAccessAuthorization = function () {
            var _this = this;
            this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyLoadingAccessAuth')(), function () { return __awaiter(_this, void 0, void 0, function () {
                var response, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.accessAuthorization([]); // reset array data
                            return [4 /*yield*/, Api.securityService.getAllAccessAuthorization(SessionService.getSecurityToken(), 1000)];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                response.forEach(function (item) {
                                    var checkBoxObsItem = new CheckBoxObs(item);
                                    if (_this.actionType() === 'edit' && _this.accessGroupObs.AccessAuthorizationIDs().indexOf(item.ID) > -1) {
                                        checkBoxObsItem.Selected(true);
                                    }
                                    _this.accessAuthorization.push(checkBoxObsItem);
                                });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.connector.handleError(WfUMAddEditAccessGroupDialogComponent)(error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfUMAddEditAccessGroupDialogComponent.prototype.onSaveClick = function () {
            this.accessGroupObs.AccessAuthorizationIDs(this.accessAuthorization().filter(function (item) { return item.Selected(); }).map(function (item) { return item.ID; }));
            if (this.actionType() === 'edit') {
                this.updateProjectAuth();
            }
            else {
                this.insertProjectAuth();
            }
        };
        WfUMAddEditAccessGroupDialogComponent.prototype.insertProjectAuth = function () {
            var _this = this;
            this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusySavingAccessAuth')(), function () { return __awaiter(_this, void 0, void 0, function () {
                var accessGroupDto, isInserted, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            accessGroupDto = this.accessGroupObs.toDto();
                            return [4 /*yield*/, Api.securityService.insertAccessGroup(SessionService.getSecurityToken(), accessGroupDto, 1000)];
                        case 1:
                            isInserted = _a.sent();
                            if (isInserted) {
                                this.confirmCallBackMethod(accessGroupDto);
                                Logger.successToast(this.connector.translate('I4SCADA_UM_AccessGroupSuccessfullyAdded')().replace(new RegExp("##name##", "ig"), accessGroupDto.Name));
                            }
                            this.close();
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            this.connector.handleError(WfUMAddEditAccessGroupDialogComponent)(error_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfUMAddEditAccessGroupDialogComponent.prototype.updateProjectAuth = function () {
            var _this = this;
            this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyUpdatingAccessAuth')(), function () { return __awaiter(_this, void 0, void 0, function () {
                var accessGroupDto, isUpdated, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            accessGroupDto = this.accessGroupObs.toDto();
                            return [4 /*yield*/, Api.securityService.updateAccessGroup(SessionService.getSecurityToken(), accessGroupDto, 1000)];
                        case 1:
                            isUpdated = _a.sent();
                            if (isUpdated) {
                                this.confirmCallBackMethod(accessGroupDto);
                                Logger.successToast(this.connector.translate('I4SCADA_UM_AccessGroupSuccessfullyUpdated')().replace(new RegExp("##name##", "ig"), accessGroupDto.Name));
                            }
                            this.close();
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.connector.handleError(WfUMAddEditAccessGroupDialogComponent)(error_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        WfUMAddEditAccessGroupDialogComponent.prototype.close = function () {
            this.showModalFromOutside(false);
        };
        WfUMAddEditAccessGroupDialogComponent.prototype.dispose = function () {
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
        return WfUMAddEditAccessGroupDialogComponent;
    }(ComponentBaseModel));
    return WfUMAddEditAccessGroupDialogComponent;
});
//# sourceMappingURL=wf-um-add-edit-access-group-dialog.component.js.map