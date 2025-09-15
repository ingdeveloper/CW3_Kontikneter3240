import ComponentBaseModel = require("../../../component-base.model");
import SessionService = require("../../../../services/sessionService");
import Api = require("../../../../services/api");
import BusyIndicator = require("../../../../decorators/busyIndicator");
import Logger = require("../../../../services/logger");
import AccessGroupObs = require("../shared/wf-um-access-group-obs-model");
import CheckBoxObs = require("../shared/wf-um-check-box-obs-model");
import { Utils } from "../shared/utils";

interface IWfUMAddEditAccessGroupDialogParams extends IComponentBaseParams {
    showModalFromOutside: KnockoutObservable<boolean>;
    actionType: KnockoutObservable<string>;
    accessGroup: KnockoutObservable<AccessGroupDTO>;
    confirmCallBackMethod: Function;  
}

class WfUMAddEditAccessGroupDialogComponent extends ComponentBaseModel<IWfUMAddEditAccessGroupDialogParams> {
    private busyContext: BusyIndicator;
    private accessGroupObs: AccessGroupObs;
    private accessAuthorization: KnockoutObservableArray<CheckBoxObs>;
    private showModal: KnockoutObservable<boolean>;
    // date picker options
    private datePickerOpt: any; 
    // modal fields
    private showModalFromOutside: KnockoutObservable<boolean>;   
    private actionType: KnockoutObservable<string>;
    private accessGroup: KnockoutObservable<AccessGroupDTO>;
    private confirmCallBackMethod: Function;
    // localizations 
    private accessRightsLoc = this.connector.translate('I4SCADA_UM_AccessRights');

   
    constructor(params: IWfUMAddEditAccessGroupDialogParams) {
        super(params);
    }


    protected initializeSettings() {
        super.initializeSettings();

        this.busyContext = new BusyIndicator(this);

        this.accessGroupObs = new AccessGroupObs(); 
        this.accessAuthorization = ko.observableArray([]);
        this.showModal = ko.observable(false);
        
        this.datePickerOpt = {
            locale: this.connector.getGenericCulture(ko.unwrap(this.connector.currentLanguageId)),
            format: 'HH:mm:ss'
        }
        // input settings
        this.showModalFromOutside = this.settings.showModalFromOutside;
        this.actionType = this.settings.actionType;
        this.accessGroup = this.settings.accessGroup;
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
    }

    private initializeData() {
        // new
        if (isNullOrUndefined(this.accessGroup())) {
            this.accessGroupObs.initialize();
        // edit
        } else {
            this.accessGroupObs.fromDto(this.accessGroup());
        }

        this.getAllAccessAuthorization();
    }

    getAllAccessAuthorization() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyLoadingAccessAuth')(), async () => {
            try {    
                this.accessAuthorization([]); // reset array data
                const response = await Api.securityService.getAllAccessAuthorization(SessionService.getSecurityToken(), 1000);
                if (response) {
                    response.forEach(item => {
                        let checkBoxObsItem = new CheckBoxObs(item);
                        if (this.actionType() === 'edit' && this.accessGroupObs.AccessAuthorizationIDs().indexOf(item.ID) > -1) {
                            checkBoxObsItem.Selected(true);
                        }
                        this.accessAuthorization.push(checkBoxObsItem);
                    });
                }    

            } catch (error) {
                this.connector.handleError(WfUMAddEditAccessGroupDialogComponent)(error);
            }
        })
    }

    private onSaveClick() {
        this.accessGroupObs.AccessAuthorizationIDs(this.accessAuthorization().filter(item => item.Selected()).map(item => item.ID));

        if(this.actionType() === 'edit') {
            this.updateProjectAuth();
        } else {
            this.insertProjectAuth();
        }
    }

    private insertProjectAuth() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusySavingAccessAuth')(), async () => {
            try {
                let accessGroupDto = this.accessGroupObs.toDto();
                const isInserted = await Api.securityService.insertAccessGroup(SessionService.getSecurityToken(), accessGroupDto, 1000);
                if (isInserted) {
                    this.confirmCallBackMethod(accessGroupDto);
                    Logger.successToast(this.connector.translate('I4SCADA_UM_AccessGroupSuccessfullyAdded')().replace(new RegExp("##name##", "ig"), accessGroupDto.Name));           
                }
                this.close();     

            } catch (error) {
                this.connector.handleError(WfUMAddEditAccessGroupDialogComponent)(error);
            }
        })
    }

    private updateProjectAuth() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyUpdatingAccessAuth')(), async () => {
            try {    
                let accessGroupDto = this.accessGroupObs.toDto();
                const isUpdated = await Api.securityService.updateAccessGroup(SessionService.getSecurityToken(), accessGroupDto, 1000);
                if (isUpdated) {
                    this.confirmCallBackMethod(accessGroupDto);
                    Logger.successToast(this.connector.translate('I4SCADA_UM_AccessGroupSuccessfullyUpdated')().replace(new RegExp("##name##", "ig"), accessGroupDto.Name));          
                }
                this.close();      

            } catch (error) {
                this.connector.handleError(WfUMAddEditAccessGroupDialogComponent)(error);
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

export = WfUMAddEditAccessGroupDialogComponent;
