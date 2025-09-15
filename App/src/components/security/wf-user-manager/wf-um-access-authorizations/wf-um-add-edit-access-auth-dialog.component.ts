import ComponentBaseModel = require("../../../component-base.model");
import SessionService = require("../../../../services/sessionService");
import Api = require("../../../../services/api");
import BusyIndicator = require("../../../../decorators/busyIndicator");
import Logger = require("../../../../services/logger");
import AccessAuthorizationObs = require("../shared/wf-um-access-authorization-obs-model");
import { Utils } from "../shared/utils";

interface IWfUMAddEditAccessAuthDialogParams extends IComponentBaseParams {
    showModalFromOutside: KnockoutObservable<boolean>;
    actionType: KnockoutObservable<string>;
    accessAuthorization: KnockoutObservable<AccessAuthorizationDTO>;
    confirmCallBackMethod: Function;  
}

class WfUMAddEditAccessAuthDialogComponent extends ComponentBaseModel<IWfUMAddEditAccessAuthDialogParams> {
    private busyContext: BusyIndicator;

    private accessAuthorizationObs: AccessAuthorizationObs;
    private showModal: KnockoutObservable<boolean>;
    private accessTypeRadioBtn: KnockoutComputed<string>;
    private isSaveValid: KnockoutComputed<boolean>;
    // modal fields
    private showModalFromOutside: KnockoutObservable<boolean>;   
    private actionType: KnockoutObservable<string>;
    private accessAuthorization: KnockoutObservable<AccessAuthorizationDTO>;
    private confirmCallBackMethod: Function;

   
    constructor(params: IWfUMAddEditAccessAuthDialogParams) {
        super(params);
    }


    protected initializeSettings() {
        super.initializeSettings();

        this.busyContext = new BusyIndicator(this);

        this.accessAuthorizationObs = new AccessAuthorizationObs(); 
        this.showModal = ko.observable(false);
        // input settings
        this.showModalFromOutside = this.settings.showModalFromOutside;
        this.actionType = this.settings.actionType;
        this.accessAuthorization = this.settings.accessAuthorization;
        this.confirmCallBackMethod = this.settings.confirmCallBackMethod;      
        // methods
        this.initializeComputeds();
    }

    private initializeComputeds() {
        this.showModalFromOutside.extend({ notify: 'always' });
        this.showModalFromOutside.subscribe((newValue) => {
            if (newValue) {
                this.showModal(true);
                this.initializeData();
            } else {
                this.showModal(false);
            }
        });

        this.accessTypeRadioBtn = ko.computed({
            read: () => {
              return (!!this.accessAuthorizationObs.AccessType()).toString();  
            },
            write: (value) => {
               if(value === 'true') {
                    this.accessAuthorizationObs.AccessType(true);
               } else {
                    this.accessAuthorizationObs.AccessType(false);
               }
            }
        });

        this.isSaveValid = ko.pureComputed(() => {
            return (!this.accessAuthorizationObs.AccessType() && !this.accessAuthorizationObs.ComputerName['isFieldEmpty']() 
                 || this.accessAuthorizationObs.AccessType()) && !this.accessAuthorizationObs.Name['isFieldEmpty']()
        });
    }

    private initializeData() {
        // new
        if (isNullOrUndefined(this.accessAuthorization())) {
            this.accessAuthorizationObs.initialize();
        // edit
        } else {
            this.accessAuthorizationObs.fromDto(this.accessAuthorization());
        }
    }

    private onSaveClick() {
        if(this.actionType() === 'edit') {
            this.updateProjectAuth();
        } else {
            this.insertProjectAuth();
        }
    }

    private insertProjectAuth() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusySavingAccessAuth')(), async () => {
            try {
                let accessAuthorizationDto = this.accessAuthorizationObs.toDto();
                const isInserted = await Api.securityService.insertAccessAuthorization(SessionService.getSecurityToken(), accessAuthorizationDto, 1000);
                if (isInserted) {
                    this.confirmCallBackMethod(accessAuthorizationDto);
                    Logger.successToast(this.connector.translate('I4SCADA_UM_AccessAuthSuccessfullyAdded')().replace(new RegExp("##name##", "ig"), accessAuthorizationDto.Name));          
                }
                this.close();     

            } catch (error) {
                this.connector.handleError(WfUMAddEditAccessAuthDialogComponent)(error);
            }
        })
    }

    private updateProjectAuth() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyUpdatingAccessAuth')(), async () => {
            try {    
                let accessAuthorizationDto = this.accessAuthorizationObs.toDto();
                const isUpdated = await Api.securityService.updateAccessAuthorization(SessionService.getSecurityToken(), accessAuthorizationDto, 1000);
                if (isUpdated) {
                    this.confirmCallBackMethod(accessAuthorizationDto);
                    Logger.successToast(this.connector.translate('I4SCADA_UM_AccessAuthSuccessfullyUpdated')().replace(new RegExp("##name##", "ig"), accessAuthorizationDto.Name));           
                }
                this.close();      

            } catch (error) {
                this.connector.handleError(WfUMAddEditAccessAuthDialogComponent)(error);
            }
        })
    }

    private close() {
        this.showModalFromOutside(false);
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfUMAddEditAccessAuthDialogComponent;
