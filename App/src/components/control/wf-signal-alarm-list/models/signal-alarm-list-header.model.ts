export class SignalAlarmListHeader {
    public sortOrder = ko.observable<SortOrder>(null);
    public sortOrderIcon = ko.pureComputed(() => {
        if (this.sortOrder() === SortOrder.ASC)
            return "wf wf-shape-triangle";
        if (this.sortOrder() === SortOrder.DESC)
            return "wf wf-shape-triangle wf-w";
        return "";
    });

    public isSortable = this.orderItems.length > 0;
    public cssName: string;

    constructor(
        public readonly orderItems: string[] = [],
        public readonly propertyName: string,
        public readonly displayName: string,
        public readonly requestOrder: (order: SortOrder, item: SignalAlarmListHeader) => void = () => { },
        defaultSortOrder: SortOrder = null
    ) {
        if (defaultSortOrder !== null) {
            this.sortOrder(defaultSortOrder);
        }

        this.cssName = `wf-header-${propertyName}`;
    }

    public onOrder() {
        let newSortOrder = SortOrder.DESC

        if (this.sortOrder() === SortOrder.ASC) {
            newSortOrder = SortOrder.DESC;
        }
        if (this.sortOrder() === SortOrder.DESC) {
            newSortOrder = SortOrder.ASC;
        }
        this.sortOrder(newSortOrder);
        this.requestOrder(newSortOrder, this);
    }

    public getOrderFragment(): { Key: string, Value: SortOrder }[] {
        return this.orderItems.map(x => { return { Key: x, Value: this.sortOrder() } }).filter(x => x.Value !== null);
    }
}