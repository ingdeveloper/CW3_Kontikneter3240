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
define(["require", "exports", "../viewModelBase", "../../services/connector", "../../services/models/logValuesFilter"], function (require, exports, ViewModelBase, Connector, LogValuesFilter) {
    "use strict";
    var LogTagsTutorial = /** @class */ (function (_super) {
        __extends(LogTagsTutorial, _super);
        function LogTagsTutorial() {
            var _this = _super.call(this) || this;
            _this.connector = new Connector();
            return _this;
        }
        LogTagsTutorial.prototype.activate = function () {
            //-------------------------------------------------------------------
            // Settings, properties
            //-------------------------------------------------------------------
            var _this = this;
            this.signalName1 = ko.observable("Level 1");
            this.logTagName1 = ko.observable("LogTagLevel1");
            this.signalName2 = ko.observable("Level 2");
            this.logTagName2 = ko.observable("LogTagLevel2");
            // Definition of time range for values
            this.startDate = ko.observable(moment().subtract(1, "minute"));
            this.endDate = ko.observable(moment());
            // Misc required settings
            this.maxResults = 5;
            this.sortOrder = ko.observable(LogValuesSortOrder.DateDescending);
            //-------------------------------------------------------------------
            this.signals = ko.observableArray();
            this.signals.subscribe(this.getSignalInformation, this);
            this.signalDefinitions = ko.observableArray();
            this.logTag1 = ko.observable();
            this.logTag2 = ko.observable();
            this.logIds = ko.observableArray();
            this.logValues = ko.observableArray();
            this.timeStamps1 = ko.observableArray();
            this.values1 = ko.observableArray();
            this.timeStamps2 = ko.observableArray();
            this.values2 = ko.observableArray();
            this.valuesArray1 = ko.computed(function () {
                return _.zip(_this.timeStamps1(), _this.values1());
            }, this);
            this.valuesArray2 = ko.computed(function () {
                return _.zip(_this.timeStamps2(), _this.values2());
            }, this);
            this.addSignal();
        };
        LogTagsTutorial.prototype.addSignal = function () {
            this.signals.push(this.signalName1(), this.signalName2());
        };
        LogTagsTutorial.prototype.getSignalInformation = function () {
            return __awaiter(this, void 0, void 0, function () {
                var servers, aliases, logTags, definitions, signalDefinition1, signalDefinition2, logTag1, logTag2, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            servers = ["."];
                            aliases = ko.unwrap(this.signals);
                            logTags = null;
                            // Return if no signalname is  configured
                            if (!aliases.length)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.connector.getSignalDefinitions(aliases)];
                        case 2:
                            definitions = _a.sent();
                            // Store signalDefinitions 
                            this.signalDefinitions(definitions);
                            signalDefinition1 = _.find(this.signalDefinitions(), function (x) { return x.AliasName === _this.signalName1(); });
                            signalDefinition2 = _.find(this.signalDefinitions(), function (x) { return x.AliasName === _this.signalName2(); });
                            logTag1 = _.find(signalDefinition1.Logs, function (log) { return log.LogTag === _this.logTagName1(); });
                            logTag2 = _.find(signalDefinition2.Logs, function (log) { return log.LogTag === _this.logTagName2(); });
                            // Store raw logTag object for demo purposes
                            this.logTag1(logTag1);
                            this.logTag2(logTag2);
                            if (logTag1 && logTag2) {
                                //console.log('LogTag Object:' + logTag.ID);
                                this.logIds.push(logTag1.ID);
                                //console.log('LogTag Object:' + logTag.ID);
                                this.logIds.push(logTag2.ID);
                                // Get logTag values from database
                                this.getLogValues();
                            }
                            else {
                                //  console.log("No LogTags with name " + this.logTagName1() + " found for signal " + this.signalName());
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.connector.handleError(LogTagsTutorial)(error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        LogTagsTutorial.prototype.getLogValues = function () {
            return __awaiter(this, void 0, void 0, function () {
                var filter, logValues, timeStamps1, values1, timeStamps2, values2, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = new LogValuesFilter(this.logIds(), ko.unwrap(this.startDate), ko.unwrap(this.endDate), ko.unwrap(this.maxResults), ko.unwrap(this.sortOrder));
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.connector.getLogValues(filter)
                                // Store raw response for for further processing
                            ];
                        case 2:
                            logValues = _a.sent();
                            // Store raw response for for further processing
                            this.logValues(logValues);
                            timeStamps1 = [];
                            values1 = [];
                            timeStamps2 = [];
                            values2 = [];
                            _.each(logValues, function (row) {
                                // Get the logged value    
                                if (row.Values[0]) {
                                    // Store the timestamp
                                    timeStamps1.push(row.EntriesDate);
                                    if (row.Values[0].Value) {
                                        values1.push(row.Values[0].Value);
                                    }
                                }
                                // Get the logged value    
                                if (row.Values[1]) {
                                    // Store the timestamp
                                    timeStamps2.push(row.EntriesDate);
                                    if (row.Values[1].Value) {
                                        values2.push(row.Values[1].Value);
                                    }
                                }
                            });
                            // Store the extracted timestamps and values to separate observable arrays
                            this.values1(values1);
                            this.timeStamps1(timeStamps1);
                            this.values2(values2);
                            this.timeStamps2(timeStamps2);
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            this.connector.handleError(LogTagsTutorial)(error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        LogTagsTutorial.prototype.changeSignal = function (signalName, logTagName) {
            console.log(signalName + ' ' + logTagName);
            this.logTagName1(logTagName);
            this.signalName1(signalName);
            // Reset properties
            this.signals.removeAll();
            this.signalDefinitions(null);
            this.logTag1(null);
            this.logTag2(null);
            this.logIds.removeAll();
            this.logValues.removeAll();
            this.timeStamps1.removeAll();
            this.values1.removeAll();
            this.timeStamps2.removeAll();
            this.values2.removeAll();
            // Trigger getting log values with new settings
            this.addSignal();
        };
        return LogTagsTutorial;
    }(ViewModelBase));
    return LogTagsTutorial;
});
//# sourceMappingURL=log-tags.tutorial.js.map