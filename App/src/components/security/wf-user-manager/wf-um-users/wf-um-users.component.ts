import ComponentBaseModel = require("../../../component-base.model");
import UsersService = require("../../../../services/usersService");
import BusyIndicator = require("../../../../decorators/busyIndicator");
import Logger = require("../../../../services/logger");
import { WfUMSortedColumn } from "../shared/wf-um-interfaces";
import { Pages, Action, UserType, SortOrder } from "../shared/wf-um-enyms";
import { Utils } from "../shared/utils";

declare var uuid;

interface IWfUMUsersParams extends IComponentBaseParams {
    showDefaultSettingsDialog: KnockoutObservable<boolean>;
    showPasswordPolicyDialog: KnockoutObservable<boolean>;
    refreshPageTrigger: KnockoutObservable<string>;
    height: number;
}

class WfUMUsersComponent extends ComponentBaseModel<IWfUMUsersParams> {
    private busyContext: BusyIndicator;
    private SortOrder = SortOrder;
    private UserType = UserType;
    private customSubscriptions;

    private tableDS: KnockoutObservableArray<UserDTO>;
    private tableViewDS: KnockoutObservableArray<UserDTO>;
    private searchText: KnockoutObservable<string>;
    private sortedColumn: WfUMSortedColumn;

    private height: KnockoutObservable<number>;
    private panelBodyHeight: KnockoutComputed<number>;

    private refreshPageTrigger: KnockoutObservable<string>;

    // dialogs
    private confirmDialog: any;
    private cloneNameDialog: any;
    private passwordChangeDialog: any;
    private defaultSettingsDialog: any;
    private passwordPolicyDialog: any;
    private addEditDialog: any;

    constructor(params: IWfUMUsersParams) {
        super(params);

        this.initializeComputeds();
    }


    protected initializeSettings() {
        this.settings.systemAuthorization = "UserManager Operator";
        super.initializeSettings();

        this.busyContext = new BusyIndicator(this);
        this.customSubscriptions = [];

        this.tableDS = ko.observableArray([]);
        this.tableViewDS = ko.observableArray([]);
        this.searchText = ko.observable('');
        this.sortedColumn = { name: ko.observable(''), order: ko.observable('') };

        this.refreshPageTrigger = this.settings.refreshPageTrigger;

        this.initializeDialogsVariables();
        this.refreshPage();

        this.height = ko.observable(ko.unwrap(this.settings.height) || null);

        this.panelBodyHeight = ko.pureComputed(() => {
            if (!this.height()) {
                return null;
            }
            return this.height();
        });
    }

    private initializeDialogsVariables() {
        // confirm
        this.confirmDialog = {
            selectedItem: null,
            show: ko.observable(false),
            responseMethod: async () => {
                this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyDeletingUser')(), async () => {
                    try {
                        const newToken = await UsersService.deleteUser(this.confirmDialog.selectedItem.ID);
                        if (newToken) {
                            this.connector.setSecurityToken(newToken);
                            Logger.successToast(this.connector.translate('I4SCADA_UM_UserSuccessfullyDeleted')().replace(new RegExp("##name##", "ig"), this.confirmDialog.selectedItem.Name));
                        }

                        let userToRemove = Utils.findObjInArray(this.tableDS(), 'ID', this.confirmDialog.selectedItem.ID);

                        this.tableDS.remove(userToRemove);
                        this.tableViewDS.remove(userToRemove);

                    } catch (error) {
                        this.connector.handleError(WfUMUsersComponent)(error);
                    }
                });
            }
        }
        // clone name
        this.cloneNameDialog = {
            selectedItem: ko.observable(),
            tableData: ko.observableArray([]),
            show: ko.observable(false),
            responseMethod: async (cloneName: string) => {
                this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyCloningUser')(),
                    async () => {
                        try {
                            let userClone = Object.assign({}, this.cloneNameDialog.selectedItem());
                            userClone.Name = cloneName;
                            userClone.ID = uuid.v4();

                            const isInserted = await UsersService.insertUser(userClone);
                            if (isInserted) {
                                Logger.successToast(this.connector.translate('I4SCADA_UM_UserSuccessfullyCloned')()
                                    .replace(new RegExp("##name##", "ig"), this.cloneNameDialog.selectedItem().Name));
                                this.tableDS.push(userClone);
                                this.applyFilters();
                            }
                        } catch (error) {
                            this.connector.handleError(WfUMUsersComponent)(error);
                        }
                    });
            }
        }
        // password change
        this.passwordChangeDialog = {
            selectedItem: null,
            show: ko.observable(false),
            responseMethod: async (newPassword) => {
                this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyPasswordUpdating')(), async () => {
                    try {
                        const newToken = await UsersService.changeUserPassword(this.passwordChangeDialog.selectedItem.ID, newPassword);
                        if (newToken) {
                            this.connector.setSecurityToken(newToken);
                            Logger.successToast(this.connector.translate('I4SCADA_UM_UserSuccessfullyUpdatePassword')().replace(new RegExp("##name##", "ig"), this.passwordChangeDialog.selectedItem.Name));
                        }
                    } catch (error) {
                        this.connector.handleError(WfUMUsersComponent)(error);
                    }
                });
            }
        }
        // default settings     
        this.defaultSettingsDialog = {
            show: ko.observable(false)
        }
        this.defaultSettingsDialog.show = this.settings.showDefaultSettingsDialog; // use reference from main page
        // password policy  
        this.passwordPolicyDialog = {
            show: ko.observable(false)
        }
        this.passwordPolicyDialog.show = this.settings.showPasswordPolicyDialog; // use reference from main page
        // add/edit
        this.addEditDialog = {
            show: ko.observable(false),
            actionType: ko.observable(''),
            userType: ko.observable(''),
            selectedItem: ko.observable(),
            responseMethod: (user: UserDTO) => {
                // remove item and add it again how we can refresh table with updated value
                if (this.addEditDialog.actionType() === Action.Edit) {
                    let indexOfEditedItem = Utils.findIndexInArray(this.tableDS(), 'ID', user.ID);
                    this.tableDS()[indexOfEditedItem] = user;
                } else {
                    this.tableDS.push(user);
                }

                this.applyFilters();
            }
        }
    }

    private initializeComputeds() {
        this.connector.currentLoggedInUser.subscribe((newValue) => {
            //if (newValue !== null) {
                this.refreshPage();
            //}
        });

        this.refreshPageTrigger.extend({ notify: 'always' });
        let refreshPageSubscription = this.refreshPageTrigger.subscribe((newValue) => {
            if (Pages.Users === newValue) {
                this.refreshPage();
            }        
        });
        this.customSubscriptions.push(refreshPageSubscription);

        this.searchText.subscribe((newValue) => {
            this.onSearch(newValue);
        });
    }

    private refreshPage() {
        this.getAllUser();
        this.applyFilters();
    }

    private async getAllUser() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyGettingUsersDetails')(),
            async () => {
                try {
                    let response = await UsersService.getAllUsers();
                    if (!isNullOrUndefined(response)) {
                        this.tableDS(response);
                        this.tableViewDS(response.slice());
                    } else {
                        this.tableDS([]);
                        this.tableViewDS([]);
                    }
                } catch (error) {
                    this.connector.handleError(WfUMUsersComponent)(error);
                }
            });
    }

    private onSearch(newValue) {
        this.tableViewDS(Utils.filterArray(this.tableDS(), 'Name', newValue));
    }

    private onSortClick(columnName) {
        this.sortedColumn.name(columnName);
        this.sortedColumn.order(this.sortedColumn.order() === SortOrder.Asc ? SortOrder.Desc: SortOrder.Asc);

        let desc = this.sortedColumn.order() === SortOrder.Desc;
        // always sort both array because of search which always use original array
        this.tableViewDS.sort(Utils.sortArray(columnName, desc));
        this.tableDS.sort(Utils.sortArray(columnName, desc));
    }

    private applyFilters() {
        if (!Utils.isNullUndefOrEmpty(this.sortedColumn.name())) {
            let desc = this.sortedColumn.order() === SortOrder.Desc;
            this.tableDS.sort(Utils.sortArray(this.sortedColumn.name(), desc));
        }
        this.onSearch(this.searchText());
    }
    // DIALOGS
    // delete -------------------------------------------------------------------
    private onDeleteClick(user: UserDTO) {
        this.confirmDialog.selectedItem = user;
        this.confirmDialog.show(true);
    }
    // clone --------------------------------------------------------------------
    private onCloneClick(user: UserDTO) {
        this.cloneNameDialog.selectedItem(user);
        this.cloneNameDialog.tableData(this.tableDS());
        this.cloneNameDialog.show(true);
    }
    // password change ----------------------------------------------------------
    private onChangePasswordClick(user: UserDTO) {
        this.passwordChangeDialog.selectedItem = user;
        this.passwordChangeDialog.show(true);
    }
    // add/edit -----------------------------------------------------
    private onEditClick(user: UserDTO) {
        this.addEditDialog.actionType(Action.Edit);
        this.addEditDialog.userType(user.IsADUser ? UserType.Domain : UserType.Scada)
        this.addEditDialog.selectedItem(user);
        this.addEditDialog.show(true);
    }

    private onAddUser(userType) {
        this.addEditDialog.actionType(Action.Add);
        this.addEditDialog.userType(userType);
        this.addEditDialog.selectedItem(null);
        this.addEditDialog.show(true);
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

export = WfUMUsersComponent;
