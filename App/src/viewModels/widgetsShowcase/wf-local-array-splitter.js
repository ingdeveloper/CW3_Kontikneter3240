define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();

            self.widgetName = "wf-local-array-splitter";
            self.widgetCategory = "Utility";

            self.widgetProperties =
                [
                    {
                        name: 'inputSignalName',
                        type: 'String',
                        defaultValue: '',
                        description: 'Das Eingangssignal, das Array-Werte enthält',
                        descriptionEN: 'The input signal that contains array values'
                    },
                    {
                        name: 'inputArrayType',
                        type: 'Native|String',
                        defaultValue: 'Native',
                        description: 'Der Typ der Array-Werte, die das Signal enthält. Wenn es nativ ist, berücksichtigt die Komponente den Signalwert als ein tatsächliches Array. Wenn sie auf string gesetzt ist, analysiert die Komponente den String-Signalwert und versucht, die Array-Werte daraus zu extrahieren. Um es zu Parsen, müssen die folgenden Optionen festgelegt werden.',
                        descriptionEN: 'The type of array values that the signal contains. If native, the component espects the signal value to be an actual array. If set to string, the component will parse the string signal value and will try to extract the array values out of it. For parsing it, the following options must be set.'
                    },
                    {
                        name: 'inputArrayLeftDelimiter',
                        type: 'String',
                        defaultValue: '[',
                        description: 'Das linke Array-Trennzeichen, das zum Parsen von String-Arrays verwendet wird',
                        descriptionEN: 'The left array delimiter used for parsing String arrays',
                    },
                    {
                        name: 'inputArrayRightDelimiter',
                        type: 'String',
                        defaultValue: ']',
                        description: 'Das richtige Array-Trennzeichen zum Parsen von String-Arrays',
                        descriptionEN: 'The right array delimiter used for parsing String arrays',
                    },
                    {
                        name: 'inputArrayElementSeparator',
                        type: 'String',
                        defaultValue: ',',
                        description: 'Das Trennzeichen, das zwischen String-Array-Elementen verwendet wird',
                        descriptionEN: 'The separator used between String array elements',
                    },
                    {
                        name: 'inputArrayElementQuote',
                        type: 'String',
                        defaultValue: '"',
                        description: 'Das Anführungszeichen, das um String-Array-Elemente verwendet wird',
                        descriptionEN: 'The quote character used around String array elements'
                    },
                    {
                        name: 'inputArrayStripWhitespace',
                        type: 'Boolean',
                        defaultValue: 'true',
                        description: 'Wenn der Wert der Eigenschaft auf "true" gesetzt ist, entfernt der Parser alle Leerzeichen zwischen Array-Elementen und am Anfang und Ende des Arrays. Wenn der Wert "false" ist, wird keine solche Entfernung durchgeführt. Keine Entfernung wird innerhalb der Anführungszeichen des Elements ausgeführt, wenn sie definiert sind, unabhängig vom Wert dieser Eigenschaft.',
                        descriptionEN: 'If set to true, the parser will strip any whitespace between array elements and at the beginning and end of array. If false, no stripping will be done. No stripping will be done inside the element quotes if they are defined, regardless of the value of this property.',
                    },
                    {
                        name: 'arrayValueType',
                        type: 'Decimal|Integer|String|Boolean',
                        defaultValue: 'Decimal',
                        description: 'Der Typ der Werte, die das Array enthält. Wenn mehrere Wertetypen im Array sein können, sollte es auf "String" gesetzt werden. Dies wird zum Parsen der Werte und zum Bereitstellen einer nativen Repräsentation in den lokalen Signalen sowie zum Formatieren derselben beim Schreiben in die Ausgabe verwendet.',
                        descriptionEN: 'The type of values that the array contains. If multiple value types can be in the array, then it should be set to "String". This is used for parsing the values and providing a native representation in the local signals, as well as for formatting them when writing to the output.',
                    },
                    {
                        name: 'arrayMaxSize',
                        type: 'Number (positive)',
                        defaultValue: '',
                        description: 'Wenn die Eigenschaft definiert ist, wird die Anzahl der Signale für jedes Array-Element begrenzt. Wenn nicht gesetzt, werden Signale hinzugefügt, wenn die Array-Werte gelesen werden und das Array an Größe zunimmt. Sobald Signale zugewiesen sind, werden sie nicht freigegeben, bis die gesamte Komponente freigegeben ist. Es wird empfohlen, diesen Wert nach Möglichkeit einzustellen, da sonst eine große Anzahl von Signalen erzeugt werden kann, wenn der Eingangssignalwert eine große Anzahl von Elementen enthält.',
                        descriptionEN: 'If set, it will limit the number of signals for each array element. If not set, it will add signals as the array values are read and the array grows in size. Once signals are allocated, they will not be released unless the entire component is released. It is recommended to set this value if possible, otherwise large numbers of signals can be created if the input signal value contains a large number of items.',
                    },
                    {
                        name: 'arrayMinSize',
                        type: 'Number (positive)',
                        defaultValue: '',
                        description: 'Wenn die Eigenschaft definiert ist, wird das Array gezwungen, eine Mindestgröße zu haben. Dies ist nützlich für die Vorerstellung lokaler Signale und wird auch verwendet, wenn der Wert zum Generieren des Arrays zurückgeschrieben wird.',
                        descriptionEN: 'If set, it will force the array to have a minimum size. This is useful for pre-creating local signals and it is also used when writing back the value to generate the array.',
                    },
                    {
                        name: 'arrayNameTemplate',
                        type: 'String',
                        defaultValue: '{InputSignalName}{Index}',
                        description: 'Das namens Template, das zum Erstellen der lokalen Signale verwendet wird. Die lokalen Signale haben automatisch das Präfix "local: //" und sollten nicht als Signalname im Template verwendet werden. Zwei Platzhalter können in dem Template verwendet werden:<ul>' +
                        '<li>{InputSignalName} – der Name des als Eingabe angegebenen Signals</li>' +
                        '<li>{Index} – der Index des Wertes im Array (1-basiert)</li></ul>',
                        descriptionEN: 'The name template used for creating the local signals. The local signals will automatically have the ‘local://’ prefix and it should not be specified in the template. Two placeholders can be used in the name template:<ul>' +
                        '<li>{InputSignalName} – the name of the signal specified as input</li>' +
                        '<li>{Index} – the index of the value in the array (1-based)</li></ul>',
                    },
                    {
                        name: 'outputSignalName',
                        type: 'String',
                        defaultValue: '',
                        description: 'Der Signalname, in das der Ausgabewert geschrieben wird. Wenn es leer bleibt, wird keine Schreiboperation durchgeführt.',
                        descriptionEN: 'The name of the signal to which the output will be written. If left empty, no writing will occur.',
                    },
                    {
                        name: 'outputArrayType',
                        type: 'Native|String',
                        defaultValue: 'Native',
                        description: 'Beschreibt, wie das Ausgabearray beschrieben wird:<ul>' +
                        '<li>Native – verwendet ein Array als Wert</li>' +
                        '<li>String – Array als String formatieren</li></ul>',
                        descriptionEN: 'Describes how the output array will be written:<ul>' +
                        '<li>Native – use array as value</li>' +
                        '<li>String – format array as string</li></ul>',
                    },
                    {
                        name: 'outputArrayLeftDelimiter',
                        type: 'String',
                        defaultValue: '[',
                        description: 'Das linke Array-Trennzeichen, das zum Schreiben von String-Arrays verwendet wird',
                        descriptionEN: 'The left array delimiter used for writing String arrays',
                    },
                    {
                        name: 'outputArrayRightDelimiter',
                        type: 'String',
                        defaultValue: ']',
                        description: 'Das rechte Array-Trennzeichen, das zum Schreiben von String-Arrays verwendet wird',
                        descriptionEN: 'The right array delimiter used for writing String arrays',
                    },
                    {
                        name: 'outputArrayElementSeparator',
                        type: 'String',
                        defaultValue: ',',
                        description: 'Das Trennzeichen, das zwischen String-Array-Elementen verwendet wird',
                        descriptionEN: 'The separator used between String array elements',
                    },
                    {
                        name: 'outputArrayElementQuote',
                        type: 'String',
                        defaultValue: '"',
                        description: 'Das Anführungszeichen, das in String-Array-Elementen verwendet wird',
                        descriptionEN: 'The quote character used around String array elements'
                    },
                    {
                        name: 'outputKeepNulls',
                        type: 'Boolean',
                        defaultValue: 'true',
                        description: 'Wenn der Wert der Eigenschaft auf "true" gesetzt ist, werden Nullwerte in das Array geschrieben, andernfalls werden nur Werte ungleich null geschrieben.',
                        descriptionEN: 'If set to true, null values will be written to the array, otherwise only non-null values will be written.'
                    },
                    {
                        name: 'undefinedValueHandling',
                        type: 'UseNull|UseDefaultValue',
                        defaultValue: 'UseNull',
                        description: '<ul><li>UseNull - Signalwerte ohne definierten Wert werden beim Schreiben in die Ausgabe als Null Werte behandelt</li>' +
                        '<li>UseDefaultValue – Signalwerte ohne definierten Wert werden durch DefaultValue ersetzt</li></ul>',
                        descriptionEN: '<ul><li>UseNull - signal values without a defined value will be treated as nulls when written to the output</li>' +
                        '<li>UseDefaultValue – signal values without a defined value will be replaced with the DefaultValue</li></ul>',
                    },
                    {
                        name: 'undefinedDefaultValue',
                        type: 'any',
                        defaultValue: '',
                        description: 'Standardwert, wenn UndefinedValueHanding auf UseDefaultValue gesetzt ist. Der Standardwert wird gemäß dem Wert der ArrayValueType-Eigenschaft geparst/formatiert',
                        descriptionEN: 'Default value used when UndefinedValueHanding is set to UseDefaultValue. The default value is parsed/formatted according to the value of the ArrayValueType property',
                    },
                    {
                        name: 'outputWriteBufferingMode',
                        type: 'None|Debounced|Sampled|Throttle|WaitAll|Triggered',
                        defaultValue: 'None',
                        description: 'Beschreibt, wie das Schreiben auf das Ausgangssignal erfolgt:<ul>' +
                        '<li>None – Sobald ein neuer Wert in eines der lokalen Signale geschrieben wird, wird das gesamte Array in den Ausgang geschrieben</li>' +
                        '<li>Debounced – Nachdem die OutputWriteBufferingInterval Zeit von der letzten Änderung an einem der lokalen Signale abgelaufen ist, wird der Wert geschrieben</li>' +
                        '<li>Sampled – Jede OutputWriteBufferingInterval Millisekunden, wird der Wert geschrieben, unabhängig, ob sich die Werte geändert haben oder nicht</li>' +
                        '<li>Throttle – Nach der ersten Änderung wird der Wert nach einem Maximum von OutputWriteBufferingInterval Millisekunden geschrieben. Es stoppt, sobald keine Änderungen mehr stattfinden und das Intervall verstrichen ist.</li>' +
                        '<li>WaitAll – wartet, bis alle lokalen Signale, die Array-Elementen entsprechen, in die Ausgabe geschrieben wurden, erst dann wird das Ausgabesignal beschrieben.</li>' +
                        '<li>Triggered – wartet, bis das Signal mit dem OutputWriteTriggerSignalName seinen Wert ändert</li></ul>',
                        descriptionEN: 'Describes how the writing to the output signal is done:<ul>' +
                        '<li>None – as soon as a new value is written into one of the local signals, the whole array will be written to the output</li>' +
                        '<li>Debounced – after the OutputWriteBufferingInterval time elapses from the last change to any of the local signals, the value is written</li>' +
                        '<li>Sampled – every OutputWriteBufferingInterval milliseconds, the value will be written, independent if the values have changed or not</li>' +
                        '<li>Throttle – after the first change it will write the value after a maximum of OutputWriteBufferingInterval milliseconds. It will stop as soon as there are no more changes and the interval elapses.</li>' +
                        '<li>WaitAll – waits until all local signals corresponding to array elements are written to and then writes the output.</li>' +
                        '<li>Triggered – waits until the signal with the OutputWriteTriggerSignalName changes its value</li></ul>',
                    },
                    {
                        name: 'outputWriteBufferingInterval',
                        type: 'Number',
                        defaultValue: '500',
                        description: 'Standardwert der verwendet wird, wenn UndefinedValueHanding auf UseDefaultValue gesetzt ist. Der Standardwert wird gemäß dem Wert der ArrayValueType-Eigenschaft geparst/formatiert',
                        descriptionEN: 'Default value used when UndefinedValueHanding is set to UseDefaultValue. The default value is parsed/formatted according to the value of the ArrayValueType property',
                    },
                    {
                        name: 'outputWriteTriggerSignalName',
                        type: 'String',
                        defaultValue: '',
                        description: 'Wenn die Eigenschaft gesetzt ist und der OutputWriteBufferingMode auf Triggered gesetzt ist, wird jedes Mal ein Schreibvorgang ausgelöst, wenn sich der Wert ändert.',
                        descriptionEN: 'If set and the OutputWriteBufferingMode is set to Triggered, it will trigger a write every time it’s value changes.',
                    },
                    {
                        name: 'writeOnRead',
                        type: 'Boolean',
                        defaultValue: 'false',
                        description: 'Wenn der Wert der Eigenschaft auf "true" gesetzt ist, wird bei jeder Änderung des Eingabewerts die gesamte Pipeline durchlaufen und in die Ausgabe geschrieben. <br/>' +
                        'Wenn der Wert der Eigenschaft auf "false" gesetzt ist, wird nur in das Ausgangssignal geschrieben, wenn ein neuer Wert in eines der lokalen Signale geschrieben wird (unter Berücksichtigung des OutputWriteBufferingMode).',
                        descriptionEN: 'If set to true, then every time the input value changes, it will go through the entire pipeline and write to the output. <br/>' +
                        'If set to false, then it will only write to the output when a new value is written to any of the local signals (taking into consideration the OutputWriteBufferingMode).',
                    },
                    {
                        name: 'objectID',
                        type: 'String',
                        defaultValue: '',
                        description: 'Optionale Hilfs-Eigenschaft. Der Wert von objectID kann über eine Platzhalter [OID] in anderen Eigenschaften innerhalb dieser Komponente platziert werden. Beispiel im Signalnamen: "Setpoint [OID]".',
                        descriptionEN: 'Optional helper property. The value of the objectID can be placed over a placeholder [OID] inside other properties of this component. Example Signal Name: "Setpoint [OID]".'
                    }
                ];

        };

        ctor.prototype.activate = function () {
            var self = this;
            var connector = self.connector = new signalsConnector();
            switch (connector.currentLanguageId()) {
                case -1:
                    self.selectedLanguageId(7); // Fall back to german language ID if no language ID available
                    break;
                default:
                    self.selectedLanguageId = connector.currentLanguageId;
                    break;
            }

        };

        ctor.prototype.attached = function () {
            var self = this;
            prettyPrint();
        };


        return ctor;
    });


