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
define(["require", "exports", "../../../../services/connector", "../../../services/convert-csv.service", "../models/signal-alarm-list-fields.model"], function (require, exports, Connector, ConvertCsvService, signal_alarm_list_fields_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalAlarmExportService = void 0;
    var SignalAlarmExportService = /** @class */ (function () {
        function SignalAlarmExportService(signalAlarmListService, settings) {
            this.connector = new Connector();
            this.signalAlarmListService = signalAlarmListService;
            this.convertCsvService = new ConvertCsvService(settings);
        }
        SignalAlarmExportService.prototype.handleExport = function (signalInformationColumns) {
            return __awaiter(this, void 0, void 0, function () {
                var csvFile;
                var _this = this;
                return __generator(this, function (_a) {
                    csvFile = this.convertCsvService.convertSignalAlarmListData(this.signalAlarmListService.items(), this.getFieldNamesForExport(signalInformationColumns).map(function (x) { return _this.connector.translate("I4SCADA_signal_alarm_list_column_" + x)(); }), this.getFieldsForExport(signalInformationColumns));
                    if (csvFile == null)
                        return [2 /*return*/];
                    this.convertCsvService.download();
                    return [2 /*return*/];
                });
            });
        };
        SignalAlarmExportService.prototype.getFieldNamesForExport = function (signalInformationColumns) {
            var e_1, _a;
            var fields = [];
            try {
                for (var signalInformationColumns_1 = __values(signalInformationColumns), signalInformationColumns_1_1 = signalInformationColumns_1.next(); !signalInformationColumns_1_1.done; signalInformationColumns_1_1 = signalInformationColumns_1.next()) {
                    var iterator = signalInformationColumns_1_1.value;
                    switch (iterator) {
                        case signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AlarmStatus:
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.InactiveCount);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.OffCount);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AcknowledgedCount);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.OnCount);
                            break;
                        case signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AlarmProcessingAndDisplayStatus:
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.NotProcessedButVisibleCount);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.ProcessedAndVisibleCount);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.NotProcessedAndNotVisibleCount);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.ProcessedButNotVisibleCount);
                            break;
                        case signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.Value:
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.Value);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.DiscreteValue);
                            break;
                        default:
                            fields.push(iterator);
                            break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (signalInformationColumns_1_1 && !signalInformationColumns_1_1.done && (_a = signalInformationColumns_1.return)) _a.call(signalInformationColumns_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return fields;
        };
        SignalAlarmExportService.prototype.getFieldsForExport = function (signalInformationColumns) {
            var e_2, _a;
            var fields = [];
            try {
                for (var signalInformationColumns_2 = __values(signalInformationColumns), signalInformationColumns_2_1 = signalInformationColumns_2.next(); !signalInformationColumns_2_1.done; signalInformationColumns_2_1 = signalInformationColumns_2.next()) {
                    var iterator = signalInformationColumns_2_1.value;
                    switch (iterator) {
                        case signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AlarmStatus:
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.InactiveCount);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.OffCount);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.AcknowledgedCount);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.OnCount);
                            break;
                        case signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AlarmProcessingAndDisplayStatus:
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.NotProcessedButVisibleCount);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.ProcessedAndVisibleCount);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.NotProcessedAndNotVisibleCount);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.ProcessedButNotVisibleCount);
                            break;
                        case signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.AliasName:
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.AliasName);
                            break;
                        case signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.Description:
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.Description);
                            break;
                        case signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.Name:
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.Name);
                            break;
                        case signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.Unit:
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.Unit);
                            break;
                        case signal_alarm_list_fields_model_1.SignalAlarmListFiledNames.Value:
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.Value);
                            fields.push(signal_alarm_list_fields_model_1.SignalAlarmListPropertyNames.DiscreteValues);
                            break;
                        default:
                            fields.push(iterator);
                            break;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (signalInformationColumns_2_1 && !signalInformationColumns_2_1.done && (_a = signalInformationColumns_2.return)) _a.call(signalInformationColumns_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return fields;
        };
        return SignalAlarmExportService;
    }());
    exports.SignalAlarmExportService = SignalAlarmExportService;
});
//# sourceMappingURL=signal-alarm-export.service.js.map