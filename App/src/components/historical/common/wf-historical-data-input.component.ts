import { ChartsColoringService } from "../services/charts-configuration/charts-coloring.service";

declare var uuid;

interface IWfHistoricalDataInputParams {
    value: KnockoutObservable<string>;
    disable: KnockoutObservable<boolean>;
    symbolicText: string;
    type: string;
}

class WfHistoricalDataInputeComponent {

    public readonly value: KnockoutObservable<string>;
    public readonly symbolicText: string;
    public readonly type: string;
    public readonly nullable: boolean = false;
    public readonly disable: KnockoutObservable<boolean>;

    constructor(params: IWfHistoricalDataInputParams) {
        this.value = params.value;
        this.disable = params.disable || ko.observable(false);
        this.symbolicText = params.symbolicText || "I4SCADA_Color";
        this.type = params.type || "text";

        if (this.value.rules && !_.find(this.value.rules(), x => x.rule === "required")) {
            this.nullable = true;
        }
    }

    public onReset(){
        this.value(null);
    }

}

export = WfHistoricalDataInputeComponent;