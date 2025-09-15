import ComponentBaseModel = require("../../../component-base.model");
import SessionService = require("../../../../services/sessionService");
import Api = require("../../../../services/api");
import BusyIndicator = require("../../../../decorators/busyIndicator");
import Logger = require("../../../../services/logger");
import { WfUMSortedColumn } from "../shared/wf-um-interfaces";
import { Pages, Action, SortOrder } from "../shared/wf-um-enyms";
import { Utils } from "../shared/utils";

declare var uuid;

interface IWfUMAccessGroupsParams extends IComponentBaseParams {
    refreshPageTrigger: KnockoutObservable<string>;
    height: number;
}

class WfUMAccessGroupsComponent extends ComponentBaseModel<IWfUMAccessGroupsParams> {
    private busyContext: BusyIndicator;
    private SortOrder = SortOrder;
    private customSubscriptions;

    private tableDS: KnockoutObservableArray<AccessGroupDTO>;
    private tableViewDS: KnockoutObservableArray<AccessGroupDTO>;
    private searchText: KnockoutObservable<string>;
    private sortedColumn: WfUMSortedColumn;

    private height: KnockoutObservable<number>;
    private panelBodyHeight: KnockoutComputed<number>;

    private refreshPageTrigger: KnockoutObservable<string>;
    // dialogs
    private confirmDialog: any;
    private cloneNameDialog: any;
    private addEditDialog: any;

    constructor(params: IWfUMAccessGroupsParams) {
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


    private initializeComputeds() {
        this.connector.currentLoggedInUser.subscribe((value) => {
            this.refreshPage()
        });

        this.refreshPageTrigger.extend({ notify: 'always' });
        let refreshPageSubscription = this.refreshPageTrigger.subscribe((newValue) => {
            if (Pages.AccessGroups === newValue) {
                this.refreshPage();
            }        
        });
        this.customSubscriptions.push(refreshPageSubscription);

        this.searchText.subscribe((newValue) => {
            this.onSearch(newValue);
        });
    }

    private initializeDialogsVariables() {
        // confirm
        this.confirmDialog = {
            selectedItem: null,
            show: ko.observable(false),
            responseMethod: async () => {
                this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyDeletingAccessGroup')(), async () => {
                    try {
                        const newToken = await Api.securityService.deleteAccessGroup(SessionService.getSecurityToken(), this.confirmDialog.selectedItem.ID, 1000);
                        if (newToken) {
                            Logger.successToast(this.connector.translate('I4SCADA_UM_AccessGroupSuccessfullyDeleted')().replace(new RegExp("##name##", "ig"), this.confirmDialog.selectedItem.Name));
                        }

                        let itemToRemove = Utils.findObjInArray(this.tableDS(), 'ID', this.confirmDialog.selectedItem.ID);

                        this.tableDS.remove(itemToRemove);
                        this.tableViewDS.remove(itemToRemove);

                    } catch (error) {
                        this.connector.handleError(WfUMAccessGroupsComponent)(error);
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
                this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyCloningAccessGroup')(), async () => {
                    try {
                        let accessGroupClone = JSON.parse(JSON.stringify(this.cloneNameDialog.selectedItem()));
                        accessGroupClone.Name = cloneName;
                        accessGroupClone.ID = uuid.v4();
        
                        const isInserted = await Api.securityService.insertAccessGroup(SessionService.getSecurityToken(), accessGroupClone, 1000);
                        if (isInserted) {
                            Logger.successToast(this.connector.translate('I4SCADA_UM_AccessGroupSuccessfullyCloned')().replace(new RegExp("##name##", "ig"), this.cloneNameDialog.selectedItem().Name));
                            this.tableDS.push(accessGroupClone);
                            this.applyFilters();
                        }
                    } catch (error) {
                        this.connector.handleError(WfUMAccessGroupsComponent)(error);
                    }
                })
            }
        }
        // add/edit
        this.addEditDialog = {
            show: ko.observable(false),
            actionType: ko.observable(''),
            selectedItem: ko.observable(),
            responseMethod: (accessGroup: AccessGroupDTO) => {
                // remove item and add it again how we can refresh table with updated value
                if (this.addEditDialog.actionType() === Action.Edit) {
                    let indexOfEditedItem = Utils.findIndexInArray(this.tableDS(), 'ID', accessGroup.ID);
                    this.tableDS()[indexOfEditedItem] = accessGroup;
                } else {
                    this.tableDS.push(accessGroup);
                }
                
                this.applyFilters();
            }
        }
    }

    private refreshPage() {
        this.getAllAccessGroups();
        this.applyFilters();
    }

    private getAllAccessGroups() {
        this.busyContext.runLongAction(this.connector.translate('I4SCADA_UM_BusyLoadingAccessGroup')(), async () => {
            try {   
                const response = await Api.securityService.getAllAccessGroup(SessionService.getSecurityToken(), 1000);
                if (response) {
                    this.tableDS(response);
                    this.tableViewDS(response.slice());
                } else {
                    this.tableDS([]);
                    this.tableViewDS([]);
                }  
            } catch (error) {
                this.connector.handleError(WfUMAccessGroupsComponent)(error);
            }
        })
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
    private onDeleteClick(accessGroup: AccessGroupDTO) {
        this.confirmDialog.selectedItem = accessGroup;
        this.confirmDialog.show(true);
    }
    // clone --------------------------------------------------------------------
    private onCloneClick(accessGroup: AccessGroupDTO) {
        this.cloneNameDialog.selectedItem(accessGroup);
        this.cloneNameDialog.tableData(this.tableDS());
        this.cloneNameDialog.show(true);
    }
    // add/edit -----------------------------------------------------
    private onEditClick(accessGroup: AccessGroupDTO) {
        this.addEditDialog.actionType(Action.Edit);
        this.addEditDialog.selectedItem(accessGroup);
        this.addEditDialog.show(true);
    }

    private onAddClick() {
        this.addEditDialog.actionType(Action.Add);
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

export = WfUMAccessGroupsComponent;
