class CheckBoxObs {
    Selected: KnockoutObservable<boolean>;
    Name: string;
    ID: string;

    constructor(item, textProperty?) {
        this.Selected = ko.observable(false);
        this.Name = textProperty ? item[textProperty] : item.Name;
        this.ID = item.ID;
    }

}

export = CheckBoxObs;