import StatesService = require("./states.service");

class VisualStatesService extends StatesService {
    public multipleCss: KnockoutComputed<string>;
    public css: KnockoutComputed<string>;
    public statusText: KnockoutComputed<string>;
    public currentState: KnockoutComputed<string>;
    public statusCssClass: KnockoutComputed<string>;

    private symbolicTexts: string[];
    private cssClassNames: string[];

    private createSymbolicTextStates(settings) {
        this.symbolicTexts = [settings.symbolicTextNormalState];

        if (_.any(settings.states)) {
            _.each(settings.states, (state: IStateModel) => {
                this.symbolicTexts.push(state.symbolicText);
            });
        } else if (!Array.isArray(settings.symbolicTexts)) {
            this.symbolicTexts.push(settings.symbolicTextState1);
            this.symbolicTexts.push(settings.symbolicTextState2);
            this.symbolicTexts.push(settings.symbolicTextState3);
            this.symbolicTexts.push(settings.symbolicTextState4);
            this.symbolicTexts.push(settings.symbolicTextState5);
            this.symbolicTexts.push(settings.symbolicTextState6);
            this.symbolicTexts.push(settings.symbolicTextState7);
            this.symbolicTexts.push(settings.symbolicTextState8);
        } else {
            this.symbolicTexts.push.apply(this.symbolicTexts, settings.symbolicTexts);
        }

        this.replacePlaceholderObjectID(this.symbolicTexts, settings.objectID);
    }

    private createCssStates(settings) {
        this.cssClassNames = [settings.cssClassNormalState || "normal"];

        if (_.any(settings.states)) {
            _.each(settings.states, (state: IStateModel) => {
                this.cssClassNames.push(state.cssClassName);
            });
        } else if (!Array.isArray(settings.cssClassStates)) {
            this.cssClassNames.push(settings.cssClassState1 || "state1");
            this.cssClassNames.push(settings.cssClassState2 || "state2");
            this.cssClassNames.push(settings.cssClassState3 || "state3");
            this.cssClassNames.push(settings.cssClassState4 || "state4");
            this.cssClassNames.push(settings.cssClassState5 || "state5");
            this.cssClassNames.push(settings.cssClassState6 || "state6");
            this.cssClassNames.push(settings.cssClassState7 || "state7");
            this.cssClassNames.push(settings.cssClassState8 || "state8");
        } else {
            this.cssClassNames.push.apply(this.cssClassNames, settings.cssClassStates);
        }
    }

    protected initializeComputeds() {
        super.initializeComputeds();

        this.statusCssClass = ko.pureComputed(() => {

            const stateNumber = ko.unwrap(this.currentStateIndex);

            const cssClass = _.isNaN(stateNumber) ||
                stateNumber >= this.cssClassNames.length ?
                this.cssClassNames[0] :
                this.cssClassNames[stateNumber];

            return cssClass;
        });

        this.statusText = ko.pureComputed(() => {
            const stateNumber = ko.unwrap(this.currentStateIndex);

            const stateText = _.isNaN(stateNumber) ||
                stateNumber >= this.symbolicTexts.length ?
                this.symbolicTexts[0] :
                this.symbolicTexts[stateNumber];

            return stateText;

        });


        this.css = ko.pureComputed(() => {
            return this.currentState() + " " + this.statusCssClass();
        }, this);

        this.multipleCss = ko.pureComputed(() => {
            let currentStates = "";
            const currentStatesIndex = ko.unwrap(this.currentStatesIndex);

            if (currentStatesIndex === null || currentStatesIndex === undefined || currentStatesIndex.length === 0) {
                return `${this.cssClassNames[0]} state${0}`;
            }

            for (let index of currentStatesIndex) {
                let cssClass = this.cssClassNames[index + 1];
                if (cssClass) {
                    currentStates = `${currentStates} state${index + 1} ${cssClass}`;
                }
                else {
                    currentStates = `${currentStates} state${index + 1}`;
                }
            }
            return currentStates;
        }, this);
    }

    constructor(settings: IState) {
        super(settings);

        this.createCssStates(settings);
        this.createSymbolicTextStates(settings);

        this.initializeComputeds();

        this.currentStatesModels.subscribe(items => {
            items.map((x, i) => {
                x.cssClassName = this.cssClassNames[i];
                x.symbolicText = this.symbolicTexts[i];
                return x;
            });
        });

        ko.computed(() => {
            this.currentStateModel().cssClassName = this.getCssClassName();
            this.currentStateModel().symbolicText = this.getSymbolicText();
        });
    }

    protected getCssClassName() {
        return this.cssClassNames[0];
    }

    protected getSymbolicText() {
        return this.symbolicTexts[0];
    }
}

export = VisualStatesService;