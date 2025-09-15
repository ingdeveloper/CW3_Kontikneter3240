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
define(["require", "exports", "../../services/connector", "../../services/logger"], function (require, exports, Connector, Logger) {
    "use strict";
    var StatesService = /** @class */ (function () {
        function StatesService(settings) {
            this.currentStatesModels = ko.observableArray([]);
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
        StatesService.prototype.buildStates = function () {
            var states = [];
            for (var i = 0; (i < this.conditionRules.length) || (i < this.stateSignals.length); i++) {
                states.push([this.stateSignals[i], this.maskSignals[i], this.operators[i], this.conditionRules[i], this.conditionRuleSignals[i]]);
            }
            return states;
        };
        StatesService.prototype.createStates = function (settings) {
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
        StatesService.prototype.addStates = function (newStates) {
            var states = { writeToBuffer: false };
            states.states = [newStates];
            this.createStates(states);
            this.fillFromStates(states);
            this.dummyObservable.notifySubscribers();
        };
        StatesService.prototype.initializeComputeds = function () {
            var _this = this;
            this.currentStates = ko.computed(function () {
                _this.currentStatesModels([]);
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
                    _this.currentStatesModels.push({
                        signalName: states[i][0],
                        maskSignal: states[i][1],
                        operator: states[i][2],
                        conditionRule: states[i][3],
                        cssClassName: undefined,
                        isValid: ko.observable(isStateValid === null || isStateValid === undefined ? false : isStateValid),
                        symbolicText: undefined
                    });
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
            this.currentStateModel = ko.computed(function () {
                _this.currentState();
                var result = {
                    signalName: _this.stateSignals[0],
                    maskSignal: _this.maskSignals[0],
                    conditionRule: _this.conditionRules[0],
                    operator: _this.operators[0],
                    cssClassName: undefined,
                    isValid: ko.observable(false),
                    symbolicText: undefined
                };
                return result;
            });
            this.currentStateIndex = ko.pureComputed(function () {
                return Number(_this.currentState().substring(5));
            });
        };
        StatesService.prototype.fillFromStates = function (settings) {
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
        StatesService.prototype.applyOperator = function (signal, mask, operator) {
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
        StatesService.prototype.initializeSignals = function (conditionRule, conditionRuleSignals) {
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
        StatesService.prototype.replacePlaceholder = function (conditionRule, conditionRuleSignals) {
            if (!conditionRule)
                return null;
            conditionRuleSignals.forEach(function (signal) {
                var value = signal.value();
                var replacementValue = value;
                if (typeof value === "string" && value !== "n/a")
                    replacementValue = ("'" + value + "'").toLowerCase();
                conditionRule = conditionRule.toLowerCase().replace("%" + signal.signalName().toLowerCase() + "%", replacementValue);
            });
            return conditionRule;
        };
        StatesService.prototype.allSignalsAreAvailable = function (conditionRuleSignals) {
            if (conditionRuleSignals === undefined || conditionRuleSignals === null)
                conditionRuleSignals = [];
            for (var i = 0; i < conditionRuleSignals.length; i++) {
                var value = conditionRuleSignals[i].value();
                if (typeof value === "string" && value !== "n/a")
                    return true;
                if (value == "n/a") {
                    console.warn("Signal are not available (n/a)", conditionRuleSignals[i]);
                    return false;
                }
                if (isNaN(value) || value === undefined) {
                    console.warn("Invalid signal in state (is NaN or undefined)", conditionRuleSignals[i]);
                    return false;
                }
            }
            return true;
        };
        //try to resolve the conditionRule over traverse function
        StatesService.prototype.resolveConditionRule = function (conditionRule, conditionRuleSignals) {
            if (!Array.isArray(conditionRuleSignals))
                conditionRuleSignals = [];
            if (!this.allSignalsAreAvailable(conditionRuleSignals)) {
                return null;
            }
            if (conditionRule !== null) {
                try {
                    var rawCondition = this.replacePlaceholder(this.resolveConditionForSignalReplacement(conditionRule), conditionRuleSignals);
                    if (StatesService.ConditionRuleCache.hasOwnProperty(rawCondition) || StatesService.ConditionRuleCache[conditionRule] === null) {
                        return StatesService.ConditionRuleCache[rawCondition];
                    }
                    // console.log("Run condition: '" + rawCondition + "'");
                    var result = this.traverse(jsep(rawCondition), 0);
                    StatesService.ConditionRuleCache[rawCondition] = result;
                    return result;
                }
                catch (ex) {
                    console.error("Parser error: conditionRule: '" + conditionRule + "', with signals '" + conditionRuleSignals.map(function (signal) { return signal.signalName(); }).toString() + "', " + ex, this);
                    StatesService.ConditionRuleCache[conditionRule] = null;
                    return null;
                }
            }
            else {
                return null;
            }
        };
        StatesService.prototype.resolveConditionForSignalReplacement = function (condition) {
            if (window.usei4Connector) {
                return condition;
            }
            var regex = /%[^%]+::/;
            var resolvedCondition = condition.replace(regex, "%");
            return resolvedCondition;
        };
        //helper methode to get SignalNames from a String, the signalName is souroundet by %
        StatesService.prototype.filterSignals = function (condition) {
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
        StatesService.prototype.traverse = function (para, i) {
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
                if (para.operator === "~") {
                    return ~this.traverse(para.argument, i);
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
        StatesService.prototype.getAsStringObject = function (param) {
            return param ? param.toString() : "";
        };
        StatesService.prototype.unregisterSignals = function () {
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
        StatesService.prototype.replacePlaceholderObjectID = function (arrayOfString, objectID) {
            if (!arrayOfString)
                return null;
            for (var i = 0; i < arrayOfString.length; i++)
                arrayOfString[i] = (ko.unwrap(arrayOfString[i]) || '').stringPlaceholderResolver(objectID);
        };
        StatesService.prototype.setJsepBinaryOperators = function () {
            jsep.addBinaryOp("endswith", 10);
            jsep.addBinaryOp("startswith", 10);
            jsep.addBinaryOp("contains", 10);
        };
        StatesService.ConditionRuleCache = {};
        return StatesService;
    }());
    return StatesService;
});
//# sourceMappingURL=states.service.js.map