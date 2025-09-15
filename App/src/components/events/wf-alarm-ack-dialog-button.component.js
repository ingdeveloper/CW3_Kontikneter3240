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
define(["require", "exports", "../../services/connector", "../../services/errorCodeService"], function (require, exports, Connector, ErrorCodeService) {
    "use strict";
    var AcknowledgementAction;
    (function (AcknowledgementAction) {
        AcknowledgementAction[AcknowledgementAction["AllVisible"] = 0] = "AllVisible";
        AcknowledgementAction[AcknowledgementAction["ByGroup"] = 1] = "ByGroup";
        AcknowledgementAction[AcknowledgementAction["AllActive"] = 2] = "AllActive";
        AcknowledgementAction[AcknowledgementAction["AllGone"] = 3] = "AllGone";
    })(AcknowledgementAction || (AcknowledgementAction = {}));
    var WfAlarmAckDialogButtonComponent = /** @class */ (function () {
        function WfAlarmAckDialogButtonComponent(params) {
            this.showModal = ko.observable(false);
            this.isBusy = ko.observable(false);
            this.comment = ko.observable(null);
            this.alarmGroups = ko.observableArray([]);
            this.selectedAlarmGroup = ko.observable(null);
            this.acknowledgementActions = ko.observableArray([]);
            this.selectedAcknowledgementActions = ko.observable(null);
            this.id = ko.observable(uuid.v4());
            this.connector = new Connector();
            this.buttonCss = params.buttonCss || "";
            this.onlineAlarms = params.onlineAlarms;
            this.isModalDialogsDraggable = params.isModalDialogsDraggable != null ? params.isModalDialogsDraggable : false;
        }
        WfAlarmAckDialogButtonComponent.prototype.InitializeAcknowledgementActions = function () {
            this.acknowledgementActions([
                { symbolicTextTranslation: this.connector.translate('I4SCADA_Acknowledge_All_Visible_Alarms'), action: AcknowledgementAction.AllVisible },
                { symbolicTextTranslation: this.connector.translate('I4SCADA_Acknowledge_All_Alarms_In_Same_Group'), action: AcknowledgementAction.ByGroup },
                { symbolicTextTranslation: this.connector.translate('I4SCADA_Acknowledge_All_Active_Alarms'), action: AcknowledgementAction.AllActive },
                { symbolicTextTranslation: this.connector.translate('I4SCADA_Acknowledge_All_Gone_Alarms'), action: AcknowledgementAction.AllGone }
            ]);
        };
        WfAlarmAckDialogButtonComponent.prototype.getAllAlarmGroups = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.connector.getAlarmGroups(this.connector.currentLanguageId())];
                        case 1:
                            data = _a.sent();
                            this.alarmGroups(data);
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.connector.handleError(WfAlarmAckDialogButtonComponent)(error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmAckDialogButtonComponent.prototype.acknowledgeAlarms = function () {
            return __awaiter(this, void 0, void 0, function () {
                var onlineAlarms, needAcknowledge, alarmIds, result, _a, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.isBusy(true);
                            onlineAlarms = this.onlineAlarms().concat([]);
                            needAcknowledge = _.filter(onlineAlarms, function (alarm) { return !alarm.DateAck; });
                            alarmIds = _.map(needAcknowledge, function (alarm) { return alarm.AlarmID; });
                            if (!_.any(alarmIds)) {
                                this.isBusy(false);
                                return [2 /*return*/];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, 4, 5]);
                            result = this.connector.acknowledgeAlarms(alarmIds, this.comment());
                            this.close();
                            _a = this.handleAcknowledgeResul;
                            return [4 /*yield*/, result];
                        case 2:
                            _a.apply(this, [_b.sent()]);
                            return [3 /*break*/, 5];
                        case 3:
                            error_2 = _b.sent();
                            this.connector.handleError(WfAlarmAckDialogButtonComponent)(error_2);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isBusy(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmAckDialogButtonComponent.prototype.acknowledgeAlarmsByGroup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var groupName, result, _a, error_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.isBusy(true);
                            groupName = this.selectedAlarmGroup().SymbolicTextName;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, 4, 5]);
                            result = this.connector.acknowledgeAlarmsByGroup(groupName, this.comment());
                            this.close();
                            _a = this.handleAcknowledgeResul;
                            return [4 /*yield*/, result];
                        case 2:
                            _a.apply(this, [_b.sent()]);
                            return [3 /*break*/, 5];
                        case 3:
                            error_3 = _b.sent();
                            this.connector.handleError(WfAlarmAckDialogButtonComponent)(error_3);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isBusy(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmAckDialogButtonComponent.prototype.acknowledgeAllActiveAlarms = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, _a, error_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.isBusy(true);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, 4, 5]);
                            result = this.connector.acknowledgeAllAlarms(this.comment());
                            this.close();
                            _a = this.handleAcknowledgeResul;
                            return [4 /*yield*/, result];
                        case 2:
                            _a.apply(this, [_b.sent()]);
                            return [3 /*break*/, 5];
                        case 3:
                            error_4 = _b.sent();
                            this.connector.handleError(WfAlarmAckDialogButtonComponent)(error_4);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isBusy(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmAckDialogButtonComponent.prototype.acknowledgeAllGoneAlarms = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, _a, error_5;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.isBusy(true);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, 4, 5]);
                            result = this.connector.acknowledgeAllGoneAlarms(this.comment());
                            this.close();
                            _a = this.handleAcknowledgeResul;
                            return [4 /*yield*/, result];
                        case 2:
                            _a.apply(this, [_b.sent()]);
                            return [3 /*break*/, 5];
                        case 3:
                            error_5 = _b.sent();
                            this.connector.handleError(WfAlarmAckDialogButtonComponent)(error_5);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isBusy(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmAckDialogButtonComponent.prototype.handleAcknowledgeResul = function (result) {
            this.comment(null);
            if (result.Result === true) {
                var text = "I4SCADA_Acknowledgment_successful";
                var translation = ko.unwrap(this.connector.translate(text));
                this.connector.info(self, translation);
            }
            else {
                var text = ErrorCodeService.acknowledgmentErrorCodes[result.ErrorCodes[0].toString()];
                var translation = ko.unwrap(this.connector.translate(text));
                this.connector.error(this, translation);
            }
        };
        WfAlarmAckDialogButtonComponent.prototype.onAcknowledge = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.selectedAcknowledgementActions().action;
                            switch (_a) {
                                case AcknowledgementAction.AllActive: return [3 /*break*/, 1];
                                case AcknowledgementAction.AllGone: return [3 /*break*/, 3];
                                case AcknowledgementAction.AllVisible: return [3 /*break*/, 5];
                                case AcknowledgementAction.ByGroup: return [3 /*break*/, 7];
                            }
                            return [3 /*break*/, 9];
                        case 1: return [4 /*yield*/, this.acknowledgeAllActiveAlarms()];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 3: return [4 /*yield*/, this.acknowledgeAllGoneAlarms()];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 5: return [4 /*yield*/, this.acknowledgeAlarms()];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 7: return [4 /*yield*/, this.acknowledgeAlarmsByGroup()];
                        case 8:
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmAckDialogButtonComponent.prototype.open = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isBusy(true);
                            return [4 /*yield*/, this.getAllAlarmGroups()];
                        case 1:
                            _a.sent();
                            this.InitializeAcknowledgementActions();
                            this.isBusy(false);
                            this.showModal(true);
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmAckDialogButtonComponent.prototype.close = function () {
            this.showModal(false);
        };
        return WfAlarmAckDialogButtonComponent;
    }());
    return WfAlarmAckDialogButtonComponent;
});
//# sourceMappingURL=wf-alarm-ack-dialog-button.component.js.map