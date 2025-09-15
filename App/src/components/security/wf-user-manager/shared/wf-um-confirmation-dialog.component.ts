import ComponentBaseModel = require("../../../component-base.model");

interface IWfConfirmationDialogParams extends IComponentBaseParams {
    showModalFromOutside: KnockoutObservable<boolean>;
    confirmCallBackMethod: Function;
}

class WfConfirmationDialogComponent extends ComponentBaseModel<IWfConfirmationDialogParams> {   

    private showModal: KnockoutObservable<boolean>;
    // input settings
    private showModalFromOutside: KnockoutObservable<boolean>;
    private confirmCallBackMethod: Function;

    constructor(params: IWfConfirmationDialogParams) {
        super(params);  
    }


    protected initializeSettings() {
        super.initializeSettings();
        this.showModal = ko.observable(false);
        // input settings
        this.showModalFromOutside = this.settings.showModalFromOutside;
        this.confirmCallBackMethod = this.settings.confirmCallBackMethod;
       
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
    }

    private close() {
        this.showModalFromOutside(false);
    }

    private confirm() {
        this.confirmCallBackMethod();
        this.close();
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfConfirmationDialogComponent;
