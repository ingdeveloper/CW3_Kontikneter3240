import Connector = require("../../services/connector");
import Logger = require("../../services/logger");

import ChangedFieldAnimationService = require("../services/changed-field-animation.service");
import VisualStatesService = require("../services/visual-states.service");
import Signal = require("../../services/models/signal");

import ComponentBaseModel = require("../component-base.model");
import SignalArrayService = require("../services/signal-array.service");

declare var numeral;

/**
 * This interface contains the HTML parameters for the WfValueComponent.
 * 
 * @interface IWfValueParams
 * @extends {IComponentBaseParams}
 * @extends {}
 * @extends {IChangedFieldAnimationParams}
 */
interface IWfValueParams extends IComponentBaseParams, IChangedFieldAnimationParams, IState, ISignalArrayParams {
    isAlphanumeric: boolean;
    unitLabel: boolean;
    staticUnitText: string;
    signalName: string;
    isDateTime: boolean;
    dateTimeFormat: string;
}

class WfValueComponent<TWfValueParams extends IWfValueParams> extends ComponentBaseModel<TWfValueParams> {
    protected signalArrayService: SignalArrayService;
    protected cssDisplayClass: KnockoutComputed<string>;
    protected statusCssClass: KnockoutComputed<string>;
    protected states: VisualStatesService;
    protected dateTimeFormat: string;
    protected isDateTime: boolean;
    protected changedFieldAnimationService: ChangedFieldAnimationService;
    protected cssClass: KnockoutComputed<string> | string;

    protected isAlphanumeric: boolean;
    protected unitLabel: boolean;
    protected staticUnitText: string;
    protected signalName: string;
    protected signalValue: KnockoutObservable<any> | string;
    protected signal: Signal;

    constructor(params: TWfValueParams) {
        super(params);

        this.signal = this.connector.getSignal(this.signalName);
        this.initializeSignalArray();

        this.initializeSignals();
        this.initializeStates();
        this.initializeChangedFieldAnimation();
        this.connector.getOnlineUpdates(); 
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.isAlphanumeric = ko.unwrap(this.settings.isAlphanumeric) !== undefined ? ko.unwrap(this.settings.isAlphanumeric) : false;
        this.unitLabel = ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : false;
        this.staticUnitText = (ko.unwrap(this.settings.staticUnitText) || '').stringPlaceholderResolver(this.objectID);

        this.isDateTime = ko.unwrap(this.settings.isDateTime) !== undefined ? ko.unwrap(this.settings.isDateTime) : false;
        this.dateTimeFormat = ko.unwrap(this.settings.dateTimeFormat) ? ko.unwrap(this.settings.dateTimeFormat) : "";

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);
        this.signalValue = "";
        this.cssClass = "";
    }

    private initializeChangedFieldAnimation() {
        this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.signalValue as KnockoutObservable<any>, this.cssDisplayClass);
        this.cssClass = ko.computed(() => {
            return this.changedFieldAnimationService ? this.changedFieldAnimationService.cssClass() || "" : "";
        });
    }

    protected initializeStates() {
        this.states = new VisualStatesService(this.settings);
        this.statusCssClass = this.states.statusCssClass;
        this.cssDisplayClass = this.states.css;
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

    /**
     * Place here signal cleanup functionality.
     * 
     * @protected
     * @returns 
     * 
     * @memberOf WfValueComponent
     */
    protected async dispose() {
        await super.dispose();
        await this.changedFieldAnimationService.dispose();
        await this.states.unregisterSignals();
        if (!this.signal)
            return;
        await this.connector.unregisterSignals(this.signal);
    }
}

export = WfValueComponent;
