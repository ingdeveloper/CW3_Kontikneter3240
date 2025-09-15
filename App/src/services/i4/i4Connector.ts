import SignalsService = require("../signalsService");
import HttpService = require("../http");
import Signal = require("../models/signal");
import SignalsInterface = require("../models/_signal");
import SignalValueType = SignalsInterface.SignalValueType;
import MeasurementService = require("./measurementService");
import ConnectionService = require("./connectionService");
import Logger = require("../logger");
import ConnectorBase = require("../connectorBase");
import ActionResult = WEBfactory.DWH.Data.Exchange.ActionResult;
import ISignalDetails = WEBfactory.DWH.Data.Exchange.ISignalDetails;
import Measurement = WEBfactory.DWH.Server.RealTime.Proxies.Model.Measurement;
import { Deferred } from "../deferred";
import { IConnector } from "../_connector";
import Signals = require("../models/signals");
import SignalValueData = require("../models/_signal-value-data");

class i4Connector extends ConnectorBase implements IConnector {

    private static pageNumber = 1;
    private static count = 200;

    private measurementService: MeasurementService;
    private triggerResolvingOfSignalIdsInRegisteredSignalList = _.debounce(() => {
        let registerSignals = SignalsService.registeredSignalList;
        let signalsToRemove: Signal[] = [];

        if (!registerSignals.length)
            return;

        let signalsWithoutSignalId: Signal[] = [];

        for (const signal of registerSignals) {
            if (ko.unwrap(signal.id) === undefined) { //signals with null are not i4 related signals and should not try to be resolved
                signalsWithoutSignalId.push(signal);
            }
        }

        if (!signalsWithoutSignalId.length) return;

        let signalsPendingResolution: I4SignalDeclaration[] = [];

        for (const signal of signalsWithoutSignalId) {
            const signalDeclaration = this.extractI4SignalDeclaration(signal.signalName());
            signalsToRemove.push(signal);

            if (signalDeclaration.deviceName) {
                signalsPendingResolution.push(signalDeclaration);
            }
            else {
                signal.id(null); //non i4 signals or incorectly configured
                Logger.warn(i4Connector, `Signal with name [${signalDeclaration.signalName}] does not fit the i4 naming criteria 'deviceName${ConnectorBase.DeviceSignalDelimitter}signalName'`);
            }
        }

        if (!signalsPendingResolution.length) return;

        for (const signal of signalsToRemove) {
            SignalsService.registeredSignalList.splice(SignalsService.registeredSignalList.indexOf(signal), 1);
        }


        const url = window.resolveUrl(window.i4InstallationUrl + `/${window.i4PostfixInstallationUrl}/signals/getMultipleIds`);

        try {
            HttpService.post(url, signalsPendingResolution).then(signalIds => {
                for (let i = 0; i < signalsPendingResolution.length; i++) {
                    let signalId = signalIds[i];
                    signalId = signalId ? (signalId as Guid).toString().toLowerCase() : null;

                    const signalName = this.getSignalNameFromDeclaration(signalsPendingResolution[i]);

                    const signal = SignalsService.getSignal(signalName, false);
                    if (signal) {
                        signal.id(signalId);
                    }
                }
            });
        } catch (error) {
            Logger.handleError(i4Connector)(error);
        }
    }, window.debounceIntervalResolvingOfSignalIds);
    private subscribeToSignalChangeEvents = _.debounce(async () => {

        let signals = SignalsService.allRegisteredSignals.concat([]);
        if (!signals.length)
            return;

        let pendingSubscriptions: Guid[] = [];

        for (let signal of signals) {
            if (signal.deferredId.isResolved()) {
                if (ko.unwrap(signal.id)) {
                    pendingSubscriptions.push(signal.id());
                }
            } else {
                this.triggerResolvingOfSignalIdsInRegisteredSignalList();

                signal.deferredId.promise.then(() => {
                    return this.subscribeToSignalChangeEvents();
                });
            }
        }

        if (pendingSubscriptions.length) {
            await this.subscribeAll(pendingSubscriptions);
        }
    }, window.debounceIntervalSubscribeToSignalChangeEvents);

    constructor() {
        super();

        this.measurementService = ConnectionService.getInstance().getMeasurementService();
    }

    public getSignal(name: string, shouldAddSubscriber: boolean = true): Signal {
        if (!name)
            return null;

        if (i4Connector.isGuid(name)) {
            name = name.toLowerCase();
        }

        const signal = SignalsService.getSignal(name, shouldAddSubscriber);

        this.triggerResolvingOfSignalIdsInRegisteredSignalList(); //debatable

        return signal;
    }

    public async getOnlineUpdates() {
        await this.subscribeToSignalChangeEvents();
    }

    public async writeSignals(signalValues: SignalValue): Promise<ActionResult> {


        const promises = Object.keys(signalValues)
            .map(signalName => this.writeSignal(signalName, signalValues[signalName]));

        try {
            const writeResults = await Promise.all(promises);
            let exception: System.Exception = null;
            let errorMessage: string = "";
            let wasSuccessful = true;

            for (const writeResult of writeResults) {
                if (!writeResult.successful) {
                    wasSuccessful = false;
                    errorMessage += `|${writeResult.errorMessage}`;
                    exception = writeResult.exception;
                }
            }

            return { successful: wasSuccessful, errorMessage: errorMessage, exception: exception } as ActionResult;
        } catch (error) {
            Logger.handleError(i4Connector)(error);
            return {
                successful: false,
                errorMessage: error.toString(),
                exception: error
            };
        }
    }

    public async getSignalDefinition(signalName: string): Promise<CommonSignalDefinition> {
        let signal = this.getSignal(signalName, false);

        if (!signal) {
            return Promise.resolve(null);
        }

        if (signal.deferredDefinition) {
            return signal.deferredDefinition.promise;
        }

        if (!signal.deferredId.isResolved()) {
            this.triggerResolvingOfSignalIdsInRegisteredSignalList();
        }

        return signal.deferredId.promise.then(() => {
            return this.getSignalDefinitionForSignal(signal);
        });
    }

    public async getSignalDefinitions(signalNames: string[]): Promise<CommonSignalDefinition[]> {
        const promises: Promise<CommonSignalDefinition>[] = [];

        for (const signalName of signalNames) {
            promises.push(this.getSignalDefinition(signalName));
        }

        return await Promise.all(promises);
    }

    public async getAllSignalDefinitions(): Promise<CommonSignalDefinition[]> {
        const signals = await this.getResolvedDefinitions();
        for (const signal of signals) {
            const registeredSignal = this.getSignal(signal.Name, false);
            registeredSignal.id(signal.ID);
            registeredSignal.definition(signal);
        }

        if (signals.length >= i4Connector.count) {
            i4Connector.pageNumber += 1;

            return await this.getAllSignalDefinitions();
        }

        return signals;

    }

    public async getSignalDefinitionsByPatterns(patterns: string[], onlyActive: boolean = true) {

        const commonSignalDefinitions = await this.getAllSignalDefinitions();

        let definitions: any[] = [];

        if (!patterns || patterns.length === 0) //pattern is empty. Sen all signals
            definitions = commonSignalDefinitions;

        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            if (pattern.indexOf("*") === -1) { //Tehere is not * in pattern. Pattern is singal name
                const model = _.find(commonSignalDefinitions, signal => {
                    return signal.Name === pattern;
                });
                if (model) {
                    definitions.push(model);
                }
            } else { // There is * in pattern.
                const regex = new RegExp("^" + pattern.split("*").join(".*") + "$");
                definitions = definitions.concat(_.filter(commonSignalDefinitions, (model: CommonSignalDefinition) => model && model.Name && regex.test(model.Name)));
            }
        }
        ;

        if (onlyActive)
            definitions = _.filter(definitions, definition => {
                return definition.Active;
            });

        return definitions;

    }

    public async unregisterSignals(...signals: (string | Signal)[]) {
        const ids: Guid[] = [];

        for (const signal of signals) {
            if (!signal) continue;

            let id: Guid;

            if (typeof signal === "string") {
                id = this.getSignal(signal, false).id();
            } else {
                id = signal.id();
            }

            if (id) {
                ids.push(id);
            }
        }

        await this.measurementService.unsubscribeAll(this.onMeasurementUpdate, ids);
    }

    public async readSignals(signalNames: string[]) {
        const signals = Signals.fromSignalNames(signalNames);
        SignalsService.readLocalSignals(signals.localSignals);
        await this.readRemoteSignals(signals.remoteSignals);
        return Signals.toSignalValueDTOs(signalNames, signals);
    }

    private async readRemoteSignals(remoteSignals: SignalValueData[]) {

        const results = [];

        for (const remoteSignal of remoteSignals) {
            try {
                let data = await this.readRemoteSignal(remoteSignal.name)
                results.push({
                    value: data.value,
                    result: 0
                });
            } catch{
                results.push({
                    value: null,
                    result: 500
                });
            }
        }

        results.forEach((result, index) => {
            remoteSignals[index].value = result.value;
            remoteSignals[index].result = result.result;
        });

    }

    private async readRemoteSignal(name: string): Promise<Measurement> {

        const signal = this.getSignal(name, false);

        if (!signal ||
            (signal.deferredId.isResolved() && !ko.unwrap(signal.id))) {
            return Promise.resolve(null);
        }

        return signal.deferredId.promise.then(signalId => {
            try {
                return this.measurementService.read(signalId)
            } catch (error) {
                Logger.handleError(i4Connector)(error);
                return Promise.resolve(null);
            }
        });
    }

    private async writeSignal(name: string, value: any): Promise<ActionResult> {

        if (!name) {
            return null;
        }

        const writableSignalValue = { value: value, signal: this.getSignal(name, false) };

        if (!writableSignalValue.signal ||
            (writableSignalValue.signal.deferredId.isResolved() && !ko.unwrap(writableSignalValue.signal.id))) {
            return Promise.resolve(null);
        }

        return writableSignalValue.signal.deferredId.promise.then(signalId => {
            const url = window.resolveUrl(window.i4InstallationUrl + `/${window.i4PostfixInstallationUrl}/signals/${signalId}/write`);

            try {
                const writeSignalInfo = { signalId: signalId, value: value, timestamp: moment().toMSDate() };
                return HttpService.post<ActionResult>(url, writeSignalInfo);
            } catch (error) {
                Logger.handleError(i4Connector)(error);
                return Promise.resolve(null);
            }
        });
    }

    private async getSignalDefinitionForSignal(signal: Signal): Promise<CommonSignalDefinition> {
        if (signal.deferredDefinition) {
            return signal.deferredDefinition.promise;
        }

        if (!ko.unwrap(signal.id)) {
            return Promise.resolve(null);
        }

        const url = window.resolveUrl(window.i4InstallationUrl + `/${window.i4PostfixInstallationUrl}/signals/${signal.id()}/details`);

        signal.deferredDefinition = new Deferred<CommonSignalDefinition>();
        return await HttpService.get<ISignalDetails>(url).then(details => {
            if (!details) {
                details = this.getDefaultSignalDetails();
            }

            details = this.updateSignalDetailsProperties(details);

            const existingSignal = this.getSignal(signal.signalName(), false);
            if (existingSignal) {
                existingSignal.definition(details);
            }

            return existingSignal.deferredDefinition.promise;
        });
    }

    private getResolvedDefinitions(): CommonSignalDefinition[] {
        const definitions: any[] = [];
        for (const signal of SignalsService.allRegisteredSignals) {
            if (ko.unwrap(signal.definition)) {
                definitions.push(signal.definition());
            }
        }

        return definitions;

        //the SignalsController list method has authorization built inside of the query as well as authorized as post method decorator
        //so if the scada page is not authentificated as i4 requirers we always are going to get an empty list back
        //for that we decided Seba and Ionut to return the entire list of signals that have been previously registered and resolved
    }

    private async subscribeAll(signalIds: Guid[]) {
        await this.measurementService.subscribeAll(this.onMeasurementUpdate, signalIds);
    }

    private onMeasurementUpdate(signalState: ISignalState): void {
        let signalName = signalState.name;

        if (i4Connector.isGuid(signalName)) {
            signalName = signalName.toLowerCase();
        }

        let signal = SignalsService.getRegisteredSignalByNameOrId(signalName);
        if (!signal) {
            signal = SignalsService.getSignal(signalName, false);
        }

        if (signal && signalState && signalState.value) {
            signal.setValue(signalState.value(), SignalValueType.Server);
        }
    }

    private getDefaultSignalDetails(): ISignalDetails {
        let model = {} as ISignalDetails;

        model.factor = 1;
        model.conversionFactorFrom = 1;
        model.conversionFactorTo = 1;
        model.log = true;

        return model;
    }

    private updateSignalDetailsProperties(signalDetail: WEBfactory.DWH.Data.Exchange.ISignalDetails): WEBfactory.DWH.Data.Exchange.ISignalDetails {

        signalDetail.ID = signalDetail.id;
        signalDetail.Name = signalDetail.name;
        signalDetail.Alias = signalDetail.alias;
        signalDetail.Active = signalDetail.active;
        signalDetail.Description = signalDetail.description;
        signalDetail.Unit = signalDetail.unit;
        signalDetail.Minimum = signalDetail.minValue;
        signalDetail.Maximum = signalDetail.maxValue;

        return signalDetail;
    }

    private getCommonSignalModel(signal: WEBfactory.DWH.Data.Exchange.ISignal): CommonSignalDefinition {
        const commonSignal = {} as CommonSignalDefinition;

        commonSignal.ID = signal.id;
        commonSignal.Name = signal.name;
        commonSignal.Alias = signal.alias;
        commonSignal.Active = signal.active;
        commonSignal.Description = signal.description;
        commonSignal.Unit = signal.unit;
        commonSignal.Maximum = -1;
        commonSignal.Minimum = -1;

        return commonSignal;
    }

    private defaultFilterOptions(): WEBfactory.DWH.Data.Exchange.ISignalFilter {
        const filter = {
            adapterId: null,
            adapterSignals: 0,
            adapterTypeId: null,
            areaScope: [],
            autoFilter: true,
            customerId: null,
            deviceManufacturerIds: null,
            deviceModelIds: null,
            deviceScope: [],
            deviceTypeIds: null,
            entityVariables: 0,
            excludedIds: [],
            filterOptions: 381,
            hardwareVersionIds: null,
            hidden: 0,
            inactive: 0,
            languageId: 9,
            maxItems: 5,
            minItems: 0,
            minPatternLength: 0,
            pattern: "",
            selectedItems: [],
            selectedTypes: ["Device"],
            signalTypes: null,
            singleSelectionMode: false,
            siteTypeId: null,
            softwareVersionIds: null,
            subtitle: null,
            title: null,
            types: ["OrganizationalUnit", "Site", "Area", "Device"],
            unassigned: 0
        } as WEBfactory.DWH.Data.Exchange.ISignalFilter;

        return filter;
    }
}

export = i4Connector;