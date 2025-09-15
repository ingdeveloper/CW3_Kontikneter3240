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
define(["require", "exports", "../../../services/connector", "../../../services/connectorEnums"], function (require, exports, Connector, connectorEnums_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HistoricalDataConfigurationLocalService = void 0;
    var HistoricalDataConfigurationLocalService = /** @class */ (function () {
        function HistoricalDataConfigurationLocalService() {
            this.connector = new Connector();
        }
        HistoricalDataConfigurationLocalService.prototype.listAsync = function (namespace) {
            if (namespace === void 0) { namespace = ""; }
            return __awaiter(this, void 0, void 0, function () {
                var list, key, configResult, item;
                return __generator(this, function (_a) {
                    list = [];
                    for (key in localStorage) {
                        if (!key.startsWith("wf-historical-data-chart#" + namespace + "#"))
                            continue;
                        configResult = localStorage.getItem(key);
                        if (!configResult)
                            continue;
                        item = JSON.parse(configResult);
                        list.push({
                            configuration: JSON.parse(item.Content),
                            controlType: item.ControlType,
                            createdOn: moment(item.CreatedOn).toDate(),
                            name: item.Name,
                            namespace: item.Namespace,
                            owner: item.Owner,
                            userId: item.UserId,
                            version: item.Version,
                            id: item.ID
                        });
                    }
                    return [2 /*return*/, list];
                });
            });
        };
        HistoricalDataConfigurationLocalService.prototype.getAsync = function (name, namespace) {
            if (namespace === void 0) { namespace = ""; }
            return __awaiter(this, void 0, void 0, function () {
                var configResult, item;
                return __generator(this, function (_a) {
                    configResult = localStorage.getItem("wf-historical-data-chart#" + namespace + "#" + name);
                    if (!configResult)
                        return [2 /*return*/];
                    item = JSON.parse(configResult);
                    return [2 /*return*/, {
                            configuration: JSON.parse(item.Content),
                            controlType: item.ControlType,
                            createdOn: moment(item.CreatedOn).toDate(),
                            name: item.Name,
                            namespace: item.Namespace,
                            owner: item.Owner,
                            userId: item.UserId,
                            version: item.Version,
                            id: item.ID
                        }];
                });
            });
        };
        HistoricalDataConfigurationLocalService.prototype.createAsync = function (name, configuration, namespace) {
            if (namespace === void 0) { namespace = ""; }
            return __awaiter(this, void 0, void 0, function () {
                var config;
                return __generator(this, function (_a) {
                    config = {
                        ID: uuid.v4(),
                        Name: name,
                        Namespace: namespace,
                        CreatedOn: moment.utc().toMSDate(),
                        Version: 0,
                        ControlType: HistoricalDataConfigurationLocalService.ControlType,
                        Owner: this.connector.currentLoggedInUser(),
                        Content: JSON.stringify(configuration),
                    };
                    localStorage.setItem("wf-historical-data-chart#" + namespace + "#" + name, JSON.stringify(config));
                    return [2 /*return*/];
                });
            });
        };
        HistoricalDataConfigurationLocalService.prototype.updateAsync = function (name, configuration, namespace) {
            if (namespace === void 0) { namespace = ""; }
            return __awaiter(this, void 0, void 0, function () {
                var configResult, configUpdate, config;
                return __generator(this, function (_a) {
                    configResult = localStorage.getItem("wf-historical-data-chart#" + namespace + "#" + name);
                    if (!configResult)
                        return [2 /*return*/];
                    configUpdate = JSON.parse(configResult);
                    config = {
                        ID: configUpdate.ID,
                        Name: configUpdate.Name,
                        Namespace: configUpdate.Namespace,
                        CreatedOn: configUpdate.CreatedOn,
                        Version: configUpdate.Version + 1,
                        ControlType: HistoricalDataConfigurationLocalService.ControlType,
                        Owner: configUpdate.Owner,
                        Content: JSON.stringify(configuration),
                    };
                    localStorage.setItem("wf-historical-data-chart#" + namespace + "#" + name, JSON.stringify(config));
                    return [2 /*return*/];
                });
            });
        };
        HistoricalDataConfigurationLocalService.prototype.deleteAsync = function (name, namespace) {
            if (namespace === void 0) { namespace = ""; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    localStorage.removeItem("wf-historical-data-chart#" + namespace + "#" + name);
                    return [2 /*return*/];
                });
            });
        };
        HistoricalDataConfigurationLocalService.ControlType = connectorEnums_1.ConfigControlType.HistoricalDataChart;
        return HistoricalDataConfigurationLocalService;
    }());
    exports.HistoricalDataConfigurationLocalService = HistoricalDataConfigurationLocalService;
});
//# sourceMappingURL=historical-data-configuration-local.service.js.map