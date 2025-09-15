import Signal = require("../../services/models/signal");
import ValueConversionsService = require("../services/value-conversions.service");
import ComponentBaseModel = require("../component-base.model");
import SignalArrayService = require("../services/signal-array.service");

interface IWfGauge1Params extends IWfArcBaseParams {
    backgroundFillColor: string;
    lowRangeFillColor: string;
    highRangeFillColor: string;
    needleFillColor: string;
    iconBackgroundColor: string;
    minorTicks: number;
    lowRangeStart: number;
    lowRangeEnd: number;
    highRangeStart: number;
    highRangeEnd: number;

    lowRangeStartSignalName: string;
    lowRangeEndSignalName: string;
    highRangeStartSignalName: string;
    highRangeEndSignalName: string;
    majorTicksSignalName: string;
    minorTicksSignalName: string;
}

class WfGauge1Component extends ComponentBaseModel<IWfGauge1Params> {
    private signalArrayService: SignalArrayService;
    private format: string;
    private signalName: string;
    private currentSignalValue: KnockoutObservable<number> = ko.observable<number>();

    private maxValueVioliation = ko.observable(false);
    private minValueVioliation = ko.observable(false);

    private signal: Signal;
    private maxRangeSignal: Signal;
    private majorTicksSignal: Signal;
    private minRangeSignal: Signal;
    private minorTicksSignal: Signal;
    private lowRangeStartSignal: Signal;
    private lowRangeEndSignal: Signal;
    private highRangeStartSignal: Signal;
    private highRangeEndSignal: Signal;

    private r2d: number;
    private height: number;
    private width: number;
    private innerRadius: number;
    private majorTicks: number;
    private minRange: number;
    private maxRange: number;
    private maxRangeSignalName: string;
    private minRangeSignalName: string;
    private maxRangeValue: KnockoutComputed<any>;
    private startAngle: number;
    private endAngle: number;
    private showValueLabel: boolean;
    private iconClass: string;
    private iconColor: string;
    private iconStyle: string;
    private formattedSignalValue: KnockoutObservable<any>;
    private currentAngle: KnockoutComputed<number>;
    private backgroundFillColor: string;
    private lowRangeFillColor: string;
    private highRangeFillColor: string;
    private needleFillColor: string;
    private iconBackgroundColor: string;
    private minorTicks: number;

    private minRangeValue: KnockoutComputed<any>;
    private lowRangeStart: KnockoutComputed<any>;
    private lowRangeEnd: KnockoutComputed<any>;
    private highRangeStart: KnockoutComputed<any>;
    private highRangeEnd: KnockoutComputed<any>;

    private radius: number;
    private marginBottom: KnockoutComputed<string | number>;

    private lowRangeStartAngle: KnockoutComputed<any>;
    private lowRangeEndAngle: KnockoutComputed<any>;
    private highRangeStartAngle: KnockoutComputed<any>;
    private highRangeEndAngle: KnockoutComputed<any>;

    private lowRangeStartSignalName: string;
    private lowRangeEndSignalName: string;
    private highRangeStartSignalName: string;
    private highRangeEndSignalName: string;
    private majorTicksSignalName: string;
    private minorTicksSignalName: string;

    private minorTicksValue: KnockoutComputed<any>;
    private majorTicksValue: KnockoutComputed<any>;

    private minorTicksArray: KnockoutComputed<number[]>;
    private majorTicksArray: KnockoutComputed<number[]>;

    private needleAngle: KnockoutComputed<string> | KnockoutObservable<number>;

    private valueConversionsService: ValueConversionsService;

    private rangeValidation: KnockoutComputed<void>;
    private highRangeValidation: KnockoutComputed<void>;
    private lowRangeValidation: KnockoutComputed<void>;

    constructor(params: IWfGauge1Params) {
        super(params);

        if (!this.signalName) {
            this.needleAngle = ko.observable(0);
        }

        this.signal = this.connector.getSignal(this.signalName);
        this.initializeSignalArray();

        if (this.signalArrayService.isArray) {
            this.currentSignalValue = this.signalArrayService.signalValue;
        } else {
            this.currentSignalValue = this.signal.value;
        }

        // The formated value will be used for value display
        this.formattedSignalValue = this.currentSignalValue.extend({ numeralNumber: this.format });

        this.connector.getOnlineUpdates(); 

        this.initializeComputeds();
    }

    protected initializeSettings() {
        super.initializeSettings();
        this.valueConversionsService = new ValueConversionsService();


        //#region Properties
        this.r2d = Math.PI / 180;

        this.format = ko.unwrap(this.settings.format) ? ko.unwrap(this.settings.format) : '0,0.[00]';

        //this.height = ko.unwrap(settings.width) !== undefined ? ko.unwrap(settings.width) : 200;
        this.width = ko.unwrap(this.settings.width) !== undefined ? ko.unwrap(this.settings.width) : 200;
        this.height = this.width;

        this.showValueLabel = ko.unwrap(this.settings.showValueLabel) !== undefined ? ko.unwrap(this.settings.showValueLabel) : true;

        this.radius = Math.min(this.width, this.height) / 2;
        this.innerRadius = ko.unwrap(this.settings.innerRadius) !== undefined ? ko.unwrap(this.settings.innerRadius) : 0.55;

        this.backgroundFillColor = ko.unwrap(this.settings.backgroundFillColor) || '#5cb85c';
        this.lowRangeFillColor = ko.unwrap(this.settings.lowRangeFillColor) || '#f0ad4e';
        this.highRangeFillColor = ko.unwrap(this.settings.highRangeFillColor) || '#d9534f';
        this.needleFillColor = ko.unwrap(this.settings.needleFillColor) || '#555555';

        this.iconColor = ko.unwrap(this.settings.iconColor) ? ko.unwrap(this.settings.iconColor) : '#ffffff';
        this.iconBackgroundColor = ko.unwrap(this.settings.iconBackgroundColor) || '#999999';
        this.iconClass = ko.unwrap(this.settings.iconClass) ? ko.unwrap(this.settings.iconClass) : 'wf wf-speed-gauge wf-2x';
        this.iconStyle = ko.unwrap(this.settings.iconStyle) || "";

        this.majorTicks = ko.unwrap(this.settings.majorTicks) !== undefined ? (ko.unwrap(this.settings.majorTicks) - 1) : 5;
        this.minorTicks = ko.unwrap(this.settings.minorTicks) !== undefined ? ko.unwrap(this.settings.minorTicks) : 5;

        this.minRange = ko.unwrap(this.settings.minRange) !== undefined ? ko.unwrap(this.settings.minRange) : 0;
        this.maxRange = ko.unwrap(this.settings.maxRange) !== undefined ? ko.unwrap(this.settings.maxRange) : 100;
        this.startAngle = ko.unwrap(this.settings.startAngle) !== undefined ? ko.unwrap(this.settings.startAngle) : -90;
        this.endAngle = ko.unwrap(this.settings.endAngle) !== undefined ? ko.unwrap(this.settings.endAngle) : 90;

        //#endregion

        this.signalName = (ko.unwrap(this.settings.signalName) || '').stringPlaceholderResolver(this.objectID);

        this.majorTicks = ko.unwrap(this.settings.majorTicks) !== undefined ? (ko.unwrap(this.settings.majorTicks) - 1) : 5;
        this.minorTicks = ko.unwrap(this.settings.minorTicks) !== undefined ? ko.unwrap(this.settings.minorTicks) : 5;

        this.majorTicksSignalName = ko.unwrap(this.settings.majorTicksSignalName) ? ko.unwrap(this.settings.majorTicksSignalName) : null;
        if (this.majorTicksSignalName)
            this.majorTicksSignal = this.connector.getSignal(this.majorTicksSignalName);

        this.minorTicksSignalName = ko.unwrap(this.settings.minorTicksSignalName) ? ko.unwrap(this.settings.minorTicksSignalName) : null;
        if (this.minorTicksSignalName)
            this.minorTicksSignal = this.connector.getSignal(this.minorTicksSignalName);


        this.maxRangeSignalName = ko.unwrap(this.settings.maxRangeSignalName) ? ko.unwrap(this.settings.maxRangeSignalName) : null;
        if (this.maxRangeSignalName)
            this.maxRangeSignal = this.connector.getSignal(this.maxRangeSignalName);

        this.minRangeSignalName = ko.unwrap(this.settings.minRangeSignalName) ? ko.unwrap(this.settings.minRangeSignalName) : null;
        if (this.minRangeSignalName)
            this.minRangeSignal = this.connector.getSignal(this.minRangeSignalName);


        this.lowRangeStartSignalName = ko.unwrap(this.settings.lowRangeStartSignalName) ? ko.unwrap(this.settings.lowRangeStartSignalName) : null;
        if (this.lowRangeStartSignalName)
            this.lowRangeStartSignal = this.connector.getSignal(this.lowRangeStartSignalName);

        this.lowRangeEndSignalName = ko.unwrap(this.settings.lowRangeEndSignalName) ? ko.unwrap(this.settings.lowRangeEndSignalName) : null;
        if (this.lowRangeEndSignalName)
            this.lowRangeEndSignal = this.connector.getSignal(this.lowRangeEndSignalName);

        this.highRangeStartSignalName = ko.unwrap(this.settings.highRangeStartSignalName) ? ko.unwrap(this.settings.highRangeStartSignalName) : null;
        if (this.highRangeStartSignalName)
            this.highRangeStartSignal = this.connector.getSignal(this.highRangeStartSignalName);

        this.highRangeEndSignalName = ko.unwrap(this.settings.highRangeEndSignalName) ? ko.unwrap(this.settings.highRangeEndSignalName) : null;
        if (this.highRangeEndSignalName)
            this.highRangeEndSignal = this.connector.getSignal(this.highRangeEndSignalName);

        this.majorTicksSignalName = ko.unwrap(this.settings.majorTicksSignalName) ? ko.unwrap(this.settings.majorTicksSignalName) : null;
        if (this.majorTicksSignalName)
            this.majorTicksSignal = this.connector.getSignal(this.majorTicksSignalName);

        this.minorTicksSignalName = ko.unwrap(this.settings.minorTicksSignalName) ? ko.unwrap(this.settings.minorTicksSignalName) : null;
        if (this.minorTicksSignalName)
            this.minorTicksSignal = this.connector.getSignal(this.minorTicksSignalName);
    }

    protected initializeComputeds() {

        this.marginBottom = ko.pureComputed(() => {
            if (this.showValueLabel === false) {
                return -this.width / 4 + 'px';
            }
            else {
                return 'auto';
            }
        });

        this.maxRangeValue = ko.computed(() => {
            return this.maxRangeSignal ? _.isNumber(this.maxRangeSignal.value()) ? this.maxRangeSignal.value() : this.maxRange : this.maxRange;
        });

        this.minRangeValue = ko.computed(() => {
            return this.minRangeSignal ? _.isNumber(this.minRangeSignal.value()) ? this.minRangeSignal.value() : this.minRange : this.minRange;
        });

        this.lowRangeStart = ko.computed(() => {
            var lowRangeStart = this.lowRangeStartSignal ? _.isNumber(this.lowRangeStartSignal.value()) ? this.lowRangeStartSignal.value() : this.settings.lowRangeStart : this.settings.lowRangeStart;
            return ko.unwrap(lowRangeStart) !== undefined ? ko.unwrap(lowRangeStart) : this.maxRangeValue() * 0.6;
        });

        this.lowRangeEnd = ko.computed(() => {
            var lowRangeEnd = this.lowRangeEndSignal ? _.isNumber(this.lowRangeEndSignal.value()) ? this.lowRangeEndSignal.value() : this.settings.lowRangeEnd : this.settings.lowRangeEnd;
            return ko.unwrap(lowRangeEnd) !== undefined ? ko.unwrap(lowRangeEnd) : this.maxRangeValue() * 0.8;
        });

        this.highRangeStart = ko.computed(() => {
            var highRangeStart = this.highRangeStartSignal ? _.isNumber(this.highRangeStartSignal.value()) ? this.highRangeStartSignal.value() : this.settings.highRangeStart : this.settings.highRangeStart;
            return ko.unwrap(highRangeStart) !== undefined ? ko.unwrap(highRangeStart) : this.maxRangeValue() * 0.8;
        });

        this.highRangeEnd = ko.computed(() => {
            var highRangeEnd = this.highRangeEndSignal ? _.isNumber(this.highRangeEndSignal.value()) ? this.highRangeEndSignal.value() : this.settings.highRangeEnd : this.settings.highRangeEnd;
            return ko.unwrap(highRangeEnd) !== undefined ? ko.unwrap(highRangeEnd) : this.maxRangeValue();
        });

        this.lowRangeStartAngle = ko.computed(() => {
            return this.valueConversionsService.linearScale(this.lowRangeStart(), this.minRangeValue(), this.maxRangeValue(), this.startAngle, this.endAngle);
        });
        this.lowRangeEndAngle = ko.computed(() => {
            return this.valueConversionsService.linearScale(this.lowRangeEnd(), this.minRangeValue(), this.maxRangeValue(), this.startAngle, this.endAngle);
        });
        this.highRangeStartAngle = ko.computed(() => {
            return this.valueConversionsService.linearScale(this.highRangeStart(), this.minRangeValue(), this.maxRangeValue(), this.startAngle, this.endAngle);
        });
        this.highRangeEndAngle = ko.computed(() => {
            return this.valueConversionsService.linearScale(this.highRangeEnd(), this.minRangeValue(), this.maxRangeValue(), this.startAngle, this.endAngle);
        });


        this.majorTicksValue = ko.computed(() => {
            return this.majorTicksSignal ? _.isNumber(this.majorTicksSignal.value()) ? this.majorTicksSignal.value() : this.majorTicks : this.majorTicks;
        });

        this.minorTicksValue = ko.computed(() => {
            return this.minorTicksSignal ? _.isNumber(this.minorTicksSignal.value()) ? this.minorTicksSignal.value() : this.minorTicks : this.minorTicks;
        });

        this.majorTicksArray = ko.computed(() => {
            return this.majorTicksValue() <= 0 ? [] : _.union(_.range(this.startAngle, this.endAngle + (this.endAngle - this.startAngle) / this.majorTicksValue(), (this.endAngle - this.startAngle) / this.majorTicksValue()), [this.endAngle]);
        });

        this.minorTicksArray = ko.computed(() => {
            return this.majorTicksValue() * this.minorTicksValue() <= 0 ? [] : _.range(this.startAngle, this.endAngle, (this.endAngle - this.startAngle) / (this.majorTicksValue() * this.minorTicksValue()));
        });


        this.needleAngle = ko.pureComputed(() => {
            var value = this.currentSignalValue();
            // Prevent the needle angle to be higher as the max angle of the gauge (endAngle)
            if (value > this.maxRangeValue()) {
                this.maxValueVioliation(true);
                this.minValueVioliation(false);
                return 'rotate(' + this.endAngle + 'deg)';
            }

            if (value < this.minRangeValue()) {
                this.minValueVioliation(true);
                this.maxValueVioliation(false);
                return 'rotate(' + this.startAngle + 'deg)';
            }

            this.maxValueVioliation(false);
            this.minValueVioliation(false);

            // Otherwise recalculate the needle angle
            var degree = this.valueConversionsService.linearScale(this.currentSignalValue(), this.minRangeValue(), this.maxRangeValue(), this.startAngle, this.endAngle);
            return 'rotate(' + degree + 'deg)';

        }, this);

        this.lowRangeValidation = ko.computed(() => {
            if (this.lowRangeEnd() < this.lowRangeStart())
                console.warn("lowRangeEnd " + this.lowRangeEnd() + " should be greater as lowRangeStart " + this.lowRangeStart());
        }, this);

        this.highRangeValidation = ko.computed(() => {
            if (this.highRangeEnd() < this.highRangeStart())
                console.warn("highRangeEnd " + this.highRangeEnd() + " should be greater as highRangeStart " + this.highRangeStart());
        }, this);

        this.rangeValidation = ko.computed(() => {
            if (this.maxRangeValue() < this.minRangeValue())
                console.warn("maxRange " + this.maxRangeValue() + " should be greater as minRange " + this.minRangeValue());
        }, this);
    }

    private initializeSignalArray() {
        this.signalArrayService = new SignalArrayService(this.settings, this.signal);
    }

    protected async dispose() {
        super.dispose();
        if (this.maxRangeSignal)
            await this.connector.unregisterSignals(this.maxRangeSignal);
        if (this.minRangeSignal)
            await this.connector.unregisterSignals(this.majorTicksSignal);
        if (this.majorTicksSignal)
            await this.connector.unregisterSignals(this.minRangeSignal);
        if (this.minorTicksSignal)
            await this.connector.unregisterSignals(this.minorTicksSignal);
        if (this.lowRangeStartSignal)
            await this.connector.unregisterSignals(this.lowRangeStartSignal);
        if (this.lowRangeEndSignal)
            await this.connector.unregisterSignals(this.lowRangeEndSignal);
        if (this.highRangeStartSignal)
            await this.connector.unregisterSignals(this.highRangeStartSignal);
        if (this.highRangeEndSignal)
            await this.connector.unregisterSignals(this.highRangeEndSignal);
        if (!this.signal)
            return;
        await this.connector.unregisterSignals(this.signal);
    }
}

export = WfGauge1Component;