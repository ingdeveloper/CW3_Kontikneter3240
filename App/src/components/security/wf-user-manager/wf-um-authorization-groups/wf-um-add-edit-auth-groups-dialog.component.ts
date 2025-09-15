import ComponentBaseModel = require("../../../component-base.model");
import SessionService = require("../../../../services/sessionService");
import Api = require("../../../../services/api");
import AlarmsService = require("../../../../services/alarmsService");
import AuthorizationGroupService = require("../../../../services/authorizationGroupService");
import BusyIndicator = require("../../../../decorators/busyIndicator");
import Logger = require("../../../../services/logger");
import AuthorizationGroupObs = require("../shared/wf-um-authorization-group-obs-model");
import CheckBoxObs = require("../shared/wf-um-check-box-obs-model");
import { Utils } from "../shared/utils";

interface IWfUMAddEditAuthGroupsDialogParams extends IComponentBaseParams {
    showModalFromOutside: KnockoutObservable<boolean>;
    actionType: KnockoutObservable<string>;
    authorizationGroup: KnockoutObservable<AuthorizationGroupDTO>;
    confirmCallBackMethod: Function;  
}

class WfUMAddEditAuthGroupsDialogComponent extends ComponentBaseModel<IWfUMAddEditAuthGroupsDialogParams> {
    private busyContext: BusyIndicator;

    private projectAuthorizations: KnockoutObservableArray<CheckBoxObs>;
    private systemAuthorizations: KnockoutObservableArray<CheckBoxObs>;
    private writeGroups: KnockoutObservableArray<CheckBoxObs>;
    private alarmTypes: KnockoutObservableArray<CheckBoxObs>;
    private alarmGroups: KnockoutObservableArray<CheckBoxObs>;
    private accessGroups: KnockoutObservableArray<CheckBoxObs>;
    private schedulerLocations: KnockoutObservableArray<CheckBoxObs>;

    private authorizationGroupObs: AuthorizationGroupObs;
    private showModal: KnockoutObservable<boolean>;
    // modal fields
    private showModalFromOutside: KnockoutObservable<boolean>;   
    private actionType: KnockoutObservable<string>;
    private authorizationGroup: KnockoutObservable<AuthorizationGroupDTO>;
    private confirmCallBackMethod: Function;
    // localizations 
    private projectAuthorizationsLoc = this.connector.translate('I4SCADA_UM_ProjectAuthorizations');
    private systemAuthorizationsLoc = this.connector.translate('I4SCADA_UM_SystemAuthorizations');  
    private writeGroupsLoc = this.connector.translate('I4SCADA_UM_WriteGroups');  
    private alarmTypesLoc = this.connector.translate('I4SCADA_UM_AlarmTypes');  
    private alarmGroupsLoc = this.connector.translate('I4SCADA_UM_AlarmGroups');  
    private accessGroupsLoc = this.connector.translate('I4SCADA_UM_AccessGroups');  
    private schedulerLocationsLoc = this.connector.translate('I4SCADA_UM_SchedulerLocations');  

   
    constructor(params: IWfUMAddEditAuthGroupsDialogParams) {
        super(params);
    }


    protected initializeSettings() {
        super.initializeSettings();

        this.busyContext = new BusyIndicator(this);

        this.projectAuthorizations = ko.observableArray([]);
        this.systemAuthorizations = ko.observableArray([]);
        this.writeGroups = ko.observableArray([]);
        this.alarmTypes = ko.observableArray([]);
        this.alarmGroups = ko.observableArray([]);
        this.accessGroups = ko.observableArray([]);
        this.schedulerLocations = ko.observableArray([]);

        this.authorizationGroupObs = new AuthorizationGroupObs(); 
        this.showModal = ko.observable(false);
        // input settings
        this.showModalFromOutside = this.settings.showModalFromOutside;
        this.actionType = this.settings.actionType;
        this.authorizationGroup = this.settings.authorizationGroup;
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
        if (isNullOrUndefined(this.authorizationGroup())) {
            this.authorizationGroupObs.initialize();
        // edit
        } else {
            this.authorizationGroupObs.fromDto(this.authorizationGroup());
        }

        this.getAllProjectAuthorization();
        this.getAllSystemAuthorization();
        this.getAllWriteGroup();
        this.getAlarmTypes()
        this.getAlarmGroups();
        this.getAllAccessGroups();
        this.getAllSchedulerLocations();
    }

    private getAllProjectAuthorization() {
        this.busyContext.runLongAction('Loading project authorizations...', async () => {
            try {   
                this.projectAuthorizations([]); // reset array data
                const response = await Api.securityService.getAllProjectAuthorization(SessionService.getSecurityToken(), 1000);
                if (response) {
                    response.forEach(item => {
                        let checkBoxObsItem = new CheckBoxObs(item);
                        if (this.actionType() === 'edit' && this.authorizationGroupObs.ProjectAuthorizationIDs().indexOf(item.ID) > -1) {
                            checkBoxObsItem.Selected(true);
                        }
                        this.projectAuthorizations.push(checkBoxObsItem);
                    });
                }    
            } catch (error) {
                this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error);
            }
        })
    }

    private getAllSystemAuthorization() {
        this.busyContext.runLongAction('Loading system authorizations...', async () => {
            try {   
                this.systemAuthorizations([]); // reset array data 
                const response = await Api.securityService.getAllSystemAuthorization(SessionService.getSecurityToken(), 1000);
                if (response) {
                    response.forEach(item => {
                        let checkBoxObsItem = new CheckBoxObs(item);
                        if (this.actionType() === 'edit' && this.authorizationGroupObs.SystemAuthorizationIDs().indexOf(item.ID) > -1) {
                            checkBoxObsItem.Selected(true);
                        }
                        this.systemAuthorizations.push(checkBoxObsItem);
                    });
                }    
            } catch (error) {
                this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error);
            }
        })
    }

    private getAllWriteGroup() {
        this.busyContext.runLongAction('Loading write groups...', async () => {
            try {   
                this.writeGroups([]); // reset array data  
                const response = await Api.signalsService.getAllWriteGroup(SessionService.getSecurityToken(), 1000);
                if (response) {
                    response.forEach(item => {
                        let checkBoxObsItem = new CheckBoxObs(item);
                        if (this.actionType() === 'edit' && this.authorizationGroupObs.WriteGroupIDs().indexOf(item.ID) > -1) {
                            checkBoxObsItem.Selected(true);
                        }
                        this.writeGroups.push(checkBoxObsItem);
                    });
                }    
            } catch (error) {
                this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error);
            }
        })
    }

    private getAlarmTypes() {
        this.busyContext.runLongAction('Loading alarm types...', async () => {
            try {  
                this.alarmTypes([]); // reset array data   
                const response = await AlarmsService.getAlarmTypes(this.connector.currentLanguageId());
                if (response) {
                    response.forEach(item => {
                        let checkBoxObsItem = new CheckBoxObs(item, 'SymbolicTextTranslation');
                        if (this.actionType() === 'edit' && this.authorizationGroupObs.AlarmTypeIDs().indexOf(item.ID) > -1) {
                            checkBoxObsItem.Selected(true);
                        }
                        this.alarmTypes.push(checkBoxObsItem);
                    });
                }    
            } catch (error) {
                this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error);
            }
        })
    }

    private getAlarmGroups() {
        this.busyContext.runLongAction('Loading alarm groups...', async () => {
            try {   
                this.alarmGroups([]); // reset array data  
                const response = await AlarmsService.getAlarmGroups(this.connector.currentLanguageId());
                if (response) {
                    response.forEach(item => {
                        let checkBoxObsItem = new CheckBoxObs(item, 'SymbolicTextTranslation');
                        if (this.actionType() === 'edit' && this.authorizationGroupObs.AlarmGroupIDs().indexOf(item.ID) > -1) {
                            checkBoxObsItem.Selected(true);
                        }
                        this.alarmGroups.push(checkBoxObsItem);
                    });
                }    
            } catch (error) {
                this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error);
            }
        })
    }

    private getAllAccessGroups() {
        this.busyContext.runLongAction('Loading access groups types...', async () => {
            try {  
                this.accessGroups([]); // reset array data   
                const response = await Api.securityService.getAllAccessGroup(SessionService.getSecurityToken(), 1000);
                if (response) {
                    response.forEach(item => {
                        let checkBoxObsItem = new CheckBoxObs(item);
                        if (this.actionType() === 'edit' && this.authorizationGroupObs.AccessGroupIDs().indexOf(item.ID) > -1) {
                            checkBoxObsItem.Selected(true);
                        }
                        this.accessGroups.push(checkBoxObsItem);
                    });
                }    
            } catch (error) {
                this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error);
            }
        })
    }

    private getAllSchedulerLocations() {
        this.busyContext.runLongAction('Loading scheduler locations types...', async () => {
            try {   
                this.schedulerLocations([]); // reset array data  
                const response = await Api.securityService.getAllSchedulerLocation(SessionService.getSecurityToken(), 1000);
                if (response) {
                    response.forEach(item => {
                        let checkBoxObsItem = new CheckBoxObs(item);
                        if (this.actionType() === 'edit' && this.authorizationGroupObs.LocationIDs().indexOf(item.ID) > -1) {
                            checkBoxObsItem.Selected(true);
                        }
                        this.schedulerLocations.push(checkBoxObsItem);
                    });
                }    
            } catch (error) {
                this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error);
            }
        })
    }

    private onSaveClick() {
        // set selected items
        this.authorizationGroupObs.ProjectAuthorizationIDs(this.projectAuthorizations().filter(item => item.Selected()).map(item => item.ID));
        this.authorizationGroupObs.SystemAuthorizationIDs(this.systemAuthorizations().filter(item => item.Selected()).map(item => item.ID));
        this.authorizationGroupObs.WriteGroupIDs(this.writeGroups().filter(item => item.Selected()).map(item => item.ID));
        this.authorizationGroupObs.AlarmTypeIDs(this.alarmTypes().filter(item => item.Selected()).map(item => item.ID));
        this.authorizationGroupObs.AlarmGroupIDs(this.alarmGroups().filter(item => item.Selected()).map(item => item.ID)); 
        this.authorizationGroupObs.AccessGroupIDs(this.accessGroups().filter(item => item.Selected()).map(item => item.ID));
        this.authorizationGroupObs.LocationIDs(this.schedulerLocations().filter(item => item.Selected()).map(item => item.ID));

        if(this.actionType() === 'edit') {
            this.updateAuthGroup();
        } else {
            this.insertAuthGroup();
        }
    }

    private insertAuthGroup() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusySavingAuthGroup')(), async () => {
            try {
                let authorizationGroupDto = this.authorizationGroupObs.toDto();
                const isInserted = await AuthorizationGroupService.insertAuthorizationGroup(authorizationGroupDto);
                if (isInserted) {
                    this.confirmCallBackMethod(authorizationGroupDto);
                    Logger.successToast(this.connector.translate('I4SCADA_UM_AuthGroupSuccessfullyAdded')().replace(new RegExp("##name##", "ig"), authorizationGroupDto.Name));         
                }
                this.close();     

            } catch (error) {
                this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error);
            }
        })
    }

    private updateAuthGroup() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyUpdatingAuthGroup')(), async () => {
            try {    
                let authorizationGroupDto = this.authorizationGroupObs.toDto();
                const isUpdated = await AuthorizationGroupService.updateAuthorizationGroup(authorizationGroupDto);
                if (isUpdated) {
                    this.confirmCallBackMethod(authorizationGroupDto);
                    Logger.successToast(this.connector.translate('I4SCADA_UM_AuthGroupSuccessfullyUpdated')().replace(new RegExp("##name##", "ig"), authorizationGroupDto.Name));      
                }
                this.close();      

            } catch (error) {
                this.connector.handleError(WfUMAddEditAuthGroupsDialogComponent)(error);
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

export = WfUMAddEditAuthGroupsDialogComponent;
