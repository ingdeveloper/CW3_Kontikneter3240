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
define(["require", "exports", "../signalsService", "../http", "../models/_signal", "./connectionService", "../logger", "../connectorBase", "../deferred", "../models/signals"], function (require, exports, SignalsService, HttpService, SignalsInterface, ConnectionService, Logger, ConnectorBase, deferred_1, Signals) {
    "use strict";
    var SignalValueType = SignalsInterface.SignalValueType;
    var i4Connector = /** @class */ (function (_super) {
        __extends(i4Connector, _super);
        function i4Connector() {
            var _this = _super.call(this) || this;
            _this.triggerResolvingOfSignalIdsInRegisteredSignalList = _.debounce(function () {
                var e_1, _a, e_2, _b, e_3, _c;
                var registerSignals = SignalsService.registeredSignalList;
                var signalsToRemove = [];
                if (!registerSignals.length)
                    return;
                var signalsWithoutSignalId = [];
                try {
                    for (var registerSignals_1 = __values(registerSignals), registerSignals_1_1 = registerSignals_1.next(); !registerSignals_1_1.done; registerSignals_1_1 = registerSignals_1.next()) {
                        var signal = registerSignals_1_1.value;
                        if (ko.unwrap(signal.id) === undefined) { //signals with null are not i4 related signals and should not try to be resolved
                            signalsWithoutSignalId.push(signal);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (registerSignals_1_1 && !registerSignals_1_1.done && (_a = registerSignals_1.return)) _a.call(registerSignals_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (!signalsWithoutSignalId.length)
                    return;
                var signalsPendingResolution = [];
                try {
                    for (var signalsWithoutSignalId_1 = __values(signalsWithoutSignalId), signalsWithoutSignalId_1_1 = signalsWithoutSignalId_1.next(); !signalsWithoutSignalId_1_1.done; signalsWithoutSignalId_1_1 = signalsWithoutSignalId_1.next()) {
                        var signal = signalsWithoutSignalId_1_1.value;
                        var signalDeclaration = _this.extractI4SignalDeclaration(signal.signalName());
                        signalsToRemove.push(signal);
                        if (signalDeclaration.deviceName) {
                            signalsPendingResolution.push(signalDeclaration);
                        }
                        else {
                            signal.id(null); //non i4 signals or incorectly configured
                            Logger.warn(i4Connector, "Signal with name [" + signalDeclaration.signalName + "] does not fit the i4 naming criteria 'deviceName" + ConnectorBase.DeviceSignalDelimitter + "signalName'");
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (signalsWithoutSignalId_1_1 && !signalsWithoutSignalId_1_1.done && (_b = signalsWithoutSignalId_1.return)) _b.call(signalsWithoutSignalId_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                if (!signalsPendingResolution.length)
                    return;
                try {
                    for (var signalsToRemove_1 = __values(signalsToRemove), signalsToRemove_1_1 = signalsToRemove_1.next(); !signalsToRemove_1_1.done; signalsToRemove_1_1 = signalsToRemove_1.next()) {
                        var signal = signalsToRemove_1_1.value;
                        SignalsService.registeredSignalList.splice(SignalsService.registeredSignalList.indexOf(signal), 1);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (signalsToRemove_1_1 && !signalsToRemove_1_1.done && (_c = signalsToRemove_1.return)) _c.call(signalsToRemove_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                var url = window.resolveUrl(window.i4InstallationUrl + ("/" + window.i4PostfixInstallationUrl + "/signals/getMultipleIds"));
                try {
                    HttpService.post(url, signalsPendingResolution).then(function (signalIds) {
                        for (var i = 0; i < signalsPendingResolution.length; i++) {
                            var signalId = signalIds[i];
                            signalId = signalId ? signalId.toString().toLowerCase() : null;
                            var signalName = _this.getSignalNameFromDeclaration(signalsPendingResolution[i]);
                            var signal = SignalsService.getSignal(signalName, false);
                            if (signal) {
                                signal.id(signalId);
                            }
                        }
                    });
                }
                catch (error) {
                    Logger.handleError(i4Connector)(error);
                }
            }, window.debounceIntervalResolvingOfSignalIds);
            _this.subscribeToSignalChangeEvents = _.debounce(function () { return __awaiter(_this, void 0, void 0, function () {
                var signals, pendingSubscriptions, signals_1, signals_1_1, signal;
                var e_4, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            signals = SignalsService.allRegisteredSignals.concat([]);
                            if (!signals.length)
                                return [2 /*return*/];
                            pendingSubscriptions = [];
                            try {
                                for (signals_1 = __values(signals), signals_1_1 = signals_1.next(); !signals_1_1.done; signals_1_1 = signals_1.next()) {
                                    signal = signals_1_1.value;
                                    if (signal.deferredId.isResolved()) {
                                        if (ko.unwrap(signal.id)) {
                                            pendingSubscriptions.push(signal.id());
                                        }
                                    }
                                    else {
                                        this.triggerResolvingOfSignalIdsInRegisteredSignalList();
                                        signal.deferredId.promise.then(function () {
                                            return _this.subscribeToSignalChangeEvents();
                                        });
                                    }
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (signals_1_1 && !signals_1_1.done && (_a = signals_1.return)) _a.call(signals_1);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            if (!pendingSubscriptions.length) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.subscribeAll(pendingSubscriptions)];
                        case 1:
                            _b.sent();
                            _b.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); }, window.debounceIntervalSubscribeToSignalChangeEvents);
            _this.measurementService = ConnectionService.getInstance().getMeasurementService();
            return _this;
        }
        i4Connector.prototype.getSignal = function (name, shouldAddSubscriber) {
            if (shouldAddSubscriber === void 0) { shouldAddSubscriber = true; }
            if (!name)
                return null;
            if (i4Connector.isGuid(name)) {
                name = name.toLowerCase();
            }
            var signal = SignalsService.getSignal(name, shouldAddSubscriber);
            this.triggerResolvingOfSignalIdsInRegisteredSignalList(); //debatable
            return signal;
        };
        i4Connector.prototype.getOnlineUpdates = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.subscribeToSignalChangeEvents()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        i4Connector.prototype.writeSignals = function (signalValues) {
            return __awaiter(this, void 0, void 0, function () {
                var promises, writeResults, exception, errorMessage, wasSuccessful, writeResults_1, writeResults_1_1, writeResult, error_1;
                var e_5, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            promises = Object.keys(signalValues)
                                .map(function (signalName) { return _this.writeSignal(signalName, signalValues[signalName]); });
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Promise.all(promises)];
                        case 2:
                            writeResults = _b.sent();
                            exception = null;
                            errorMessage = "";
                            wasSuccessful = true;
                            try {
                                for (writeResults_1 = __values(writeResults), writeResults_1_1 = writeResults_1.next(); !writeResults_1_1.done; writeResults_1_1 = writeResults_1.next()) {
                                    writeResult = writeResults_1_1.value;
                                    if (!writeResult.successful) {
                                        wasSuccessful = false;
                                        errorMessage += "|" + writeResult.errorMessage;
                                        exception = writeResult.exception;
                                    }
                                }
                            }
                            catch (e_5_1) { e_5 = { error: e_5_1 }; }
                            finally {
                                try {
                                    if (writeResults_1_1 && !writeResults_1_1.done && (_a = writeResults_1.return)) _a.call(writeResults_1);
                                }
                                finally { if (e_5) throw e_5.error; }
                            }
                            return [2 /*return*/, { successful: wasSuccessful, errorMessage: errorMessage, exception: exception }];
                        case 3:
                            error_1 = _b.sent();
                            Logger.handleError(i4Connector)(error_1);
                            return [2 /*return*/, {
                                    successful: false,
                                    errorMessage: error_1.toString(),
                                    exception: error_1
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        i4Connector.prototype.getSignalDefinition = function (signalName) {
            return __awaiter(this, void 0, void 0, function () {
                var signal;
                var _this = this;
                return __generator(this, function (_a) {
                    signal = this.getSignal(signalName, false);
                    if (!signal) {
                        return [2 /*return*/, Promise.resolve(null)];
                    }
                    if (signal.deferredDefinition) {
                        return [2 /*return*/, signal.deferredDefinition.promise];
                    }
                    if (!signal.deferredId.isResolved()) {
                        this.triggerResolvingOfSignalIdsInRegisteredSignalList();
                    }
                    return [2 /*return*/, signal.deferredId.promise.then(function () {
                            return _this.getSignalDefinitionForSignal(signal);
                        })];
                });
            });
        };
        i4Connector.prototype.getSignalDefinitions = function (signalNames) {
            return __awaiter(this, void 0, void 0, function () {
                var promises, signalNames_1, signalNames_1_1, signalName;
                var e_6, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            promises = [];
                            try {
                                for (signalNames_1 = __values(signalNames), signalNames_1_1 = signalNames_1.next(); !signalNames_1_1.done; signalNames_1_1 = signalNames_1.next()) {
                                    signalName = signalNames_1_1.value;
                                    promises.push(this.getSignalDefinition(signalName));
                                }
                            }
                            catch (e_6_1) { e_6 = { error: e_6_1 }; }
                            finally {
                                try {
                                    if (signalNames_1_1 && !signalNames_1_1.done && (_a = signalNames_1.return)) _a.call(signalNames_1);
                                }
                                finally { if (e_6) throw e_6.error; }
                            }
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1: return [2 /*return*/, _b.sent()];
                    }
                });
            });
        };
        i4Connector.prototype.getAllSignalDefinitions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var signals, signals_2, signals_2_1, signal, registeredSignal;
                var e_7, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getResolvedDefinitions()];
                        case 1:
                            signals = _b.sent();
                            try {
                                for (signals_2 = __values(signals), signals_2_1 = signals_2.next(); !signals_2_1.done; signals_2_1 = signals_2.next()) {
                                    signal = signals_2_1.value;
                                    registeredSignal = this.getSignal(signal.Name, false);
                                    registeredSignal.id(signal.ID);
                                    registeredSignal.definition(signal);
                                }
                            }
                            catch (e_7_1) { e_7 = { error: e_7_1 }; }
                            finally {
                                try {
                                    if (signals_2_1 && !signals_2_1.done && (_a = signals_2.return)) _a.call(signals_2);
                                }
                                finally { if (e_7) throw e_7.error; }
                            }
                            if (!(signals.length >= i4Connector.count)) return [3 /*break*/, 3];
                            i4Connector.pageNumber += 1;
                            return [4 /*yield*/, this.getAllSignalDefinitions()];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3: return [2 /*return*/, signals];
                    }
                });
            });
        };
        i4Connector.prototype.getSignalDefinitionsByPatterns = function (patterns, onlyActive) {
            if (onlyActive === void 0) { onlyActive = true; }
            return __awaiter(this, void 0, void 0, function () {
                var commonSignalDefinitions, definitions, _loop_1, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getAllSignalDefinitions()];
                        case 1:
                            commonSignalDefinitions = _a.sent();
                            definitions = [];
                            if (!patterns || patterns.length === 0) //pattern is empty. Sen all signals
                                definitions = commonSignalDefinitions;
                            _loop_1 = function (i) {
                                var pattern = patterns[i];
                                if (pattern.indexOf("*") === -1) { //Tehere is not * in pattern. Pattern is singal name
                                    var model = _.find(commonSignalDefinitions, function (signal) {
                                        return signal.Name === pattern;
                                    });
                                    if (model) {
                                        definitions.push(model);
                                    }
                                }
                                else { // There is * in pattern.
                                    var regex_1 = new RegExp("^" + pattern.split("*").join(".*") + "$");
                                    definitions = definitions.concat(_.filter(commonSignalDefinitions, function (model) { return model && model.Name && regex_1.test(model.Name); }));
                                }
                            };
                            for (i = 0; i < patterns.length; i++) {
                                _loop_1(i);
                            }
                            ;
                            if (onlyActive)
                                definitions = _.filter(definitions, function (definition) {
                                    return definition.Active;
                                });
                            return [2 /*return*/, definitions];
                    }
                });
            });
        };
        i4Connector.prototype.unregisterSignals = function () {
            var signals = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                signals[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var ids, signals_3, signals_3_1, signal, id;
                var e_8, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ids = [];
                            try {
                                for (signals_3 = __values(signals), signals_3_1 = signals_3.next(); !signals_3_1.done; signals_3_1 = signals_3.next()) {
                                    signal = signals_3_1.value;
                                    if (!signal)
                                        continue;
                                    id = void 0;
                                    if (typeof signal === "string") {
                                        id = this.getSignal(signal, false).id();
                                    }
                                    else {
                                        id = signal.id();
                                    }
                                    if (id) {
                                        ids.push(id);
                                    }
                                }
                            }
                            catch (e_8_1) { e_8 = { error: e_8_1 }; }
                            finally {
                                try {
                                    if (signals_3_1 && !signals_3_1.done && (_a = signals_3.return)) _a.call(signals_3);
                                }
                                finally { if (e_8) throw e_8.error; }
                            }
                            return [4 /*yield*/, this.measurementService.unsubscribeAll(this.onMeasurementUpdate, ids)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        i4Connector.prototype.readSignals = function (signalNames) {
            return __awaiter(this, void 0, void 0, function () {
                var signals;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            signals = Signals.fromSignalNames(signalNames);
                            SignalsService.readLocalSignals(signals.localSignals);
                            return [4 /*yield*/, this.readRemoteSignals(signals.remoteSignals)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, Signals.toSignalValueDTOs(signalNames, signals)];
                    }
                });
            });
        };
        i4Connector.prototype.readRemoteSignals = function (remoteSignals) {
            return __awaiter(this, void 0, void 0, function () {
                var results, remoteSignals_1, remoteSignals_1_1, remoteSignal, data, _a, e_9_1;
                var e_9, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            results = [];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 8, 9, 10]);
                            remoteSignals_1 = __values(remoteSignals), remoteSignals_1_1 = remoteSignals_1.next();
                            _c.label = 2;
                        case 2:
                            if (!!remoteSignals_1_1.done) return [3 /*break*/, 7];
                            remoteSignal = remoteSignals_1_1.value;
                            _c.label = 3;
                        case 3:
                            _c.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.readRemoteSignal(remoteSignal.name)];
                        case 4:
                            data = _c.sent();
                            results.push({
                                value: data.value,
                                result: 0
                            });
                            return [3 /*break*/, 6];
                        case 5:
                            _a = _c.sent();
                            results.push({
                                value: null,
                                result: 500
                            });
                            return [3 /*break*/, 6];
                        case 6:
                            remoteSignals_1_1 = remoteSignals_1.next();
                            return [3 /*break*/, 2];
                        case 7: return [3 /*break*/, 10];
                        case 8:
                            e_9_1 = _c.sent();
                            e_9 = { error: e_9_1 };
                            return [3 /*break*/, 10];
                        case 9:
                            try {
                                if (remoteSignals_1_1 && !remoteSignals_1_1.done && (_b = remoteSignals_1.return)) _b.call(remoteSignals_1);
                            }
                            finally { if (e_9) throw e_9.error; }
                            return [7 /*endfinally*/];
                        case 10:
                            results.forEach(function (result, index) {
                                remoteSignals[index].value = result.value;
                                remoteSignals[index].result = result.result;
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        i4Connector.prototype.readRemoteSignal = function (name) {
            return __awaiter(this, void 0, void 0, function () {
                var signal;
                var _this = this;
                return __generator(this, function (_a) {
                    signal = this.getSignal(name, false);
                    if (!signal ||
                        (signal.deferredId.isResolved() && !ko.unwrap(signal.id))) {
                        return [2 /*return*/, Promise.resolve(null)];
                    }
                    return [2 /*return*/, signal.deferredId.promise.then(function (signalId) {
                            try {
                                return _this.measurementService.read(signalId);
                            }
                            catch (error) {
                                Logger.handleError(i4Connector)(error);
                                return Promise.resolve(null);
                            }
                        })];
                });
            });
        };
        i4Connector.prototype.writeSignal = function (name, value) {
            return __awaiter(this, void 0, void 0, function () {
                var writableSignalValue;
                return __generator(this, function (_a) {
                    if (!name) {
                        return [2 /*return*/, null];
                    }
                    writableSignalValue = { value: value, signal: this.getSignal(name, false) };
                    if (!writableSignalValue.signal ||
                        (writableSignalValue.signal.deferredId.isResolved() && !ko.unwrap(writableSignalValue.signal.id))) {
                        return [2 /*return*/, Promise.resolve(null)];
                    }
                    return [2 /*return*/, writableSignalValue.signal.deferredId.promise.then(function (signalId) {
                            var url = window.resolveUrl(window.i4InstallationUrl + ("/" + window.i4PostfixInstallationUrl + "/signals/" + signalId + "/write"));
                            try {
                                var writeSignalInfo = { signalId: signalId, value: value, timestamp: moment().toMSDate() };
                                return HttpService.post(url, writeSignalInfo);
                            }
                            catch (error) {
                                Logger.handleError(i4Connector)(error);
                                return Promise.resolve(null);
                            }
                        })];
                });
            });
        };
        i4Connector.prototype.getSignalDefinitionForSignal = function (signal) {
            return __awaiter(this, void 0, void 0, function () {
                var url;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (signal.deferredDefinition) {
                                return [2 /*return*/, signal.deferredDefinition.promise];
                            }
                            if (!ko.unwrap(signal.id)) {
                                return [2 /*return*/, Promise.resolve(null)];
                            }
                            url = window.resolveUrl(window.i4InstallationUrl + ("/" + window.i4PostfixInstallationUrl + "/signals/" + signal.id() + "/details"));
                            signal.deferredDefinition = new deferred_1.Deferred();
                            return [4 /*yield*/, HttpService.get(url).then(function (details) {
                                    if (!details) {
                                        details = _this.getDefaultSignalDetails();
                                    }
                                    details = _this.updateSignalDetailsProperties(details);
                                    var existingSignal = _this.getSignal(signal.signalName(), false);
                                    if (existingSignal) {
                                        existingSignal.definition(details);
                                    }
                                    return existingSignal.deferredDefinition.promise;
                                })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        i4Connector.prototype.getResolvedDefinitions = function () {
            var e_10, _a;
            var definitions = [];
            try {
                for (var _b = __values(SignalsService.allRegisteredSignals), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var signal = _c.value;
                    if (ko.unwrap(signal.definition)) {
                        definitions.push(signal.definition());
                    }
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_10) throw e_10.error; }
            }
            return definitions;
            //the SignalsController list method has authorization built inside of the query as well as authorized as post method decorator
            //so if the scada page is not authentificated as i4 requirers we always are going to get an empty list back
            //for that we decided Seba and Ionut to return the entire list of signals that have been previously registered and resolved
        };
        i4Connector.prototype.subscribeAll = function (signalIds) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.measurementService.subscribeAll(this.onMeasurementUpdate, signalIds)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        i4Connector.prototype.onMeasurementUpdate = function (signalState) {
            var signalName = signalState.name;
            if (i4Connector.isGuid(signalName)) {
                signalName = signalName.toLowerCase();
            }
            var signal = SignalsService.getRegisteredSignalByNameOrId(signalName);
            if (!signal) {
                signal = SignalsService.getSignal(signalName, false);
            }
            if (signal && signalState && signalState.value) {
                signal.setValue(signalState.value(), SignalValueType.Server);
            }
        };
        i4Connector.prototype.getDefaultSignalDetails = function () {
            var model = {};
            model.factor = 1;
            model.conversionFactorFrom = 1;
            model.conversionFactorTo = 1;
            model.log = true;
            return model;
        };
        i4Connector.prototype.updateSignalDetailsProperties = function (signalDetail) {
            signalDetail.ID = signalDetail.id;
            signalDetail.Name = signalDetail.name;
            signalDetail.Alias = signalDetail.alias;
            signalDetail.Active = signalDetail.active;
            signalDetail.Description = signalDetail.description;
            signalDetail.Unit = signalDetail.unit;
            signalDetail.Minimum = signalDetail.minValue;
            signalDetail.Maximum = signalDetail.maxValue;
            return signalDetail;
        };
        i4Connector.prototype.getCommonSignalModel = function (signal) {
            var commonSignal = {};
            commonSignal.ID = signal.id;
            commonSignal.Name = signal.name;
            commonSignal.Alias = signal.alias;
            commonSignal.Active = signal.active;
            commonSignal.Description = signal.description;
            commonSignal.Unit = signal.unit;
            commonSignal.Maximum = -1;
            commonSignal.Minimum = -1;
            return commonSignal;
        };
        i4Connector.prototype.defaultFilterOptions = function () {
            var filter = {
                adapterId: null,
                adapterSignals: 0,
                adapterTypeId: null,
                areaScope: [],
                autoFilter: true,
                customerId: null,
                deviceManufacturerIds: null,
                deviceModelIds: null,
                deviceScope: [],
                deviceTypeIds: null,
                entityVariables: 0,
                excludedIds: [],
                filterOptions: 381,
                hardwareVersionIds: null,
                hidden: 0,
                inactive: 0,
                languageId: 9,
                maxItems: 5,
                minItems: 0,
                minPatternLength: 0,
                pattern: "",
                selectedItems: [],
                selectedTypes: ["Device"],
                signalTypes: null,
                singleSelectionMode: false,
                siteTypeId: null,
                softwareVersionIds: null,
                subtitle: null,
                title: null,
                types: ["OrganizationalUnit", "Site", "Area", "Device"],
                unassigned: 0
            };
            return filter;
        };
        i4Connector.pageNumber = 1;
        i4Connector.count = 200;
        return i4Connector;
    }(ConnectorBase));
    return i4Connector;
});
//# sourceMappingURL=i4Connector.js.map