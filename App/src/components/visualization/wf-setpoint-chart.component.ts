import ComponentBaseModel = require("../component-base.model");
import Signal = require("../../services/models/signal");

interface ISetpointChartComponentParams extends IComponentBaseParams {
    xAxesSignalNames: string[];
    yAxesSignalNames: string[];

    xAxesLineSignalName: string;
    yAxesLineSignalName: string;

    xAxesArraySignalName: string;
    yAxesArraySignalName: string;

    xAxesValues: number[];
    yAxesValues: number[];

    min: number;
    max: number;

    labelSymbolicText: string;
    yAxesSymbolicText: string;
    xAxesSymbolicText: string;
    color: string;
    height: number;

    xAxesLineSymbolicText: string;
    yAxesLineSymbolicText: string;

    xAxesLinePropertyName: string;
    yAxesLinePropertyName: string;

    xAxesPropertyName: string;
    yAxesPropertyName: string;

    showAxesTextInTooltip: boolean;
}

class SetpointChartComponent extends ComponentBaseModel<ISetpointChartComponentParams> {

    private xAxesSignalNames: string[];
    private yAxesSignalNames: string[];

    private xAxesLineSignalName: string;
    private yAxesLineSignalName: string;

    private xAxesValues: number[];
    private yAxesValues: number[];

    private xAxesArraySignalName: string;
    private yAxesArraySignalName: string;

    private min: number;
    private max: number;

    public labelSymbolicText: string;
    public yAxesSymbolicText: string;
    public xAxesSymbolicText: string;
    public color: string;

    public height: number;

    private xColumns: KnockoutComputed<any>;
    private yColumns: KnockoutComputed<any>;

    private xLines: KnockoutComputed<any>;
    private yLines: KnockoutComputed<any>;

    private xColumnSignals: Signal[];
    private yColumnSignals: Signal[];

    private xArrayColumnSignal: Signal;
    private yArrayColumnSignal: Signal;

    private xAxesLineSignal: Signal;
    private yAxesLineSignal: Signal;

    public c3Chart: KnockoutObservable<any>;

    private trigger: KnockoutObservable<boolean>;
    private languageSubscription: KnockoutSubscription;

    private xAxesLinePropertyName: string;
    private yAxesLinePropertyName: string;

    private xAxesLineName: KnockoutObservable<string> = ko.observable("");
    private yAxesLineName: KnockoutObservable<string> = ko.observable("");

    private xAxesLineSymbolicText: string = "";
    private yAxesLineSymbolicText: string = "";

    private xAxesPropertyName: string = "";
    private yAxesPropertyName: string = "";

    private xAxesName: KnockoutObservable<string>;
    private yAxesName: KnockoutObservable<string>;

    private showAxesTextInTooltip: boolean;

    constructor(params: ISetpointChartComponentParams) {
        super(params);
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.min = this.settings.min !== undefined ? ko.unwrap(this.settings.min) : null;
        this.max = this.settings.max !== undefined ? ko.unwrap(this.settings.max) : null;

        this.xAxesSignalNames = this.settings.xAxesSignalNames !== undefined ? ko.unwrap(this.settings.xAxesSignalNames) : [];
        this.yAxesSignalNames = this.settings.yAxesSignalNames !== undefined ? ko.unwrap(this.settings.yAxesSignalNames) : [];

        this.xAxesLineSignalName = this.settings.xAxesLineSignalName !== undefined ? ko.unwrap(this.settings.xAxesLineSignalName).stringPlaceholderResolver(this.objectID) : null;
        this.yAxesLineSignalName = this.settings.yAxesLineSignalName !== undefined ? ko.unwrap(this.settings.yAxesLineSignalName).stringPlaceholderResolver(this.objectID) : null;

        this.xAxesValues = this.settings.xAxesValues !== undefined ? ko.unwrap(this.settings.xAxesValues) : [];
        this.yAxesValues = this.settings.yAxesValues !== undefined ? ko.unwrap(this.settings.yAxesValues) : [];

        this.xAxesArraySignalName = this.settings.xAxesArraySignalName !== undefined ? ko.unwrap(this.settings.xAxesArraySignalName).stringPlaceholderResolver(this.objectID) : null;
        this.yAxesArraySignalName = this.settings.yAxesArraySignalName !== undefined ? ko.unwrap(this.settings.yAxesArraySignalName).stringPlaceholderResolver(this.objectID) : null;

        this.yAxesSymbolicText = this.settings.yAxesSymbolicText !== undefined ? ko.unwrap(this.settings.yAxesSymbolicText) : "";
        this.xAxesSymbolicText = this.settings.xAxesSymbolicText !== undefined ? ko.unwrap(this.settings.xAxesSymbolicText) : "";

        const defaultLabelSymbolicText = " ";
        this.labelSymbolicText = this.settings.labelSymbolicText !== undefined ? ko.unwrap(this.settings.labelSymbolicText) === "" ? defaultLabelSymbolicText : ko.unwrap(this.settings.labelSymbolicText) : defaultLabelSymbolicText;

        this.height = this.settings.height || 350;
        this.color = this.settings.color !== undefined ? ko.unwrap(this.settings.color) : "#ff0000";

        this.xAxesLinePropertyName = ko.unwrap(this.settings.xAxesLinePropertyName) || "AliasName";
        this.yAxesLinePropertyName = ko.unwrap(this.settings.yAxesLinePropertyName) || "AliasName";

        this.xAxesLineSymbolicText = ko.unwrap(this.settings.xAxesLineSymbolicText) || "";
        this.yAxesLineSymbolicText = ko.unwrap(this.settings.xAxesLineSymbolicText) || "";

        this.xAxesPropertyName = ko.unwrap(this.settings.xAxesPropertyName) || "";
        this.yAxesPropertyName = ko.unwrap(this.settings.yAxesPropertyName) || "";

        this.showAxesTextInTooltip = ko.unwrap(this.settings.showAxesTextInTooltip) || false;

        this.initializeChart();
        this.initializeAsync();
    }

    private async initializeChart() {
        this.trigger = ko.observable(false);
        this.xColumnSignals = [];
        this.yColumnSignals = [];
        this.xAxesLineSignal = null;
        this.yAxesLineSignal = null;
        this.xArrayColumnSignal = null;
        this.yArrayColumnSignal = null;
        this.xAxesName = ko.observable(this.xAxesSymbolicText);
        this.yAxesName = ko.observable(this.yAxesSymbolicText);

        this.xLines = ko.computed(() => {
            this.trigger();
            const lines = [];
            if (this.xAxesLineSignal) {
                const value = this.xAxesLineSignal.value();
                lines.push({ value: value, text: this.xAxesLineName(), position: "start" });
            }
            return lines;
        });

        this.yLines = ko.computed(() => {
            this.trigger();
            const lines = [];
            if (this.yAxesLineSignal) {
                const value = this.yAxesLineSignal.value();
                lines.push({ value: value, text: this.yAxesLineName(), position: "start" });
            }
            return lines;
        });

        this.xColumns = ko.computed(() => {
            this.trigger();
            const columName = "x";
            if (_.isArray(this.xAxesValues) && this.xAxesValues.length > 0) {
                return this.buildStaticColumns(columName, this.xAxesValues);
            }
            if (this.xAxesArraySignalName !== null && this.xAxesArraySignalName !== "") {
                return this.buildArrayColumns(columName, this.xArrayColumnSignal);
            }
            return this.buildColumns(columName, this.xColumnSignals);
        });

        this.yColumns = ko.computed(() => {
            this.trigger();
            const columName = this.connector.translate(this.labelSymbolicText).peek();
            if (_.isArray(this.yAxesValues) && this.yAxesValues.length > 0) {
                return this.buildStaticColumns(columName, this.yAxesValues);
            }
            if (this.yAxesArraySignalName !== null && this.yAxesArraySignalName !== "") {
                return this.buildArrayColumns(columName, this.yArrayColumnSignal);
            }
            return this.buildColumns(columName, this.yColumnSignals);
        });

        this.c3Chart = ko.computed(() => this.getC3ChartObject()).extend({ rateLimit: 200 });

        this.getColumnSignals(this.yAxesSignalNames, this.yColumnSignals, this.yAxesArraySignalName, this.yArrayColumnSignal);
        this.getColumnSignals(this.xAxesSignalNames, this.xColumnSignals, this.xAxesArraySignalName, this.xArrayColumnSignal);


        if (this.xAxesLineSignalName !== null && this.xAxesLineSignalName !== "") {
            this.xAxesLineSignal = this.connector.getSignal(this.xAxesLineSignalName);
        }
        if (this.yAxesLineSignalName !== null && this.yAxesLineSignalName !== "") {
            this.yAxesLineSignal = this.connector.getSignal(this.yAxesLineSignalName);
        }

    }

    private extractSignalDefinitionProperty(signalDefinition: SignalDefinitionDTO, propertyName: string) {
        if (!propertyName)
            return "";

        if (!signalDefinition)
            return "";

        //Simple property of SignalDefinitionDTO
        if (_.indexOf(propertyName, '.') === -1)
            return !isNullOrUndefined(signalDefinition[propertyName]) ? signalDefinition[propertyName] : "";

        var options = propertyName.split(".");
        var subDefinition = signalDefinition[options[0]];
        if (!subDefinition) return "";
        return subDefinition[options[1]] || ""; //DTO property of SignalDefinitionDTO
    }


    private async initializeAsync() {

        await this.getSignalDefinitionPropertyAsync();
        await this.connector.getOnlineUpdates();

        this.languageSubscription = this.connector.currentLanguageId.subscribe(async () => {
            await this.getSignalDefinitionPropertyAsync();
            this.trigger(!this.trigger());
        });

        this.trigger(!this.trigger());
    }

    private async getSignalDefinitionPropertyAsync() {
        const yAxesLineNamePromise = this.getSignalDefinitionAxesAsync(this.yAxesLineSignalName, this.yAxesLinePropertyName, this.yAxesLineSymbolicText)
        const xAxesLineNamePromise = this.getSignalDefinitionAxesAsync(this.xAxesLineSignalName, this.xAxesLinePropertyName, this.xAxesLineSymbolicText);

        const yAxesNamePromise = this.getSignalDefinitionAxesAsync(this.getSignalForAxesName(this.yAxesValues, this.yAxesArraySignalName, this.yColumnSignals), this.yAxesPropertyName, this.yAxesSymbolicText)
        const xAxesNamePromise = this.getSignalDefinitionAxesAsync(this.getSignalForAxesName(this.xAxesValues, this.xAxesArraySignalName, this.xColumnSignals), this.xAxesPropertyName, this.xAxesSymbolicText);

        const yAxesLineName = await yAxesLineNamePromise;
        const xAxesLineName = await xAxesLineNamePromise;

        const yAxesName = await yAxesNamePromise;
        const xAxesName = await xAxesNamePromise;

        this.yAxesLineName(yAxesLineName);
        this.xAxesLineName(xAxesLineName);

        this.yAxesName(yAxesName);
        this.xAxesName(xAxesName);
    }

    private getSignalForAxesName(axesValues: number[], axesArraySignalName: string, columnSignals: Signal[]) {
        if (_.isArray(axesValues) && axesValues.length > 0) {
            return "";
        }
        if (axesArraySignalName !== null && axesArraySignalName !== "") {
            return axesArraySignalName;
        }
        const signal = _.first(columnSignals);
        if (signal != null) {
            return _.first(columnSignals).signalName();
        }
        return "";
    }


    private async getSignalDefinitionAxesAsync(signalName: string, propertyName: string, symbolicText: string) {
        if ((signalName !== null && signalName !== "") && symbolicText == "") {
            const xAxesLineName = await this.connector.getSignalDefinition(signalName) as SignalDefinitionDTO;
            if (propertyName !== null && propertyName !== "") {
                return this.extractSignalDefinitionProperty(xAxesLineName, propertyName);
            }
            return "";
        }
        else {
            return this.connector.translate(symbolicText)();
        }
    }

    private getColumnSignals(signals: string[], columnSignals: Signal[], signalName: string, columnSignal: Signal) {

        if (signalName !== null && signalName !== "") {
            columnSignal = this.connector.getSignal(signalName);
        }
        else {
            for (let signalName of signals) {
                if (signalName !== null && signalName !== "") {
                    const signal = this.connector.getSignal(signalName.stringPlaceholderResolver(this.objectID));
                    columnSignals.push(signal);
                }
            }
        }
    }

    private getMin() {
        if (this.min !== null) {
            return this.min;
        }
        const min = _.min(this.yColumns());
        return min === -Infinity ? -100 : min;
    }

    private getMax() {
        if (this.max !== null) {
            return this.max;
        }
        const max = _.max(this.yColumns());
        return max === Infinity ? 100 : max;
    }

    private buildStaticColumns(columName: string, columnValues: number[]) {
        const columns: any[] = [
            columName
        ];

        for (const value of columnValues) {
            columns.push(value);
        }
        return columns;
    }


    private buildArrayColumns(columName: string, columnSignal: Signal) {
        const columns = [
            columName
        ];

        if (columnSignal) {
            const signals = columnSignal.value();
            if (_.isArray(signals)) {
                for (const arrayValue of signals) {
                    columns.push(arrayValue);
                }
            }
        }
        return columns;
    }

    private buildColumns(columName: string, columnSignals: Signal[]) {
        const columns = [
            columName
        ];

        let signals = columnSignals;
        for (const signal of signals) {
            const value = signal.value();
            columns.push(value === "n/a" ? 0 : value);
        }
        return columns;
    }

    private getC3ChartObject() {
        const chart = {
            x: 'x',
            columns: [this.yColumns(), this.xColumns()],
            xLines: this.xLines(),
            yLines: this.yLines(),
            range: { max: this.getMax(), min: this.getMin() },
            type: 'line',
            colors: {},
            axes: {},
            showY: () => true,
            yLabel: this.yAxesName(),
            xLabel: this.xAxesName()
        }
        const setpointTranslation = this.connector.translate(this.labelSymbolicText).peek();
        chart.colors[setpointTranslation] = this.color;
        chart.axes[setpointTranslation] = "y";
        return chart;
    }

    protected async dispose() {
        if (this.languageSubscription) {
            this.languageSubscription.dispose();
        }

        this.connector.unregisterSignals(...this.yColumnSignals);
        this.connector.unregisterSignals(...this.xColumnSignals);

        this.connector.unregisterSignals(this.yArrayColumnSignal);
        this.connector.unregisterSignals(this.xArrayColumnSignal);

        await super.dispose();
    }
}

export = SetpointChartComponent;
