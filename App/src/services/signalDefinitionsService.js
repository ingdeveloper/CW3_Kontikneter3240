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
define(["require", "exports", "./api", "./logger", "./symbolicTextsService", "./models/signalDefinitionsFilter", "./sessionService"], function (require, exports, Api, Logger, SymbolicTexstService, SignalDefinitionsFilter, SessionService) {
    "use strict";
    var States;
    (function (States) {
        States[States["Available"] = 0] = "Available";
        States[States["Queried"] = 1] = "Queried";
        States[States["Unavailable"] = 2] = "Unavailable";
        States[States["Invalid"] = 3] = "Invalid"; //3
    })(States || (States = {}));
    var SignalInformationModel = /** @class */ (function () {
        function SignalInformationModel() {
        }
        return SignalInformationModel;
    }());
    var SignalDefinitionsService = /** @class */ (function () {
        function SignalDefinitionsService() {
        }
        SignalDefinitionsService.getDefinition = function (signalName) {
            return __awaiter(this, void 0, void 0, function () {
                var signalInforamtion, definition;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!signalName)
                                return [2 /*return*/, Promise.resolve(null)];
                            signalInforamtion = _.find(SignalDefinitionsService.signalInformationModels, function (x) { return x.signalName === signalName; });
                            if (signalInforamtion && signalInforamtion.state == States.Unavailable) {
                                return [2 /*return*/, Promise.resolve(null)];
                            }
                            if (!SignalDefinitionsService.runningUpdate) return [3 /*break*/, 2];
                            return [4 /*yield*/, SignalDefinitionsService.runningUpdate];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            definition = SignalDefinitionsService.getCachedDefinition(signalName);
                            if (definition() !== undefined)
                                return [2 /*return*/, definition()];
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    SignalDefinitionsService.triggerGetSignalDefinitionsCallForUnresolvedDefers();
                                    var subscription = definition.subscribe(function (def) {
                                        if (!def)
                                            return; //in release mode the subscribe is triggered before the call is finished with the default of null.
                                        // check if Signal is now Available if not retun null
                                        if (_.find(SignalDefinitionsService.signalInformationModels, function (x) { return x.signalName === signalName; }).state !== States.Available) {
                                            resolve(null);
                                        }
                                        resolve(def);
                                        subscription.dispose();
                                    });
                                })];
                    }
                });
            });
        };
        SignalDefinitionsService.getCachedDefinition = function (signalName) {
            var definition = SignalDefinitionsService.signalDefinitions[signalName] = SignalDefinitionsService.signalDefinitions[signalName] || ko.observable();
            return definition;
        };
        SignalDefinitionsService.getDefinitions = function (signalNames) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.all(signalNames.map(function (name) { return SignalDefinitionsService.getDefinition(name); }))];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        SignalDefinitionsService.getAllDefinitions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var signalDefinitions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, SignalDefinitionsService.loadSignalDefinitionsAsync([])];
                        case 1:
                            signalDefinitions = _a.sent();
                            SignalDefinitionsService.startIndex += SignalDefinitionsService.count;
                            _a.label = 2;
                        case 2:
                            if (signalDefinitions.length >= SignalDefinitionsService.count) return [3 /*break*/, 0];
                            _a.label = 3;
                        case 3: return [2 /*return*/, SignalDefinitionsService.returnSignalDefinitions(null)];
                    }
                });
            });
        };
        SignalDefinitionsService.doUpdate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, model, definition, erroe_1;
                var e_1, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 4, 5, 6]);
                            if (!SignalDefinitionsService.runningUpdate) return [3 /*break*/, 2];
                            return [4 /*yield*/, SignalDefinitionsService.runningUpdate];
                        case 1:
                            _d.sent();
                            _d.label = 2;
                        case 2:
                            SignalDefinitionsService.runningUpdate = SignalDefinitionsService.loadSignalDefinitionsAsync(SignalDefinitionsService.signalInformationModels);
                            return [4 /*yield*/, SignalDefinitionsService.runningUpdate];
                        case 3:
                            _d.sent();
                            try {
                                for (_a = __values(SignalDefinitionsService.signalInformationModels), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    model = _b.value;
                                    definition = SignalDefinitionsService.getCachedDefinition(model.signalName);
                                    definition(model.definition);
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            return [3 /*break*/, 6];
                        case 4:
                            erroe_1 = _d.sent();
                            Logger.error(SignalDefinitionsService, "Unable to load SignalDefinitions.", erroe_1);
                            return [3 /*break*/, 6];
                        case 5:
                            SignalDefinitionsService.runningUpdate = null;
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        ;
        SignalDefinitionsService.getSignalsDefinitionsByPatterns = function (patterns, onlyActive) {
            if (onlyActive === void 0) { onlyActive = true; }
            return __awaiter(this, void 0, void 0, function () {
                var definitions, i, pattern, definition, regex;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!SignalDefinitionsService.disableSignalBrowser) return [3 /*break*/, 2];
                            return [4 /*yield*/, SignalDefinitionsService.getDefinitions(patterns)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [4 /*yield*/, SignalDefinitionsService.getAllDefinitions()];
                        case 3:
                            _a.sent();
                            definitions = [];
                            if (!patterns || patterns.length === 0) //pattern is empty. Sen all signals
                                definitions = SignalDefinitionsService.signalInformationModels;
                            for (i = 0; i < patterns.length; i++) {
                                pattern = patterns[i];
                                if (pattern.indexOf("*") === -1) { //There is not * in pattern. Pattern is singal name
                                    definition = _.findWhere(SignalDefinitionsService.signalInformationModels, { AliasName: pattern });
                                    if (definition) {
                                        definitions.push(definition);
                                    }
                                }
                                else { // There is * in pattern. 
                                    regex = new RegExp("^" + pattern.split("*").join(".*") + "$");
                                    definitions = definitions.concat(_.filter(SignalDefinitionsService.signalInformationModels, function (model) { return model && model.signalName && regex.test(model.signalName); }));
                                }
                                ;
                            }
                            if (onlyActive) {
                                definitions = _.filter(definitions, function (definition) { return definition.definition.Active; });
                            }
                            return [2 /*return*/, _.map(definitions, function (definition) {
                                    definition.definition.Alias = definition.definition.AliasName;
                                    return definition.definition;
                                })];
                    }
                });
            });
        };
        SignalDefinitionsService.callGetDefinitions = function (signalNames) {
            return __awaiter(this, void 0, void 0, function () {
                var requestedModels, unrequestedModels;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            requestedModels = _.map(signalNames, function (signalName) { return SignalDefinitionsService.getOrCreateSignalDefinition(signalName); });
                            unrequestedModels = _.filter(requestedModels, function (model) { return model.state === States.Invalid || model.state === States.Unavailable; });
                            if (!unrequestedModels.length) return [3 /*break*/, 2];
                            return [4 /*yield*/, SignalDefinitionsService.loadSignalDefinitionsAsync(unrequestedModels)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/, SignalDefinitionsService.returnSignalDefinitions(requestedModels)];
                    }
                });
            });
        };
        SignalDefinitionsService.returnSignalDefinitions = function (models) {
            if (!models || !models.length) {
                var availableItems = _.where(SignalDefinitionsService.signalInformationModels, function (x) { return x.state === States.Available; });
                return _.map(availableItems, function (x) { return x.definition; });
            }
            return _.map(models, function (x) { return x.definition; });
        };
        SignalDefinitionsService.loadSignalDefinitionsAsync = function (models) {
            return __awaiter(this, void 0, void 0, function () {
                var models_1, models_1_1, model, languageId, requestedSignalNames, filter, securityToken, signalDefinitions, difference;
                var e_2, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            try {
                                for (models_1 = __values(models), models_1_1 = models_1.next(); !models_1_1.done; models_1_1 = models_1.next()) {
                                    model = models_1_1.value;
                                    SignalDefinitionsService.updateDefinitionModelState(model, States.Queried);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (models_1_1 && !models_1_1.done && (_a = models_1.return)) _a.call(models_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            return [4 /*yield*/, SymbolicTexstService.initializeLanguageAsync()];
                        case 1:
                            languageId = _b.sent();
                            requestedSignalNames = _.map(models, function (model) { return model.signalName; });
                            console.log("Loading Definitions for signals: [" + requestedSignalNames.join(",") + "]");
                            filter = new SignalDefinitionsFilter([], requestedSignalNames, null, SignalDefinitionResultsFilter.All);
                            securityToken = SessionService.getSecurityToken();
                            signalDefinitions = [];
                            if (!securityToken) return [3 /*break*/, 3];
                            return [4 /*yield*/, Api.signalsService.getSignalDefinitionsByToken(securityToken, filter.toDto(), languageId, SignalDefinitionsService.startIndex, SignalDefinitionsService.count, SessionService.timeOut)];
                        case 2:
                            signalDefinitions = _b.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, Api.signalsService.getSignalDefinitions(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter.toDto(), languageId, SignalDefinitionsService.startIndex, SignalDefinitionsService.count, SessionService.timeOut)];
                        case 4:
                            signalDefinitions = _b.sent();
                            _b.label = 5;
                        case 5:
                            difference = _.difference(requestedSignalNames, signalDefinitions.map(function (x) { return x.AliasName; }));
                            SignalDefinitionsService.updateDefinitions(signalDefinitions, languageId);
                            SignalDefinitionsService.updateUnavailableDefinitions(difference.map(function (x) { return { AliasName: x }; }), languageId);
                            return [2 /*return*/, signalDefinitions];
                    }
                });
            });
        };
        SignalDefinitionsService.getOrCreateSignalDefinition = function (signalName) {
            var model = _.find(SignalDefinitionsService.signalInformationModels, function (model) { return model.signalName === signalName; });
            if (model) {
                return model;
            }
            model = new SignalInformationModel();
            model.signalName = signalName;
            model.languageId = -1;
            model.state = States.Unavailable;
            model.definition = null;
            SignalDefinitionsService.signalInformationModels.push(model);
            return model;
        };
        SignalDefinitionsService.updateDefinitions = function (signalDefinitions, languageId) {
            var e_3, _a;
            try {
                for (var signalDefinitions_1 = __values(signalDefinitions), signalDefinitions_1_1 = signalDefinitions_1.next(); !signalDefinitions_1_1.done; signalDefinitions_1_1 = signalDefinitions_1.next()) {
                    var signalDefinition = signalDefinitions_1_1.value;
                    var model = SignalDefinitionsService.getOrCreateSignalDefinition(signalDefinition.AliasName);
                    model.definition = SignalDefinitionsService.updateSignalDefinitionProperties(signalDefinition);
                    model.languageId = languageId;
                    SignalDefinitionsService.updateDefinitionModelState(model, States.Available);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (signalDefinitions_1_1 && !signalDefinitions_1_1.done && (_a = signalDefinitions_1.return)) _a.call(signalDefinitions_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return signalDefinitions;
        };
        SignalDefinitionsService.updateUnavailableDefinitions = function (signalDefinitions, languageId) {
            var e_4, _a;
            try {
                for (var signalDefinitions_2 = __values(signalDefinitions), signalDefinitions_2_1 = signalDefinitions_2.next(); !signalDefinitions_2_1.done; signalDefinitions_2_1 = signalDefinitions_2.next()) {
                    var signalDefinition = signalDefinitions_2_1.value;
                    var model = SignalDefinitionsService.getOrCreateSignalDefinition(signalDefinition.AliasName);
                    model.definition = SignalDefinitionsService.updateSignalDefinitionProperties(signalDefinition);
                    model.languageId = languageId;
                    SignalDefinitionsService.updateDefinitionModelState(model, States.Unavailable);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (signalDefinitions_2_1 && !signalDefinitions_2_1.done && (_a = signalDefinitions_2.return)) _a.call(signalDefinitions_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return signalDefinitions;
        };
        SignalDefinitionsService.updateSignalDefinitionProperties = function (signalDefinition) {
            signalDefinition.Alias = signalDefinition.AliasName;
            //should be removed if the fix for the webservices to get the signal Definition is running
            if (!signalDefinition.Description) {
                signalDefinition.Description = signalDefinition.DescriptionSymbolicText;
            }
            return signalDefinition;
        };
        SignalDefinitionsService.updateDefinitionState = function (signalName, state) {
            var model = SignalDefinitionsService.getOrCreateSignalDefinition(signalName);
            SignalDefinitionsService.updateDefinitionModelState(model, state);
        };
        SignalDefinitionsService.updateDefinitionModelState = function (model, state) {
            //console.log("Changed state of '" + model.signalName + "' from: " + model.state + " to " + state);
            model.state = state;
        };
        SignalDefinitionsService.signalInformationModels = [];
        SignalDefinitionsService.startIndex = 0;
        SignalDefinitionsService.count = 1000;
        SignalDefinitionsService.disableSignalBrowser = window.disableSignalBrowser;
        SignalDefinitionsService.signalDefinitions = {};
        SignalDefinitionsService.runningUpdate = null;
        SignalDefinitionsService.subscribe = SymbolicTexstService.currentLanguageId.subscribe(function () {
            SignalDefinitionsService.doUpdate();
        });
        SignalDefinitionsService.triggerGetSignalDefinitionsCallForUnresolvedDefers = _.debounce(function () { return __awaiter(void 0, void 0, void 0, function () {
            var unresolvedSignalNames, signalName, signalDefinitions, index, definition, signalName, cachedDefinition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unresolvedSignalNames = [];
                        for (signalName in SignalDefinitionsService.signalDefinitions) {
                            if (!SignalDefinitionsService.signalDefinitions[signalName]()) {
                                unresolvedSignalNames.push(signalName);
                            }
                        }
                        if (!unresolvedSignalNames.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, SignalDefinitionsService.callGetDefinitions(unresolvedSignalNames)];
                    case 1:
                        signalDefinitions = _a.sent();
                        for (index = 0; index < unresolvedSignalNames.length; index++) {
                            definition = signalDefinitions && signalDefinitions.length > index ? signalDefinitions[index] : null;
                            signalName = unresolvedSignalNames[index];
                            cachedDefinition = SignalDefinitionsService.getCachedDefinition(signalName);
                            cachedDefinition(definition);
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }, window.debounceIntervalResolvingSignalDefinitions);
        return SignalDefinitionsService;
    }());
    return SignalDefinitionsService;
});
//# sourceMappingURL=signalDefinitionsService.js.map