import Connector = require("src/services/connector");
import Signal = require("src/services/models/signal");
import ValueConversionsService = require("src/components/services/value-conversions.service");
import ComponentBaseModel = require("src/components/component-base.model");
import SignalArrayService = require("src/components/services/signal-array.service");
import VisualStatesService = require("src/components/services/visual-states.service");


class classRange {
    position: number;
    color: string;
}

interface IWfWfBargraphParams extends IComponentBaseParams, ISignalArrayParams, IState, IChangedFieldAnimationParams {
    width: number;
    height: number;
    orientation: string;
    progressBarSize: string;
    cssClass: string;
    iconClass: string;
    titleText: string;
    format: string;
    maxRange: number;
    minRange: number;
    showTickLabels: boolean;
    unitLabel: boolean;
    valueLabel: boolean;
    signalName: string;
    maxRangeSignalName: string;
    minRangeSignalName: string;
    minValueWarningEnable: boolean;
    maxValueWarningEnable: boolean;
    //neu ab Januar 2022, amueller
    range1: classRange;
    range2: classRange;
    range3: classRange;

}

class WfBargraphComponent extends ComponentBaseModel<IWfWfBargraphParams> {
    private signalArrayService: SignalArrayService;
    protected cssDisplayClass: KnockoutComputed<string>;
    protected statusCssClass: KnockoutComputed<string>;
    private midRangeValueFormated: KnockoutComputed<number>;
    private minRangeValueFormated: KnockoutComputed<any>;
    private maxRangeValueFormated: KnockoutComputed<any>;
    private midRangeValue: KnockoutComputed<number>;
    private minRangeValue: KnockoutComputed<any>;
    private maxRangeValue: KnockoutComputed<any>;
    private minRangeSignal: Signal;
    private maxRangeSignal: Signal;
    private minRangeSignalName: string;
    private maxRangeSignalName: string;

    private valueConversionsService: ValueConversionsService;

    private signalName: string;
    private currentSignalValue: KnockoutObservable<any>;
    private signal: Signal;
    private format: string;
    private formattedSignalValue: string | KnockoutObservable<any>;

    private width: string | number;
    private height: string;
    private orientation: string;
    private progressBarSize: string;

    private iconClass: string;
    private titleText: string;
    private maxRange: number;
    private minRange: number;
    private midRange: KnockoutObservable<number>;

    private showTickLabels: KnockoutObservable<boolean>;
    private unitLabel: KnockoutObservable<boolean>;
    private valueLabel: KnockoutObservable<boolean>;

    private maxValueVioliation: KnockoutObservable<boolean>;
    private minValueVioliation: KnockoutObservable<boolean>;

    private progressValue: KnockoutComputed<any>;
    protected states: VisualStatesService;
    private axisOrientation: KnockoutComputed<string>;
    private revertAxis: KnockoutComputed<boolean>;
    private isVertical: KnockoutComputed<boolean>;

    private minValueWarningEnable: KnockoutObservable<boolean>;
    private maxValueWarningEnable: KnockoutObservable<boolean>;

    //neu ab Januar 2022, amueller
    private progressValue2: KnockoutObservable<number>;
    private rangeIsActive: KnockoutObservable<boolean>;
    private range1: classRange;
    private range2: classRange;
    private range3: classRange;
    private progressValue2Change: KnockoutComputed<any>;
    private range1Value: KnockoutObservable<number>;
    private range2Value: KnockoutObservable<number>;
    private range3Value: KnockoutObservable<number>;
    private range1Color: KnockoutObservable<string>;
    private range2Color: KnockoutObservable<string>;
    private range3Color: KnockoutObservable<string>;
    private range1ColorHighlight: KnockoutObservable<string>;
    private range2ColorHighlight: KnockoutObservable<string>;
    private range3ColorHighlight: KnockoutObservable<string>;
    private r1: number;
    private r2: number;
    private r3: number;
    private showRange1: KnockoutObservable<boolean>;
    private showRange2: KnockoutObservable<boolean>;
    private showRange3: KnockoutObservable<boolean>;

    constructor(params: IWfWfBargraphParams) {
        super(params);

        // Stop here and return if no signalName was configured
        if (!this.signalName) {
            return;
        }

        this.signal = this.connector.getSignal(this.signalName);
        this.initializeSignalArray();

        if (this.signalArrayService.isArray) {
            this.currentSignalValue = this.signalArrayService.signalValue;
        } else {
            this.currentSignalValue = this.signal.value;
        }

        // The formated value will is used for value display
        this.formattedSignalValue = this.currentSignalValue.extend({
            numeralNumber: this.format
        });

        this.initializeComputeds();
        this.initializeStates();
        //this.initializeChangedFieldAnimation();
        this.connector.getOnlineUpdates(); //.fail(this.connector.handleError(this));




    }

    protected initializeSettings() {
        console.log("%cinitialSettings", "background: yellow");

        super.initializeSettings();

        this.valueConversionsService = new ValueConversionsService();

        this.minValueVioliation = ko.observable(false);
        this.minValueWarningEnable = ko.observable(ko.unwrap(this.settings.minValueWarningEnable) !== undefined ? ko.unwrap(this.settings.minValueWarningEnable) : false);
        this.maxValueVioliation = ko.observable(false);
        this.maxValueWarningEnable = ko.observable(ko.unwrap(this.settings.maxValueWarningEnable) !== undefined ? ko.unwrap(this.settings.maxValueWarningEnable) : false);

        this.width = ko.unwrap(this.settings.width) || "100%";
        this.height = ko.unwrap(this.settings.height) + 'px' || "";
        this.orientation = ko.unwrap(this.settings.orientation) || "horizontal left";

        this.progressBarSize = ko.unwrap(this.settings.progressBarSize) || "";
        (this.settings as any).cssClassNormalState = ko.unwrap(this.settings.cssClass) || null;

        this.iconClass = ko.unwrap(this.settings.iconClass) || "";
        this.titleText = (ko.unwrap(this.settings.titleText) || "").stringPlaceholderResolver(this.objectID);

        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : "0,0.[00]";

        this.maxRange = ko.unwrap(this.settings.maxRange) || 100;
        this.minRange = ko.unwrap(this.settings.minRange) || 0;

        this.showTickLabels = ko.observable(ko.unwrap(this.settings.showTickLabels) !== undefined ? ko.unwrap(this.settings.showTickLabels) : false);
        this.unitLabel = ko.observable(ko.unwrap(this.settings.unitLabel) !== undefined ? ko.unwrap(this.settings.unitLabel) : true);
        this.valueLabel = ko.observable(ko.unwrap(this.settings.valueLabel) !== undefined ? ko.unwrap(this.settings.valueLabel) : true);

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);

        this.formattedSignalValue = '';
        this.currentSignalValue = ko.observable();

        this.range1 = ko.unwrap(this.settings.range1) !== undefined ? ko.unwrap(this.settings.range1) : null;
        this.range2 = ko.unwrap(this.settings.range2) !== undefined ? ko.unwrap(this.settings.range2) : null;
        this.range3 = ko.unwrap(this.settings.range3) !== undefined ? ko.unwrap(this.settings.range3) : null;

        //----------------------------------------------------------------------------------------------------------------
        // Abfragen, ob die Bereiche sichtbar gemacht werden sollen
        //----------------------------------------------------------------------------------------------------------------
        if (this.range1 !== null) {
            console.log(this.range1);
            
            if ((this.range1.color != undefined) && (this.range1.position != undefined)) {
                this.showRange1 = ko.observable(true);
                if (this.range1.color == undefined) this.range1.color = '#449d47';
                if (this.range1.position == undefined) this.range1.position = 0;
            }
            else {
                this.showRange1 = ko.observable(false);
                this.range1.color = '#449d46';
                this.range1.position = 0;
            }
        } else {
            //-- params ist null
            this.showRange1 = ko.observable(false);
            this.range1 = {position: 0, color:'#449d45'};
        }
        //--------------
        if (this.range2 !== null) {
            if ((this.range2.color != undefined) && (this.range2.position != undefined)) {
                this.showRange2 = ko.observable(true);
                if (this.range2.color == undefined) this.range2.color = '#449d44';
                if (this.range2.position == undefined) this.range2.position = 0;
            }
            else {
                this.showRange2 = ko.observable(false);
                this.range2.color = '#449d44';
                this.range2.position = 0;
            }
        } else {
            //-- params ist null
            this.showRange2 = ko.observable(false);
            this.range2 = {position: 0, color:'#449d44'};
        }
        //--------------
        if (this.range3 !== null) {
            if ((this.range3.color != undefined) && (this.range3.position != undefined)) {
                this.showRange3 = ko.observable(true);
                if (this.range3.color == undefined) this.range3.color = '#449d44';
                if (this.range3.position == undefined) this.range3.position = 0;
            }
            else {
                this.showRange3 = ko.observable(false);
                this.range3.color = '#449d44';
                this.range3.position = 0;
            }
        } else {
            //-- params ist null
            this.showRange3 = ko.observable(false);
            this.range3 = {position: 0, color:'#449d44'};
        }
        //--------------




        if (this.showRange1() && this.showRange2() && this.showRange3()) {
            this.rangeIsActive = ko.observable(true);
            console.log("%cRange ist aktiv","background:yellow");
        } else {
            this.rangeIsActive = ko.observable(false);
            console.log("%cRange ist aus","background:yellow");
        }

        this.range1Color = ko.observable(this.range1.color);
        this.range2Color = ko.observable(this.range2.color);
        this.range3Color = ko.observable(this.range3.color);
        this.range1ColorHighlight = ko.observable('#5cb85c');
        this.range2ColorHighlight = ko.observable('#5cb85c');
        this.range3ColorHighlight = ko.observable('#5cb85c');


        console.log(this.range1);
        console.log(this.settings.range1);


        //----------------------------------------------------------------------------------------------------------------
        // Berechnen der Breite/Höhe der DIVs
        //----------------------------------------------------------------------------------------------------------------
        if (this.rangeIsActive()) {
            console.log("Active");


            var c1 = this.convertColor(this.range1.color != undefined ? this.range1.color : '');
            if (c1.length > 0) {
                this.range1ColorHighlight = ko.observable('#' + ((c1[0] - 1).toString(16).length == 1 ? '0' + (c1[0] - 1).toString(16) : (c1[0] - 1).toString(16)) + ((c1[1] - 1).toString(16).length == 1 ? '0' + (c1[1] - 1).toString(16) : (c1[1] - 1).toString(16)) + ((c1[2] - 1).toString(16).length == 1 ? '0' + (c1[2] - 1).toString(16) : (c1[2] - 1).toString(16)));
            } else {
                this.range1ColorHighlight = ko.observable(this.range1.color);
            }

            var c2 = this.convertColor(this.range2.color);
            if (c2.length > 0) {
                this.range2ColorHighlight = ko.observable('#' + ((c2[0] - 1).toString(16).length == 1 ? '0' + (c2[0] - 1).toString(16) : (c2[0] - 1).toString(16)) + ((c2[1] - 1).toString(16).length == 1 ? '0' + (c2[1] - 1).toString(16) : (c2[1] - 1).toString(16)) + ((c2[2] - 1).toString(16).length == 1 ? '0' + (c2[2] - 1).toString(16) : (c2[2] - 1).toString(16)));
            } else {
                this.range2ColorHighlight = ko.observable(this.range2.color);
            }

            var c3 = this.convertColor(this.range3.color);
            if (c3.length > 0) {
                this.range3ColorHighlight = ko.observable('#' + ((c3[0] - 1).toString(16).length == 1 ? '0' + (c3[0] - 1).toString(16) : (c3[0] - 1).toString(16)) + ((c3[1] - 1).toString(16).length == 1 ? '0' + (c3[1] - 1).toString(16) : (c3[1] - 1).toString(16)) + ((c3[2] - 1).toString(16).length == 1 ? '0' + (c3[2] - 1).toString(16) : (c3[2] - 1).toString(16)));
            } else {
                this.range3ColorHighlight = ko.observable(this.range3.color);
            }
            console.log(this.range1Color(), this.range2Color(), this.range3Color());
            console.log(this.range1ColorHighlight(), this.range2ColorHighlight(), this.range3ColorHighlight());
        }


        this.r1 = 0;
        this.r2 = 0;
        this.r3 = 0;

    }

    protected initializeComputeds() {
        console.log("%cinitialComputeds", "background: yellow");

        this.axisOrientation = ko.computed(() => {
            return this.orientation.indexOf("horizontal") !== -1 ? "bottom" : "right";
        }, this);

        this.revertAxis = ko.computed(() => {
            return this.orientation.indexOf("right") !== -1 || this.orientation.indexOf("top") !== -1;
        }, this);

        this.isVertical = ko.computed(() => {
            return !(this.orientation.indexOf("horizontal") !== -1);
        }, this);


        this.maxRangeSignalName = ko.unwrap(this.settings.maxRangeSignalName) ? ko.unwrap(this.settings.maxRangeSignalName) : null;
        if (this.maxRangeSignalName)
            this.maxRangeSignal = this.connector.getSignal(this.maxRangeSignalName);

        this.minRangeSignalName = ko.unwrap(this.settings.minRangeSignalName) ? ko.unwrap(this.settings.minRangeSignalName) : null;
        if (this.minRangeSignalName)
            this.minRangeSignal = this.connector.getSignal(this.minRangeSignalName);

        this.maxRangeValue = ko.computed(() => {
            return this.maxRangeSignal ? _.isNumber(this.maxRangeSignal.value()) ? this.maxRangeSignal.value() : this.maxRange : this.maxRange;
        });

        this.maxRangeValueFormated = this.maxRangeValue.extend({
            numeralNumber: this.format
        });

        this.minRangeValue = ko.computed(() => {
            return this.minRangeSignal ? _.isNumber(this.minRangeSignal.value()) ? this.minRangeSignal.value() : this.minRange : this.minRange;
        });

        this.minRangeValueFormated = this.minRangeValue.extend({
            numeralNumber: this.format
        });

        this.midRangeValue = ko.computed(() => {
            return (this.maxRangeValue() + this.minRangeValue()) / 2;
        });

        this.midRangeValueFormated = this.midRangeValue.extend({
            numeralNumber: this.format
        });


        this.progressValue2 = ko.observable(0);
        this.range1Value = ko.observable(0);
        this.range2Value = ko.observable(0);
        this.range3Value = ko.observable(0);

        this.progressValue = ko.computed(() => {
            const signalValue = this.currentSignalValue();
            var maxErreicht = false;
            var minErreicht = false;
            // Prevent the width of progressbar to be out of range 0 - 100%
            if (signalValue > this.maxRangeValue()) {
                if (this.maxValueWarningEnable()) {
                    this.maxValueVioliation(true);
                }
                this.minValueVioliation(false);
                // return "100%";
                maxErreicht = true;
            } else if (signalValue < this.minRangeValue()) {
                if (this.minValueWarningEnable()) {
                    this.minValueVioliation(true);
                }
                this.maxValueVioliation(false);
                // return "0%";
                minErreicht = true;
            }

            this.maxValueVioliation(false);
            this.minValueVioliation(false);

            // Calculate the width in a linear conversion to 0 - 100%
            var progressWidth = this.valueConversionsService.linearScale(this.currentSignalValue(), this.minRangeValue(), this.maxRangeValue(), 0, 100);
            this.progressValue2(progressWidth);
            // console.log(this.showRange1());

            if (this.showRange1()) {
                var w1 = this.valueConversionsService.linearScale(this.range1.position, this.minRangeValue(), this.maxRangeValue(), 0, 100);
            } else {
                var w1 = 0;
            }
            this.r1 = progressWidth > w1 ? w1 : progressWidth;
            this.range1Value(this.r1);
            // console.log("v1", w1.toFixed(1), this.r1.toFixed(1),this.range1.position);

            if (this.showRange2()) {
                var w2 = this.valueConversionsService.linearScale(this.range2.position, this.minRangeValue(), this.maxRangeValue(), 0, 100);
            } else {
                var w2 = 0;
            }
            this.r2 = 0;
            if ((progressWidth > w1) && (true)) {
                if (progressWidth > w2) {
                    this.r2 = w2 - w1;
                } else {
                    this.r2 = progressWidth - w1;
                }
            }
            this.range2Value(this.r2);
            // console.log("v2", w2.toFixed(1), this.r2.toFixed(1));

            var w3 = 100;//this.valueConversionsService.linearScale(this.range3.position, this.minRangeValue(), this.maxRangeValue(), 0, 100);
            this.r3 = 0;
            if ((progressWidth > w2) && (true)) {
                if (progressWidth > w3) {
                    this.r3 = w3 - w2;
                } else {
                    this.r3 = progressWidth - w2;
                }
            }
            this.range3Value(this.r3);
            // console.log("v3", w3.toFixed(1), this.r3.toFixed(1));

            if (maxErreicht || minErreicht) {
                if (maxErreicht) return "100%";
                if (minErreicht) return "0%";
            }
            else
                return progressWidth + "%";
        });



    }

    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.signal);
    }

    protected initializeStates() {
        this.states = new VisualStatesService(this.settings);
        this.statusCssClass = this.states.statusCssClass;
    }

    //private initializeChangedFieldAnimation() {
    //    this.changedFieldAnimationService = new ChangedFieldAnimationService(this.settings, this.currentSignalValue as KnockoutObservable<any>, this.cssDisplayClass);
    //    this.cssClass = ko.computed(() => {
    //        return this.changedFieldAnimationService ? this.changedFieldAnimationService.cssClass() || "" : "";
    //    });
    //}

    protected async dispose() {
        await super.dispose();
        await this.states.unregisterSignals();
        if (this.visualSecurityService)
            this.visualSecurityService.dispose();
        if (this.maxRangeSignal)
            await this.connector.unregisterSignals(this.maxRangeSignal);
        if (this.minRangeSignal)
            await this.connector.unregisterSignals(this.minRangeSignal);
        if (!this.signal)
            return;
        await this.connector.unregisterSignals(this.signal);
    }

    private convertColor(hexa) {
        var chunks = [];
        var tmp, i;
        var hexa2 = hexa.substr(1); // remove the pound 
        if (hexa2.length === 3) {
            tmp = hexa2.split("");
            for (i = 0; i < 3; i++) {
                chunks.push(parseInt(tmp[i] + "" + tmp[i], 16));
            }
        } else if (hexa2.length === 6) {
            tmp = hexa2.match(/.{2}/g);
            for (i = 0; i < 3; i++) {
                chunks.push(parseInt(tmp[i], 16));
            }
        } else {
            // throw new Error("'"+hexa+"' is not a valid hex format");
            toastr.error("<b>'" + hexa + "'</b> ist nicht das richtige <b>Farbformat</b>. Kontrolliere die Parameter bei der Komponente <b>'ccw-wf-bargraph'</b> bei dem Signalnamen <b>'" + this.signalName + "'</b>");
        }

        return chunks;
    }
}

export = WfBargraphComponent;
