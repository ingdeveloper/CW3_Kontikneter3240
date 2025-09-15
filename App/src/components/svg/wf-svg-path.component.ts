import ComponentBaseModel = require("../component-base.model");
import Signal = require("../../services/models/signal");
import VisualStatesService = require("../services/visual-states.service");
import SignalArrayService = require("../services/signal-array.service");

// Component properties

class WfSvgPathComponent extends ComponentBaseModel<IWfSvgPathParams> {
    private signal: Signal;
    private signalValue: KnockoutValueOrObservable<any>;
    private signalName: string;
    private unitLabel: boolean;
    private isAlphanumeric: boolean;
    protected dateTimeFormat: string;
    protected isDateTime: boolean;

    protected height: number = null;
    protected width: number = null;
    private style: KnockoutComputed<any>;
    private viewBox: string;
    protected pathData: string;
    private navigationUrl: string;
    private shouldNavigateToUrl: KnockoutComputed<boolean> = ko.pureComputed(() => {
        if (!this.navigationUrl) return false;

        const indexOfParamsSeparator = this.navigationUrl.indexOf("?");

        const result = this.navigationUrl.substring(0, indexOfParamsSeparator > -1 ? indexOfParamsSeparator : this.navigationUrl.length).length > 0;

        return result;
    }, this);

    private pathCssClass: string;

    private labelText: string;
    private subLabelText: string;

    private tooltipEnabled: boolean;
    private tooltipVisible = ko.observable<boolean>();

    private statusCssClass: KnockoutComputed<string>;
    private cssClassNames: string[];
    private states: VisualStatesService;
    protected signalArrayService: SignalArrayService;
    private tooltipTitle;


    constructor(params: IWfSvgPathParams) {
        super(params);
        this.initializeStates();

        this.signal = this.connector.getSignal(this.signalName);
        this.initializeSignalArray();
        this.initializeSignals();

        this.connector.getOnlineUpdates();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.height = ko.unwrap(this.settings.height) !== undefined ? ko.unwrap(this.settings.height) : null;
        this.width = ko.unwrap(this.settings.width) !== undefined ? ko.unwrap(this.settings.width) : null;
        this.viewBox = ko.unwrap(this.settings.viewBox);

        // this.style = ko.computed(() => {
        //     if(this.settings.viewBox){
        //         return 'width: ' + this.width +'px;' + 'height: ' + this.height +'px;'
        //     }
        //     else return "";
        // },this);

        this.pathData = ko.unwrap(this.settings.pathData) || "M1 1 199 1 199 99 1 99 Z";
        this.navigationUrl = ko.unwrap(this.settings.navigationUrl) || "";
        this.pathCssClass = ko.unwrap(this.settings.pathCssClass) || "wf-svg-path";

        this.labelText = (ko.unwrap(this.connector.translate(ko.unwrap(this.settings.labelText))()) || "").stringPlaceholderResolver(this.objectID);
        this.subLabelText = (ko.unwrap(this.connector.translate(ko.unwrap(this.settings.subLabelText))()) || "").stringPlaceholderResolver(this.objectID);
        this.tooltipEnabled = ko.unwrap(this.settings.tooltipEnabled) !== undefined ? ko.unwrap(this.settings.tooltipEnabled) : false;
        this.tooltipVisible = ko.observable(false);

        this.tooltipTitle = ko.unwrap(this.settings.tooltipTitle) || "";

        this.isDateTime = ko.unwrap(this.settings.isDateTime) !== undefined ? ko.unwrap(this.settings.isDateTime) : false;
        this.dateTimeFormat = ko.unwrap(this.settings.dateTimeFormat) ? ko.unwrap(this.settings.dateTimeFormat) : "";
        this.isAlphanumeric = ko.unwrap(this.settings.isAlphanumeric) !== undefined ? ko.unwrap(this.settings.isAlphanumeric) : false;
        this.unitLabel = ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : false;
        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
        this.signalValue = '';
    }

    private initializeSignals() {

        if (this.signalArrayService.isArray) {
            this.signalValue = this.signalArrayService.signalValue;
        } else if (this.isAlphanumeric) {
            this.signalValue = this.signal.value;
        } else if (this.isDateTime) {
            this.signalValue = this.signal.value.extend({
                date: {
                    format: this.dateTimeFormat
                }
            });
        } else {
            this.signalValue = ko.computed(() => {
                return this.signal.value() * this.signalArrayService.signalValueFactor;
            },
                this).extend({ numeralNumber: this.signalArrayService.format });
        }
    }

    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.signal);
    }

    private initializeStates() {
        this.states = new VisualStatesService(this.settings);
        this.statusCssClass = this.states.multipleCss;
    }

    public mouseover() {
        if (!this.tooltipEnabled) return;
        this.tooltipVisible(true);
    };

    public mouseout() {
        if (!this.tooltipEnabled) return;
        this.tooltipVisible(false);
    };

    public async dispose() {
        await super.dispose();
        if (!this.signal)
            return;
        return this.connector.unregisterSignals(this.signal);
    };

}

export = WfSvgPathComponent;