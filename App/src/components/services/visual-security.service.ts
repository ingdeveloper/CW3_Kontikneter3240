import Signal = require("../../services/models/signal");
import Connector = require("../../services/connector");


class VisualSecurityService {
    public isVisible: KnockoutComputed<boolean>;
    public isDisabled: KnockoutComputed<boolean>;

    private enableSignal: Signal;
    private visibilitySignal: Signal;
    private visibilityOperator: string;
    private enableOperator: string;
    private visibilitySignalValue: string;
    private enableSignalValue: any;
    private visibilitySignalName: string;
    private enableSignalName: string;

    private isExistVisibleSignalDefinition: KnockoutObservable<boolean>;
    private isExistEnableSignalDefinition: KnockoutObservable<boolean>;
    private connector: Connector;

    constructor(private settings: IVisualSecurityParams) {

        this.connector = new Connector();

        const objectID = ko.unwrap(this.settings.objectID);

        this.enableSignalName = (ko.unwrap(this.settings.enableSignalName) || "").stringPlaceholderResolver(objectID);
        this.visibilitySignalName = (ko.unwrap(this.settings.visibilitySignalName) || "").stringPlaceholderResolver(objectID);

        this.enableSignalValue = ko.unwrap(this.settings.enableSignalValue);
        this.visibilitySignalValue = ko.unwrap(this.settings.visibilitySignalValue);

        this.enableOperator = ko.unwrap(this.settings.enableOperator) || "==";
        this.visibilityOperator = ko.unwrap(this.settings.visibilityOperator) || "==";

        this.visibilitySignal = this.visibilitySignalName ? this.connector.getSignal(this.visibilitySignalName) : null;
        this.enableSignal = this.enableSignalName ? this.connector.getSignal(this.enableSignalName) : null;

        this.isExistVisibleSignalDefinition = ko.observable(false);
        this.isExistEnableSignalDefinition = ko.observable(false);

        this.isVisible = ko.computed(() => {
            if (!this.visibilitySignal)
                return true;

            if (!this.isExistVisibleSignalDefinition())
                return false;

            if (this.visibilitySignalValue === undefined || this.visibilitySignalValue === null)
                return true;

            return evaluateCondition(this.visibilitySignal.value(), this.visibilitySignalValue, this.visibilityOperator);
        });

        this.isDisabled = ko.computed(() => {
            if (!this.enableSignal)
                return false;

            if (!this.isExistEnableSignalDefinition())
                return true;

            if (this.enableSignalValue === undefined || this.enableSignalValue === null)
                return false;

            return !evaluateCondition(this.enableSignal.value(), this.enableSignalValue, this.enableOperator);
        });

        this.checkVisibilitySignalName();
        this.checkEnableSignalName();
    }

    private async checkVisibilitySignalName() {
        if (this.visibilitySignalName != null) {
            const definition = await this.connector.getSignalDefinition(this.visibilitySignalName);
            this.isExistVisibleSignalDefinition(!!definition);
        }
    }

    private async checkEnableSignalName() {
        if (this.enableSignalName != null) {
            const definition = await this.connector.getSignalDefinition(this.enableSignalName);
            this.isExistEnableSignalDefinition(!!definition);
        }
    }

    public dispose() {
        if (this.visibilitySignal !== null) {
            this.connector.unregisterSignals(this.visibilitySignal);
        }
        if (this.enableSignal !== null) {
            this.connector.unregisterSignals(this.enableSignal);
        }
    }
}
export = VisualSecurityService;