import SignalsService = require("./signalsService");

class SignalsBufferService {
    private static signalsToWrite = ko.observable<SignalValue>({});

    public static bufferIsEmpty = ko.computed(() => {
        return Object.keys(SignalsBufferService.signalsToWrite()).length === 0;
    });

    public static writeSignalsToBuffer(signalValues: SignalValue) {
        for (const signalName of Object.keys(signalValues)) {
            const signalsToWrite = SignalsBufferService.signalsToWrite();
            signalsToWrite[signalName] = signalValues[signalName];
            SignalsBufferService.signalsToWrite(signalsToWrite);
        }
    }

    public static async writeSignalsFromBuffer() {
        const result = await SignalsService.writeSignals(SignalsBufferService.signalsToWrite());
        if (result !== undefined) {
            SignalsBufferService.signalsToWrite({});
            return result;
        }
        else return false;
    }

    public static async writeSignalsFromBufferSecure(userPassword: string) {
        const result = await SignalsService.writeSignalsSecure(userPassword, SignalsBufferService.signalsToWrite());
        if (result !== undefined) {
            SignalsBufferService.signalsToWrite({});
            return true;
        }
        else return false;
    }

    public static existSignalInBuffer(signalName: string) {
        return _.contains(Object.keys(SignalsBufferService.signalsToWrite()), signalName);
    }

    public static existSignalsInBuffer(signalName: string[]) {
        return _.intersection(Object.keys(SignalsBufferService.signalsToWrite()), signalName).length > 0;
    }

    public static clearSignalBuffer() {
        SignalsBufferService.signalsToWrite({});
    }

    public static getSignalsFromBuffer() {
        return _.map(SignalsBufferService.signalsToWrite(), (value: any, key: any) => {
            return <KeyValuePair<string, any>>{
                key: key,
                value: value
            };
        });
    }

    public static readSignals(signalNames: string[]) {

        var result = [];

        for (var i = 0; i < signalNames.length; i++)
            if (this.existSignalInBuffer(signalNames[i]))
                result.push(SignalsBufferService.signalsToWrite()[signalNames[i]]);

        return result;
    }
    //!!! Neu "clearSignalFromBuffer" am 29.08.2017 von amueller@coppenrath-wiese.de
    public static clearSignalsFromBuffer(signalNames: string[]) {

        var result = [];

        //console.log("%c-----------", "background:yellow");
        //console.log(SignalsBufferService.signalsToWrite());

        var buff;
        buff = SignalsBufferService.signalsToWrite();  //Inhalt speichern

        //durchsuchen des Array's, wenn Variable vorhanden, dann löschen
        for (var i = 0; i < signalNames.length; i++)
            if (this.existSignalInBuffer(signalNames[i]))
                delete buff[signalNames[i]];  //löschen eines Eintrages

        //console.log(buff);
        SignalsBufferService.signalsToWrite(buff);  //geändertes Array wieder in Buffer schreiben

        return result;
    }


}

export = SignalsBufferService;