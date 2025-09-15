interface Window {
    resolveUrl(url: string): string;
    resolveHeaders(headers?: any): any;
    cacheKey: string;
    debug: boolean;
    defaultTimeZone: string;
    appVersion: string;
    rootContentUrl: string;
    signalRUrl: string;
    i4InstallationUrl: string;
    i4PostfixInstallationUrl: string;
    usei4Connector: boolean;
    clientConfiguration:
    {
        useVirtualKeyboard: boolean;
        languageCode: string;
        updateRate: number;
    }

    debounceIntervalResolvingSignalDefinitions: number;
    debounceIntervalResolvingOfSignalIds: number;
    debounceIntervalSubscribeToSignalChangeEvents: number;

    shouldCheckClientSession: boolean;

    translate(symbolicTextName: string);
}