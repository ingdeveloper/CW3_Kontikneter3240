class ChangedFieldAnimationService {

    public cssClass: KnockoutComputed<string>;

    private timer: number;
    private showAnimation: KnockoutObservable<boolean>;
    private changedCssDuration: number;
    private signalChangedCss: string;
    private subscription: KnockoutSubscription;

    constructor(private settings: IChangedFieldAnimationParams, private knockoutField: KnockoutObservable<any>, private defaultCssClass: KnockoutValueOrObservable<string> | string = "") {

        this.showAnimation = ko.observable(false);
        this.timer = null;
        this.changedCssDuration = this.settings.changedCssDuration || 1000;
        this.signalChangedCss = (this.settings.additionalCssForAnimation || "") + " " + (this.settings.signalChangedClass || "bg-changed");

        this.subscription = this.knockoutField.subscribe(() => {

            if (this.timer) {
                clearTimeout(this.timer);
            }

            this.showAnimation(true);
            this.timer = window.setTimeout(() => {
                this.showAnimation(false);
            }, this.changedCssDuration);
        });


        this.cssClass = ko.computed(() => {
            return this.showAnimation() ? this.signalChangedCss + " " + ko.unwrap(this.defaultCssClass) : ko.unwrap(this.defaultCssClass);
        }, this);
    }

    public dispose() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.cssClass.dispose();
        this.subscription.dispose();
    }
}

export = ChangedFieldAnimationService;


