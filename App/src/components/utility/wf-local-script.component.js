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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
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
define(["require", "exports", "../utility-component-base.model"], function (require, exports, UtilityComponentBaseModel) {
    "use strict";
    var WfLocalScriptComponent = /** @class */ (function (_super) {
        __extends(WfLocalScriptComponent, _super);
        function WfLocalScriptComponent(params) {
            return _super.call(this, params) || this;
        }
        WfLocalScriptComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            var inputSignalNames = ko.unwrap(this.settings.inputSignalNames) || [];
            this.inputSignalNames = inputSignalNames.map(function (x) { return x.stringPlaceholderResolver(_this.objectID); });
            this.outputSignalName = UtilityComponentBaseModel.stringParam(this.settings.outputSignalName, "").stringPlaceholderResolver(this.objectID);
            this.isAsync = ko.unwrap(this.settings.isAsync) === true;
            this.inputSignals = this.inputSignalNames.map(function (x) { return _this.connector.getSignal(x); });
            this.setScript = function (value) { return _this.startProcess(value); };
        };
        WfLocalScriptComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _b.sent();
                            this.process.dispose();
                            return [4 /*yield*/, (_a = this.connector).unregisterSignals.apply(_a, __spread(this.inputSignals))];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfLocalScriptComponent.prototype.processInput = function () {
            var e_1, _a;
            var _this = this;
            var valuesArray = [];
            var values = {};
            try {
                for (var _b = __values(this.inputSignals), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var signal = _c.value;
                    var value = signal.hasValue() ? signal.value() : undefined;
                    valuesArray.push(value);
                    values[signal.signalName()] = value;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (!this.isAsync) {
                try {
                    var output = this.scriptFunction(values, valuesArray, this.connector);
                    this.writeOutputSignal(output);
                }
                catch (error) {
                    this.connector.handleError(this)(error);
                }
            }
            else {
                var output = this.scriptFunction(values, valuesArray, this.connector);
                output.then(function (value) { return _this.writeOutputSignal(value); })
                    .catch(function (error) { return _this.connector.handleError(_this)(error); });
            }
        };
        WfLocalScriptComponent.prototype.writeOutputSignal = function (output) {
            if (this.outputSignalName) {
                var outputValue = {};
                outputValue[this.outputSignalName] = output;
                this.connector.writeSignals(outputValue);
            }
        };
        WfLocalScriptComponent.prototype.startProcess = function (script) {
            var _this = this;
            var functionBody = UtilityComponentBaseModel.stringParam(script, "return null;").stringPlaceholderResolver(this.objectID).trim();
            this.scriptFunction = new Function("values", "valuesArray", "connector", functionBody);
            this.process = ko.computed(function () { return _this.processInput(); });
        };
        return WfLocalScriptComponent;
    }(UtilityComponentBaseModel));
    return WfLocalScriptComponent;
});
//# sourceMappingURL=wf-local-script.component.js.map