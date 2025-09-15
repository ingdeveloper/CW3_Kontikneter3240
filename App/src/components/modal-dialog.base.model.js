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
define(["require", "exports", "../services/logger", "./component-base.model"], function (require, exports, Logger, ComponentBaseModel) {
    "use strict";
    var ModalDialogBaseModel = /** @class */ (function (_super) {
        __extends(ModalDialogBaseModel, _super);
        function ModalDialogBaseModel(params) {
            return _super.call(this, params) || this;
        }
        ModalDialogBaseModel.prototype.initializeSettings = function () {
            _super.prototype.initializeSettings.call(this);
            this.isNested = this.settings.isNested || false;
            this.componentName = 'dialog-content' + ko.unwrap(this.id);
            this.show = ko.observable(false);
            this.viewName = this.settings.viewName !== undefined ? ko.unwrap(this.settings.viewName) : "";
            this.viewPath = this.settings.viewPath !== undefined ? ko.unwrap(this.settings.viewPath) : "./src/views/dialogs/";
            this.viewModelName = this.settings.viewModelName !== undefined ? ko.unwrap(this.settings.viewModelName) : "";
            this.viewModelPath = this.settings.viewModelPath !== undefined ? ko.unwrap(this.settings.viewModelPath) : "./src/viewModels/dialogs/";
            this.draggable = ko.unwrap(this.settings.draggable) !== undefined ? ko.unwrap(this.settings.draggable) : true;
            this.title = (ko.unwrap(this.settings.title) || "").stringPlaceholderResolver(this.objectID);
            this.showApplyButton = this.settings.showApplyButton !== undefined ? ko.unwrap(this.settings.showApplyButton) : false;
            this.modalBodyClass = this.settings.modalBodyClass !== undefined ? ko.unwrap(this.settings.modalBodyClass) : "";
            this.applyCallback = this.settings.applyCallback || "";
            this.closeCallback = this.settings.closeCallback || "";
            this.beforeShowCallback = this.settings.beforeShowCallback || "";
            var isViewModelObservable = this.settings.viewModel !== undefined && typeof this.settings.viewModel === "function";
            this.viewModel = isViewModelObservable ? this.settings.viewModel : ko.observable();
            ko.components.register(this.componentName, {
                viewModel: function () { },
                template: "<div/>"
            });
            this.headerClasses = ko.observable(ko.unwrap(this.settings.headerClasses) || "modal-primary");
            if (!isViewModelObservable)
                this.viewModel(this.stringPlaceholderResolver(this.settings.viewModel) || {});
        };
        ModalDialogBaseModel.prototype.applyViewModel = function () {
            if (!this.viewName) {
                if (!this.isNested)
                    return Logger.warn(this, "Property 'viewName' is empty!");
                else
                    return;
            }
            if (_.last(this.viewPath) !== "/")
                this.viewPath = this.viewPath + "/";
            var viewPath = this.viewPath + this.viewName + ".html";
            ko.components.unregister(this.componentName);
            if (this.viewModelName)
                ko.components.register(this.componentName, {
                    viewModel: { require: this.viewModelPath + this.viewModelName },
                    template: { require: 'text!' + viewPath }
                });
            else
                ko.components.register(this.componentName, {
                    viewModel: WfModalComponentViewModel,
                    template: { require: 'text!' + viewPath }
                });
        };
        ;
        ModalDialogBaseModel.prototype.close = function () {
            this.show(false);
            ko.components.unregister(this.componentName);
            if (this.closeCallback && typeof this.closeCallback === "function")
                this.closeCallback();
        };
        ;
        ModalDialogBaseModel.prototype.apply = function () {
            this.show(false);
            ko.components.unregister(this.componentName);
            if (this.applyCallback && typeof this.applyCallback === "function")
                this.applyCallback();
        };
        ;
        ModalDialogBaseModel.prototype.handleShowDialog = function () {
            if (this.beforeShowCallback && typeof this.beforeShowCallback === "function")
                this.beforeShowCallback();
            this.applyViewModel();
            this.show(true);
        };
        ;
        ModalDialogBaseModel.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var modalDialog, modalDialogContainer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            ko.components.unregister(this.componentName);
                            modalDialog = $(document).find('#modal-dialog-' + ko.unwrap(this.id));
                            modalDialogContainer = $(document).find('#modal-dialog-container-' + ko.unwrap(this.id));
                            modalDialog.remove();
                            modalDialogContainer.remove();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return ModalDialogBaseModel;
    }(ComponentBaseModel));
    var WfModalComponentViewModel = /** @class */ (function () {
        function WfModalComponentViewModel(params) {
            var viewModel = params.viewModel();
            for (var key in viewModel) {
                if (viewModel.hasOwnProperty(key)) {
                    this[key] = viewModel[key];
                }
            }
            this.connector = params.connector;
        }
        return WfModalComponentViewModel;
    }());
    return ModalDialogBaseModel;
});
//# sourceMappingURL=modal-dialog.base.model.js.map