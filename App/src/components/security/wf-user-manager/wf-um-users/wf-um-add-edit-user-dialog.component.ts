import ComponentBaseModel = require("../../../component-base.model");
import ConfigurationsService = require("../../../../services/configurationsService");
import AuthorizationGroupService = require("../../../../services/authorizationGroupService");
import UsersService = require("../../../../services/usersService");
import BusyIndicator = require("../../../../decorators/busyIndicator");
import Logger = require("../../../../services/logger");
import UserObs = require("../shared/wf-um-user-obs-model");
import AuthorizationGroupObs = require("../shared/wf-um-authorization-group-obs-model");
import CheckBoxObs = require("../shared/wf-um-check-box-obs-model");
import { Utils } from "../shared/utils";

interface IWfUMAddEditUserDialogParams extends IComponentBaseParams {
    showModalFromOutside: KnockoutObservable<boolean>;
    actionType: KnockoutObservable<string>;
    userType: KnockoutObservable<string>;
    user: KnockoutObservable<UserDTO>;
    confirmCallBackMethod: Function;  
}

class WfUMAddEditUserDialogComponent extends ComponentBaseModel<IWfUMAddEditUserDialogParams> {
    private busyContext: BusyIndicator;
    private userObs: UserObs;
    private authGroups: KnockoutObservableArray<CheckBoxObs>;
    private showModal: KnockoutObservable<boolean>;
    // modal fields
    private showModalFromOutside: KnockoutObservable<boolean>;   
    private actionType: KnockoutObservable<string>;
    private userType: KnockoutObservable<string>;
    private user: KnockoutObservable<UserDTO>;
    private confirmCallBackMethod: Function;
    // localizations 
    private authorizationGroupsLoc = this.connector.translate('I4SCADA_UM_AuthorizationGroups');

   
    constructor(params: IWfUMAddEditUserDialogParams) {
        super(params);
    }


    protected initializeSettings() {
        super.initializeSettings();

        this.busyContext = new BusyIndicator(this);
        
        this.userObs = new UserObs(); 
        this.authGroups = ko.observableArray([]);
        this.showModal = ko.observable(false);
        // input settings
        this.showModalFromOutside = this.settings.showModalFromOutside;
        this.actionType = this.settings.actionType;
        this.userType = this.settings.userType;
        this.user = this.settings.user;
        this.confirmCallBackMethod = this.settings.confirmCallBackMethod;      
        // methods
        this.initializeComputeds();
    }

    private initializeComputeds() {
        this.showModalFromOutside.extend({ notify: 'always' });
        this.showModalFromOutside.subscribe((newValue) => {
            if (newValue) {
                this.showModal(true);
                this.initializeUserData();
            } else {
                this.showModal(false);
            }
        });
    }

    private initializeUserData() {
        // new
        if (isNullOrUndefined(this.user())) {
            this.userObs.initialize(this.userType());
        // edit
        } else {
            this.userObs.fromDto(this.user());
        }

        if(this.userType() === 'scada') {
            this.getAuthorizationGroups();
        }
    }

    getAuthorizationGroups() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyLoadingAuthGroup')(), async () => {
            try {    
                this.authGroups([]); // reset array data
                const response = await AuthorizationGroupService.getAllAuthorizationGroup();
                if (response) {
                    response.forEach(item => {
                        let checkBoxObsItem = new CheckBoxObs(item);
                        if (this.actionType() === 'edit' && this.userObs.AuthorizationGroupIDs().indexOf(item.ID) > -1) {
                            checkBoxObsItem.Selected(true);
                        }
                        this.authGroups.push(checkBoxObsItem);
                    });
                }    

            } catch (error) {
                this.connector.handleError(WfUMAddEditUserDialogComponent)(error);
            }
        })
    }

    private onResetFailedLogonsClick() {
        this.userObs.FailedLogOns(0);
    }

    private onClickSaveUser() {
        if(this.userType() === 'scada') {
            this.userObs.AuthorizationGroupIDs(this.authGroups().filter(item => item.Selected()).map(item => item.ID));
        }
        if(this.actionType() === 'edit') {
            this.updateUser();
        } else {
            this.insertUser();
        }
    }

    private insertUser() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusySavingUser')(), async () => {
            try {
                let userDto = this.userObs.toDto();
                const isInserted = await UsersService.insertUser(userDto);
                if (isInserted) {
                    this.confirmCallBackMethod(userDto);
                    Logger.successToast(this.connector.translate('I4SCADA_UM_UserSuccessfullyAdded')().replace(new RegExp("##name##", "ig"), userDto.Name));          
                }
                this.close();     

            } catch (error) {
                this.connector.handleError(WfUMAddEditUserDialogComponent)(error);
            }
        })
    }

    private updateUser() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyUpdatingUser')(), async () => {
            try {    
                let userDto = this.userObs.toDto();
                const newToken = await UsersService.updateUser(userDto);
                if (newToken) {
                    this.connector.setSecurityToken(newToken);
                    this.confirmCallBackMethod(userDto);
                    Logger.successToast(this.connector.translate('I4SCADA_UM_UserSuccessfullyUpdated')().replace(new RegExp("##name##", "ig"), userDto.Name));           
                }
                this.close();      

            } catch (error) {
                this.connector.handleError(WfUMAddEditUserDialogComponent)(error);
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

export = WfUMAddEditUserDialogComponent;
