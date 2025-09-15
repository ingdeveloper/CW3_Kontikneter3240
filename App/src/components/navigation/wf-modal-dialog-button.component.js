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
define(["require", "exports", "../component-base.model", "../services/visual-states.service"], function (require, exports, ComponentBaseModel, VisualStatesService) {
    "use strict";
    var WfModalDialogButtonComponent = /** @class */ (function (_super) {
        __extends(WfModalDialogButtonComponent, _super);
        function WfModalDialogButtonComponent(params) {
            var _this = _super.call(this, params) || this;
            _this.initializeStates();
            return _this;
        }
        WfModalDialogButtonComponent.prototype.initializeSettings = function () {
            var _this = this;
            _super.prototype.initializeSettings.call(this);
            var cssClass = ko.unwrap(this.settings.cssClass) || "btn-default";
            var flat = ko.unwrap(this.settings.flat) ? ko.unwrap(this.settings.flat) : false;
            var showModal = ko.unwrap(this.settings.showModal) ? ko.unwrap(this.settings.showModal) : true;
            var modalUrl = ko.unwrap(this.settings.modalSource) || "";
            //const modalParameters = this.mapParametersToQueryStringParameters(ko.unwrap(this.settings.modalParameters));
            var modalParameters = (ko.unwrap(this.settings.modalParameters) || "").stringPlaceholderResolver(this.objectID);
            var fontSize = ko.unwrap(this.settings.fontSize) || 14;
            var fontBold = ko.unwrap(this.settings.fontBold) ? ko.unwrap(this.settings.fontBold) : false;
            this.dialogClassName = ko.observable(ko.unwrap(this.settings.dialogClassName) || "");
            this.headerClass = ko.observable(ko.unwrap(this.settings.headerClass) || "");
            this.dataTitle = ko.observable((ko.unwrap(this.settings.modalTitle) || "").stringPlaceholderResolver(this.objectID));
            this.dataPlacement = ko.observable(ko.unwrap(this.settings.modalDialogPlacement) || "center");
            this.bodyHeight = ko.observable(ko.unwrap(this.settings.bodyHeight) || 250);
            this.bodyWidth = ko.observable(ko.unwrap(this.settings.bodyWidth) || 300);
            this.iconStyle = ko.observable(ko.unwrap(this.settings.iconCustomCss) || "");
            this.iconClass = ko.observable(ko.unwrap(this.settings.iconClass) || "wf-callout");
            this.showIcon = ko.observable(ko.unwrap(this.settings.showModal) ? ko.unwrap(this.settings.showModal) : true);
            this.fontFamily = ko.observable(ko.unwrap(this.settings.fontFamily) || "Arial");
            this.buttonText = ko.observable(ko.unwrap(this.settings.buttonText) || "");
            this.statusClass = ko.pureComputed(function () {
                var disableStatusClass = _this.isDisabled() ? "wf-disabled-container" : "wf-enabled-container";
                var flatClass = flat ? "wf-flat" : "";
                return cssClass + " " + flatClass + " " + disableStatusClass + " " + _this.states.statusCssClass();
            });
            this.dataSource = ko.pureComputed(function () {
                var result = modalUrl + (modalParameters !== "" && !modalParameters.startsWith("?") ? "?" : "") + modalParameters;
                return encodeURI(result);
            });
            this.dataToggle = ko.pureComputed(function () {
                return showModal ? "modal" : "none";
            });
            this.fontSize = ko.pureComputed(function () {
                return fontSize + "px";
            });
            this.fontWeight = ko.pureComputed(function () {
                return fontBold ? "bold" : "normal";
            });
            //this.isNested = this.settings.isNested || false;
            //this.componentName = 'dialog-content' + ko.unwrap(this.id);
            //this.show = ko.observable(false);
            //this.viewName = this.settings.viewName !== undefined ? ko.unwrap(this.settings.viewName) : "";
            //this.viewPath = this.settings.viewPath !== undefined ? ko.unwrap(this.settings.viewPath) : "./src/views/dialogs/";
            //this.viewModelName = this.settings.viewModelName !== undefined ? ko.unwrap(this.settings.viewModelName) : "";
            //this.viewModelPath = this.settings.viewModelPath !== undefined ? ko.unwrap(this.settings.viewModelPath) : "./src/viewModels/dialogs/";
        };
        WfModalDialogButtonComponent.prototype.initializeStates = function () {
            this.states = new VisualStatesService(this.settings);
        };
        WfModalDialogButtonComponent.prototype.mapParametersToQueryStringParameters = function (parameters) {
            if (!parameters)
                return "";
            var nameValuePairs = [];
            _.each(parameters, function (parameter) {
                nameValuePairs.push(parameter.name + "=" + parameter.value);
            });
            return nameValuePairs.join("'&");
        };
        WfModalDialogButtonComponent.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            this.states.unregisterSignals();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return WfModalDialogButtonComponent;
    }(ComponentBaseModel));
    return WfModalDialogButtonComponent;
});
//# sourceMappingURL=wf-modal-dialog-button.component.js.map