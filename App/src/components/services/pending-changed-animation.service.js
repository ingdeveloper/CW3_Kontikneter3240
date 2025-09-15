define(["require", "exports", "../../services/models/_signal"], function (require, exports, SignalsInterface) {
    "use strict";
    var SignalValueType = SignalsInterface.SignalValueType;
    var PendingChangedAnimationService = /** @class */ (function () {
        function PendingChangedAnimationService(settings, pendingSignal, defaultCssClass) {
            var _this = this;
            if (defaultCssClass === void 0) { defaultCssClass = ""; }
            this.settings = settings;
            this.pendingSignal = pendingSignal;
            this.defaultCssClass = defaultCssClass;
            this.showAnimation = ko.observable(false);
            this.valuePendingCss = (this.settings.additionalCssForPendingAnimation || "") + " " + (this.settings.valuePendingOnClass || "wf-value-pending-on");
            this.subscription = this.pendingSignal.valueType.subscribe(function (value) {
                if (value === SignalValueType.Server) {
                    _this.showAnimation(false);
                }
            });
            this.cssClass = ko.computed(function () {
                var on = _this.valuePendingCss + " " + (ko.unwrap(_this.defaultCssClass) || "");
                var off = (_this.settings.valuePendingOffClass || "wf-value-pending-off") + " " + (ko.unwrap(_this.defaultCssClass) || "");
                return _this.showAnimation() ? on : off;
            }, this);
        }
        PendingChangedAnimationService.prototype.onValueChangeRequested = function () {
            this.showAnimation(true);
        };
        PendingChangedAnimationService.prototype.onValueChangeCanceled = function () {
            this.showAnimation(false);
        };
        PendingChangedAnimationService.prototype.dispose = function () {
            this.subscription.dispose();
            this.cssClass.dispose();
        };
        return PendingChangedAnimationService;
    }());
    return PendingChangedAnimationService;
});
//# sourceMappingURL=pending-changed-animation.service.js.map