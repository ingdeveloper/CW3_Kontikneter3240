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
define(["require", "exports", "../component-base.model"], function (require, exports, ComponentBaseModel) {
    "use strict";
    var WfSignalInformationComponent = /** @class */ (function (_super) {
        __extends(WfSignalInformationComponent, _super);
        function WfSignalInformationComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.output = ko.observable("");
            // Stop processing here if no signalname is defined
            if (!_this.signalName) {
                return _this;
            }
            _this.getOutput();
            // Get signal information
            _this.getSignalDefinition();
            return _this;
        }
        WfSignalInformationComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            this.signalDefinitions = ko.observable({});
            this.signalDefinitions.subscribe(function (definition) {
                _this.output(_this.getOutput());
            }, this);
            this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
            this.propertyName = ko.unwrap(this.settings.propertyName) || 'Unit';
            this.logTagName = (ko.unwrap(this.settings.logTagName) || '').stringPlaceholderResolver(this.objectID);
            this.selectedLanguageId = this.connector.currentLanguageId;
            this.selectedLanguageId.subscribe(function () {
                // Reload the signal information on language change
                _this.getSignalDefinition();
            });
        };
        WfSignalInformationComponent.prototype.getOutput = function () {
            if (!this.propertyName)
                return "";
            //Simple property of SignalDefinitionDTO
            if (_.indexOf(this.propertyName, '.') === -1)
                return !isNullOrUndefined(this.signalDefinitions()[this.propertyName]) ? this.signalDefinitions()[this.propertyName] : "";
            var options = this.propertyName.split(".");
            var logs = this.signalDefinitions()[options[0]];
            if (!logs)
                return "";
            if (_.isArray(logs)) { //Logs, Array property of SignalDefinitionDTO
                if (options[0] !== "Logs")
                    return "";
                if (!this.logTagName)
                    return "";
                var length = logs.length;
                for (var j = 0; j < length; j++)
                    if (logs[j]["LogTag"] === this.logTagName)
                        return logs[j][options[1]] || "";
            }
            return logs[options[1]] || ""; //DTO property of SignalDefinitionDTO
        };
        WfSignalInformationComponent.prototype.getSignalDefinition = function () {
            return __awaiter(this, void 0, void 0, function () {
                var definition, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.connector.getSignalDefinition(this.signalName)];
                        case 1:
                            definition = _a.sent();
                            if (definition) {
                                this.signalDefinitions(definition);
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.connector.handleError(WfSignalInformationComponent);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalInformationComponent.prototype.dispose = function () {
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
        return WfSignalInformationComponent;
    }(ComponentBaseModel));
    return WfSignalInformationComponent;
});
//# sourceMappingURL=wf-signal-information.component.js.map