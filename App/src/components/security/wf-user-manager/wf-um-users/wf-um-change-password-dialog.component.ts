import ComponentBaseModel = require("../../../component-base.model");
import { Utils } from "../shared/utils";

interface IWfUMConfirmationDialogParams extends IComponentBaseParams {
    showModalFromOutside: KnockoutObservable<boolean>;
    confirmCallBackMethod: Function;   
}

class WfUMConfirmationDialogComponent extends ComponentBaseModel<IWfUMConfirmationDialogParams> {   

    private showModal: KnockoutObservable<boolean>;
    // input settings
    private showModalFromOutside: KnockoutObservable<boolean>;
    private confirmCallBackMethod: Function;
    // modal fields 
    newPassword: KnockoutObservable<string>;
    newPasswordConfirmation: KnockoutObservable<string>;
    passwordIsValid: KnockoutComputed<boolean>;

    constructor(params: IWfUMConfirmationDialogParams) {
        super(params);  
    }


    protected initializeSettings() {
        super.initializeSettings();

        this.showModal = ko.observable(false);
        // input settings
        this.showModalFromOutside = this.settings.showModalFromOutside;
        this.confirmCallBackMethod = this.settings.confirmCallBackMethod;
        // modal fields    
        this.newPassword = ko.observable('');
        this.newPasswordConfirmation = ko.observable('');

        this.initializeComputeds();
    }
   

    private initializeComputeds() {
        this.showModalFromOutside.extend({ notify: 'always' });
        this.showModalFromOutside.subscribe((newValue) => {
            if (newValue) {               
                this.showModal(true);
            } else {
                this.showModal(false);
            }
        });

        this.passwordIsValid = ko.pureComputed(() => {
            return !Utils.isNullUndefOrEmpty(this.newPassword()) && 
                   !Utils.isNullUndefOrEmpty(this.newPasswordConfirmation()) && 
                   this.newPassword() === this.newPasswordConfirmation()
        }, this);
    }

    private close() {
        this.newPassword('');
        this.newPasswordConfirmation('');
        this.showModalFromOutside(false);
    }

    private confirm() {
        this.confirmCallBackMethod(this.newPassword());
        this.close();
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfUMConfirmationDialogComponent;
