define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfHistoricalDataChart";
            self.widgetCategory = "Historische Daten";

            self.widgetProperties =
                [{
                    name: 'objectID',
                    type: 'String',
                    defaultValue: '',
                    description: 'Optionale Hilfs-Eigenschaft. Der Wert von objectID kann über eine Platzhalter [OID] in anderen Eigenschaften innerhalb dieser Komponente platziert werden. Beispiel im Signalnamen: "Setpoint [OID]".',
                    descriptionEN: 'Optional helper property. The value of the objectID can be placed over a placeholder [OID] inside other properties of this component. Example Signal Name: "Setpoint [OID]".'
                },
                {
                    type: 'String',
                    name: 'groupName',
                    defaultValue: '',
                    description: 'Definiert einen Namensraum für den Serien Provider.',
                    descriptionEN: 'Defines a namespace for the serial provider.'
                },
                {
                    type: 'String',
                    name: 'controlName',
                    defaultValue: '',
                    description: 'Definiert einen Namensraum für den Chart Serien Provider. Die Eigenschaft ist optional.',
                    descriptionEN: 'Defines a namespace for the serial chart provider. This property is optional.'
                },
                {
                    type: 'Number',
                    name: 'height',
                    defaultValue: '300',
                    description: 'Höhe des Widgets in Pixel',
                    descriptionEN: 'Widget height in Pixels'
                },
                {
                    name: 'count',
                    type: 'Number',
                    defaultValue: '2147483647',
                    description: 'Maximale Anzahl der Einträge.',
                    descriptionEN: 'Maximum number of entries.'
                },
                {
                    name: 'timeSeriesMode',
                    type: 'TimeSeriesMode',
                    defaultValue: 'TimeSeriesMode.Offline',
                    description: 'Definiert den Modus, Online oder Offline. Im Onlinemodus werden die daten Zyklisch aktualisiert, im Offlinemodus kann der Bnutzer die Daten mit einem refresh Button aktualisieren.',
                    descriptionEN: 'Defines the mode, online or offline. In online mode the data is updated cyclically, in offline mode the user can update the data with a refresh button.'
                },
                {
                    type: 'String',
                    name: 'startOffset',
                    defaultValue: 'minutes',
                    description: 'Mögliche Vorgaben: seconds, minutes, hours, days, weeks, months, years.',
                    descriptionEN: 'Possible targets: seconds, minutes, hours, days, weeks, months, years.'
                },
                {
                    type: 'Number',
                    name: 'startOffsetIntervall',
                    defaultValue: '15',
                    description: 'Nummerischer Wert für die startOffset-Eigenschaft.',
                    descriptionEN: 'Numeric value for the start offset property.'
                },
                {
                    type: 'String',
                    name: 'endOffset',
                    defaultValue: 'minutes',
                    description: 'Mögliche Vorgaben: seconds, minutes, hours, days, weeks, months, years.',
                    descriptionEN: 'Possible targets: seconds, minutes, hours, days, weeks, months, years.'
                },
                {
                    type: 'Number',
                    name: 'endOffsetIntervall',
                    defaultValue: '0',
                    description: 'Nummerischer Wert für die endOffset-Eigenschaft.',
                    descriptionEN: 'Numeric value for the start end offset property.'
                },
                {
                    name: 'showLegend',
                    type: 'Boolean',
                    defaultValue: 'true',
                    description: 'Definiert ob die Legende angezeigt wird.',
                    descriptionEN: 'Defines whether or not the legend is displayed.'
                },
                {
                    name: 'showLegendValues',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Definiert ob die Legende den aktuellen Wert des Cursors anzeigen soll.',
                    descriptionEN: 'Defines whether the legend should show the current value of the cursor.'
                },
                {
                    name: 'legendPosition',
                    type: 'left | right | top | bottom',
                    defaultValue: 'bottom',
                    description: 'Definiert wo die Legende angezeicht wird. Zulässig sind "left", "right", "top", "bottom"',
                    descriptionEN: 'Defines where the legend is displayed. Valid inputs are "left", "right", "top", "bottom"'
                },
                {
                    name: 'legendVerticalAlign',
                    type: 'top | middle | bottom | none',
                    defaultValue: 'middle',
                    description: 'Definiert wo die Legende vertikal angezeicht wird. Zulässig sind "top", "middle", "bottom", "none"',
                    descriptionEN: 'Defines where the legend is displayed vertically. Valid inputs are "top", "middle", "bottom", "none"'
                },
                {
                    name: 'legendContentAlign',
                    type: 'left | center | right | none',
                    defaultValue: 'center',
                    description: 'Definiert wie der Inhalt der Legende angezeigt wird. Zulässig sind "left", "center", "right", "none"',
                    descriptionEN: 'Defines how the content of the legend is displayed. Valid inputs are "left", "center", "right", "none"'
                },
                {
                    name: 'exportCsvDelimiter',
                    type: 'String',
                    defaultValue: ';',
                    description: 'Definiert das Trennzeichen der Spalten in der Exportdatei.',
                    descriptionEN: 'Defines the delimiter of the columns in the export file.'
                },
                {
                    name: 'exportType',
                    type: 'ExportType',
                    defaultValue: 'ExportType.Csv',
                    description: 'Definiert in welchem Format historische daten Exportiert werden sollen.',
                    descriptionEN: 'Defines in which format historical data should be exported.'
                },
                {
                    name: 'exportDateTimeFormat',
                    type: 'String',
                    defaultValue: 'yyyy.MM.dd HH:mm:ss',
                    description: 'Definiert das Format der Datetime in der Exportdatei. Definiert das optionale Datums- und Uhrzeitformat für Zeitstempel an. Verfügbare Formate https://docs.microsoft.com/de-de/dotnet/standard/base-types/custom-date-and-time-format-strings',
                    descriptionEN: 'Defines the format of the datetime in the export file. Specifies optional date and time format for timestaps. Available formats https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings'
                },
                {
                    name: 'scrollbarShowX',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Definiert ob die Scrollbar für die X-Achse angezeigt wird.',
                    descriptionEN: 'Defines whether the scrollbar for the X-axis is displayed.'
                },
                {
                    name: 'scrollbarShowY',
                    type: 'Boolean',
                    defaultValue: 'false',
                    description: 'Definiert ob die Scrollbar für die Y-Achse angezeigt wird.',
                    descriptionEN: 'Defines whether the scrollbar for the Y-axis is displayed.'
                },
                {
                    name: 'series',
                    type: 'ISeriesConfiguration[]',
                    defaultValue: '[]',
                    description: 'Definiert die Serien.',
                    descriptionEN: 'Define the series.'
                },
                {
                    name: 'axes',
                    type: 'ISeriesAxesConfiguration[]',
                    defaultValue: '[]',
                    description: 'Definiert die Achsen.',
                    descriptionEN: 'Defines the axes.'
                },
                {
                    name: 'regions',
                    type: 'IRegionConfiguration[]',
                    defaultValue: '[]',
                    description: 'Definiert die Regionen.',
                    descriptionEN: 'Defines the Region.'
                },
                {
                    type: 'Boolean',
                    name: 'dataToolboxShowLabels',
                    defaultValue: 'false',
                    description: 'Definiert ob die Toolbox zum anzeigen der Daten Konfigurations Buttons angezeigt werden soll.',
                    descriptionEN: 'Defines whether the toolbox for displaying the data configuration buttons should be displayed.'
                },
                {
                    type: 'IToolboxButton<ToolboxButtons>[]',
                    name: 'dataToolboxButtons',
                    defaultValue: '[{ button: ToolboxButtons.PauseResume }, { button: ToolboxButtons.TimeSettings }, ...] ',
                    description: 'Definiert welche Buttons in der Toolbox angezeigt werden sollen.',
                    descriptionEN: 'Defines which buttons should be displayed in the toolbox.'
                },
                {
                    type: 'Boolean',
                    name: 'dialogToolboxShowLabels',
                    defaultValue: 'false',
                    description: 'Definiert ob die Toolbox zum anzeigen der Konfigurationsdialoge Buttons angezeigt werden soll.',
                    descriptionEN: 'Defines whether the toolbox for displaying the configuration dialog buttons should be displayed.'
                },
                {
                    type: 'IToolboxButton<DialogToolboxButtons>[]',
                    name: 'dialogToolboxButtons',
                    defaultValue: '[{ button: DialogToolboxButtons.Axes }, { button: DialogToolboxButtons.Data }, ...]',
                    description: 'Definiert welche Buttons in der Toolbox angezeigt werden sollen.',
                    descriptionEN: 'Defines which buttons should be displayed in the toolbox.'
                },
                {
                    type: 'TopRight | BottomRight',
                    name: 'configurationButtonPosition',
                    defaultValue: 'TopRight',
                    description: 'Definiert wo die Konfigurations Buttons positioniert werden.',
                    descriptionEN: 'Defines where the configuration buttons are positioned.'
                },
                {
                    type: 'String',
                    name: 'title',
                    defaultValue: 'WEBfactory Chart',
                    description: 'Überschrift über dem Trend.',
                    descriptionEN: 'Heading above trend.'
                },
                {
                    type: 'String', name: 'buttonBarCssClass ',
                    defaultValue: 'btn btn-default', description: 'CSS Klasse für die Buttons in der Kopfleiste.',
                    descriptionEN: 'CSS class for buttons in the header toolbar.'
                },
                {
                    type: 'String', name: 'panelBarCssClass ',
                    defaultValue: 'panel panel-default', description: 'CSS Klasse für die Kopfleiste.',
                    descriptionEN: 'CSS class for the header toolbar.'
                },
                {
                    type: "Boolean",
                    name: "showDateTimeTooltip",
                    defaultValue: "false",
                    description: 'Definiert wie der Zeitbereich angezeigt werden soll, wenn aktiviert wird der Zeitbereich als Tooltip angezeigt',
                    descriptionEN: 'Defines whether the time range should be displayed. If enabled the time range will be displayed as a tooltip'
                },
                {
                    type: 'String',
                    name: 'dateTimeTooltipFormat',
                    defaultValue: 'DD.MM.YYYY HH:mm:ss',
                    description: 'Definiert das Format des Zeitbereich Tooltips und des Zeitbereich Badge. Definiert das optionale Datums- und Uhrzeitformat für Zeitstempel, zum Beispiel DD.MM.YYYY hh:mm:ss. Verfügbare Ausdrücke sind - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Weiterführende Informationen unter https://momentjs.com/docs/, Im Bereich \"Year, month, and day tokens\".',
                    descriptionEN: 'Defines the format of the datetime in the tooltip and badge. Specifies optional date and time format for timestaps - e.g. DD.MM.YYYY hh:mm:ss. Available tokens are - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Further information are available under https://momentjs.com/docs/, chapter Year, month, and day tokens.'
                },
                {
                    type: 'Boolean', name: 'panelVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob das Panel angezeigt wird.',
                    descriptionEN: 'Defines whether the panel is displayed.'
                },
                {
                    name: 'visibilitySignalName',
                    type: 'String',
                    defaultValue: '',
                    description: 'Name des Signals, dessen Wert für das verstecken verwendet wird.',
                    descriptionEN: 'The name of the signal which is used for to hide the widget/component.'
                },
                {
                    name: 'visibilitySignalValue',
                    type: 'String | Number',
                    defaultValue: '',
                    description: 'Wert der Eigenschaft "visibilitySignalName"',
                    descriptionEN: 'Value of "visibilitySignalName" option.'
                },
                {
                    name: 'visibilityOperator',
                    type: 'String',
                    defaultValue: '==',
                    description: 'Operator für die Bedingung, wann der Inhalt des Widget bzw. der Komponente sichtbar sein werden soll. Verfügbare Operatoren: !=, ==, >=, <=, >, <.',
                    descriptionEN: 'Operator for the condition if the content of the widget / component should be visible. Avalable operatoren: !=, ==, >=, <=, >, <.'
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
                    type: "String",
                    name: "initialConfiguration",
                    defaultValue: "",
                    description: 'Der Name einer Konfiguration, welche automatisch initial geladen wird.',
                    descriptionEN: 'The name of the configuration to be loaded by default.'
                },
                {
                    type: "String",
                    name: "configurationNamespace",
                    defaultValue: "",
                    description: 'Der Namensraum für die Konfiguration.',
                    descriptionEN: 'The namespace for the configuration.'
                }, {
                    type: "String",
                    name: "configurationName",
                    defaultValue: "",
                    description: 'Definiert welcher Name zum speichern einer Konfiguration verwendet wird.',
                    descriptionEN: 'Defines which name is used to save a configuration.'
                },
                {
                    type: "Boolean",
                    name: "clientsideConfiguration",
                    defaultValue: "false",
                    description: 'Definiert ob Konfigurationen lokal gespeichert werden.',
                    descriptionEN: 'Defines whether configurations are saved locally.'
                },
                {
                    type: "number",
                    name: "minPolylineStep",
                    defaultValue: "0.5",
                    description: 'Wenn multi-segment lines (Polyline) gezeichnet werden, können einige Punkte vereinfacht werden, wenn sie näher an minPolylineStep liegen. Je größer dieser Wert ist, desto einfacher werden Linien gezeichnet.',
                    descriptionEN: 'When multi-segment lines (Polyline) are drawn some points may be simplified if they are closer than minPolylineStep. The bigger this value, the more simplified lines will come out.'
                },
                {
                    type: "Boolean",
                    name: "layoutVertical",
                    defaultValue: "false",
                    description: 'Ändert die Orientierung der Achsen, die Achsen haben zwei Container, in denen diese plaziert werden können (links, rechts). Die Container können das Verhalten ändern, anstelle von nebeneinander, können Achsen übereinander gezeigt werden. Wenn die eigenschaf auf "true" gesetzt wird werden alle Achsen übereinander angezeigt.',
                    descriptionEN: 'Changes the orientation of the axes, the axes have two containers in which they can be placed (left, right). The containers can change the behavior, instead of side by side, axes can be shown on top of each other. If the property is set to "true", all axes are displayed one above the other.'
                },
                 
                ];

            self.enums = [
                {
                    name: "InterpolationTypes",
                    properties: [
                        'None',
                        'Linear',
                        'CubicSpline',
                        'Differential'
                    ]
                },
                {
                    name: "SeriesDisplayType",
                    properties: [
                        'Name',
                        'Alias',
                        'Description',
                    ]
                },
                {
                    name: "TimeSeriesMode",
                    properties: [
                        'Offline',
                        'Online'
                    ]
                },
                {
                    name: "ExportType",
                    properties: [
                        'Csv',
                        'Excel',
                        'Xml',
                        'Json'
                    ]
                },
                {
                    name: "CalendarTimeRanges",
                    properties: [
                        'Custom',
                        'Year',
                        'Month',
                        'Week',
                        'Day',
                        'Actual',
                        'Yesterday',
                        'Today',
                    ]
                },
                {
                    name: "RangeConfigurationType",
                    properties: [
                        'Value',
                        'Signal',
                    ]
                },
                {
                    name: "ValuePosition",
                    properties: [
                        'Outside',
                        'Inside',

                    ]
                },
                {
                    name: "ChartType",
                    properties: [
                        'Line',
                        'StackedLine',
                        'Dots',
                        'LineDots',
                        'Step',
                        'Bar',
                        'StackedBar'
                    ]
                },
                {
                    name: "HorizontalLineConfigurationType",
                    properties: [
                        'SignalMin',
                        'SignalMax',
                        'Value',
                        'IntervalMin',
                        'IntervalMax',
                        'IntervalAvg'
                    ]
                }
            ];

            self.parameters =
                [
                    [
                        {
                            name: "ISeriesConfiguration",
                            properties: [
                                { name: 'signalName', type: 'String', defaultValue: '', description: 'Name des Signals.', descriptionEN: 'Name of the signal.' },
                                { name: 'tag', type: 'String', defaultValue: '', description: 'Tag des historischen Logs.', descriptionEN: 'Tag of the historical log.' },
                                { name: 'name', type: 'String', defaultValue: '', description: 'Eindeutiger Name.', descriptionEN: 'Unique name.' },
                                { name: 'axis', type: 'String', defaultValue: '', description: 'Name der zugeordneten Achse.', descriptionEN: 'Name of the assigned axis.' },
                                { name: 'fillColor', type: 'String', defaultValue: '', description: 'Füllfarbe.', descriptionEN: 'Fill color.' },
                                { name: 'strokeColor', type: 'String', defaultValue: '', description: 'Farbe der Linien.', descriptionEN: 'Stroke color' },
                                { name: 'display', type: 'SeriesDisplayType', defaultValue: '', description: 'Wert der als Beschriftung angezeigt wird.', descriptionEN: 'Value displayed as label.' },
                                { name: 'thickness', type: 'Number', defaultValue: '', description: 'Stärke.', descriptionEN: 'Thickness' },
                                { name: 'chartType', type: 'ChartType', defaultValue: '', description: 'Type der Serie.', descriptionEN: 'Type of Series' },
                                { name: 'digital', type: 'Boolean', defaultValue: '', description: 'Wenn aktiviert werden die Werte zu einer Digitalen Linie manipuliert.', descriptionEN: 'When enabled, the values are manipulated into a digital line.' },
                                { name: 'digitalBit', type: 'Number', defaultValue: '', description: 'Maskierung der historischen Werte.', descriptionEN: 'Masking of historical values.' },
                                { name: 'invertDigitalRepresentation', type: 'Boolean', defaultValue: '', description: 'Die historischen Werte werden invertiert.', descriptionEN: 'The historical values are inverted.' },
                                { name: 'digits', type: 'Number', defaultValue: '', description: 'Anzahl der Nachkommastellen.', descriptionEN: 'Digits of values.' },
                                { name: 'interpolation', type: 'InterpolationTypes', defaultValue: '', description: 'Interpolationsverfahren der Linie.', descriptionEN: 'Interpolation method of the line.' },
                                { name: 'horizontalLines', type: 'IHorizontalLineConfiguration[]', defaultValue: '', description: 'Konfiguration der Horizontalen Linien.', descriptionEN: 'Configuration of the horizontal lines.' },
                            ]
                        },
                        {
                            name: "ISeriesAxesConfiguration",
                            properties: [
                                { name: 'name', type: 'String', defaultValue: '', description: 'Eindeutiger Name.', descriptionEN: 'Unique name.' },
                                { name: 'color', type: 'String', defaultValue: '', description: 'Farbe.', descriptionEN: 'Color.' },
                                { name: 'gridColor', type: 'String', defaultValue: '', description: 'Gitterfarbe.', descriptionEN: 'Grid color.' },
                                { name: 'thickness', type: 'Number', defaultValue: '', description: 'Stärke.', descriptionEN: 'Thickness.' },
                                { name: 'gridThickness', type: 'Number', defaultValue: '', description: 'Gitter Stärke', descriptionEN: 'Grid Thickness.' },
                                { name: 'valuePosition', type: 'ValuePosition', defaultValue: '', description: 'Position der Achsenwerte.', descriptionEN: 'Position of the axis values.' },
                                { name: 'useIntegerValues', type: 'Boolean', defaultValue: '', description: 'Ganze Werte verwenden.', descriptionEN: 'Use integer values.' },
                                { name: 'showLabels', type: 'Boolean', defaultValue: '', description: 'Beschriftung anzeigen.', descriptionEN: 'Show labels.' },
                                { name: 'showFirstLabel', type: 'Boolean', defaultValue: '', description: 'Erste Beschriftung anzeigen.', descriptionEN: 'Show first label.' },
                                { name: 'showLastLabel', type: 'Boolean', defaultValue: '', description: 'Letzte Beschriftung anzeigen.', descriptionEN: 'Show last label.' },
                                { name: 'inversed', type: 'Boolean', defaultValue: '', description: 'Invertiert.', descriptionEN: 'Inversed.' },
                                { name: 'opposite', type: 'Boolean', defaultValue: '', description: 'Achse wird auf der rechten Seite dargestellt.', descriptionEN: 'Axis is displayed on the right side.' },
                                { name: 'digits', type: 'Number', defaultValue: '', description: 'Anzahl der Nachkommastellen.', descriptionEN: 'Digits of values.' },
                                { name: 'titleRotation', type: 'Number', defaultValue: '', description: 'Rotation Achsentitel.', descriptionEN: 'Rotation of title.' },
                                { name: 'labelRotation', type: 'Number', defaultValue: '', description: 'Rotation Bezeichner.', descriptionEN: 'Rotation of label.' },
                                { name: 'logarithmic', type: 'Boolean', defaultValue: '', description: 'Logarithmische Darstellung.', descriptionEN: 'Logarithmic representation.' },
                                { name: 'scientific', type: 'Boolean', defaultValue: '', description: 'Wissenschaftliche Darstellung', descriptionEN: 'Scientific representation.' },
                                { name: 'minGridDistance', type: 'Number', defaultValue: '', description: 'Minimaler Gitter Abstand.', descriptionEN: 'Minimum grid distance.' },
                                { name: 'max', type: 'Number', defaultValue: '', description: 'Definiert den maximalen Wert der Achse.', descriptionEN: 'Defines the max value for y-axis.' },
                                { name: 'min', type: 'Number', defaultValue: '', description: 'Definiert den minimalen Wert der Achse.', descriptionEN: 'Defines the min value for y-axis.' }
                            ]
                        },
                        {
                            name: "IRegionConfiguration",
                            properties: [
                                { name: 'name', type: 'String', defaultValue: '', description: 'Eindeutiger Name.', descriptionEN: 'Unique name.' },
                                { name: 'color', type: 'String', defaultValue: '', description: 'Farbe.', descriptionEN: 'Color.' },
                                { name: 'axis', type: 'String', defaultValue: '', description: 'Name der zugeordneten Achse.', descriptionEN: 'Name of the assigned axis.' },
                                { name: 'start', type: 'String', defaultValue: '', description: 'Start Signalwert oder Wert.', descriptionEN: 'Start signal value or value.' },
                                { name: 'startType', type: 'RangeConfigurationType', defaultValue: '', description: 'Typ des Startwertes.', descriptionEN: 'Type of start value.' },
                                { name: 'end', type: 'String', defaultValue: '', description: 'Ende Signalwert oder Wert.', descriptionEN: 'End signal value or value.' },
                                { name: 'endType', type: 'RangeConfigurationType', defaultValue: '', description: 'Typ des Endwertes.', descriptionEN: 'Type of end value.' }
                            ]
                        },
                        {
                            name: "ICursorConfiguration",
                            properties: [
                                { name: 'name', type: 'String', defaultValue: '', description: 'Eindeutiger Name.', descriptionEN: 'Unique name.' },
                                { name: 'timestamp', type: 'Date', defaultValue: '', description: 'Definiert die Position des Cursors.', descriptionEN: 'Defines the position of the cursor.' },
                                { name: 'offsetInterval', type: 'Number', defaultValue: '', description: 'Offset intervall.', descriptionEN: 'Offset interval.' },
                                { name: 'offset', type: 'seconds | minutes | hours | days | weeks | months | years', defaultValue: '', description: 'Type des Offset intervall.', descriptionEN: 'Type of offset interval.' }
                            ]
                        },
                        {
                            name: "IHorizontalLineConfiguration",
                            properties: [
                                { name: 'name', type: 'String', defaultValue: '', description: 'Eindeutiger Name.', descriptionEN: 'Unique name.' },
                                { name: 'color', type: 'String', defaultValue: '', description: 'Farbe.', descriptionEN: 'Color.' },
                                { name: 'offset', type: 'String', defaultValue: '', description: 'Versatz zu dem Wert.', descriptionEN: 'Offset to the value.' },
                                { name: 'value', type: 'String', defaultValue: '', description: 'Wert.', descriptionEN: 'Value.' },
                                { name: 'type', type: 'HorizontalLineConfigurationType', defaultValue: '', description: 'Typ der Linie.', descriptionEN: 'Type of line.' }
                            ]
                        },
                    ],
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


