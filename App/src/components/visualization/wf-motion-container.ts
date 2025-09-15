import Signal = require("../../services/models/signal");

import ComponentBaseModel = require("../component-base.model");

interface IWMotionParams extends IComponentBaseParams {
    startOffsetX: number;
    startOffsetY: number;
    signalNameX: string;
    signalNameY: string;
    signalValueFactor: number;
}

class WfMotionComponent extends ComponentBaseModel<IWMotionParams> {
    private signalY: Signal;
    private signalX: Signal;
    private contentTranslation: KnockoutObservable<string>;
    private signalValueFactor: number;
    private signalNameY: string;
    private signalNameX: string;
    private startOffsetY: number;
    private startOffsetX: number;

    constructor(params: IWMotionParams) {
        super(params)
        this.connector.getOnlineUpdates();
    }

    protected initializeSettings() {
        super.initializeSettings();


        this.startOffsetX = ko.unwrap(this.settings.startOffsetX) !== undefined ? ko.unwrap(this.settings.startOffsetX) : 0;
        this.startOffsetY = ko.unwrap(this.settings.startOffsetY) !== undefined ? ko.unwrap(this.settings.startOffsetY) : 0;

        this.signalNameX = (ko.unwrap(this.settings.signalNameX) || '').stringPlaceholderResolver(this.objectID);
        this.signalNameY = (ko.unwrap(this.settings.signalNameY) || '').stringPlaceholderResolver(this.objectID);

        this.signalValueFactor = ko.unwrap(this.settings.signalValueFactor) || 1;


        // Stop here and return if no signalName was configured
        if (!this.signalNameX && !this.signalNameY) {
            this.contentTranslation = ko.observable("0");
        }

        this.signalX = this.connector.getSignal(this.signalNameX);
        this.signalY = this.connector.getSignal(this.signalNameY);


        // Calc and return the deg value
        this.contentTranslation = ko.pureComputed(() => {
            const signalXValue = this.signalX.value();
            const signalYValue = this.signalY.value();

            const valueX = signalXValue * this.signalValueFactor;
            const valueY = signalYValue * this.signalValueFactor;

            return `translate(${valueX + this.startOffsetX}px, ${valueY + this.startOffsetY}px)`;
        }, this);

    }

    protected async dispose() {
        await super.dispose();
        if (!this.signalX)
            await this.connector.unregisterSignals(this.signalX);
        if (!this.signalY)
            await this.connector.unregisterSignals(this.signalY);
    }
}

export = WfMotionComponent;
