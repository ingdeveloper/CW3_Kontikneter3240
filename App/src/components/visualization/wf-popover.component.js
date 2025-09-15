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
define(["require", "exports", "../../services/logger", "../component-base.model", "../services/visual-states.service"], function (require, exports, Logger, ComponentBaseModel, VisualStatesService) {
    "use strict";
    var WfPopoverComponent = /** @class */ (function (_super) {
        __extends(WfPopoverComponent, _super);
        function WfPopoverComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.initializeStates();
            return _this;
        }
        WfPopoverComponent.prototype.initializeStates = function () {
            this.states = new VisualStatesService(this.settings);
            this.statusCssClass = this.states.statusCssClass;
        };
        WfPopoverComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            this.resolvePlaceholders = this.settings.resolvePlaceholders || false;
            this.isNested = this.settings.isNested || false;
            this.viewName = this.settings.viewName !== undefined ? ko.unwrap(this.settings.viewName) : "";
            this.viewName = this.viewName.stringPlaceholderResolver(this.objectID);
            this.viewPath = this.settings.viewPath !== undefined ? ko.unwrap(this.settings.viewPath) : "src/views/popovers/";
            this.cssClass = ko.unwrap(this.settings.cssClass);
            this.template = this.viewName ? 'wf-signal-information-popover-' + ko.unwrap(this.id) : "";
            this.template = this.template.stringPlaceholderResolver(this.objectID);
            this.componentName = 'wf-popover-content' + ko.unwrap(this.id);
            this.container = this.settings.container !== undefined ? ko.unwrap(this.settings.container) : false;
            this.content = this.settings.content !== undefined ? ko.unwrap(this.settings.content) : "";
            this.delay = this.settings.delay !== undefined ? ko.unwrap(this.settings.delay) : 0;
            this.html = this.settings.html !== undefined ? ko.unwrap(this.settings.html) : false;
            this.position = this.settings.position !== undefined ? ko.unwrap(this.settings.position) : "right";
            this.title = ko.observable(this.settings.title !== undefined ? ko.unwrap(this.settings.title) : "");
            this.trigger = this.settings.trigger !== undefined ? ko.unwrap(this.settings.trigger) : "click";
            this.singleMode = this.settings.singleMode !== undefined ? ko.unwrap(this.settings.singleMode) : false;
            this.closeButton = this.settings.closeButton !== undefined ? ko.unwrap(this.settings.closeButton) : true;
            this.closeButtonCssClass = ko.unwrap(this.settings.closeButtonCssClass) || "";
            this.headerCssClass = ko.unwrap(this.settings.headerCssClass) || "";
            this.contentCssClass = ko.unwrap(this.settings.contentCssClass) || "";
            this.width = ko.unwrap(this.settings.width);
            this.height = ko.unwrap(this.settings.height);
            this.disableOverlayColor = ko.unwrap(this.settings.disableOverlayColor) || "rgba(255,255,255,.5)";
            ko.components.register(this.componentName, {
                viewModel: function () { },
                template: "<div/>"
            });
            var isViewModelObservable = this.settings.viewModel !== undefined && typeof this.settings.viewModel === "function";
            this.viewModel = isViewModelObservable ? this.settings.viewModel : ko.observable();
            this.viewModel.subscribe(function (newValue) {
                if (!newValue)
                    return;
                _this.applyViewModel(newValue);
            }, this);
            if (!isViewModelObservable)
                this.viewModel(this.stringPlaceholderResolver(this.settings.viewModel) || {});
        };
        WfPopoverComponent.prototype.applyViewModel = function (viewModel) {
            var _this = this;
            if (!this.viewName) {
                if (!this.isNested)
                    return Logger.warn(this, "Property 'viewName' is empty!");
                else
                    return;
            }
            var viewPath = this.viewPath;
            if (_.last(viewPath) !== "/")
                viewPath = viewPath + "/";
            this.viewName = this.escapeQueryStringParameters(this.viewName);
            var path = "" + viewPath + this.viewName;
            path = path.stringPlaceholderResolver(this.objectID);
            try {
                ko.components.unregister(this.componentName);
            }
            catch (error) {
            }
            if (this.resolvePlaceholders) {
                require(["text!" + path], function (responseText) {
                    responseText = wf.utilities.ResolveStringPlaceholders(path, responseText).stringPlaceholderResolver(_this.objectID);
                    var title = wf.utilities.ResolveStringPlaceholders(path, _this.title());
                    title = title.stringPlaceholderResolver(_this.objectID);
                    title = ko.unwrap(_this.connector.translate(title));
                    _this.title(title);
                    ko.components.register(_this.componentName, {
                        viewModel: WfPopoverComponentViewModel,
                        template: responseText
                    });
                });
            }
            else {
                var title = ko.unwrap(this.connector.translate(this.title())).stringPlaceholderResolver(this.objectID);
                this.title(title);
                if (!this.isValidWebsiteAddress(this.viewName)) {
                    path = path + ".html";
                }
                else {
                    path = this.viewName.stringPlaceholderResolver(this.objectID);
                }
                ko.components.register(this.componentName, {
                    viewModel: WfPopoverComponentViewModel,
                    template: { require: "text!" + path }
                });
            }
        };
        ;
        WfPopoverComponent.prototype.escapeQueryStringParameters = function (url) {
            var queryStringSeparatorIndex = url.indexOf("?");
            if (queryStringSeparatorIndex === -1)
                return url;
            var queryString = url.substring(queryStringSeparatorIndex + 1);
            var baseUrl = url.substring(0, queryStringSeparatorIndex);
            return baseUrl + "?" + this.escapeCommonURLReservedCharacters(queryString);
        };
        WfPopoverComponent.prototype.escapeCommonURLReservedCharacters = function (text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, function (value) {
                if (value === void 0) { value = "$&"; }
                return "%" + value.charCodeAt(0).toString(16).toUpperCase();
            });
        };
        //private isValidWebsiteAddress(url: string): boolean {
        //    var regex = new RegExp("^((http|https|ftp|smtp):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$", "gm");
        //    return regex.test(url);
        //}
        WfPopoverComponent.prototype.isValidWebsiteAddress = function (str) {
            var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            if (regexp.test(str)) {
                return true;
            }
            else {
                return false;
            }
        };
        WfPopoverComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            this.states.unregisterSignals();
                            if (!this.signal)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.connector.unregisterSignals(this.signal)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfPopoverComponent;
    }(ComponentBaseModel));
    var WfPopoverComponentViewModel = /** @class */ (function () {
        function WfPopoverComponentViewModel(params) {
            var viewModel = params.viewModel();
            for (var key in viewModel) {
                if (viewModel.hasOwnProperty(key)) {
                    this[key] = viewModel[key];
                }
            }
            this.connector = params.connector;
        }
        return WfPopoverComponentViewModel;
    }());
    return WfPopoverComponent;
});
//# sourceMappingURL=wf-popover.component.js.map