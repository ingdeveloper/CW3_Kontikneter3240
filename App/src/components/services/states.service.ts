import Connector = require("../../services/connector");
import Logger = require("../../services/logger");
import Signal = require("../../services/models/signal");

class StatesService {
    public static ConditionRuleCache: { [index: string]: boolean | any } = {};

    public currentStatesIndex: KnockoutObservableArray<number>;
    public currentStateIndex: KnockoutComputed<number>;
    public currentState: KnockoutComputed<string>;
    public currentStates: KnockoutComputed<string>;
    public currentStateModel: KnockoutComputed<IStateModel>;
    public currentStatesModels: KnockoutObservableArray<IStateModel> = ko.observableArray([]);

    protected conditionRuleSignals: Signal[][] = [];
    protected conditionRules: string[] = [];
    protected stateSignals: any[] = [];
    protected maskSignals: string[] = [];
    protected operators: string[] = [];
    private connector = new Connector();
    private useBuffer: boolean = false;

    private dummyObservable: KnockoutObservable<any>;

    private buildStates() {

        var states: any[] = [];

        for (let i = 0; (i < this.conditionRules.length) || (i < this.stateSignals.length); i++) {
            states.push([this.stateSignals[i], this.maskSignals[i], this.operators[i], this.conditionRules[i], this.conditionRuleSignals[i]]);
        }

        return states;
    }

    private createStates(settings: IState) {

        if (_.any(settings.states)) {
            settings.stateSignalNames = [];
            settings.conditionRules = [];
            settings.maskSignals = [];
            settings.operators = [];

            _.each(settings.states, (state) => {
                (settings.stateSignalNames as any[]).push(ko.unwrap(state.signalName));
                settings.conditionRules.push(state.conditionRule);
                settings.maskSignals.push(state.maskSignal);
                settings.operators.push(state.operator);
            });
        }

        if (!Array.isArray(settings.stateSignalNames)) {
            settings.stateSignalNames = [];

            if (settings.stateSignalName1 !== undefined)
                settings.stateSignalNames[0] = settings.stateSignalName1;
            if (settings.stateSignalName2 !== undefined)
                settings.stateSignalNames[1] = settings.stateSignalName2;
            if (settings.stateSignalName3 !== undefined)
                settings.stateSignalNames[2] = settings.stateSignalName3;
            if (settings.stateSignalName4 !== undefined)
                settings.stateSignalNames[3] = settings.stateSignalName4;
            if (settings.stateSignalName5 !== undefined)
                settings.stateSignalNames[4] = settings.stateSignalName5;
            if (settings.stateSignalName6 !== undefined)
                settings.stateSignalNames[5] = settings.stateSignalName6;
            if (settings.stateSignalName7 !== undefined)
                settings.stateSignalNames[6] = settings.stateSignalName7;
            if (settings.stateSignalName8 !== undefined)
                settings.stateSignalNames[7] = settings.stateSignalName8;

            let i = 8;
            while (settings.hasOwnProperty(`stateSignalName${i}`)) {
                settings.stateSignalNames[i - 1] = settings[`stateSignalName${i}`] || null;
                i++;
            }

        }

        this.replacePlaceholderObjectID(settings.stateSignalNames, settings.objectID);

        if (!Array.isArray(settings.conditionRules)) {
            settings.conditionRules = [];

            if (settings.conditionRule1 !== undefined)
                settings.conditionRules[0] = settings.conditionRule1;
            if (settings.conditionRule2 !== undefined)
                settings.conditionRules[1] = settings.conditionRule2;
            if (settings.conditionRule3 !== undefined)
                settings.conditionRules[2] = settings.conditionRule3;
            if (settings.conditionRule4 !== undefined)
                settings.conditionRules[3] = settings.conditionRule4;
            if (settings.conditionRule5 !== undefined)
                settings.conditionRules[4] = settings.conditionRule5;
            if (settings.conditionRule6 !== undefined)
                settings.conditionRules[5] = settings.conditionRule6;
            if (settings.conditionRule7 !== undefined)
                settings.conditionRules[6] = settings.conditionRule7;
            if (settings.conditionRule8 !== undefined)
                settings.conditionRules[7] = settings.conditionRule8;

            let i = 8;
            while (settings.hasOwnProperty(`conditionRule${i}`)) {
                settings.conditionRules[i - 1] = settings[`conditionRule${i}`] || null;
                i++;
            }
        }



        this.replacePlaceholderObjectID(settings.conditionRules, settings.objectID);

        if (!Array.isArray(settings.maskSignals)) {
            settings.maskSignals = [];

            if (settings.maskSignal1 !== undefined)
                settings.maskSignals[0] = settings.maskSignal1;
            if (settings.maskSignal2 !== undefined)
                settings.maskSignals[1] = settings.maskSignal2;
            if (settings.maskSignal3 !== undefined)
                settings.maskSignals[2] = settings.maskSignal3;
            if (settings.maskSignal4 !== undefined)
                settings.maskSignals[3] = settings.maskSignal4;
            if (settings.maskSignal5 !== undefined)
                settings.maskSignals[4] = settings.maskSignal5;
            if (settings.maskSignal6 !== undefined)
                settings.maskSignals[5] = settings.maskSignal6;
            if (settings.maskSignal7 !== undefined)
                settings.maskSignals[6] = settings.maskSignal7;
            if (settings.maskSignal8 !== undefined)
                settings.maskSignals[7] = settings.maskSignal8;

            let i = 8;
            while (settings.hasOwnProperty(`maskSignal${i}`)) {
                settings.maskSignals[i - 1] = settings[`maskSignal${i}`] || null;
                i++;
            }
        }
        if (!Array.isArray(settings.operators)) {
            settings.operators = [];

            if (settings.operator1 !== undefined)
                settings.operators[0] = settings.operator1;
            if (settings.operator2 !== undefined)
                settings.operators[1] = settings.operator2;
            if (settings.operator3 !== undefined)
                settings.operators[2] = settings.operator3;
            if (settings.operator4 !== undefined)
                settings.operators[3] = settings.operator4;
            if (settings.operator5 !== undefined)
                settings.operators[4] = settings.operator5;
            if (settings.operator6 !== undefined)
                settings.operators[5] = settings.operator6;
            if (settings.operator7 !== undefined)
                settings.operators[6] = settings.operator7;
            if (settings.operator8 !== undefined)
                settings.operators[7] = settings.operator8;

            let i = 8;
            while (settings.hasOwnProperty(`operator${i}`)) {
                settings.operators[i - 1] = settings[`operator${i}`] || null;
                i++;
            }
        }

    }

    public addStates(newStates: IStateModel) {
        var states: IState = { writeToBuffer: false };

        states.states = [newStates];
        this.createStates(states);
        this.fillFromStates(states);

        this.dummyObservable.notifySubscribers();
    }

    protected initializeComputeds() {

        this.currentStates = ko.computed(() => {
            this.currentStatesModels([]);

            const currentStatesIndex = [];
            var currentStates = '';
            var states = this.buildStates();
            this.dummyObservable();

            for (var i = 0; i < states.length; i++) {
                var isStateValid: boolean;

                //checks if conditionRule is set
                if (states[i][3]) {
                    //process conditionRule
                    isStateValid = this.resolveConditionRule(states[i][3], states[i][4]);
                }
                else {
                    //process maskSignal with operator
                    isStateValid = this.applyOperator(states[i][0], states[i][1], states[i][2]);
                }
                if (isStateValid) {
                    //build state
                    currentStates = `${currentStates} state${i + 1}`;
                    currentStatesIndex.push(i);
                }

                this.currentStatesModels.push({
                    signalName: states[i][0],
                    maskSignal: states[i][1],
                    operator: states[i][2],
                    conditionRule: states[i][3],
                    cssClassName: undefined,
                    isValid: ko.observable(isStateValid === null || isStateValid === undefined ? false : isStateValid),
                    symbolicText: undefined
                })
            }

            this.currentStatesIndex(currentStatesIndex);

            if (currentStates !== '') {
                return currentStates;
            }
            else {
                return "normal";
            }
        });

        this.currentState = ko.pureComputed(() => {
            let currentStates = this.currentStates().trim();
            let spaceIndex = currentStates.indexOf(" ");

            return currentStates.substring(0, spaceIndex === -1 ? currentStates.length : spaceIndex);
        });

        this.currentStateModel = ko.computed(() => {
            this.currentState();

            const result = {
                signalName: this.stateSignals[0],
                maskSignal: this.maskSignals[0],
                conditionRule: this.conditionRules[0],
                operator: this.operators[0],
                cssClassName: undefined,
                isValid: ko.observable(false),
                symbolicText: undefined
            } as IStateModel

            return result;
        });

        this.currentStateIndex = ko.pureComputed(() => {
            return Number(this.currentState().substring(5));
        });
    }

    constructor(settings: IState) {
        this.dummyObservable = ko.observable();
        this.currentStatesIndex = ko.observableArray([]);
        this.useBuffer = settings.writeToBuffer != undefined ? settings.writeToBuffer : false;
        this.setJsepBinaryOperators();
        this.createStates(settings);
        this.fillFromStates(settings);
        this.initializeComputeds();

        this.connector.getOnlineUpdates(); //.fail(Logger.handleError(this));
    }

    private fillFromStates(settings: IState) {

        //check if sateSignalNames are set and register signals
        for (let signal of settings.stateSignalNames) {

            if (ko.unwrap(signal))
                this.stateSignals.push(this.connector.getSignal(ko.unwrap(signal)));
            else
                this.stateSignals.push(null);
        }

        for (let signal of settings.maskSignals) {
            this.maskSignals.push(signal);
        }

        for (let operator of settings.operators) {
            this.operators.push(operator);
        }

        //Register the signals in conditionRules with initializeSignals
        //ex: conditionRule1: '%Setpoint 1% > %Setpoint 2%'
        var currentConditionRuleSignalsSize = this.conditionRuleSignals.length;

        for (let i = 0; i < settings.conditionRules.length; i++) {
            if (!Array.isArray(this.conditionRuleSignals[i + currentConditionRuleSignalsSize]))
                this.conditionRuleSignals[i + currentConditionRuleSignalsSize] = [];
            let conditionRule = this.initializeSignals(settings.conditionRules[i], this.conditionRuleSignals[i + currentConditionRuleSignalsSize])
                ? settings.conditionRules[i]
                : null;
            this.conditionRules.push(conditionRule);
        }

        this.connector.getOnlineUpdates();//.fail(Logger.handleError(this));
    }

    // for maskSignal with operator 
    private applyOperator(signal: Signal | any, mask: KnockoutObservable<any> | any, operator: string): boolean {
        var value: any = "n.Def";

        var readFromBuffer = signal != null && this.useBuffer && this.connector.existSignalInBuffer(signal.signalName());

        if (signal != null && !readFromBuffer)
            value = ko.unwrap<any>(signal.value());
        if (signal != null && readFromBuffer) {
            var tmp = this.connector.readSignalsFromBuffer([signal.signalName()]);
            if (tmp.length > 0)
                value = tmp[0];
        }

        mask = ko.unwrap<any>(mask);
        operator = ko.unwrap(operator);

        switch (operator) {
            case ">":
                return value > mask;
            case ">=":
                return value >= mask;
            case "<":
                return value < mask;
            case "<=":
                return value <= mask;
            //check if Signal and  mask is not equals
            //ex.: stateSignalValue1: 3, maskSignal1: 5 =>  3!=5 => true
            //ex.: stateSignalValue1: 5, maskSignal1: 5 =>  5!=5 => false
            case "!=":
                return value !== mask;
            //AND bit link the signal with the mask, the condition is TRUE if the linking equals the mask
            //ex.: stateSignalValue1: 6, maskSignal1: 2 =>  6&2=2 => 2==2 => true
            //ex.: stateSignalValue1: 5, maskSignal1: 2 =>  5&2=0 => 0==2 => false
            case "&":
                return (value & mask) === mask;
            //OR bit link the signal with the mask, the condition is TRUE if the linking equals the mask
            //ex.: stateSignalValue1: 1, maskSignal1: 3 =>  1|3=3 => 3==3 => true
            //ex.: stateSignalValue1: 2, maskSignal1: 3 =>  2|3=3 => 3==3 => true
            //ex.: stateSignalValue1: 4, maskSignal1: 3 =>  4|3=7 => 7==3 => false
            case "|":
                return (value | mask) === mask;
            default:
                return value === mask;
        }
    }

    // register signals and validate condition;
    private initializeSignals(conditionRule: string, conditionRuleSignals: Signal[]): string {
        if (!conditionRule) {
            return null;
        }
        if ((conditionRule.split("%").length - 1) % 2 === 0) {
            if (!conditionRule.split("%")[1]) { // this template %%...
                Logger.warn(this, "Placeholder doesn't contain signalName");
                return null;
            }
            var signalList = this.filterSignals(conditionRule);
            signalList.forEach((signalName) => {
                var signal = this.connector.getSignal(signalName);
                conditionRuleSignals.push(signal);
            });

            return conditionRule;
        }

        Logger.error(this, "Placeholder is not correctly defined, please wrap a signal name like that:  %SignalName%");
        return null;
    }

    //replace placholder with values
    private replacePlaceholder(conditionRule: string, conditionRuleSignals: Signal[]): string {
        if (!conditionRule) return null;

        conditionRuleSignals.forEach((signal) => {
            const value = signal.value();
            let replacementValue = value;
            if (typeof value === "string" && value !== "n/a")
                replacementValue = `'${value}'`.toLowerCase();
            conditionRule = conditionRule.toLowerCase().replace(`%${signal.signalName().toLowerCase()}%`, replacementValue);
        });
        return conditionRule;
    }

    private allSignalsAreAvailable(conditionRuleSignals: Signal[]): boolean {
        if (conditionRuleSignals === undefined || conditionRuleSignals === null)
            conditionRuleSignals = [];

        for (var i = 0; i < conditionRuleSignals.length; i++) {
            const value = conditionRuleSignals[i].value();
            if (typeof value === "string" && value !== "n/a")
                return true;
            if (value == "n/a") {
                console.warn("Signal are not available (n/a)", conditionRuleSignals[i]);
                return false;
            }
            if (isNaN(value) || value === undefined) {
                console.warn("Invalid signal in state (is NaN or undefined)", conditionRuleSignals[i]);
                return false;
            }
        }

        return true;
    }

    //try to resolve the conditionRule over traverse function
    private resolveConditionRule(conditionRule: string, conditionRuleSignals: Signal[]): any {
        if (!Array.isArray(conditionRuleSignals))
            conditionRuleSignals = [];

        if (!this.allSignalsAreAvailable(conditionRuleSignals)) {
            return null;
        }

        if (conditionRule !== null) {
            try {
                const rawCondition = this.replacePlaceholder(this.resolveConditionForSignalReplacement(conditionRule), conditionRuleSignals);

                if (StatesService.ConditionRuleCache.hasOwnProperty(rawCondition) || StatesService.ConditionRuleCache[conditionRule] === null) {
                    return StatesService.ConditionRuleCache[rawCondition];
                }

                // console.log("Run condition: '" + rawCondition + "'");

                const result = this.traverse(jsep(rawCondition), 0);

                StatesService.ConditionRuleCache[rawCondition] = result;

                return result;
            } catch (ex) {
                console.error(`Parser error: conditionRule: '${conditionRule}', with signals '${conditionRuleSignals.map(signal => signal.signalName()).toString()}', ${ex}`, this);

                StatesService.ConditionRuleCache[conditionRule] = null;

                return null;
            }
        }
        else {
            return null;
        }
    }

    private resolveConditionForSignalReplacement(condition: string): string {
        if (window.usei4Connector) {
            return condition;
        }

        const regex = /%[^%]+::/;

        const resolvedCondition = condition.replace(regex, "%");

        return resolvedCondition;
    }

    //helper methode to get SignalNames from a String, the signalName is souroundet by %
    private filterSignals(condition: string): string[] {
        var regex = /%[^%]+%/g;
        var match: RegExpExecArray;
        var signalList: string[] = [];
        while ((match = regex.exec(condition)) !== null) {
            signalList.push(match[0].substring(1, match[0].length - 1));
        }
        return signalList;
    }

    //rekursive function to reslove the parse-tree
    //para: geparste conditionRule von jsep
    private traverse(para: JsepNode, i: number): any {
        i++;

        //check if is singel boolen term or Value
        if (para.value != null) {//abort criterion
            return para.value;
        }

        //chek if term is an prefix like NOT(!), Minus(-)
        if (para.prefix != null) {
            if (para.operator === "!") {
                return !this.traverse(para.argument, i);
            }
            if (para.operator === "-") {
                return -this.traverse(para.argument, i);
            }
            if (para.operator === "~") {
                return ~this.traverse(para.argument, i);
            }
        }

        //do the magic rekursively and validate the operator
        if (para.operator != null) {//abort criterion
            switch (para.operator) {
                case ">=":
                    return this.traverse(para.left, i) >= this.traverse(para.right, i);
                case "<=":
                    return this.traverse(para.left, i) <= this.traverse(para.right, i);
                case ">":
                    return this.traverse(para.left, i) > this.traverse(para.right, i);
                case "<":
                    return this.traverse(para.left, i) < this.traverse(para.right, i);
                case "!=":
                    return this.traverse(para.left, i) !== this.traverse(para.right, i);
                case "==":
                    return this.traverse(para.left, i) === this.traverse(para.right, i);
                case "&&":
                    return this.traverse(para.left, i) && this.traverse(para.right, i);
                case "||":
                    return this.traverse(para.left, i) || this.traverse(para.right, i);
                case "&":
                    return this.traverse(para.left, i) & this.traverse(para.right, i);
                case "|":
                    return this.traverse(para.left, i) | this.traverse(para.right, i);
                case "^":
                    return this.traverse(para.left, i) ^ this.traverse(para.right, i);
                case "<<":
                    return this.traverse(para.left, i) << this.traverse(para.right, i);
                case ">>":
                    return this.traverse(para.left, i) >> this.traverse(para.right, i);
                case "endswith":
                    return this.getAsStringObject(this.traverse(para.left, i)).endsWith(this.getAsStringObject(this.traverse(para.right, i)));
                case "startswith":
                    return this.getAsStringObject(this.traverse(para.left, i)).startsWith(this.getAsStringObject(this.traverse(para.right, i)));
                case "contains":
                    return this.getAsStringObject(this.traverse(para.left, i)).indexOf(this.getAsStringObject(this.traverse(para.right, i))) > -1;
            }
        }

        return null;
    }

    private getAsStringObject(param: any): string {
        return param ? param.toString() : "";
    }

    public unregisterSignals() {

        var signalsToUnregister: Signal[] = [];
        for (let signals of this.conditionRuleSignals) {
            signalsToUnregister.push.apply(signalsToUnregister, signals);
        }
        //unregister stateSignals
        for (let stateSignal of this.stateSignals) {
            if (stateSignal != undefined)
                signalsToUnregister.push(stateSignal);
        }
        return this.connector.unregisterSignals.apply(this.connector, signalsToUnregister);
    }

    protected replacePlaceholderObjectID(arrayOfString: any[], objectID: string): any {
        if (!arrayOfString) return null;

        for (var i = 0; i < arrayOfString.length; i++)
            arrayOfString[i] = (ko.unwrap(arrayOfString[i]) || '').stringPlaceholderResolver(objectID);
    }

    private setJsepBinaryOperators(): void {
        (jsep as any).addBinaryOp("endswith", 10);
        (jsep as any).addBinaryOp("startswith", 10);
        (jsep as any).addBinaryOp("contains", 10);
    }
}

export = StatesService;