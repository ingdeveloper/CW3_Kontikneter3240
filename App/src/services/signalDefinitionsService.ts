import Api = require("./api");
import Logger = require("./logger");
import SymbolicTexstService = require("./symbolicTextsService");
import SignalDefinitionsFilter = require("./models/signalDefinitionsFilter");
import SessionService = require("./sessionService");

enum States {
    Available,  //0
    Queried,    //1
    Unavailable,//2
    Invalid     //3
}

class SignalInformationModel {
    public signalName: string;
    public languageId: number;
    public state: States;
    public definition: SignalDefinitionDTO;
}

class SignalDefinitionsService {
    private static signalInformationModels: SignalInformationModel[] = [];
    private static startIndex = 0;
    private static count = 1000;
    private static disableSignalBrowser = (<any>window).disableSignalBrowser;
    private static signalDefinitions: { [index: string]: KnockoutObservable<SignalDefinitionDTO> } = {};

    private static runningUpdate: Promise<any[]> = null;

    private static subscribe = SymbolicTexstService.currentLanguageId.subscribe(() => {
        SignalDefinitionsService.doUpdate();
    });

    public static async getDefinition(signalName: string): Promise<SignalDefinitionDTO> {
        if (!signalName)
            return Promise.resolve(null);

        // if signalInformationModel are stored and state is Unavailable return null, needs to be checked when a chached signals will be retrived from chache
        const signalInforamtion = _.find(SignalDefinitionsService.signalInformationModels, x => x.signalName === signalName);
        if (signalInforamtion && signalInforamtion.state == States.Unavailable) {
            return Promise.resolve(null);
        }

        if (SignalDefinitionsService.runningUpdate) {
            await SignalDefinitionsService.runningUpdate;
        }

        const definition = SignalDefinitionsService.getCachedDefinition(signalName);
        if (definition() !== undefined) return definition();

        return new Promise<SignalDefinitionDTO>((resolve, reject) => {
            SignalDefinitionsService.triggerGetSignalDefinitionsCallForUnresolvedDefers();
            const subscription = definition.subscribe(def => {
                if (!def) return; //in release mode the subscribe is triggered before the call is finished with the default of null.
                // check if Signal is now Available if not retun null
                if (_.find(SignalDefinitionsService.signalInformationModels, x => x.signalName === signalName).state !== States.Available) {
                    resolve(null);
                }
                resolve(def);
                subscription.dispose();
            });
        });
    }

    private static getCachedDefinition(signalName: string) {
        const definition = SignalDefinitionsService.signalDefinitions[signalName] = SignalDefinitionsService.signalDefinitions[signalName] || ko.observable<SignalDefinitionDTO>();
        return definition;
    }

    public static async getDefinitions(signalNames: string[]): Promise<SignalDefinitionDTO[]> {
        return await Promise.all(signalNames.map(name => SignalDefinitionsService.getDefinition(name)));
    }

    public static async getAllDefinitions(): Promise<SignalDefinitionDTO[]> {
        let signalDefinitions: SignalDefinitionDTO[];
        do {
            signalDefinitions = await SignalDefinitionsService.loadSignalDefinitionsAsync([]);
            SignalDefinitionsService.startIndex += SignalDefinitionsService.count;
        } while (signalDefinitions.length >= SignalDefinitionsService.count);

        return SignalDefinitionsService.returnSignalDefinitions(null);
    }

    private static async doUpdate() {
        try {
            if (SignalDefinitionsService.runningUpdate) {
                await SignalDefinitionsService.runningUpdate;
            }
            SignalDefinitionsService.runningUpdate = SignalDefinitionsService.loadSignalDefinitionsAsync(SignalDefinitionsService.signalInformationModels);

            await SignalDefinitionsService.runningUpdate;

            for (const model of SignalDefinitionsService.signalInformationModels) {
                const definition = SignalDefinitionsService.getCachedDefinition(model.signalName);
                definition(model.definition);
            }
        } catch (erroe) {
            Logger.error(SignalDefinitionsService, "Unable to load SignalDefinitions.", erroe);
        } finally {
            SignalDefinitionsService.runningUpdate = null;
        }
    };

    public static async getSignalsDefinitionsByPatterns(patterns: string[], onlyActive: boolean = true) {

        if (SignalDefinitionsService.disableSignalBrowser) {
            return await SignalDefinitionsService.getDefinitions(patterns);
        }

        await SignalDefinitionsService.getAllDefinitions();

        var definitions: any[] = [];

        if (!patterns || patterns.length === 0) //pattern is empty. Sen all signals
            definitions = SignalDefinitionsService.signalInformationModels;

        for (let i = 0; i < patterns.length; i++) {
            var pattern = patterns[i];
            if (pattern.indexOf("*") === -1) { //There is not * in pattern. Pattern is singal name
                var definition = _.findWhere(SignalDefinitionsService.signalInformationModels, { AliasName: pattern });
                if (definition) {
                    definitions.push(definition);
                }

            } else { // There is * in pattern. 
                var regex = new RegExp("^" + pattern.split("*").join(".*") + "$");
                definitions = definitions.concat(_.filter(SignalDefinitionsService.signalInformationModels, model => model && model.signalName && regex.test(model.signalName)));
            };
        }
        if (onlyActive) {
            definitions = _.filter(definitions, (definition: SignalInformationModel) => definition.definition.Active);
        }

        return _.map(definitions, (definition: SignalInformationModel) => {
            definition.definition.Alias = definition.definition.AliasName;
            return definition.definition;
        });
    }

    private static triggerGetSignalDefinitionsCallForUnresolvedDefers = _.debounce(async () => {
        var unresolvedSignalNames: string[] = [];

        for (const signalName in SignalDefinitionsService.signalDefinitions) {
            if (!SignalDefinitionsService.signalDefinitions[signalName]()) {
                unresolvedSignalNames.push(signalName);
            }
        }

        if (unresolvedSignalNames.length) {
            const signalDefinitions = await SignalDefinitionsService.callGetDefinitions(unresolvedSignalNames);

            for (let index = 0; index < unresolvedSignalNames.length; index++) {
                const definition = signalDefinitions && signalDefinitions.length > index ? signalDefinitions[index] : null;
                const signalName = unresolvedSignalNames[index];

                const cachedDefinition = SignalDefinitionsService.getCachedDefinition(signalName);
                cachedDefinition(definition);
            }
        }
    }, window.debounceIntervalResolvingSignalDefinitions);

    private static async callGetDefinitions(signalNames: string[]): Promise<SignalDefinitionDTO[]> {
        const requestedModels = _.map(signalNames, signalName => SignalDefinitionsService.getOrCreateSignalDefinition(signalName));
        const unrequestedModels: SignalInformationModel[] = _.filter(requestedModels, model => model.state === States.Invalid || model.state === States.Unavailable);

        if (unrequestedModels.length) {
            await SignalDefinitionsService.loadSignalDefinitionsAsync(unrequestedModels);
        }

        return SignalDefinitionsService.returnSignalDefinitions(requestedModels);
    }

    private static returnSignalDefinitions(models: SignalInformationModel[]) {
        if (!models || !models.length) {
            const availableItems = _.where(SignalDefinitionsService.signalInformationModels, x => x.state === States.Available);
            return _.map(availableItems, x => x.definition);
        }

        return _.map(models, x => x.definition);
    }

    private static async loadSignalDefinitionsAsync(models: SignalInformationModel[]) {
        for (const model of models) {
            SignalDefinitionsService.updateDefinitionModelState(model, States.Queried);
        }

        const languageId = await SymbolicTexstService.initializeLanguageAsync();
        const requestedSignalNames = _.map(models, model => model.signalName);

        console.log("Loading Definitions for signals: [" + requestedSignalNames.join(",") + "]");

        var filter = new SignalDefinitionsFilter([], requestedSignalNames, null, SignalDefinitionResultsFilter.All);

        const securityToken = SessionService.getSecurityToken();
        let signalDefinitions: SignalDefinitionDTO[] = [];
        if (securityToken) {
            signalDefinitions = await Api.signalsService.getSignalDefinitionsByToken(securityToken, filter.toDto(), languageId, SignalDefinitionsService.startIndex, SignalDefinitionsService.count, SessionService.timeOut);
        } else {
            signalDefinitions = await Api.signalsService.getSignalDefinitions(SessionService.sessionId, SessionService.getClientId(), SessionService.currentLoggedInUser(), SessionService.currentLoggedInUserIsDomainUser(), filter.toDto(), languageId, SignalDefinitionsService.startIndex, SignalDefinitionsService.count, SessionService.timeOut);
        }

        const difference = _.difference(requestedSignalNames, signalDefinitions.map(x => x.AliasName));
        SignalDefinitionsService.updateDefinitions(signalDefinitions, languageId);
        SignalDefinitionsService.updateUnavailableDefinitions(difference.map(x => { return { AliasName: x } as SignalDefinitionDTO }), languageId);

        return signalDefinitions;
    }

    private static getOrCreateSignalDefinition(signalName: string): SignalInformationModel {
        var model = _.find(SignalDefinitionsService.signalInformationModels, model => model.signalName === signalName);
        if (model) {
            return model;
        }

        model = new SignalInformationModel();
        model.signalName = signalName;
        model.languageId = -1;
        model.state = States.Unavailable;
        model.definition = null;
        SignalDefinitionsService.signalInformationModels.push(model);
        return model;
    }

    private static updateDefinitions(signalDefinitions: SignalDefinitionDTO[], languageId: number): SignalDefinitionDTO[] {
        for (const signalDefinition of signalDefinitions) {
            var model = SignalDefinitionsService.getOrCreateSignalDefinition(signalDefinition.AliasName);
            model.definition = SignalDefinitionsService.updateSignalDefinitionProperties(signalDefinition);
            model.languageId = languageId;
            SignalDefinitionsService.updateDefinitionModelState(model, States.Available);
        }

        return signalDefinitions;
    }

    private static updateUnavailableDefinitions(signalDefinitions: SignalDefinitionDTO[], languageId: number): SignalDefinitionDTO[] {
        for (const signalDefinition of signalDefinitions) {
            var model = SignalDefinitionsService.getOrCreateSignalDefinition(signalDefinition.AliasName);
            model.definition = SignalDefinitionsService.updateSignalDefinitionProperties(signalDefinition);
            model.languageId = languageId;
            SignalDefinitionsService.updateDefinitionModelState(model, States.Unavailable);
        }

        return signalDefinitions;
    }

    private static updateSignalDefinitionProperties(signalDefinition: SignalDefinitionDTO): SignalDefinitionDTO {
        signalDefinition.Alias = signalDefinition.AliasName;

        //should be removed if the fix for the webservices to get the signal Definition is running
        if (!signalDefinition.Description) {
            signalDefinition.Description = signalDefinition.DescriptionSymbolicText;
        }

        return signalDefinition;
    }

    private static updateDefinitionState(signalName: string, state: States) {
        var model = SignalDefinitionsService.getOrCreateSignalDefinition(signalName);
        SignalDefinitionsService.updateDefinitionModelState(model, state);
    }

    private static updateDefinitionModelState(model: any, state: States): any {
        //console.log("Changed state of '" + model.signalName + "' from: " + model.state + " to " + state);
        model.state = state;
    }
}

export = SignalDefinitionsService;