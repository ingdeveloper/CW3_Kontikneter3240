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
define(["require", "exports", "../services/connector", "../components/services/changed-field-animation.service", "../components/component-base.model", "../services/logger"], function (require, exports, Connector, ChangedFieldAnimationService, ComponentBaseModel, Logger) {
    "use strict";
    var CcwWfStateTextComponent = /** @class */ (function (_super) {
        __extends(CcwWfStateTextComponent, _super);
        function CcwWfStateTextComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.initializeStates();
            _this.initializeChangedFieldAnimation();
            _this.connector.getOnlineUpdates(); //.fail(this.connector.handleError(this));
            return _this;
        }
        CcwWfStateTextComponent.prototype.initializeStates = function () {
            this.states = new CcwVisualStatesService(this.settings);
            this.statusCssClass = this.states.statusCssClass;
            this.statusText = this.states.statusText;
            this.css = this.states.css;
            this.elemWidth = ko.observable(ko.unwrap(this.settings.elemWidth) !== undefined ? ko.unwrap(this.settings.elemWidth) : "100%");
            this.elemTextAlign = ko.observable(ko.unwrap(this.settings.elemTextAlign) !== undefined ? ko.unwrap(this.settings.elemTextAlign) : "center");
        };
        CcwWfStateTextComponent.prototype.initializeChangedFieldAnimation = function () {
            this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.statusText, this.css);
        };
        CcwWfStateTextComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
        };
        CcwWfStateTextComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.changedFieldAnimationService.dispose()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.states.unregisterSignals()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        CcwWfStateTextComponent.prototype.info = function () {
            toastr.info("Signal: " + this.settings.stateSignalNames);
        };
        return CcwWfStateTextComponent;
    }(ComponentBaseModel));
    // ################# UNTER KLASSER ################################################
    var CcwStatesService = /** @class */ (function () {
        function CcwStatesService(settings) {
            this.conditionRuleSignals = [];
            this.conditionRules = [];
            this.stateSignals = [];
            this.maskSignals = [];
            this.operators = [];
            this.connector = new Connector();
            this.useBuffer = false;
            this.dummyObservable = ko.observable();
            this.currentStatesIndex = ko.observableArray([]);
            this.useBuffer = settings.writeToBuffer != undefined ? settings.writeToBuffer : false;
            this.setJsepBinaryOperators();
            this.createStates(settings);
            this.fillFromStates(settings);
            this.initializeComputeds();
            this.connector.getOnlineUpdates(); //.fail(Logger.handleError(this));
        }
        CcwStatesService.prototype.buildStates = function () {
            var states = [];
            for (var i = 0; (i < this.conditionRules.length) || (i < this.stateSignals.length); i++) {
                states.push([this.stateSignals[i], this.maskSignals[i], this.operators[i], this.conditionRules[i], this.conditionRuleSignals[i]]);
            }
            return states;
        };
        CcwStatesService.prototype.createStates = function (settings) {
            if (_.any(settings.states)) {
                settings.stateSignalNames = [];
                settings.conditionRules = [];
                settings.maskSignals = [];
                settings.operators = [];
                _.each(settings.states, function (state) {
                    settings.stateSignalNames.push(ko.unwrap(state.signalName));
                    settings.conditionRules.push(state.conditionRule);
                    settings.maskSignals.push(state.maskSignal);
                    settings.operators.push(state.operator);
                });
            }
            if (!Array.isArray(settings.stateSignalNames)) {
                settings.stateSignalNames = [];
                if (settings.stateSignalName1 !== undefined)
                    settings.stateSignalNames[0] = settings.stateSignalName1;
                if (settings.stateSignalName2 !== undefined)
                    settings.stateSignalNames[1] = settings.stateSignalName2;
                if (settings.stateSignalName3 !== undefined)
                    settings.stateSignalNames[2] = settings.stateSignalName3;
                if (settings.stateSignalName4 !== undefined)
                    settings.stateSignalNames[3] = settings.stateSignalName4;
                if (settings.stateSignalName5 !== undefined)
                    settings.stateSignalNames[4] = settings.stateSignalName5;
                if (settings.stateSignalName6 !== undefined)
                    settings.stateSignalNames[5] = settings.stateSignalName6;
                if (settings.stateSignalName7 !== undefined)
                    settings.stateSignalNames[6] = settings.stateSignalName7;
                if (settings.stateSignalName8 !== undefined)
                    settings.stateSignalNames[7] = settings.stateSignalName8;
                var i = 8;
                while (settings.hasOwnProperty("stateSignalName" + i)) {
                    settings.stateSignalNames[i - 1] = settings["stateSignalName" + i] || null;
                    i++;
                }
            }
            this.replacePlaceholderObjectID(settings.stateSignalNames, settings.objectID);
            if (!Array.isArray(settings.conditionRules)) {
                settings.conditionRules = [];
                if (settings.conditionRule1 !== undefined)
                    settings.conditionRules[0] = settings.conditionRule1;
                if (settings.conditionRule2 !== undefined)
                    settings.conditionRules[1] = settings.conditionRule2;
                if (settings.conditionRule3 !== undefined)
                    settings.conditionRules[2] = settings.conditionRule3;
                if (settings.conditionRule4 !== undefined)
                    settings.conditionRules[3] = settings.conditionRule4;
                if (settings.conditionRule5 !== undefined)
                    settings.conditionRules[4] = settings.conditionRule5;
                if (settings.conditionRule6 !== undefined)
                    settings.conditionRules[5] = settings.conditionRule6;
                if (settings.conditionRule7 !== undefined)
                    settings.conditionRules[6] = settings.conditionRule7;
                if (settings.conditionRule8 !== undefined)
                    settings.conditionRules[7] = settings.conditionRule8;
                var i = 8;
                while (settings.hasOwnProperty("conditionRule" + i)) {
                    settings.conditionRules[i - 1] = settings["conditionRule" + i] || null;
                    i++;
                }
            }
            this.replacePlaceholderObjectID(settings.conditionRules, settings.objectID);
            if (!Array.isArray(settings.maskSignals)) {
                settings.maskSignals = [];
                if (settings.maskSignal1 !== undefined)
                    settings.maskSignals[0] = settings.maskSignal1;
                if (settings.maskSignal2 !== undefined)
                    settings.maskSignals[1] = settings.maskSignal2;
                if (settings.maskSignal3 !== undefined)
                    settings.maskSignals[2] = settings.maskSignal3;
                if (settings.maskSignal4 !== undefined)
                    settings.maskSignals[3] = settings.maskSignal4;
                if (settings.maskSignal5 !== undefined)
                    settings.maskSignals[4] = settings.maskSignal5;
                if (settings.maskSignal6 !== undefined)
                    settings.maskSignals[5] = settings.maskSignal6;
                if (settings.maskSignal7 !== undefined)
                    settings.maskSignals[6] = settings.maskSignal7;
                if (settings.maskSignal8 !== undefined)
                    settings.maskSignals[7] = settings.maskSignal8;
                var i = 8;
                while (settings.hasOwnProperty("maskSignal" + i)) {
                    settings.maskSignals[i - 1] = settings["maskSignal" + i] || null;
                    i++;
                }
            }
            if (!Array.isArray(settings.operators)) {
                settings.operators = [];
                if (settings.operator1 !== undefined)
                    settings.operators[0] = settings.operator1;
                if (settings.operator2 !== undefined)
                    settings.operators[1] = settings.operator2;
                if (settings.operator3 !== undefined)
                    settings.operators[2] = settings.operator3;
                if (settings.operator4 !== undefined)
                    settings.operators[3] = settings.operator4;
                if (settings.operator5 !== undefined)
                    settings.operators[4] = settings.operator5;
                if (settings.operator6 !== undefined)
                    settings.operators[5] = settings.operator6;
                if (settings.operator7 !== undefined)
                    settings.operators[6] = settings.operator7;
                if (settings.operator8 !== undefined)
                    settings.operators[7] = settings.operator8;
                var i = 8;
                while (settings.hasOwnProperty("operator" + i)) {
                    settings.operators[i - 1] = settings["operator" + i] || null;
                    i++;
                }
            }
        };
        CcwStatesService.prototype.addStates = function (newStates) {
            var states = { writeToBuffer: false };
            states.states = [newStates];
            this.createStates(states);
            this.fillFromStates(states);
            this.dummyObservable.notifySubscribers();
        };
        CcwStatesService.prototype.initializeComputeds = function () {
            var _this = this;
            this.currentStates = ko.computed(function () {
                var currentStatesIndex = [];
                var currentStates = '';
                var states = _this.buildStates();
                _this.dummyObservable();
                for (var i = 0; i < states.length; i++) {
                    var isStateValid;
                    //checks if conditionRule is set
                    if (states[i][3]) {
                        //process conditionRule
                        isStateValid = _this.resolveConditionRule(states[i][3], states[i][4]);
                    }
                    else {
                        //process maskSignal with operator
                        isStateValid = _this.applyOperator(states[i][0], states[i][1], states[i][2]);
                    }
                    if (isStateValid) {
                        //build state
                        currentStates = currentStates + " state" + (i + 1);
                        currentStatesIndex.push(i);
                    }
                }
                _this.currentStatesIndex(currentStatesIndex);
                if (currentStates !== '') {
                    return currentStates;
                }
                else {
                    return "normal";
                }
            });
            this.currentState = ko.pureComputed(function () {
                var currentStates = _this.currentStates().trim();
                var spaceIndex = currentStates.indexOf(" ");
                return currentStates.substring(0, spaceIndex === -1 ? currentStates.length : spaceIndex);
            });
            this.currentStateIndex = ko.pureComputed(function () {
                return Number(_this.currentState().substring(5));
            });
        };
        CcwStatesService.prototype.fillFromStates = function (settings) {
            var e_1, _a, e_2, _b, e_3, _c;
            try {
                //check if sateSignalNames are set and register signals
                for (var _d = __values(settings.stateSignalNames), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var signal = _e.value;
                    if (ko.unwrap(signal))
                        this.stateSignals.push(this.connector.getSignal(ko.unwrap(signal)));
                    else
                        this.stateSignals.push(null);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var _f = __values(settings.maskSignals), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var signal = _g.value;
                    this.maskSignals.push(signal);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                for (var _h = __values(settings.operators), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var operator = _j.value;
                    this.operators.push(operator);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                }
                finally { if (e_3) throw e_3.error; }
            }
            //Register the signals in conditionRules with initializeSignals
            //ex: conditionRule1: '%Setpoint 1% > %Setpoint 2%'
            var currentConditionRuleSignalsSize = this.conditionRuleSignals.length;
            for (var i = 0; i < settings.conditionRules.length; i++) {
                if (!Array.isArray(this.conditionRuleSignals[i + currentConditionRuleSignalsSize]))
                    this.conditionRuleSignals[i + currentConditionRuleSignalsSize] = [];
                var conditionRule = this.initializeSignals(settings.conditionRules[i], this.conditionRuleSignals[i + currentConditionRuleSignalsSize])
                    ? settings.conditionRules[i]
                    : null;
                this.conditionRules.push(conditionRule);
            }
            this.connector.getOnlineUpdates(); //.fail(Logger.handleError(this));
        };
        // for maskSignal with operator 
        CcwStatesService.prototype.applyOperator = function (signal, mask, operator) {
            var value = "n.Def";
            var readFromBuffer = signal != null && this.useBuffer && this.connector.existSignalInBuffer(signal.signalName());
            if (signal != null && !readFromBuffer)
                value = ko.unwrap(signal.value());
            if (signal != null && readFromBuffer) {
                var tmp = this.connector.readSignalsFromBuffer([signal.signalName()]);
                if (tmp.length > 0)
                    value = tmp[0];
            }
            mask = ko.unwrap(mask);
            operator = ko.unwrap(operator);
            switch (operator) {
                case ">":
                    return value > mask;
                case ">=":
                    return value >= mask;
                case "<":
                    return value < mask;
                case "<=":
                    return value <= mask;
                //check if Signal and  mask is not equals
                //ex.: stateSignalValue1: 3, maskSignal1: 5 =>  3!=5 => true
                //ex.: stateSignalValue1: 5, maskSignal1: 5 =>  5!=5 => false
                case "!=":
                    return value !== mask;
                //AND bit link the signal with the mask, the condition is TRUE if the linking equals the mask
                //ex.: stateSignalValue1: 6, maskSignal1: 2 =>  6&2=2 => 2==2 => true
                //ex.: stateSignalValue1: 5, maskSignal1: 2 =>  5&2=0 => 0==2 => false
                case "&":
                    return (value & mask) === mask;
                //OR bit link the signal with the mask, the condition is TRUE if the linking equals the mask
                //ex.: stateSignalValue1: 1, maskSignal1: 3 =>  1|3=3 => 3==3 => true
                //ex.: stateSignalValue1: 2, maskSignal1: 3 =>  2|3=3 => 3==3 => true
                //ex.: stateSignalValue1: 4, maskSignal1: 3 =>  4|3=7 => 7==3 => false
                case "|":
                    return (value | mask) === mask;
                default:
                    return value === mask;
            }
        };
        // register signals and validate condition;
        CcwStatesService.prototype.initializeSignals = function (conditionRule, conditionRuleSignals) {
            var _this = this;
            if (!conditionRule) {
                return null;
            }
            if ((conditionRule.split("%").length - 1) % 2 === 0) {
                if (!conditionRule.split("%")[1]) { // this template %%...
                    Logger.warn(this, "Placeholder doesn't contain signalName");
                    return null;
                }
                var signalList = this.filterSignals(conditionRule);
                signalList.forEach(function (signalName) {
                    var signal = _this.connector.getSignal(signalName);
                    conditionRuleSignals.push(signal);
                });
                return conditionRule;
            }
            Logger.error(this, "Placeholder is not correctly defined, please wrap a signal name like that:  %SignalName%");
            return null;
        };
        //replace placholder with values
        CcwStatesService.prototype.replacePlaceholder = function (conditionRule, conditionRuleSignals) {
            if (!conditionRule)
                return null;
            conditionRuleSignals.forEach(function (signal) {
                var value = signal.value();
                var replacementValue = value;
                if (typeof value === "string" && value !== "n/a")
                    replacementValue = "'" + value + "'";
                conditionRule = conditionRule.toLowerCase().replace("%" + signal.signalName().toLowerCase() + "%", replacementValue);
            });
            return conditionRule;
        };
        CcwStatesService.prototype.allSignalsAreAvailable = function (conditionRuleSignals) {
            if (conditionRuleSignals === undefined || conditionRuleSignals === null)
                conditionRuleSignals = [];
            for (var i = 0; i < conditionRuleSignals.length; i++) {
                var value = conditionRuleSignals[i].value();
                if (typeof value === "string" && value !== "n/a")
                    return true;
                if (!conditionRuleSignals[i].hasValue() || isNaN(value))
                    return false;
            }
            return true;
        };
        //try to reslove the conditionRule over traverse function
        CcwStatesService.prototype.resolveConditionRule = function (conditionRule, conditionRuleSignals) {
            if (!Array.isArray(conditionRuleSignals))
                conditionRuleSignals = [];
            if (!this.allSignalsAreAvailable(conditionRuleSignals))
                return null;
            if (conditionRule != null) {
                try {
                    return this.traverse(jsep(this.replacePlaceholder(this.resolveConditionForSignalRplacement(conditionRule), conditionRuleSignals)), 0);
                }
                catch (ex) {
                    console.error("Parser error: conditionRule: '" + conditionRule + "', with signals '" + conditionRuleSignals.map(function (signal) { return signal.signalName(); }).toString() + "', " + ex, this);
                    return null;
                }
            }
            else {
                return null;
            }
        };
        CcwStatesService.prototype.resolveConditionForSignalRplacement = function (condition) {
            if (window.usei4Connector) {
                return condition;
            }
            var regex = /%[^%]+::/;
            var resolvedCondition = condition.replace(regex, "%");
            return resolvedCondition;
        };
        //helper methode to get SignalNames from a String, the signalName is souroundet by %
        CcwStatesService.prototype.filterSignals = function (condition) {
            var regex = /%[^%]+%/g;
            var match;
            var signalList = [];
            while ((match = regex.exec(condition)) !== null) {
                signalList.push(match[0].substring(1, match[0].length - 1));
            }
            return signalList;
        };
        //rekursive function to reslove the parse-tree
        //para: geparste conditionRule von jsep
        CcwStatesService.prototype.traverse = function (para, i) {
            i++;
            //check if is singel boolen term or Value
            if (para.value != null) { //abort criterion
                return para.value;
            }
            //chek if term is an prefix like NOT(!), Minus(-)
            if (para.prefix != null) {
                if (para.operator === "!") {
                    return !this.traverse(para.argument, i);
                }
                if (para.operator === "-") {
                    return -this.traverse(para.argument, i);
                }
            }
            //do the magic rekursively and validate the operator
            if (para.operator != null) { //abort criterion
                switch (para.operator) {
                    case ">=":
                        return this.traverse(para.left, i) >= this.traverse(para.right, i);
                    case "<=":
                        return this.traverse(para.left, i) <= this.traverse(para.right, i);
                    case ">":
                        return this.traverse(para.left, i) > this.traverse(para.right, i);
                    case "<":
                        return this.traverse(para.left, i) < this.traverse(para.right, i);
                    case "!=":
                        return this.traverse(para.left, i) !== this.traverse(para.right, i);
                    case "==":
                        return this.traverse(para.left, i) === this.traverse(para.right, i);
                    case "&&":
                        return this.traverse(para.left, i) && this.traverse(para.right, i);
                    case "||":
                        return this.traverse(para.left, i) || this.traverse(para.right, i);
                    case "&":
                        return this.traverse(para.left, i) & this.traverse(para.right, i);
                    case "|":
                        return this.traverse(para.left, i) | this.traverse(para.right, i);
                    case "^":
                        return this.traverse(para.left, i) ^ this.traverse(para.right, i);
                    case "<<":
                        return this.traverse(para.left, i) << this.traverse(para.right, i);
                    case ">>":
                        return this.traverse(para.left, i) >> this.traverse(para.right, i);
                    case "endswith":
                        return this.getAsStringObject(this.traverse(para.left, i)).endsWith(this.getAsStringObject(this.traverse(para.right, i)));
                    case "startswith":
                        return this.getAsStringObject(this.traverse(para.left, i)).startsWith(this.getAsStringObject(this.traverse(para.right, i)));
                    case "contains":
                        return this.getAsStringObject(this.traverse(para.left, i)).indexOf(this.getAsStringObject(this.traverse(para.right, i))) > -1;
                }
            }
            return null;
        };
        CcwStatesService.prototype.getAsStringObject = function (param) {
            return param ? param.toString() : "";
        };
        CcwStatesService.prototype.unregisterSignals = function () {
            var e_4, _a, e_5, _b;
            var signalsToUnregister = [];
            try {
                for (var _c = __values(this.conditionRuleSignals), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var signals = _d.value;
                    signalsToUnregister.push.apply(signalsToUnregister, signals);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_4) throw e_4.error; }
            }
            try {
                //unregister stateSignals
                for (var _e = __values(this.stateSignals), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var stateSignal = _f.value;
                    if (stateSignal != undefined)
                        signalsToUnregister.push(stateSignal);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return this.connector.unregisterSignals.apply(this.connector, signalsToUnregister);
        };
        //replace [OID] -> settings.objectID
        CcwStatesService.prototype.replacePlaceholderObjectID = function (arrayOfString, objectID) {
            if (!arrayOfString)
                return null;
            for (var i = 0; i < arrayOfString.length; i++)
                arrayOfString[i] = (ko.unwrap(arrayOfString[i]) || '').stringPlaceholderResolver(objectID);
        };
        CcwStatesService.prototype.setJsepBinaryOperators = function () {
            jsep.addBinaryOp("endswith", 10);
            jsep.addBinaryOp("startswith", 10);
            jsep.addBinaryOp("contains", 10);
        };
        return CcwStatesService;
    }());
    //export = StatesService;
    // ######################################### UNTER KLASSEN #############################################################
    //import StatesService = require("../components/services/states.service");
    var CcwVisualStatesService = /** @class */ (function (_super) {
        __extends(CcwVisualStatesService, _super);
        function CcwVisualStatesService(settings) {
            var _this = _super.call(this, settings) || this;
            _this.createCssStates(settings);
            _this.createSymbolicTextStates(settings);
            _this.initializeComputeds();
            return _this;
        }
        CcwVisualStatesService.prototype.createSymbolicTextStates = function (settings) {
            var _this = this;
            this.symbolicTexts = [settings.symbolicTextNormalState];
            if (_.any(settings.states)) {
                _.each(settings.states, function (state) {
                    _this.symbolicTexts.push(state.symbolicText);
                });
            }
            else if (!Array.isArray(settings.symbolicTexts)) {
                this.symbolicTexts.push(settings.symbolicTextState1);
                this.symbolicTexts.push(settings.symbolicTextState2);
                this.symbolicTexts.push(settings.symbolicTextState3);
                this.symbolicTexts.push(settings.symbolicTextState4);
                this.symbolicTexts.push(settings.symbolicTextState5);
                this.symbolicTexts.push(settings.symbolicTextState6);
                this.symbolicTexts.push(settings.symbolicTextState7);
                this.symbolicTexts.push(settings.symbolicTextState8);
            }
            else {
                this.symbolicTexts.push.apply(this.symbolicTexts, settings.symbolicTexts);
            }
            this.replacePlaceholderObjectID(this.symbolicTexts, settings.objectID);
        };
        CcwVisualStatesService.prototype.createCssStates = function (settings) {
            var _this = this;
            this.cssClassNames = [settings.cssClassNormalState || "normal"];
            if (_.any(settings.states)) {
                _.each(settings.states, function (state) {
                    _this.cssClassNames.push(state.cssClassName);
                });
            }
            else if (!Array.isArray(settings.cssClassStates)) {
                this.cssClassNames.push(settings.cssClassState1 || "state1");
                this.cssClassNames.push(settings.cssClassState2 || "state2");
                this.cssClassNames.push(settings.cssClassState3 || "state3");
                this.cssClassNames.push(settings.cssClassState4 || "state4");
                this.cssClassNames.push(settings.cssClassState5 || "state5");
                this.cssClassNames.push(settings.cssClassState6 || "state6");
                this.cssClassNames.push(settings.cssClassState7 || "state7");
                this.cssClassNames.push(settings.cssClassState8 || "state8");
            }
            else {
                this.cssClassNames.push.apply(this.cssClassNames, settings.cssClassStates);
            }
        };
        CcwVisualStatesService.prototype.initializeComputeds = function () {
            var _this = this;
            _super.prototype.initializeComputeds.call(this);
            this.statusCssClass = ko.pureComputed(function () {
                var stateNumber = ko.unwrap(_this.currentStateIndex);
                var cssClass = _.isNaN(stateNumber) ||
                    stateNumber >= _this.cssClassNames.length ?
                    _this.cssClassNames[0] :
                    _this.cssClassNames[stateNumber];
                return cssClass;
            });
            this.statusText = ko.pureComputed(function () {
                var stateNumber = ko.unwrap(_this.currentStateIndex);
                var stateText = _.isNaN(stateNumber) ||
                    stateNumber >= _this.symbolicTexts.length ?
                    _this.symbolicTexts[0] :
                    _this.symbolicTexts[stateNumber];
                return stateText;
            });
            this.css = ko.pureComputed(function () {
                // console.log("--- State ---- ");
                // console.log(this.stateSignals);
                var einSignalNichtVorhanden = false;
                var logtext = "[ccw-wf-state-text] Ohne Signal: ";
                var erg = _this.currentState() + " " + _this.statusCssClass();
                // überprüfen, ob Signalwert vorhanden ist (ungleich "null" oder "undefinded")
                for (var i = 0; i < _this.stateSignals.length; i++) {
                    var val = _this.stateSignals[i].value();
                    if ((val == null) || (val == undefined) || (val === 'n/a')) {
                        einSignalNichtVorhanden = true;
                        logtext = logtext + " " + _this.stateSignals[i].signalName();
                    }
                }
                if (einSignalNichtVorhanden) {
                    console.log("%c" + logtext, "background-color: orange");
                    erg = "ccw-wf-state-text-bg-OhneSignal ccw-flash-bg";
                }
                return erg;
            }, this);
            this.multipleCss = ko.pureComputed(function () {
                var e_6, _a;
                var currentStates = "";
                var currentStatesIndex = ko.unwrap(_this.currentStatesIndex);
                if (currentStatesIndex === null || currentStatesIndex === undefined || currentStatesIndex.length === 0) {
                    return _this.cssClassNames[0] + " state" + 0;
                }
                try {
                    for (var currentStatesIndex_1 = __values(currentStatesIndex), currentStatesIndex_1_1 = currentStatesIndex_1.next(); !currentStatesIndex_1_1.done; currentStatesIndex_1_1 = currentStatesIndex_1.next()) {
                        var index = currentStatesIndex_1_1.value;
                        var cssClass = _this.cssClassNames[index + 1];
                        if (cssClass) {
                            currentStates = currentStates + " state" + (index + 1) + " " + cssClass;
                        }
                        else {
                            currentStates = currentStates + " state" + (index + 1);
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (currentStatesIndex_1_1 && !currentStatesIndex_1_1.done && (_a = currentStatesIndex_1.return)) _a.call(currentStatesIndex_1);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                return currentStates;
            }, this);
        };
        return CcwVisualStatesService;
    }(CcwStatesService));
    return CcwWfStateTextComponent;
});
//export = CcwVisualStatesService;
//# sourceMappingURL=ccw-wf-state-text.component.js.map