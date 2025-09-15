import Connector = require("../../services/connector");
import SecuredService = require("../services/secured.service");
import ErrorCodeService = require("../../services/errorCodeService");

class WfAlarmGroupAckButtonComponent {

    private hasAuthorization: KnockoutComputed<boolean>;
    private hasNoAuthorization: KnockoutComputed<boolean>;
    private projectAuthorization: string;
    private securedService: SecuredService;
    private buttonText: string;
    private tooltipText: string;
    private objectID: string;
    private settings: any;

    private id: KnockoutObservable<string> | string;
    private connector: Connector;

    private comment: KnockoutObservable<string> = ko.observable(null);
    private groupName: string;
    private cssClass: string;
    private iconClass: string;

    private callback: () => void;

    constructor(params) {
        this.connector = new Connector();
        this.settings = params;
        this.objectID = ko.unwrap(params.objectID);

        this.projectAuthorization = (ko.unwrap(params.projectAuthorization) || "").stringPlaceholderResolver(this.objectID);
        this.securedService = new SecuredService(this.projectAuthorization);
        this.hasAuthorization = this.securedService.hasAuthorization;
        this.hasNoAuthorization = this.securedService.hasNoAuthorization;

        this.comment = this.settings.comment;
        this.groupName = ko.unwrap(this.settings.groupName) || null;
        this.buttonText = (ko.unwrap(this.settings.buttonText) || 'I4SCADA_Acknowledge_Alarms_By_Group').stringPlaceholderResolver(this.objectID);
        this.tooltipText = (ko.unwrap(this.settings.tooltipText) || 'I4SCADA_Acknowledge_All_Alarms_In_Same_Group').stringPlaceholderResolver(this.objectID);

        this.iconClass = ko.unwrap(this.settings.iconClass) || "wf wf-check";
        this.cssClass = ko.unwrap(this.settings.cssClass) || "btn btn-warning";

        this.callback = this.settings.callback;
    }

    private async acknowledgeAlarmsByGroup() {
        const groupName = this.groupName;
        try {
            const comment = ko.unwrap(this.comment());
            const result = this.connector.acknowledgeAlarmsByGroup(groupName, comment);
            this.handleAcknowledgeResul(await result);
        } catch (error) {
            this.connector.handleError(WfAlarmGroupAckButtonComponent)(error);
        } finally {
            if (this.callback)
                this.callback();
        }
    }

    private handleAcknowledgeResul(result: AcknowledgeResultDTO) {
        if (ko.isObservable(this.comment))
            this.comment(null);
        if (result.Result === true) {
            const text = "I4SCADA_Acknowledgment_successful";
            const translation = ko.unwrap(this.connector.translate(text));
            this.connector.info(self, translation);
        } else {
            const text = ErrorCodeService.acknowledgmentErrorCodes[result.ErrorCodes[0].toString()];
            const translation = ko.unwrap(this.connector.translate(text));
            this.connector.error(this, translation);
        }
    }

    private async onAcknowledge() {
        await this.acknowledgeAlarmsByGroup();
    }

}
export = WfAlarmGroupAckButtonComponent;
