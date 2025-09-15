import Connector = require("../../services/connector");
import VisualSecurityService = require("../services/visual-security.service");
import ErrorCodeService =require("../../services/errorCodeService");

declare var uuid;

enum AcknowledgementAction {
    AllVisible,
    ByGroup,
    AllActive,
    AllGone
}

interface IAcknowledgementAction {
    action: AcknowledgementAction;
    symbolicTextTranslation: string;
}

class WfAlarmAckDialogButtonComponent {

    private id: KnockoutObservable<string> | string;
    private connector: Connector;
    private showModal: KnockoutObservable<boolean> = ko.observable(false);
    private isBusy: KnockoutObservable<boolean> = ko.observable(false);
    private isModalDialogsDraggable: KnockoutObservable<boolean>;

    private onlineAlarms: KnockoutComputed<AlarmDTO[]>;
    private comment: KnockoutObservable<string> = ko.observable(null);
    private alarmGroups: KnockoutObservableArray<AlarmGroupDTO> = ko.observableArray([]);
    private selectedAlarmGroup: KnockoutObservable<AlarmGroupDTO> = ko.observable(null);

    private acknowledgementActions: KnockoutObservableArray<IAcknowledgementAction> = ko.observableArray([]);
    private selectedAcknowledgementActions: KnockoutObservable<IAcknowledgementAction> = ko.observable(null);

    private buttonCss: string;

    constructor(params) {
        this.id = ko.observable(uuid.v4());
        this.connector = new Connector();

        this.buttonCss = params.buttonCss || "";
        this.onlineAlarms = params.onlineAlarms;
        this.isModalDialogsDraggable = params.isModalDialogsDraggable != null ? params.isModalDialogsDraggable : false;
    }

    private InitializeAcknowledgementActions() {

        this.acknowledgementActions([
            { symbolicTextTranslation: this.connector.translate('I4SCADA_Acknowledge_All_Visible_Alarms'), action: AcknowledgementAction.AllVisible },
            { symbolicTextTranslation: this.connector.translate('I4SCADA_Acknowledge_All_Alarms_In_Same_Group'), action: AcknowledgementAction.ByGroup },
            { symbolicTextTranslation: this.connector.translate('I4SCADA_Acknowledge_All_Active_Alarms'), action: AcknowledgementAction.AllActive },
            { symbolicTextTranslation: this.connector.translate('I4SCADA_Acknowledge_All_Gone_Alarms'), action: AcknowledgementAction.AllGone }
        ]);
    }

    private async getAllAlarmGroups() {
        try {
            const data = await this.connector.getAlarmGroups(this.connector.currentLanguageId());
            this.alarmGroups(data);
        } catch (error) {
            this.connector.handleError(WfAlarmAckDialogButtonComponent)(error);
        }
    }

    private async acknowledgeAlarms() {
        this.isBusy(true);
        const onlineAlarms = this.onlineAlarms().concat([]);
        const needAcknowledge = _.filter(onlineAlarms, (alarm) => !alarm.DateAck);
        const alarmIds = _.map(needAcknowledge, (alarm) => alarm.AlarmID);

        if (!_.any(alarmIds)) {
            this.isBusy(false);
            return;
        }

        try {
            const result = this.connector.acknowledgeAlarms(alarmIds, this.comment());
            this.close();
            this.handleAcknowledgeResul(await result);
        } catch (error) {
            this.connector.handleError(WfAlarmAckDialogButtonComponent)(error);
        } finally {
            this.isBusy(false);
        }
    }

    private async acknowledgeAlarmsByGroup() {
        this.isBusy(true);

        const groupName = this.selectedAlarmGroup().SymbolicTextName;

        try {
            const result = this.connector.acknowledgeAlarmsByGroup(groupName, this.comment());
            this.close();
            this.handleAcknowledgeResul(await result);
        } catch (error) {
            this.connector.handleError(WfAlarmAckDialogButtonComponent)(error);
        } finally {
            this.isBusy(false);
        }
    }

    private async acknowledgeAllActiveAlarms() {
        this.isBusy(true);
        try {
            const result = this.connector.acknowledgeAllAlarms(this.comment());
            this.close();
            this.handleAcknowledgeResul(await result);
        } catch (error) {
            this.connector.handleError(WfAlarmAckDialogButtonComponent)(error);
        } finally {
            this.isBusy(false);
        }
    }

    private async acknowledgeAllGoneAlarms() {
        this.isBusy(true);
        try {
            const result = this.connector.acknowledgeAllGoneAlarms(this.comment());
            this.close();
            this.handleAcknowledgeResul(await result);
        } catch (error) {
            this.connector.handleError(WfAlarmAckDialogButtonComponent)(error);
        } finally {
            this.isBusy(false);
        }
    }

    private handleAcknowledgeResul(result: AcknowledgeResultDTO) {
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
        switch (this.selectedAcknowledgementActions().action) {
            case AcknowledgementAction.AllActive:
                await this.acknowledgeAllActiveAlarms();
                break;
            case AcknowledgementAction.AllGone:
                await this.acknowledgeAllGoneAlarms();
                break;
            case AcknowledgementAction.AllVisible:
                await this.acknowledgeAlarms();
                break;
            case AcknowledgementAction.ByGroup:
                await this.acknowledgeAlarmsByGroup();
                break;
        }
    }

    private async open() {
        this.isBusy(true);
        await this.getAllAlarmGroups();
        this.InitializeAcknowledgementActions();
        this.isBusy(false);
        this.showModal(true);
    }

    private close() {
        this.showModal(false);
    }

}

export = WfAlarmAckDialogButtonComponent;
