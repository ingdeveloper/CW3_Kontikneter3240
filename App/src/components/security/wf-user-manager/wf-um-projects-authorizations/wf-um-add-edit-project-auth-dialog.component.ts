import ComponentBaseModel = require("../../../component-base.model");
import SessionService = require("../../../../services/sessionService");
import Api = require("../../../../services/api");
import BusyIndicator = require("../../../../decorators/busyIndicator");
import Logger = require("../../../../services/logger");
import ProjectAuthorizationObs = require("../shared/wf-um-project-authorization-obs-model");
import { Utils } from "../shared/utils";

interface IWfUMAddEditProjectAuthDialogParams extends IComponentBaseParams {
    showModalFromOutside: KnockoutObservable<boolean>;
    actionType: KnockoutObservable<string>;
    projectAuth: KnockoutObservable<ProjectAuthorizationDTO>;
    confirmCallBackMethod: Function;  
}

class WfUMAddEditProjectAuthDialogComponent extends ComponentBaseModel<IWfUMAddEditProjectAuthDialogParams> {
    private busyContext: BusyIndicator;

    private projectAuthObs: ProjectAuthorizationObs;
    private showModal: KnockoutObservable<boolean>;
    // modal fields
    private showModalFromOutside: KnockoutObservable<boolean>;   
    private actionType: KnockoutObservable<string>;
    private projectAuth: KnockoutObservable<ProjectAuthorizationDTO>;
    private confirmCallBackMethod: Function;

   
    constructor(params: IWfUMAddEditProjectAuthDialogParams) {
        super(params);
    }


    protected initializeSettings() {
        super.initializeSettings();

        this.busyContext = new BusyIndicator(this);

        this.projectAuthObs = new ProjectAuthorizationObs(); 
        this.showModal = ko.observable(false);
        // input settings
        this.showModalFromOutside = this.settings.showModalFromOutside;
        this.actionType = this.settings.actionType;
        this.projectAuth = this.settings.projectAuth;
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
        if (isNullOrUndefined(this.projectAuth())) {
            this.projectAuthObs.initialize();
        // edit
        } else {
            this.projectAuthObs.fromDto(this.projectAuth());
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
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusySavingProjectAuth')(), async () => {
            try {
                let projectAuthorizationDto = this.projectAuthObs.toDto();
                const isInserted = await Api.securityService.insertProjectAuthorization(SessionService.getSecurityToken(), projectAuthorizationDto, 1000);
                if (isInserted) {
                    this.confirmCallBackMethod(projectAuthorizationDto); 
                    Logger.successToast(this.connector.translate('I4SCADA_UM_ProjectAuthSuccessfullyAdded')().replace(new RegExp("##name##", "ig"), projectAuthorizationDto.Name));          
                }
                this.close();     

            } catch (error) {
                this.connector.handleError(WfUMAddEditProjectAuthDialogComponent)(error);
            }
        })
    }

    private updateProjectAuth() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyUpdatingProjectAuth')(), async () => {
            try {    
                let projectAuthorizationDto = this.projectAuthObs.toDto();
                const isUpdated = await Api.securityService.updateProjectAuthorization(SessionService.getSecurityToken(), projectAuthorizationDto, 1000);
                if (isUpdated) {
                    this.confirmCallBackMethod(projectAuthorizationDto);
                    Logger.successToast(this.connector.translate('I4SCADA_UM_ProjectAuthSuccessfullyUpdated')().replace(new RegExp("##name##", "ig"), projectAuthorizationDto.Name));          
                }
                this.close();      

            } catch (error) {
                this.connector.handleError(WfUMAddEditProjectAuthDialogComponent)(error);
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

export = WfUMAddEditProjectAuthDialogComponent;
