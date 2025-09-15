define(["require", "exports"], function (require, exports) {
    "use strict";
    var ChangedFieldAnimationService = /** @class */ (function () {
        function ChangedFieldAnimationService(settings, knockoutField, defaultCssClass) {
            var _this = this;
            if (defaultCssClass === void 0) { defaultCssClass = ""; }
            this.settings = settings;
            this.knockoutField = knockoutField;
            this.defaultCssClass = defaultCssClass;
            this.showAnimation = ko.observable(false);
            this.timer = null;
            this.changedCssDuration = this.settings.changedCssDuration || 1000;
            this.signalChangedCss = (this.settings.additionalCssForAnimation || "") + " " + (this.settings.signalChangedClass || "bg-changed");
            this.subscription = this.knockoutField.subscribe(function () {
                if (_this.timer) {
                    clearTimeout(_this.timer);
                }
                _this.showAnimation(true);
                _this.timer = window.setTimeout(function () {
                    _this.showAnimation(false);
                }, _this.changedCssDuration);
            });
            this.cssClass = ko.computed(function () {
                return _this.showAnimation() ? _this.signalChangedCss + " " + ko.unwrap(_this.defaultCssClass) : ko.unwrap(_this.defaultCssClass);
            }, this);
        }
        ChangedFieldAnimationService.prototype.dispose = function () {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.cssClass.dispose();
            this.subscription.dispose();
        };
        return ChangedFieldAnimationService;
    }());
    return ChangedFieldAnimationService;
});
//# sourceMappingURL=changed-field-animation.service.js.map