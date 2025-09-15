import ComponentBaseModel = require("../../../component-base.model");
import ConfigurationsService = require("../../../../services/configurationsService");
import BusyIndicator = require("../../../../decorators/busyIndicator");
import Logger = require("../../../../services/logger");
import { Utils } from "../shared/utils";

interface IWfUMDefaultSettingsDialogParams extends IComponentBaseParams {
    showModalFromOutside: KnockoutObservable<boolean>;   
}

class WfUMDefaultSettingsDialogComponent extends ComponentBaseModel<IWfUMDefaultSettingsDialogParams> {   
    private busyContext: BusyIndicator;

    private customSubscriptions;

    private showModal: KnockoutObservable<boolean>;
    // input settings
    private showModalFromOutside: KnockoutObservable<boolean>;
    // modal fields 
    defaultSettings: any;

    constructor(params: IWfUMDefaultSettingsDialogParams) {
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
        this.defaultSettings = {
            ID: ko.observable(''),
            Description: ko.observable(''),
            UserLevel: ko.observable(0),
            AllowMultipleLogons: ko.observable(false),
            AutoLogOffInterval: ko.observable(0),
            MaxFailedLogons: ko.observable(0),
            LogActivities: ko.observable(false),
            IsAdmin: ko.observable(false),
            Active: ko.observable(false)
        }
        // methods
        this.initializeComputeds();
    }

    private initializeComputeds() {
        this.showModalFromOutside.extend({ notify: 'always' });
        let showModalSubscription = this.showModalFromOutside.subscribe((newValue) => {
            if (newValue) {
                this.showModal(true);
                this.getDefaultSettings();
            } else {
                this.showModal(false);
            }
        });
        this.customSubscriptions.push(showModalSubscription);
    }

    private getDefaultSettings() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyGettingDefaultSettingsDetails')(), async () => {
            try {
                const settingsResponse = await ConfigurationsService.getUserDefaultSettings();
                if (!isNullOrUndefined(settingsResponse)) {
                    this.defaultSettings.ID(settingsResponse.ID);
                    this.defaultSettings.Description(settingsResponse.Description);
                    this.defaultSettings.UserLevel(settingsResponse.UserLevel);
                    this.defaultSettings.AllowMultipleLogons(settingsResponse.AllowMultipleLogons);
                    this.defaultSettings.AutoLogOffInterval(settingsResponse.AutoLogOffInterval);
                    this.defaultSettings.MaxFailedLogons(settingsResponse.MaxFailedLogons);
                    this.defaultSettings.LogActivities(settingsResponse.LogActivities);
                    this.defaultSettings.IsAdmin(settingsResponse.IsAdmin);
                    this.defaultSettings.Active(settingsResponse.Active);
                }
            } catch (error) {
                this.connector.handleError(WfUMDefaultSettingsDialogComponent)(error);
            }
        })      
    }

    private onClickSaveDefaultSettings() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusySavingDefaultSettingsDetails')(), async () => {
            try {
                const newDefaultSettings: UserDefaultSettingsDTO = {
                    ID: this.defaultSettings.ID(),
                    Description: this.defaultSettings.Description(),
                    UserLevel: this.defaultSettings.UserLevel(),
                    AllowMultipleLogons: this.defaultSettings.AllowMultipleLogons(),
                    AutoLogOffInterval: this.defaultSettings.AutoLogOffInterval(),
                    MaxFailedLogons: this.defaultSettings.MaxFailedLogons(),
                    LogActivities: this.defaultSettings.LogActivities(),
                    IsAdmin: this.defaultSettings.IsAdmin(),
                    Active: this.defaultSettings.Active()
                }

                const settingsResponse = await ConfigurationsService.saveUserDefaultSettings(newDefaultSettings);
                if(settingsResponse) {
                    Logger.successToast(this.connector.translate('I4SCADA_UM_UsersDefaultSettingsSaved')());
                    this.close();
                }
                
            } catch (error) {
                this.connector.handleError(WfUMDefaultSettingsDialogComponent)(error);
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

export = WfUMDefaultSettingsDialogComponent;
