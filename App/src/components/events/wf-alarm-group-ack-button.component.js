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
define(["require", "exports", "../../services/connector", "../services/secured.service", "../../services/errorCodeService"], function (require, exports, Connector, SecuredService, ErrorCodeService) {
    "use strict";
    var WfAlarmGroupAckButtonComponent = /** @class */ (function () {
        function WfAlarmGroupAckButtonComponent(params) {
            this.comment = ko.observable(null);
            this.connector = new Connector();
            this.settings = params;
            this.objectID = ko.unwrap(params.objectID);
            this.projectAuthorization = (ko.unwrap(params.projectAuthorization) || "").stringPlaceholderResolver(this.objectID);
            this.securedService = new SecuredService(this.projectAuthorization);
            this.hasAuthorization = this.securedService.hasAuthorization;
            this.hasNoAuthorization = this.securedService.hasNoAuthorization;
            this.comment = this.settings.comment;
            this.groupName = ko.unwrap(this.settings.groupName) || null;
            this.buttonText = (ko.unwrap(this.settings.buttonText) || 'I4SCADA_Acknowledge_Alarms_By_Group').stringPlaceholderResolver(this.objectID);
            this.tooltipText = (ko.unwrap(this.settings.tooltipText) || 'I4SCADA_Acknowledge_All_Alarms_In_Same_Group').stringPlaceholderResolver(this.objectID);
            this.iconClass = ko.unwrap(this.settings.iconClass) || "wf wf-check";
            this.cssClass = ko.unwrap(this.settings.cssClass) || "btn btn-warning";
            this.callback = this.settings.callback;
        }
        WfAlarmGroupAckButtonComponent.prototype.acknowledgeAlarmsByGroup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var groupName, comment, result, _a, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            groupName = this.groupName;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, 4, 5]);
                            comment = ko.unwrap(this.comment());
                            result = this.connector.acknowledgeAlarmsByGroup(groupName, comment);
                            _a = this.handleAcknowledgeResul;
                            return [4 /*yield*/, result];
                        case 2:
                            _a.apply(this, [_b.sent()]);
                            return [3 /*break*/, 5];
                        case 3:
                            error_1 = _b.sent();
                            this.connector.handleError(WfAlarmGroupAckButtonComponent)(error_1);
                            return [3 /*break*/, 5];
                        case 4:
                            if (this.callback)
                                this.callback();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        WfAlarmGroupAckButtonComponent.prototype.handleAcknowledgeResul = function (result) {
            if (ko.isObservable(this.comment))
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
        WfAlarmGroupAckButtonComponent.prototype.onAcknowledge = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.acknowledgeAlarmsByGroup()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfAlarmGroupAckButtonComponent;
    }());
    return WfAlarmGroupAckButtonComponent;
});
//# sourceMappingURL=wf-alarm-group-ack-button.component.js.map