import ComponentBaseModel = require("../../../component-base.model");
import { Utils } from "./utils";

interface IWfClonedNameDialogParams extends IComponentBaseParams {
    selectedItem: KnockoutObservable<any>;
    tableData: KnockoutObservableArray<any>;
    showModalFromOutside: KnockoutObservable<boolean>;
    confirmCallBackMethod: Function;
}

class WfClonedNameDialogComponent extends ComponentBaseModel<IWfClonedNameDialogParams> {   

    private showModal: KnockoutObservable<boolean>;
    private clonedName: KnockoutObservable<string>;
    private clonedNameIsUnique: KnockoutObservable<boolean>;
    // input settings
    private selectedItem: KnockoutObservable<any>;
    private tableData: KnockoutObservableArray<any>;
    private showModalFromOutside: KnockoutObservable<boolean>;
    private confirmCallBackMethod: Function;

    constructor(params: IWfClonedNameDialogParams) {
        super(params);  
    }


    protected initializeSettings() {
        super.initializeSettings();
        this.showModal = ko.observable(false);
        this.clonedName = ko.observable();
        this.clonedNameIsUnique = ko.observable(false);
        // input settings
        this.selectedItem = this.settings.selectedItem;
        this.tableData = this.settings.tableData;
        this.showModalFromOutside = this.settings.showModalFromOutside;
        this.confirmCallBackMethod = this.settings.confirmCallBackMethod;
       
        this.initializeComputeds();
    }


    private initializeComputeds() {
        this.showModalFromOutside.extend({ notify: 'always' });
        this.showModalFromOutside.subscribe((newValue) => {
            if (newValue) {
                this.showModal(true);
                this.createCloneName();
            } else {
                this.showModal(false);
            }
        });

        this.clonedName.extend({ notify: 'always' });
        this.clonedName.subscribe((newValue) => {
            if (newValue && Utils.findObjInArray(this.tableData(), 'Name', newValue.trim()) === null) {
                this.clonedNameIsUnique(true);
            } else {
                this.clonedNameIsUnique(false);
            }
        });
    }

    private createCloneName() {
         if (this.selectedItem().Name.length <= 26) { 
           this.clonedName(this.selectedItem().Name + '_clone');
        } else {
            this.clonedName(this.selectedItem().Name);
        }
    }

    private close() {
        this.showModalFromOutside(false);
    }

    private confirm() {
        this.confirmCallBackMethod(this.clonedName());
        this.close();
    }

    protected async dispose() {
        await super.dispose();
    }
}

export = WfClonedNameDialogComponent;
