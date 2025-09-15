import Connector = require("../../services/connector");
import ComponentBaseModel = require("../component-base.model");
import ErrorCodeService = require("../../services/errorCodeService");

interface IWfAlarmAckButtonParams extends IComponentBaseParams {
    alarmId: KnockoutObservable<string>;
    ackComment: KnockoutObservable<string>;
    buttonText: string;
    iconClass: string;
    cssClass: string;
    callback: () => void;
}

class WfAlarmAckButtonComponent extends ComponentBaseModel<IWfAlarmAckButtonParams> {

    private alarmId: KnockoutObservable<string>;
    private ackComment: KnockoutObservable<string>;
    private buttonText: string;
    private iconClass: string;
    private cssClass: string;

    private callback: () => void;

    constructor(params: IWfAlarmAckButtonParams) {
        super(params)
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.alarmId = this.settings.alarmId;
        this.ackComment = this.settings.ackComment;
        this.buttonText = (ko.unwrap(this.settings.buttonText) || 'I4SCADA_Acknowledge').stringPlaceholderResolver(this.objectID);
        this.iconClass = ko.unwrap(this.settings.iconClass) || "wf wf-check";
        this.cssClass = ko.unwrap(this.settings.cssClass) || "btn btn-warning";

        this.callback = this.settings.callback;
    }


    public async acknowledgeAlarm() {
        try {
            const result = await this.connector.acknowledgeAlarms([ ko.unwrap(this.alarmId)],  ko.unwrap(this.ackComment))
            this.ackComment(null);
            if (result.Result === true) {
                const text = "I4SCADA_Acknowledgment_successful";
                const translation = ko.unwrap(this.connector.translate(text));
                this.connector.info(self, translation);
            } else {
                const text = ErrorCodeService.acknowledgmentErrorCodes[result.ErrorCodes[0].toString()];
                const translation = ko.unwrap(this.connector.translate(text));
                this.connector.error(this, translation);
            }
            if (this.callback) {
                this.callback();
            }
            return result;
        } catch (error) {
            this.connector.handleError(WfAlarmAckButtonComponent)(error)
        }
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfAlarmAckButtonComponent;
