import Connector = require("../../../services/connector");
import ComponentBaseModel = require("../../component-base.model");
import { SignalAlarmListFiledNames } from "./models/signal-alarm-list-fields.model";

interface IWfSignalAlarmListConfigurationDialogParams extends IComponentBaseParams {
    buttonBarCssClass: string;
    columnsOrder: KnockoutObservableArray<string>;
    maxSignalCount: KnockoutObservable<number>,
    onSettingsApplied: (columnsOrder: string[], maxSignals: number) => void;
    getColumnName: (name: string) => string;
    isModalDialogsDraggable: boolean;
}

class WfSignalAlarmListConfigurationDialogComponent extends ComponentBaseModel<IWfSignalAlarmListConfigurationDialogParams> {

    public readonly dialog = ko.observable(false);
    public buttonBarCssClass: string;
    public onSettingsApplied: (columnsOrder: string[], maxSignals: number) => void;
    public getColumnName: (name: string) => string;
    public isModalDialogsDraggable: boolean;

    public connector = new Connector();

    public maxSignalCount = ko.observable<number>();
    public columnsOrder = ko.observableArray<string>([]);
    public defaultColumnNames = ko.observableArray<{ name: string, checked: KnockoutObservable<boolean> }>([
        { name: SignalAlarmListFiledNames.AliasName, checked: ko.observable(false) },
        { name: SignalAlarmListFiledNames.Description, checked: ko.observable(false) },
        { name: SignalAlarmListFiledNames.Value, checked: ko.observable(false) },
        { name: SignalAlarmListFiledNames.Unit, checked: ko.observable(false) },
        { name: SignalAlarmListFiledNames.AlarmStatus, checked: ko.observable(false) },
        { name: SignalAlarmListFiledNames.AlarmProcessingAndDisplayStatus, checked: ko.observable(false) }
    ]);

    constructor(params: IWfSignalAlarmListConfigurationDialogParams) {
        super(params);
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.buttonBarCssClass = ko.unwrap(this.settings.buttonBarCssClass) || "btn btn-default";
        this.onSettingsApplied = this.settings.onSettingsApplied || ((columnsOrder: string[], maxSignals: number) => { });
        this.getColumnName = this.settings.getColumnName || ((name: string) => { return name});
        this.isModalDialogsDraggable = this.settings.isModalDialogsDraggable !== undefined ? this.settings.isModalDialogsDraggable : true;
    }

    public onClose() {
        this.dialog(false);
    }

    public onDialog() {
        this.onSettingsApplied(this.columnsOrder(), this.maxSignalCount());
        this.onClose();
    }

    public onOpen() {
        this.dialog(true);
        const columnsOrder = ko.unwrap(this.settings.columnsOrder);
        this.columnsOrder([...columnsOrder] || []);

        for (const iterator of this.defaultColumnNames()) {
            iterator.checked(_.contains(this.columnsOrder(), iterator.name));
        }

        this.maxSignalCount(ko.unwrap(this.settings.maxSignalCount) || 100);
    }

    public onChecked(data: { name: string, checked: KnockoutObservable<boolean> }, event) {
        if (event.target.checked) {
            this.columnsOrder.push(data.name);
        } else {
            this.columnsOrder.remove(data.name);
        }
        return true;
    }

    public dragItem = null;

    public dragenter(item: string, event) {
        event.originalEvent.dataTransfer.dropEffect = "move";
    }

    public dragstart(item: string, event) {
        this.dragItem = item;
        $(event.target).addClass("active");

        event.originalEvent.dataTransfer.effectAllowed = "move";

        var img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        event.originalEvent.dataTransfer.setDragImage(img, 0, 0);
        return true;
    }

    public dragend(item: string, event) {
        this.dragItem = null;
        $(event.target).removeClass("active");
        return true;
    }

    public dragover(item: string, event) {
        event.preventDefault();
        event.originalEvent.dataTransfer.dropEffect = "move";
        if (item === null) {
            return;
        }

        if (this.dragItem) {
            var currentIndex = this.columnsOrder().indexOf(item);
            var currentIndexDragItem = this.columnsOrder().indexOf(this.dragItem);

            currentIndex = currentIndex > currentIndexDragItem ? currentIndex + 1 : currentIndex - 1;

            const newOrder = this.columnsOrder().map((x, i) => {
                if (this.dragItem == x)
                    return { index: currentIndex, value: x }
                return { index: i, value: x }
            });
            this.columnsOrder(newOrder.sort((a, b) => { return a.index - b.index }).map(x => x.value));
        }
    }

    public drop(item: string, event) {
        event.preventDefault();
        if (this.dragItem) {
            var currentIndex = this.columnsOrder().indexOf(item);
            var currentIndexDragItem = this.columnsOrder().indexOf(this.dragItem);

            currentIndex = currentIndex > currentIndexDragItem ? currentIndex + 1 : currentIndex - 1;

            const newOrder = this.columnsOrder().map((x, i) => {
                if (this.dragItem == x)
                    return { index: currentIndex, value: x }
                return { index: i, value: x }
            });
            this.columnsOrder(newOrder.sort((a, b) => { return a.index - b.index }).map(x => x.value));
        }
    }

    protected async dispose() {
        var dialog = $(document).find('#modal-dialog-' + ko.unwrap(this.id));
        dialog.remove();
    }
}

export = WfSignalAlarmListConfigurationDialogComponent;