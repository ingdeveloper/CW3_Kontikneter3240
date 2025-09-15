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
define(["require", "exports", "../../services/signalsService", "../component-base.model"], function (require, exports, SignalsService, ComponentBaseModel) {
    "use strict";
    var WfSignalInformationPopupListComponent = /** @class */ (function (_super) {
        __extends(WfSignalInformationPopupListComponent, _super);
        function WfSignalInformationPopupListComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.signalDefinitions = ko.observableArray([]);
            _this.pattern = ko.observable("");
            _this.filteredSignalDefinitions = ko.computed(function () {
                var pattern = ko.unwrap(_this.pattern).toLowerCase();
                return _this.signalDefinitions().filter(function (i) {
                    return (i.AliasName || i.Name || "").toLowerCase().indexOf(pattern) >= 0 ||
                        (i.Description || "").toLowerCase().indexOf(pattern) >= 0 ||
                        (i.Unit || "").toLowerCase().indexOf(pattern) >= 0;
                });
            });
            _this.getDataAsync();
            _this.languageIdChangedSubscription = _this.connector.currentLanguageId.subscribe(function () { return _this.getDataAsync(); });
            return _this;
        }
        WfSignalInformationPopupListComponent.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.objectSettings = (ko.unwrap(this.settings.objectSettings) || "").stringPlaceholderResolver(this.objectID);
            this.signalPrefix = (ko.unwrap(this.settings.signalPrefix) || "").stringPlaceholderResolver(this.objectID);
            this.writeToBuffer = (ko.unwrap(this.settings.writeToBuffer) || false);
        };
        WfSignalInformationPopupListComponent.prototype.getDataAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var signals;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            signals = this.getSignalNamesFromPartameter();
                            return [4 /*yield*/, this.getSignalDefinitionsAsync(this.objectSettings.length > 0 ? signals : null)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalInformationPopupListComponent.prototype.getSignalNamesFromPartameter = function () {
            var _this = this;
            return this.objectSettings
                .replace(/;\s*$/, "")
                .split(";")
                .map(function (objectName) { return "" + _this.signalPrefix + objectName; });
        };
        WfSignalInformationPopupListComponent.prototype.getSignalDefinitionsAsync = function (signals) {
            if (signals === void 0) { signals = null; }
            return __awaiter(this, void 0, void 0, function () {
                var aliasNames, filter, signalDefinitions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            aliasNames = signals || [this.signalPrefix + "*"];
                            filter = {
                                ServerNames: [],
                                AliasNames: aliasNames,
                                LogTags: [],
                                ResultsFilter: SignalDefinitionResultsFilter.Extended
                            };
                            return [4 /*yield*/, SignalsService.getSignalDefinitions(filter, 0, 250)];
                        case 1:
                            signalDefinitions = _a.sent();
                            this.signalDefinitions(signalDefinitions);
                            return [2 /*return*/];
                    }
                });
            });
        };
        WfSignalInformationPopupListComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.languageIdChangedSubscription.dispose();
                            this.filteredSignalDefinitions.dispose();
                            return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfSignalInformationPopupListComponent;
    }(ComponentBaseModel));
    return WfSignalInformationPopupListComponent;
});
//# sourceMappingURL=wf-signal-information-popup-list.component.js.map