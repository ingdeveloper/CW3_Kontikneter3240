import ViewModelBase = require("../viewModelBase");

class DynamicPropertiesTutorial extends ViewModelBase {
    public paramObject: KnockoutComputed<{ name: string; params: any; }>;
    public component: KnockoutObservable<{ name: string; params: KnockoutObservable<string>; }>;
    public components: { name: string; params: KnockoutObservable<string>; }[];

    constructor() {
        super();
        this.components = [{
            name: "wf-input",
            params: ko.observable("signalName:'Setpoint 1', signalNameLabel:true")
        },
        {
            name: "wf-value",
            params: ko.observable("signalName:'Setpoint 2', signalNameLabel:true")
        },
        {
            name: "wf-arc",
            params: ko.observable("signalName:'Setpoint 3'")
        },
        {
            name: "wf-chart-1",
            params: ko.observable("lines :[{ signalName: 'Level 1', logTagName: 'LogTagLevel1', color: '#337AB7'},{ signalName: 'Level 2', logTagName: 'LogTagLevel2', color: '#f0ad4e', axis: 'y2'}],autoUpdate: false,'y1AxisColor': '#337AB7', y2AxisColor: '#f0ad4e'")
        },
        {
            name: "wf-signal-list",
            params: ko.observable("signals: [ { signalName: 'Level 1', signalLabel: 'Temperature', staticUnitText: '°C' }, { signalName: 'Level 3', signalLabel: 'Signal Label' }]")
        }
        ];

        this.component = ko.observable({
            name: "wf-input",
            params: ko.observable("signalName:'Setpoint 1', signalNameLabel:true")
        });

        this.paramObject = ko.pureComputed({
            read: () => {
                try {
                    return {
                        name: this.component().name,
                        params: eval(`({${this.component().params()}})`)
                    }

                } catch (error) {

                }
            }
        });

    }
}

export = DynamicPropertiesTutorial;