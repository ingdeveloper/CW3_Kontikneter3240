import { IPendingChangedAnimationParams } from "../models/pending-changed-animation.params";
import Signal = require("../../services/models/signal");
import SignalsInterface = require("../../services/models/_signal");
import SignalValueType = SignalsInterface.SignalValueType;

class PendingChangedAnimationService {
    public cssClass: KnockoutComputed<string>;
    private showAnimation: KnockoutObservable<boolean>;
    private valuePendingCss: string;
    private subscription: KnockoutSubscription;

    constructor(private settings: IPendingChangedAnimationParams, private pendingSignal: Signal, private defaultCssClass: KnockoutValueOrObservable<string> | string = "") {
        this.showAnimation = ko.observable(false);
        this.valuePendingCss = `${(this.settings.additionalCssForPendingAnimation || "")} ${(this.settings.valuePendingOnClass || "wf-value-pending-on")}`;
        this.subscription = this.pendingSignal.valueType.subscribe((value) => {
            if (value === SignalValueType.Server) {
                this.showAnimation(false);
            }
        });
        this.cssClass = ko.computed(() => {
            const on = `${this.valuePendingCss} ${ko.unwrap(this.defaultCssClass) || ""}`;
            const off = `${(this.settings.valuePendingOffClass || "wf-value-pending-off")} ${ko.unwrap(this.defaultCssClass) || ""}`
            return this.showAnimation() ? on : off;
        }, this);
    }

    public onValueChangeRequested() {
        this.showAnimation(true);
    }

    public onValueChangeCanceled() {
        this.showAnimation(false);
    }

    public dispose() {
        this.subscription.dispose();
        this.cssClass.dispose();
    }
}

export = PendingChangedAnimationService;


