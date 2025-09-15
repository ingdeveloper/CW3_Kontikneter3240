import WfSvgPathComponent = require("./wf-svg-path.component");

// Component properties
interface IWfSvgRectangleParams extends IWfSvgPathParams {
    // style: KnockoutComputed<any>;
}

class WfSvgRectangleComponent extends WfSvgPathComponent {

    constructor(params: IWfSvgRectangleParams) {
        super(params);
        
        this.pathData = ko.unwrap(this.settings.pathData) || "M25 0A25 25 0 0 1 0 25v15A40 40 0 0 0 40 0H25z";
        this.height = ko.unwrap(this.settings.height) !== undefined ? ko.unwrap(this.settings.height) : 50;
        this.width = ko.unwrap(this.settings.width) !== undefined ? ko.unwrap(this.settings.width) : 100
        const defaultStates = [
            // { conditionRule: '%Local Second% <= 30', cssClassName: 'running' },
            // { conditionRule: '%Local Second% > 30', cssClassName: 'warning' }
        ];

        this.settings.states = _.union(this.settings.states, defaultStates);
    }
}

export = WfSvgRectangleComponent;