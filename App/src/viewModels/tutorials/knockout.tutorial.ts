import ViewModelBase = require("../viewModelBase");

class KnockoutToutorial extends ViewModelBase {

    private myProperty: number = 123;
    //format can be string, boolean, number
    private myObservableProperty: KnockoutObservable<number> = ko.observable(123);
    private displayDetailedView: KnockoutObservable<boolean> = ko.observable(true);

    private myComputedProperty: KnockoutComputed<string> = ko.computed(() => {
        const convertedValue = this.myObservableProperty() / 1000;
        return convertedValue + ' k';
    });

    constructor() {
        super();
    }

    private buttonClick(): void {
        this.myObservableProperty(0);
    }

    private setValue(newValue): void {
        if (_.isNumber(newValue)) {
            this.myObservableProperty(newValue);
        }
    }
}

export = KnockoutToutorial;