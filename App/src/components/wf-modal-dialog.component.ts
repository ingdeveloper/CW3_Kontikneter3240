import ModalDialogBaseModel = require("./modal-dialog.base.model");

class WfModalDialogComponent extends ModalDialogBaseModel<IWfModalDialogComponentParams> {
    public disableOverlayColor: string;  

    constructor(params: IWfModalDialogComponentParams) {
        super(params);
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.disableOverlayColor = ko.unwrap(this.settings.disableOverlayColor) || "rgba(255,255,255,.5)";
    }

    protected async dispose() {
        await super.dispose();
    }
}



export = WfModalDialogComponent;