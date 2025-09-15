import { ChartsColoringService } from "../services/charts-configuration/charts-coloring.service";

declare var uuid;

interface IWfHistoricalDataColorPickerParams {
    color: KnockoutObservable<string>;
    symbolicText: string;
}

class WfHistoricalDataColorPickeComponent {

    public readonly color: KnockoutObservable<string>;
    public readonly symbolicText: string;
    public readonly nullable: boolean = false;
    public readonly isNull = ko.observable(false);

    public readonly colorSubscription: KnockoutSubscription;
    public readonly nullSubscription: KnockoutSubscription;

    constructor(params: IWfHistoricalDataColorPickerParams) {
        this.color = params.color;
        this.symbolicText = params.symbolicText || "I4SCADA_Color";

        if (this.color.rules && !_.find(this.color.rules(), x => x.rule === "required")) {
            this.nullable = true;
            this.isNull(this.color() == null);
        }

        this.colorSubscription = this.color.subscribe((value) => {
            if (value == null && this.nullable) {
                this.isNull(true);
            }
        });

        this.nullSubscription = this.isNull.subscribe((value) => {
            if (value === false) {
                this.color(ChartsColoringService.GetColor(uuid.v4()));
            } else {
                this.color(null);
            }
        });

        if (this.color() == null && this.nullable) {
            this.isNull(true);
        }
    }

    public dispose() {
        this.colorSubscription.dispose();
        this.nullSubscription.dispose();
    }

}

export = WfHistoricalDataColorPickeComponent;