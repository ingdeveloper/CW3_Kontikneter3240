import ViewModelBase = require("../viewModelBase");

class ExamplesNavigation extends ViewModelBase {

    public items = [{
        url: '#test',
        icon: 'wf wf-parent-unit',
        text: 'VW_Werksübersicht',
        active: false,
    }, {
        url: '#test',
        icon: 'wf wf-parent-unit',
        text: 'Halle 12',
        active: false
    }, {
        url: '#test',
        icon: 'wf wf-parent-unit',
        text: 'Halle 12 Ebenen',
        active: true,
        childItems: [
            {
                url: '#test',
                icon: 'wf wf-room3',
                text: 'Ebene 1',
                active: false
            }, {
                url: '#test',
                icon: 'wf wf-room3',
                text: 'Ebene 2',
                active: false
            }, {
                url: '#test',
                icon: 'wf wf-room3',
                text: 'Ebene 3',
                active: false
            }]
    }, {
        url: '#test',
        icon: 'wf wf-room3',
        text: 'Bereich 34',
        active: false
    }];
}

export = ExamplesNavigation;