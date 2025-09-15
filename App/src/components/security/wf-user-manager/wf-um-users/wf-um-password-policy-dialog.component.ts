import ComponentBaseModel = require("../../../component-base.model");
import ConfigurationsService = require("../../../../services/configurationsService");
import BusyIndicator = require("../../../../decorators/busyIndicator");
import Logger = require("../../../../services/logger");
import { Utils } from "../shared/utils";

interface IWfUMPasswordPolicyDialogParams extends IComponentBaseParams {
    showModalFromOutside: KnockoutObservable<boolean>;
    confirmCallBackMethod: Function;   
}

class WfUMPasswordPolicyDialogComponent extends ComponentBaseModel<IWfUMPasswordPolicyDialogParams> {   
    private busyContext: BusyIndicator;

    private customSubscriptions;

    private showModal: KnockoutObservable<boolean>;
    // input settings
    private showModalFromOutside: KnockoutObservable<boolean>;
    // modal fields 
    passwordPolicy: any;

    constructor(params: IWfUMPasswordPolicyDialogParams) {
        super(params);  
    }


    protected initializeSettings() {
        super.initializeSettings();

        this.busyContext = new BusyIndicator(this);

        this.customSubscriptions = [];

        this.showModal = ko.observable(false);
        // input settings
        this.showModalFromOutside = this.settings.showModalFromOutside;
        // modal fields    
        this.passwordPolicy = {
            ID: ko.observable(''),
            EnforcePasswordHistoryCount: ko.observable(0),
            MinPasswordLength: ko.observable(0),
            MaxPasswordAgeInDays: ko.observable(0),
            MustContainDigits: ko.observable(false),
            MustContainUpperCaseChars: ko.observable(false),
            MustContainLowerCaseChars: ko.observable(false),
            MustContainSpecialChars: ko.observable(false)
        }
        // methods
        this.initializeComputeds();
    }

    private initializeComputeds() {
        this.showModalFromOutside.extend({ notify: 'always' });
        let showModalSubscription = this.showModalFromOutside.subscribe((newValue) => {
            if (newValue) {
                this.showModal(true);
                this.getPasswordPolicySettings();
            } else {
                this.showModal(false);
            }
        });
        this.customSubscriptions.push(showModalSubscription);
    }

    private getPasswordPolicySettings() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyGettingPasswordPolicySettings')(), async () => {
            try {
                const passwordPolicyResponse = await ConfigurationsService.getPasswordPolicySettings();
                if (!isNullOrUndefined(passwordPolicyResponse)) {
                    this.passwordPolicy.ID(passwordPolicyResponse.ID);
                    this.passwordPolicy.EnforcePasswordHistoryCount(passwordPolicyResponse.EnforcePasswordHistoryCount);
                    this.passwordPolicy.MinPasswordLength(passwordPolicyResponse.MinPasswordLength);
                    this.passwordPolicy.MaxPasswordAgeInDays(passwordPolicyResponse.MaxPasswordAgeInDays);
                    this.passwordPolicy.MustContainDigits(passwordPolicyResponse.MustContainDigits);
                    this.passwordPolicy.MustContainUpperCaseChars(passwordPolicyResponse.MustContainUpperCaseChars);
                    this.passwordPolicy.MustContainLowerCaseChars(passwordPolicyResponse.MustContainLowerCaseChars);
                    this.passwordPolicy.MustContainSpecialChars(passwordPolicyResponse.MustContainSpecialChars);
                }
            } catch (error) {
                this.connector.handleError(WfUMPasswordPolicyDialogComponent)(error);
            }
        })      
    }

    private onClickSavePasswordPolicySettings() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusySavingPasswordPolicySettings')(), async () => {
            try {
                const newPasswordPolicy: PasswordPolicyDTO = {
                    ID: this.passwordPolicy.ID(),
                    EnforcePasswordHistoryCount: this.passwordPolicy.EnforcePasswordHistoryCount(),
                    MinPasswordLength: this.passwordPolicy.MinPasswordLength(),
                    MaxPasswordAgeInDays: this.passwordPolicy.MaxPasswordAgeInDays(),
                    MustContainDigits: this.passwordPolicy.MustContainDigits(),
                    MustContainUpperCaseChars: this.passwordPolicy.MustContainUpperCaseChars(),
                    MustContainLowerCaseChars: this.passwordPolicy.MustContainLowerCaseChars(),
                    MustContainSpecialChars: this.passwordPolicy.MustContainSpecialChars(),
                }

                const settingsResponse = await ConfigurationsService.savePasswordPolicySettings(newPasswordPolicy);
                if(settingsResponse) {
                    Logger.successToast(this.connector.translate('I4SCADA_UM_PasswordPolicySettingsSaved')());
                    this.close();
                }
                
            } catch (error) {
                this.connector.handleError(WfUMPasswordPolicyDialogComponent)(error);
            }
        })     
    }

    private close() {
        this.showModalFromOutside(false);
    }

    private confirm() {
        this.close();
    }

    private clearCustomSubscriptions() {
        for (let i = 0; i < this.customSubscriptions.length; i++) { 
            this.customSubscriptions[i].dispose();          
        }
    }

    protected async dispose() {
        this.clearCustomSubscriptions();
        await super.dispose();
    }
}

export = WfUMPasswordPolicyDialogComponent;
