import ViewModelBase = require("../viewModelBase");
import Connector = require("../../services/connector");
import LogValuesFilter = require("../../services/models/logValuesFilter");

class LogTagsTutorial extends ViewModelBase {
    private valuesArray2: KnockoutComputed<any[][]>;
    private valuesArray1: KnockoutComputed<any[][]>;
    private values2: KnockoutObservableArray<any>;
    private timeStamps2: KnockoutObservableArray<any>;
    private values1: KnockoutObservableArray<any>;
    private timeStamps1: KnockoutObservableArray<any>;
    private logValues: KnockoutObservableArray<any>;
    private logIds: KnockoutObservableArray<string>;
    private logTag2: KnockoutObservable<any>;
    private logTag1: KnockoutObservable<any>;
    private signalDefinitions: KnockoutObservable<SignalDefinitionDTO[]>;
    private signals: KnockoutObservableArray<any>;
    private sortOrder: KnockoutObservable<LogValuesSortOrder>;
    private maxResults: number;
    private endDate: KnockoutObservable<moment.Moment>;
    private startDate: KnockoutObservable<moment.Moment>;
    private logTagName2: KnockoutObservable<string>;
    private signalName2: KnockoutObservable<string>;
    private logTagName1: KnockoutObservable<string>;
    private signalName1: KnockoutObservable<string>;
    private connector: Connector;

    constructor() {
        super();
        this.connector = new Connector();
    }

    public activate() {

        //-------------------------------------------------------------------
        // Settings, properties
        //-------------------------------------------------------------------

        this.signalName1 = ko.observable("Level 1");
        this.logTagName1 = ko.observable("LogTagLevel1");

        this.signalName2 = ko.observable("Level 2");
        this.logTagName2 = ko.observable("LogTagLevel2");

        // Definition of time range for values
        this.startDate = ko.observable(moment().subtract(1, "minute"));
        this.endDate = ko.observable(moment());

        // Misc required settings
        this.maxResults = 5;
        this.sortOrder = ko.observable(LogValuesSortOrder.DateDescending);

        //-------------------------------------------------------------------

        this.signals = ko.observableArray();
        this.signals.subscribe(this.getSignalInformation, this);

        this.signalDefinitions = ko.observableArray<SignalDefinitionDTO>();

        this.logTag1 = ko.observable();
        this.logTag2 = ko.observable();

        this.logIds = ko.observableArray<string>();
        this.logValues = ko.observableArray();

        this.timeStamps1 = ko.observableArray();
        this.values1 = ko.observableArray();

        this.timeStamps2 = ko.observableArray();
        this.values2 = ko.observableArray();

        this.valuesArray1 = ko.computed(() => {
            return _.zip(this.timeStamps1(), this.values1());
        }, this);

        this.valuesArray2 = ko.computed(() => {
            return _.zip(this.timeStamps2(), this.values2());
        }, this);

        this.addSignal();
    }

    private addSignal() {
        this.signals.push(this.signalName1(), this.signalName2());
    }

    private async getSignalInformation() {

        var servers = ["."];
        var aliases = ko.unwrap(this.signals);
        var logTags = null;

        // Return if no signalname is  configured
        if (!aliases.length) return;
        try {
            const definitions = await this.connector.getSignalDefinitions(aliases) as SignalDefinitionDTO[];

            // Store signalDefinitions 
            this.signalDefinitions(definitions);
            //    console.log(this.signalDefinitions()[0].Logs.length + ' LogTags are defined for signal ' + this.signalName());

            // Filter the LogTags for this signal, where LogTag is equal configured one
            var signalDefinition1 = _.find(this.signalDefinitions(), (x) => { return x.AliasName === this.signalName1() });
            var signalDefinition2 = _.find(this.signalDefinitions(), (x) => { return x.AliasName === this.signalName2() });

            var logTag1 = _.find(signalDefinition1.Logs, (log) => { return log.LogTag === this.logTagName1(); });
            var logTag2 = _.find(signalDefinition2.Logs, (log) => { return log.LogTag === this.logTagName2(); });

            // Store raw logTag object for demo purposes
            this.logTag1(logTag1);
            this.logTag2(logTag2);

            if (logTag1 && logTag2) {
                //console.log('LogTag Object:' + logTag.ID);
                this.logIds.push(logTag1.ID);

                //console.log('LogTag Object:' + logTag.ID);
                this.logIds.push(logTag2.ID);

                // Get logTag values from database
                this.getLogValues();
            }
            else {
                //  console.log("No LogTags with name " + this.logTagName1() + " found for signal " + this.signalName());
            }
        } catch (error) {
            this.connector.handleError(LogTagsTutorial)(error);
        }

    }

    private async getLogValues() {

        var filter = new LogValuesFilter(this.logIds(), ko.unwrap(this.startDate), ko.unwrap(this.endDate), ko.unwrap(this.maxResults), ko.unwrap(this.sortOrder));
        try {
            const logValues = await this.connector.getLogValues(filter)

            // Store raw response for for further processing
            this.logValues(logValues);

            // Optional STEPS
            // Convert the result in any way it's needed for further processing
            // Here the result will be simplified and split to 2 arrays - timestamps and related values
            var timeStamps1 = [];
            var values1 = [];

            var timeStamps2 = [];
            var values2 = [];

            _.each(logValues, (row) => {

                // Get the logged value    
                if (row.Values[0]) {
                    // Store the timestamp
                    timeStamps1.push(row.EntriesDate);

                    if (row.Values[0].Value) {
                        values1.push(row.Values[0].Value);
                    }
                }

                // Get the logged value    
                if (row.Values[1]) {
                    // Store the timestamp
                    timeStamps2.push(row.EntriesDate);

                    if (row.Values[1].Value) {
                        values2.push(row.Values[1].Value);
                    }
                }
            });

            // Store the extracted timestamps and values to separate observable arrays
            this.values1(values1);
            this.timeStamps1(timeStamps1);

            this.values2(values2);
            this.timeStamps2(timeStamps2);

        } catch (error) {
            this.connector.handleError(LogTagsTutorial)(error)
        }
    }

    private changeSignal(signalName, logTagName) {

        console.log(signalName + ' ' + logTagName);

        this.logTagName1(logTagName);
        this.signalName1(signalName);

        // Reset properties
        this.signals.removeAll();
        this.signalDefinitions(null);
        this.logTag1(null);
        this.logTag2(null);
        this.logIds.removeAll();
        this.logValues.removeAll();
        this.timeStamps1.removeAll();
        this.values1.removeAll();
        this.timeStamps2.removeAll();
        this.values2.removeAll();

        // Trigger getting log values with new settings
        this.addSignal();
    }


}

export = LogTagsTutorial;