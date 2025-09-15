import ComponentBaseModel = require("../component-base.model");


interface IWfWriteSecureSignalParams extends IComponentBaseParams {
    show: KnockoutObservable<boolean>;
    signalNames: string[];
    signalValues: KnockoutObservable<any[]>;
    writeFromBuffer: boolean;
    successCalback: () => void;
    cancelCalback: () => void;
}

class WfWriteSecureSignalComponent extends ComponentBaseModel<IWfWriteSecureSignalParams> {
    private isUserLoggedIn: KnockoutObservable<boolean>;
    private reinforcementPassword: KnockoutObservable<string>;
    private cancelCalback: () => void;
    private successCalback: () => void;
    private writeFromBuffer: boolean;
    private signalValues: KnockoutObservable<any[]>;
    private signalNames: string[];
    private showWriteSecure: KnockoutObservable<boolean>;
    private draggable: KnockoutObservable<boolean>;

    constructor(params: IWfWriteSecureSignalParams) {
        super(params);
    }

    protected initializeSettings() {
        super.initializeSettings();

        this.showWriteSecure = this.settings.show !== undefined ? this.settings.show : ko.observable(false);
        this.draggable = this.settings.isModalDialogsDraggable !== undefined ? ko.observable(this.settings.isModalDialogsDraggable) : ko.observable(false);
        this.signalNames = this.settings.signalNames !== undefined ? this.settings.signalNames : null;
        this.signalValues = this.settings.signalValues !== undefined ? this.settings.signalValues : null;
        this.writeFromBuffer = this.settings.writeFromBuffer !== undefined ? this.settings.writeFromBuffer : false;

        this.successCalback = this.settings.successCalback !== undefined ? this.settings.successCalback : null;
        this.cancelCalback = this.settings.cancelCalback !== undefined ? this.settings.cancelCalback : null;

        this.reinforcementPassword = ko.observable<string>();
        this.isUserLoggedIn = ko.observable(true);

        this.checkUserIsLoggedIn();
    }

    private handleCancelWriteSecure() {
        this.closeWriteSecure();

        if (this.cancelCalback)
            this.cancelCalback();
    }

    private closeWriteSecure() {
        this.reinforcementPassword(null);
        this.showWriteSecure(false);
    }

    private async checkUserIsLoggedIn() {
        const userName = await this.connector.getCurrentLoggedInUser()
        return userName ? this.isUserLoggedIn(true) : this.isUserLoggedIn(false);
    }

    private async writeSignalsFromBufferSecure() {
        const result = await this.connector.writeSignalsFromBufferSecure(this.reinforcementPassword());
        if (result) {
            this.closeWriteSecure();
            if (this.successCalback)
                this.successCalback();
        }
    }

    private async writeSignalsSecure() {
        const values : SignalValue= {};
        const signalValues = ko.unwrap(this.signalValues);
        const signalNames = ko.unwrap(this.signalNames);

        for (let i = 0; i < signalNames.length; i++) {
            let signalName = ko.unwrap(signalNames[i]);
            let signalValue = ko.unwrap(signalValues[i]);
            if (signalName && (signalValue !== undefined))
                values[signalName] = signalValue;
        }

        const response = await this.connector.writeSignalsSecure(this.reinforcementPassword(), values);
        if (response !== undefined) {
            this.closeWriteSecure();

            if (this.successCalback)
                this.successCalback();
        }
    }

    private async handleWriteSecure() {
        if (this.writeFromBuffer)
            return await this.writeSignalsFromBufferSecure();
        if (!this.signalNames || !this.signalValues)
            return this.closeWriteSecure();
        return await this.writeSignalsSecure();
    }

    /**
     * 
     * 
     * @protected
     * 
     * @memberOf WfWriteSecureSignalComponent
     */
    protected async dispose() {
        await super.dispose();
        //clear dialogs
        var configDialog = $(document).find('#wf-write-secure-dialog-' + ko.unwrap(this.id));
        var configBackContainer = $(document).find('#wf-write-secure-dialog-back-container-' + ko.unwrap(this.id));

        configDialog.remove();
        configBackContainer.remove();
    }
}

export = WfWriteSecureSignalComponent;
