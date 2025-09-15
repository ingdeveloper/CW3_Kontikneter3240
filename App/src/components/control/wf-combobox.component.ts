import Connector = require("../../services/connector");

import Signal = require("../../services/models/signal");

import ComponentBaseModel = require("../component-base.model");
import VisualSecurityService = require("../services/visual-security.service");

declare var numeral;

interface IWfComboboxComponentParams extends IComponentBaseParams, IWriteSecureParams {
    symbolicTextNormalState: string;
    cssClassNormalState: string;
    cssClass: string;
    iconStyle: string;
    iconClass: string;
    textStyle: string;
    buttonStyle: string;
    dropdownAlignment: string;
    dropdownDirection: string;
    writeToBuffer: boolean;
    symbolicTexts: string[];
    signalNames: string[];
    signalValues: any[];
}

interface ISignalWriteItem {
    symbolicText: string;
    signalName: string;
    value: any;
    icon: string;
}

class WfComboboxComponent extends ComponentBaseModel<IWfComboboxComponentParams> {
    private writeSecureSignalNames: KnockoutObservable<string[]>;
    private showWriteSecure: KnockoutObservable<boolean>;
    private writeSecureValues: KnockoutObservable<any[]>;
    private writeSecure: boolean;

    private writeItems: any[];
    private signalWriteItems: ISignalWriteItem[];
    private writeToBuffer: boolean;
    private stateIconProperties: any;
    private stateProperties: any;

    private dropdownAlignment: string;
    private dropdownDirection: string;
    private textStyle: string;
    private buttonStyle: string;
    private iconStyle: string;
    private cssClass: string;
    private cssClassNormalState: string;
    private symbolicTextNormalState: string;


    constructor(params: IWfComboboxComponentParams) {
        super(params)
        this.initializeWriteSecure();
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.symbolicTextNormalState = (ko.unwrap(this.settings.symbolicTextNormalState) ? ko.unwrap(this.settings.symbolicTextNormalState) : "Select an option").stringPlaceholderResolver(this.objectID);
        this.cssClassNormalState = ko.unwrap(this.settings.cssClassNormalState) ? ko.unwrap(this.settings.cssClassNormalState) : "";
        this.cssClass = ko.unwrap(this.settings.cssClass) ? ko.unwrap(this.settings.cssClass) : "btn-default";

        this.iconStyle = ko.unwrap(this.settings.iconStyle) || '';
        this.textStyle = ko.unwrap(this.settings.textStyle) || '';
        this.buttonStyle = ko.unwrap(this.settings.buttonStyle) || '';

        this.dropdownAlignment = ko.unwrap(this.settings.dropdownAlignment) || "left";
        this.dropdownDirection = ko.unwrap(this.settings.dropdownDirection) === "up" ? "dropup" : "";

        this.writeItems = [];

        this.signalWriteItems = [];
        this.stateProperties = {
            'symbolicTextNormalState': ko.unwrap(this.symbolicTextNormalState),
            states: []
        };
        this.stateIconProperties = {
            'cssClassNormalState': ko.unwrap(this.cssClassNormalState),
            states: []
        };

        this.writeToBuffer = ko.unwrap(this.settings.writeToBuffer) !== undefined ? ko.unwrap(this.settings.writeToBuffer) : false;

        // Combine all Properties-Arrays together     

        const writeItems = _.zip(this.resolvePlaceHolder(this.settings.symbolicTexts, this.objectID), this.resolvePlaceHolder(this.settings.signalNames, this.objectID), this.settings.signalValues, this.settings.iconClass);

        // Generate properties objects for current state display and icon display (stateText and state CssClass widgets)
        _.each(writeItems, (item, i) => {
            const ii = i + 1;

            this.signalWriteItems[i] = {
                symbolicText: item[0],
                signalName: item[1],
                value: item[2],
                icon: item[3]
            };

            const stateProperty = {
                signalName: item[1],
                maskSignal: item[2],
                symbolicText: item[0]
            }

            const stateIconProperty = {
                signalName: item[1],
                maskSignal: item[2],
                cssClassName: item[3]
            }

            this.stateProperties.states.push(stateProperty);
            this.stateIconProperties.states.push(stateIconProperty)
        });

        this.stateIconProperties["writeToBuffer"] = this.writeToBuffer;
        this.stateProperties["writeToBuffer"] = this.writeToBuffer;
    }

    private initializeWriteSecure() {
        this.writeSecure = ko.unwrap(this.settings.writeSecure) !== undefined ? ko.unwrap(this.settings.writeSecure) : false;
        this.writeSecureValues = ko.observable();
        this.writeSecureSignalNames = ko.observable<string[]>();
        this.showWriteSecure = ko.observable(false);
    }

    private writeInputValueSecure(data: any) {
        if (this.isDisabled()) return;

        this.writeSecureValues([data.value]);
        this.writeSecureSignalNames([data.signalName]);
        this.showWriteSecure(true);
    }

    private updateStatus = async (data) => {
        const values: SignalValue = {};
        values[data.signalName] = data.value;

        if (_.size(values) === 0) return;

        if (this.writeToBuffer)
            this.connector.writeSignalsToBuffer(values);
        else if (this.writeSecure)
            this.writeInputValueSecure(data);
        else {
            const result = await this.connector.writeSignals(values)
            if (!result.successful) {
                this.connector.error("Signal write", result.errorMessage);
            }
        }
    };

    private resolvePlaceHolder(signalNames: string[], objectID: string) {
        for (let i = 0; i < signalNames.length; i++)
            signalNames[i] = (ko.unwrap(signalNames[i]) || "").stringPlaceholderResolver(this.objectID);

        return signalNames;
    }


    protected async dispose() {
        await super.dispose();
    }
}

export = WfComboboxComponent;
