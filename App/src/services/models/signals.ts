import SignalValueData = require("./_signal-value-data");

class Signals {
    public readonly localSignals: SignalValueData[] = [];
    public readonly remoteSignals: SignalValueData[] = [];

    /**
     * Creates a {Signals} object given a dictionary of signalName=>value entries.
     * @param {SignalValue} signals The signal value dictionary
     * @returns {Signals} A signals object which splits the inputs into local and remote signals.
     */
    public static fromSignalValues(signals: SignalValue) {
        const result = new Signals();

        for (const key of Object.keys(signals)) {
            if (Signals.isLocalSignal(key)) {
                result.localSignals.push({
                    name: key,
                    value: signals[key]
                });
            } else {
                result.remoteSignals.push({
                    name: key,
                    value: signals[key]
                });
            }
        }

        return result;
    }

    /**
     * Creates a new Signals object from a list of signal names.
     * @param {string[]} signalNames The signal names
     * @returns {Signals} A signals object which splits the inputs into local and remote signals.
     */
    public static fromSignalNames(signalNames: string[]) {
        const result = new Signals();

        for (const name of signalNames) {
            if (Signals.isLocalSignal(name)) {
                result.localSignals.push({
                    name: name
                });
            } else {
                result.remoteSignals.push({
                    name: name
                });
            }
        }
        return result;
    }

    /**
     * Creates a {SignalValueDTO} result from a {Signals} structure in the order defined by {signalNames}
     * @param signalNames The signal names. Results will be returned exactly in this order.
     * @param {Signals} signals The {Signals] object containing the values and the results.
     * @returns {SignalValueDTO[]} An array of {SignalValueDTO} objects containing the values.
     */
    public static toSignalValueDTOs(signalNames, signals: Signals): SignalValueDTO[]{
        let signalMap = this.addToSignalMap(signals.localSignals, {});
        signalMap = this.addToSignalMap(signals.remoteSignals, signalMap);

        return signalNames.map(x=> ({
            Result: signalMap[x].result,
            Value: signalMap[x].value
        }));
    }

    private static addToSignalMap(signals: SignalValueData[], signalMap: { [key: string]: SignalValueData }) {
        return signals.reduce((result, current) => {
            result[current.name] = current;
            return result;
        }, signalMap);
    }

    /**
     * Checks whether a signal name represents a local or a remote signal.
     * @param {string} signalName The name of the signal to be checked
     * @returns {boolean} True if the signal is local.
     */
    public static isLocalSignal(signalName: string) {
        return signalName.indexOf("local://") === 0;
    }
}

export = Signals;