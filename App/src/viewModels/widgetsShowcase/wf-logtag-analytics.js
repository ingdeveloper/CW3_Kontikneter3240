define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfLogTagAnalytics";
            self.widgetCategory = "Historische Daten";

            self.widgetProperties =
            [
                {
                    type: 'Array',
                    name: 'logTags',
                    defaultValue: '[]',
                    description: 'Konfiguration für die LogTags welche angezeigt werden sollen. Jedes Item in diesem Array muss durch ein Objekt mit folgenden Eigenschaften definiert sein: signalName, logTagName. Beispiel { signalName: \'Level 1\', logTagName: \'LogTagLevel1\' }.',
                    descriptionEN: 'Configuration for log tags which should be shown. Each item in this array should be an object defined by the properties: signalName, logTagName. Example { signalName: \'Level 1\', logTagName: \'LogTagLevel1\' }.'
                },
                {
                    name: 'objectID',
                    type: 'String',
                    defaultValue: '',
                    description: 'Optionale Hilfs-Eigenschaft. Der Wert von objectID kann über eine Platzhalter [OID] in anderen Eigenschaften innerhalb dieser Komponente platziert werden. Beispiel im Signalnamen: "Setpoint [OID]".',
                    descriptionEN: 'Optional helper property. The value of the objectID can be placed over a placeholder [OID] inside other properties of this component. Example Signal Name: "Setpoint [OID]".'
                },
                {
                    type: 'Boolean',
                    name: 'isModalDialogsDraggable',
                    defaultValue: 'true',
                    description: 'Definiert ob die modalen Dialoge ziehbar sind.',
                    descriptionEN: 'Defines whether the modal dialogs are draggable.'
                },
                {
                    type: 'String',
                    name: 'title',
                    defaultValue: '',
                    description: 'Text in der Kopfzeile',
                    descriptionEN: 'Header text'
                },
                {
                    type: 'Boolean',
                    name: 'showMaxValue',
                    defaultValue: 'true',
                    description: 'Definiert ob die maximal Wert für die Datenreihen angezeigt wird.',
                    descriptionEN: 'Defines if the max value for the dataset should be shown.'
                },
                {
                    type: 'Boolean',
                    name: 'showMaxDate',
                    defaultValue: 'true',
                    description: 'Definiert ob das Datum der maximalen Wert für die Datenreihen angezeigt wird.',
                    descriptionEN: 'Defines if the datetime of max value for the dataset should be shown.'
                },
                {
                    type: 'String',
                    name: 'showMaxLabel',
                    defaultValue: 'true',
                    description: 'Definiert ob das Label für die maximal Wert angezeigt wird.',
                    descriptionEN: 'Defines if the label for max value should be shown.'
                },
                {
                    type: 'String',
                    name: 'maxLabelText',
                    defaultValue: 'Maximum',
                    description: 'Definiert den Text vom Label für die maximal Wert.',
                    descriptionEN: 'Defines the text of the label for max value.'
                },
                {
                    type: 'Boolean',
                    name: 'showMinValue',
                    defaultValue: 'true',
                    description: 'Definiert ob die minimal Wert für die Datenreihen angezeigt wird.',
                    descriptionEN: 'Defines if the min value for the dataset should be shown.'
                },
                {
                    type: 'Boolean',
                    name: 'showMinDate',
                    defaultValue: 'true',
                    description: 'Definiert ob das Datum der minimal Wert für die Datenreihen angezeigt wird.',
                    descriptionEN: 'Defines if the datetime of min value for the dataset should be shown.'
                },
                {
                    type: 'String',
                    name: 'showMinLabel',
                    defaultValue: 'true',
                    description: 'Definiert ob das Label für die minimal Wert angezeigt wird.',
                    descriptionEN: 'Defines if the label for min value should be shown.'
                },
                {
                    type: 'String',
                    name: 'minLabelText',
                    defaultValue: 'Minimum',
                    description: 'Definiert den Text vom Label für die minimal Wert.',
                    descriptionEN: 'Defines the text of the label for min value.'
                },
                {
                    type: 'Boolean',
                    name: 'showAvg',
                    defaultValue: 'true',
                    description: 'Definiert ob die durchschnittlichen Wert für die Datenreihen angezeigt wird.',
                    descriptionEN: 'Defines if the avg value for the dataset should be shown.'
                },
                {
                    type: 'Boolean',
                    name: 'showAvgLabel',
                    defaultValue: 'true',
                    description: 'Definiert ob das Label für die durchschnittlichen Wert angezeigt wird.',
                    descriptionEN: 'Defines if the label for avg value should be shown.'
                },
                {
                    type: 'String',
                    name: 'avgLabelText',
                    defaultValue: 'Average',
                    description: 'Definiert den Text vom Label für die durchschnittlichen Wert.',
                    descriptionEN: 'Defines the text of the label for avg value.'
                },
                {
                    type: 'Boolean',
                    name: 'getLatestLogdata',
                    defaultValue: 'true',
                    description: 'Wenn diese Eigenschaft aktiv ist, werden beim Aktualisieren stets die letzten Log-Daten (maxResults) aus der Datenbank abgerufen.',
                    descriptionEN: 'When this property is active, then the endDate will be set to "now."'
                },
                {
                    type: 'Boolean',
                    name: 'autoUpdate',
                    defaultValue: 'false',
                    description: 'Wenn diese Eigenschaft mit dem Wert true gesetzt ist, wird das Anzeigeelement automatisch zyklisch aktualisiert. Bei der Aktualisierung des Anzeigeelements wird die Eigenschaften endDate auf den aktuellen Zeitpunkt gesetzt, während die Eigenschaften startDate durch die Eigenschaften startOffset and startOffsetInterval deklariert werden.',
                    descriptionEN: 'When this property is active, then the component will auto update the data. The refresh will be done with the endDate now and the startDate determined by the startOffset and startOffsetInterva.l'
                },
                {
                    type: 'Number',
                    name: 'updateRate',
                    defaultValue: '2000',
                    description: 'Das Aktualisierungsgeschwindigkeit des Anzeigeelements in Millisekunden. Diese Eigenschaft wird nur berücksichtigt, wenn die Eigenschaft autoUpdate auf den Wert true gesetzt ist. Minimumwert ist ',
                    descriptionEN: 'The update rate in milliseconds. This property will be taken into consideration only if the autoUpdate is true.'
                },
                {
                    type: 'String',
                    name: 'startOffset',
                    defaultValue: 'days',
                    description: 'Mögliche Vorgaben: seconds, minutes, days, weeks, months, years',
                    descriptionEN: 'Possible targets: seconds, minutes, days, weeks, months, years'
                },
                {
                    type: 'Number',
                    name: 'startOffsetIntervall',
                    defaultValue: '1', description: 'Nummerischer Wert für die startOffset-Eigenschaft.',
                    descriptionEN: 'Numeric value for the start offset property'
                },
                {
                    type: 'String',
                    name: 'endOffset',
                    defaultValue: 'minutes',
                    description: 'Mögliche Vorgaben: seconds, minutes, days, weeks, months, years.',
                    descriptionEN: 'Possible targets: seconds, minutes, days, weeks, months, years.'
                },
                {
                    type: 'Number',
                    name: 'endOffsetIntervall',
                    defaultValue: '0',
                    description: 'Nummerischer Wert für die endOffset-Eigenschaft.',
                    descriptionEN: 'Numeric value for the start end offset property.'
                },
                {
                    type: 'String',
                    name: 'format',
                    defaultValue: '0,0.[00]',
                    description: 'Format für die numerische Werte. Weitere Formate sind auf der Dokumentationsseite von Numeral.js zu finden: http://adamwdraper.github.io/Numeral-js/',
                    descriptionEN: 'Format for the numeric display. Other formats are available on the documentation page of Numeral.js that you can find: http://adamwdraper.github.io/Numeral-js/'
                },
                {
                    type: 'String',
                    name: 'dateTimeFormat',
                    defaultValue: 'DD.MM.YYYY HH:mm:ss',
                    description: 'Definiert das optionale Datums- und Uhrzeitformat für die angezeigten Zeitstempel, zum Beispiel DD.MM.YYYY hh:mm:ss. Verfügbare Ausdrücke sind z.B. hh, mm, ss, SSS, YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Weiterführende Informationen unter https://momentjs.com/docs/, Im Bereich "Year, month, and day tokens".',
                    descriptionEN: 'Specifies optional date and time format for shown timestaps - e.g. DD.MM.YYYY hh:mm:ss. Available tokens are - hh, mm, ss, SSS, YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Further information are available under https://momentjs.com/docs/, chapter Year, month, and day tokens.'
                },
                {
                    type: 'Boolean',
                    name: 'showHeaderForDataset',
                    defaultValue: 'true',
                    description: 'Definiert ob die Kopfzeile des Datenreihepanel angezeigt wird',
                    descriptionEN: 'Defines whether the header of datasets panel is displayed'
                },
                {
                    type: "Boolean",
                    name: "settingsButtonVisibility",
                    defaultValue: "true",
                    description: "Definiert ob der Button für den Dialog mit der Auswahl des Zeitbereich angezeigt wird.",
                    descriptionEN: "'Defines if the button for the dialog with time range selection should be shown."
                },
                {
                    type: 'Boolean', name: 'configurationButtonVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob der Button für den Konfigurations-Manager angezeigt wird.',
                    descriptionEN: 'Defines if the button for the configuration manager should be shown.'
                },
                {
                    type: 'Boolean',
                    name: 'headerVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob die Kopfzeile des Widget/Component angezeigt wird.',
                    descriptionEN: 'Defines whether the header of widget/component is displayed.'
                },
                {
                    type: 'String',
                    name: 'panelBarCssClass',
                    defaultValue: 'panel panel-default',
                    description: 'CSS Klasse für die Kopfleiste.',
                    descriptionEN: 'CSS class for the header toolbar.'
                },
                {
                    type: 'String',
                    name: 'datasetItemCssClass ',
                    defaultValue: 'panel panel-primary',
                    description: 'CSS Klasse für die Datenreihen.',
                    descriptionEN: 'CSS class for the dataset item.'
                },
                {
                    type: 'String',
                    name: 'datasetItemHeaderCssClass ',
                    defaultValue: 'panel-heading',
                    description: 'CSS Klasse für die Kopfleiste der Datenreihen.',
                    descriptionEN: 'CSS class for the header toolbar of dataset item.'
                },

                {
                    type: 'String',
                    name: 'buttonBarCssClass ',
                    defaultValue: 'btn btn-default',
                    description: 'CSS Klasse für die Button Leiste',
                    descriptionEN: 'CSS class for the Button bar'
                },
                {
                    type: 'String',
                    name: 'configurationButtonIconClass ',
                    defaultValue: 'wf wf-cog',
                    description: 'CSS Klasse für das Icon des Konfigurationsbutton',
                    descriptionEN: 'CSS Class for configuration button'
                },
                {
                    type: "String",
                    name: "projectAuthorization",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Widgets mindestens erforderlich ist. Falls die Eigenschaft nicht gesetzt wird, wird das Widget standardmäßig angezeigt.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the widget. The widget will be shown by default, if this property is not set.'
                },
                {
                    name: 'systemAuthorization',
                    type: 'String',
                    defaultValue: '',
                    description:
                        'Systemberechtigung des Benutzers, welche für die Anzeige des Widgets mindestens erforderlich ist.',
                    descriptionEN: 'Systemauthorization of the user, which are required for showing the widget.'
                },
                {
                    type: "String", name: "initialConfiguration", defaultValue: "",
                    description: 'Der Name einer Konfiguration, welche automatisch initial geladen wird.',
                    descriptionEN: 'The name of the configuration to be loaded by default.'
                },
                {
                    type: "String", name: "configurationNamespace", defaultValue: "",
                    description: 'Der Namensraum für die Konfiguration.',
                    descriptionEN: 'The namespace for the configuration.'
                },
                {
                    type: "Boolean",
                    name: "showOnlyOwnConfigurations",
                    defaultValue: "false",
                    description: 'Definiert ob nur eigene Konfigurationen angezeigt wird.',
                    descriptionEN: 'Defines whether only own configurations are displayed.'
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


