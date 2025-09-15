////////////////////
// available hubs //
////////////////////

interface SignalR {
	measurementHub: WEBfactory.DWH.Server.RealTime.Proxies.Hubs.MeasurementHub;
}

///////////////////////
// Service Contracts //
///////////////////////
declare module WEBfactory.DWH.Server.RealTime.Proxies.Hubs {

	interface MeasurementHub {

		/**
		* This property lets you send messages to the MeasurementHub hub.
		*/
		server: IMeasurementHubServer;

		/**
		* The functions on this property should be replaced if you want to receive messages from the MeasurementHub hub.
		*/
		client: IMeasurementHubClient;

		/**
		* The hub name
		*/
		hubName: string;
	}

	interface IMeasurementHubServer {

		/** 
		* Sends a "subscribe" message to the MeasurementHub hub.
		* Contract Documentation: ---
		* @param signalId {System.Guid} 
		* @return {JQueryPromise of WEBfactory.DWH.Server.RealTime.Proxies.Model.Measurement}
		*/
        read(signalId: System.Guid): JQueryPromise<WEBfactory.DWH.Server.RealTime.Proxies.Model.Measurement>;
        
		/** 
		* Sends a "subscribe" message to the MeasurementHub hub.
		* Contract Documentation: ---
		* @param signalId {System.Guid} 
		* @return {JQueryPromise of WEBfactory.DWH.Server.RealTime.Proxies.Model.Measurement}
		*/
		subscribe(signalId: System.Guid): JQueryPromise<WEBfactory.DWH.Server.RealTime.Proxies.Model.Measurement>;

		/** 
		* Sends a "subscribeAll" message to the MeasurementHub hub.
		* Contract Documentation: ---
		* @param signalIds {System.Guid[]} 
		* @return {JQueryPromise of WEBfactory.DWH.Server.RealTime.Proxies.Model.Measurement[]}
		*/
		subscribeAll(signalIds: System.Guid[]): JQueryPromise<WEBfactory.DWH.Server.RealTime.Proxies.Model.Measurement[]>;

		/** 
		* Sends a "unsubscribe" message to the MeasurementHub hub.
		* Contract Documentation: ---
		* @param signalId {System.Guid} 
		* @return {JQueryPromise of void}
		*/
		unsubscribe(signalId: System.Guid): JQueryPromise<void /*task*/>;

		/** 
		* Sends a "unsubscribeAll" message to the MeasurementHub hub.
		* Contract Documentation: ---
		* @param signalIds {System.Guid[]} 
		* @return {JQueryPromise of void}
		*/
		unsubscribeAll(signalIds: System.Guid[]): JQueryPromise<void /*task*/>;
	}

	interface IMeasurementHubClient extends WEBfactory.DWH.Server.RealTime.Proxies.Hubs.IHubClient {

		/**
		* Set this function with a "function(measurement: WEBfactory.DWH.Server.RealTime.Proxies.Model.Measurement){}" to receive the "onMeasurement" message from the hub.
		* Contract Documentation: ---
		* @param measurement {WEBfactory.DWH.Server.RealTime.Proxies.Model.Measurement} 
		* @return {void}
		*/
		onMeasurement: (measurement: any) => void;
	}

	interface IHubClient {

		/**
		* Set this function with a "function(state: number){}" to receive the "onServerStateChanged" message from the hub.
		* Contract Documentation: ---
		* @param state {number} 
		* @return {void}
		*/
		onServerStateChanged: (state: number) => void;
	}

}

declare module WEBfactory.DWH.Server.RealTime.Proxies.Model {
	interface Measurement {
		signalId: System.Guid;
		timestamp: Date;
		value: any;
	}
}

declare module System {
	interface Guid {
    }
    interface Exception {
        data: any;
        helpLink: string;
        hResult: number;
        innerException: System.Exception;
        message: string;
        source: string;
        stackTrace: string;
        targetSite: any;
    }
}

interface IWriteSignalInfo {
	SignalId: Guid;
	Value: number;
	Timestamp: moment.Moment;
}

declare module WEBfactory.DWH.Data.Exchange {
	interface INamedItem<TId> extends WEBfactory.DWH.Data.Exchange.IId<TId> {
		name: string;
	}

	interface IId<TId> {
		id: TId;
    }

    interface ISignal {
        id: string;
        name: string;
        alias: string;
        description: string;
        unit: string;
        active: boolean;

        icon: string;
    }
    enum TriStateOption {
        No = 0,
        Yes = 1,
        YesExclusively = 2
    }

    enum AdvancedObjectFilterOptions {
        None = 0,
        DeviceCategories = 1,
        Versions = 2,
        Adapters = 4,
        UnassignedDevices = 8,
        EntityVariables = 16,
        HiddenDevices = 32,
        InactiveDevices = 64,
        SiteType = 128,
        DeviceScope = 256,
        AreaScope = 512
    }
    interface ISignalFilter {
        excludedIds: Guid[];
        adapterSignals: number;

        types: string[];
        selectedTypes: string[];
        minPatternLength?: number;
        autoFilter?: boolean;
        minItems?: number;
        maxItems?: number;
        singleSelectionMode?: boolean;
        title?: string;
        subtitle?: string;

        adapterId: System.Guid;
        adapterTypeId: number;
        areaScope: System.Guid[];
        customerId: System.Guid;
        deviceManufacturerIds: number[];
        deviceModelIds: number[];
        deviceScope: System.Guid[];
        deviceTypeIds: number[];
        entityVariables: number;
        filterOptions: number;
        hardwareVersionIds: number[];
        hidden: number;
        inactive: number;
        languageId: number;
        pattern: string;
        selectedItems?: System.Guid[];
        signalTypes: number[];
        siteTypeId: number;
        softwareVersionIds: number[];
        unassigned: number;
    }

    //set Minimum, Maximum
    interface ISignalDetails extends ISignal, CommonSignalDefinition {
        
        configuration: string;
        counterOverflow: number;
        factor: number;
        conversionFactorFrom: number;
        conversionFactorTo: number;
        deadband: number;
        plausibilityDelta: number;
        gapInterval: number;
        interpolate: boolean;
        inactivityInterval: number;
        log: boolean;
        stream: boolean;
        script: string;
        lastUpdate: DateTime;
        minValue: any;
        maxValue: any;

        counter: number;
        sourceId: System.Guid;
        signalTypeId: number;
        signalTypeName: string;
        adapterTypeId: number;
        adapterTypeName: string;
        mode: ComputationMode;
        deviceName: string;
        deviceAlias: string;
    }

    enum ComputationMode {
        None = 0,
        EntityVariable = 1,
        OnlineScript = 2,
        HistoricalScript = 3
    }

    interface ActionResult {
		errorMessage: string;
		exception: System.Exception;
		successful: boolean;
	}
}