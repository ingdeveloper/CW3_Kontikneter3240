define(["../../services/connector"],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
            self.selectedLanguageId = ko.observable();
            self.widgetName = "wfLogTagTrend";
            self.widgetCategory = "Historische Daten";

            self.widgetProperties =
            [
                //xAxisType
                //xAxisTickFit
                //legendPosition

                // [ Obsolete properties ]
                //{
                //    type: 'String', name: 'signalName',
                //    defaultValue: '',
                //    description: 'Signalname',
                //    descriptionEN: 'Signal name'
                //},
                //{
                //    type: 'String', name: 'logTagName',
                //    defaultValue: '',
                //    description: 'LogTag Name, für den angegebenen Signalnamen',
                //    descriptionEN: 'LogTag name, for the specified signal name'
                //},
                {
                    type: 'Array',
                    name: 'lines',
                    defaultValue: '[]',
                    description: 'Einstellungen für die Datenreihen im Chart. Jede Datenreihe muss durch ein Objekt mit folgenden Eigenschaften definiert sein: signalName, logTagName, color (optional, Standardwert ist #000000), axis (optional, Standardwert ist \'y\' und etwas, das nicht \'y2\' ist), logId (optional), type(optional, Standatwert ist \'line\'. Verfügbare Typen sind: line, step, spline, bar, area, area-spline). Beispiel { signalName: \'Level 1\', logTagName: \'LogTagLevel1\', color: \'#f0ad4e\', axis: \'y1\' }.',
                    descriptionEN: 'Represents the definition of the datasets in the chart. Each dataset definition is an object defined by the properties: signalName, logTagName, color (optional, default is #000000), axis (optional, default is \'y\' and everything that is not \'y2\'), logId (optional), type(optional, default ist \'line\'. Available types are: line, step, spline, bar, area, area-spline). Example { signalName: \'Level 1\', logTagName: \'LogTagLevel1\', color: \'#f0ad4e\', axis: \'y1\' }.'
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
                    name: 'format',
                    defaultValue: '0,0.[00]',
                    description: 'Format für die numerische Werte im Tooltip. Weitere Formate sind auf der Dokumentationsseite von Numeral.js zu finden: http://adamwdraper.github.io/Numeral-js/.',
                    descriptionEN: 'Format for the numeric values in the tooltip. Other formats are described on the documentation page of Numeral.js: http://adamwdraper.github.io/Numeral-js/.'
                },

                {
                    type: 'String',
                    name: 'title',
                    defaultValue: 'WEBfactory Chart',
                    description: 'Überschrift über dem Trend.',
                    descriptionEN: 'Heading above trend.'
                },
                {
                    type: 'Number',
                    name: 'maxResults',
                    defaultValue: '500',
                    description: 'Maximale Anzahl der Einträge.',
                    descriptionEN: 'Maximum number of entries.'
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
                    description: 'Wenn diese Eigenschaft mit dem Wert true gesetzt ist, wird der Chart zyklisch automatisch aktualisiert. Bei der Aktualisierung des Charts wird die Eigenschaften endDate auf den aktuellen Zeitpunkt gesetzt, während die Eigenschaften startDate durch die Eigenschaften startOffset and startOffsetInterval deklariert werden.',
                    descriptionEN: 'When this property is active, then chart will auto update the data. The refresh will be done with the endDate now and the startDate determined by the startOffset and startOffsetInterva.l'
                },
                {
                    type: 'Number',
                    name: 'updateRate',
                    defaultValue: '2000',
                    description: 'Das Aktualisierungsgeschwindigkeit des Charts in Millisekunden. Diese Eigenschaft wird nur berücksichtigt, wenn die Eigenschaft autoUpdate auf den Wert true gesetzt ist. Minimumwert ist ',
                    descriptionEN: 'The update rate in milliseconds. This property will be taken into consideration only if the autoUpdate is true.'
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
                    defaultValue: '30',
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
                    type: 'Boolean',
                    name: 'showCurrentDateLine',
                    defaultValue: 'false',
                    description: 'Definiert ob die vertikale Linie für die aktuale Zeit angezeigt wird.',
                    descriptionEN: 'Defines whether the vertically line for current time is displayed.'
                },
                {
                    type: 'Number',
                    name: 'chartWidth',
                    defaultValue: 'auto',
                    description: 'Breite des Charts in Pixel.',
                    descriptionEN: 'Width of the chart in pixels.'
                },
                {
                    type: 'Number',
                    name: 'chartHeight',
                    defaultValue: '300',
                    description: 'Höhe des Trends in Pixel.',
                    descriptionEN: 'Height of trends in pixels.'
                },
                {
                    type: 'Number',
                    name: 'chartPaddingLeft',
                    defaultValue: 'undefined',
                    description: 'Linker Chart-Innenabstand in Pixel.',
                    descriptionEN: 'left chart padding in px.'
                },
                {
                    type: 'Number',
                    name: 'chartPaddingRight',
                    defaultValue: 'undefined',
                    description: 'Rechter Chart-Innenabstand in Pixel.',
                    descriptionEN: 'Right chart padding in px.'
                },
                {
                    type: 'Number',
                    name: 'chartPaddingTop',
                    defaultValue: 'undefined',
                    description: 'Oberer Chart-Innenabstand Oben in Pixel.',
                    descriptionEN: 'Top chart padding in px.'
                },
                {
                    type: 'Number',
                    name: 'chartPaddingbottom',
                    defaultValue: 'undefined',
                    description: 'Unterer Chart-Innenabstand Oben in Pixel.',
                    descriptionEN: 'Bottom chart padding in px.'
                },
                {
                    type: 'String',
                    name: 'chartType',
                    defaultValue: 'line',
                    description: 'Charttyp. Verfügbare Typen sind: line, step, spline, bar, area, area-spline.',
                    descriptionEN: 'Charttype. Available types are: line, step, spline, bar, area, area-spline.'
                },
                {
                    type: 'String',
                    name: 'legendText',
                    defaultValue: 'AliasName',
                    description: 'Definition für Labeltexte in der Legende. Gültige Werte sind: \'AliasName\', \'Name\', \'Description\', \'DescriptionSymbolicText\', \'Logs.LogTag\', \'Logs.Description\'. Falls Log.Description als Wert verwendet wird und kein Übersetzungstext in der WEBfactory Datenbank eingetragen ist, wird automatisch der Log Tag Name ausgegeben.',
                    descriptionEN: 'Definitions for label texts in the legend. Valid values are: \'AliasName\', \'Name\', \'Description\', \'DescriptionSymbolicText\', \'Logs.LogTag\', \'Logs.Description\'. In case where Log.Description is set as property value and no translation text is defined in the WEBfactory database, the log tag name will be shown by default.'
                },
                {
                    type: 'String',
                    name: 'signalFilterText',
                    defaultValue: 'AliasName',
                    description: 'Definition Signaltexte für Signaldropdown in der Signalseinstellungen. Gültige Werte sind: \'AliasName\', \'Name\', \'Description\', \'DescriptionSymbolicText\'. Wenn der Text für ausgewähltes Wert leer ist, wird der Text für Wert \'AliasName\' zeigen',
                    descriptionEN: 'Definitions signal texts for signal dropdown in the settings. Valid values are: \'AliasName\', \'Name\', \'Description\', \'DescriptionSymbolicText\'. When text for selected value is empty, thrn will show text for value  \'AliasName\' '
                },
                {
                    type: 'Boolean',
                    name: 'y1AxisVisible',
                    defaultValue: 'true',
                    description: 'Definiert ob die linke Y-Achse angezeigt wird.',
                    descriptionEN: 'Defines whether the left y-axis is displayed.'
                },
                {
                    type: 'String',
                    name: 'y1AxisLabel',
                    defaultValue: '',
                    description: 'Beschriftung an der linken Y-Achse.',
                    descriptionEN: 'Left y-axis label text.'
                },
                {
                    type: 'String',
                    name: 'y1AxisColor',
                    defaultValue: '#000000',
                    description: 'Farbe für die linke Y-Achse.',
                    descriptionEN: 'Color for the left y-axis.'
                },
                
               {
                   type: 'Boolean',
                   name: 'y1AxisInner ',
                    defaultValue: 'false',
                    description: 'Definiert ob die Achsenbeschriftung innen angezeigt wird.',
                    descriptionEN: 'Defines whether the axis label is displayed inside.'
                },
                {
                    type: 'Number',
                    name: 'y1TickCount',
                    defaultValue: 'null',
                    description: 'Anzahl der Scalenstriche auf der linken Y-Achse.',
                    descriptionEN: 'Tick number for the left y-axis scale.'
                },
                {
                    type: 'String',
                    name: 'y1TickFormat',
                    defaultValue: 'd3.format(".f")',
                    description: 'Format für die linke Y-Achse. Weitere Formate sind in der Dokumentation von D3.js zu finden: https://github.com/d3/d3-format/blob/master/README.md.',
                    descriptionEN: 'Timestamp format for the left y-axis. Other formats are described on the documentation page of D3.js: https://github.com/d3/d3-format/blob/master/README.md.'
                },
                {
                    type: 'Boolean',
                    name: 'y1GridVisible ',
                    defaultValue: 'false',
                    description: 'Definiert ob ein Raster für die linke Y-Achse angezeigt wird.',
                    descriptionEN: 'Defines whether a grid for left y-axis is displayed.'
                },
                {
                    type: 'Number',
                    name: 'y1AxisMax ',
                    defaultValue: '',
                    description: 'Definiert den maximalen Wert für die linke Y-Achse.',
                    descriptionEN: 'Defines the max value for left y-axis.'
                },
                {
                    type: 'Number',
                    name: 'y1AxisMin ',
                    defaultValue: '',
                    description: 'Definiert den minimalen Wert für die linke Y-Achse.',
                    descriptionEN: 'Defines the min value for left y-axis.'
                },
                 {
                     type: 'Boolean',
                     name: 'y1AxisMaxSignal ',
                     defaultValue: 'false',
                     description: 'Verknüpft den Maximal-Wert für die linke Y-Achse mit dem vorgegebenen Maximal-Wert ersten Signals aus lines mit axis = y1.',
                     descriptionEN: 'Binds the max value for left y-axis with the max value of the first signal from lines with axis = y1.'
                 },
                 {
                     type: 'Boolean',
                     name: 'y1AxisMinSignal ',
                     defaultValue: 'false',
                     description: 'Verknüpft den Minimal-Wert für die linke Y-Achse mit dem vorgegebenen Minimal-Wert ersten Signals aus lines mit axis = y1.',
                     descriptionEN: 'Binds the min value for left y-axis with the min value of the first signal from lines with axis = y1.'
                 },
                {
                    type: 'Boolean',
                    name: 'y2AxisVisible ',
                    defaultValue: 'true',
                    description: 'Definiert ob die rechte Y-Achse angezeigt wird.',
                    descriptionEN: 'Defines whether the right y-axis is displayed.'
                },
                {
                    type: 'String',
                    name: 'y2AxisLabel',
                    defaultValue: '',
                    description: 'Beschriftung an der rechten Y-Achse.',
                    descriptionEN: 'Right y-axis Label text.'
                },
                {
                    type: 'String',
                    name: 'y2AxisColor',
                    defaultValue: '#880000',
                    description: 'Farbe für die rechte Y-Achse.',
                    descriptionEN: 'Color for the right y-axis.'
                },
                {
                    type: 'Boolean',
                    name: 'y2AxisInner ',
                    defaultValue: 'false',
                    description: 'Definiert ob die Achsenbeschriftung innen angezeigt wird.',
                    descriptionEN: 'Defines whether the axis label is displayed inside.'
                },
                {
                    type: 'Number',
                    name: 'y2TickCount',
                    defaultValue: 'null',
                    description: 'Anzahl der Scalenstriche auf der rechten Y-Achse.',
                    descriptionEN: 'Tick number for the right y-axis scale.'
                },
                {
                    type: 'String',
                    name: 'y2TickFormat',
                    defaultValue: 'd3.format(".f")',
                    description: 'Format für die linke Y-Achse. Weitere Formate sind in der Dokumentation von D3.js zu finden: https://github.com/d3/d3-format/blob/master/README.md.',
                    descriptionEN: 'Timestamp format for the left y-axis. Other formats are described on the documentation page of D3.js: https://github.com/d3/d3-format/blob/master/README.md.'
                },
                {
                    type: 'Boolean',
                    name: 'y2GridVisible',
                    defaultValue: 'false',
                    description: 'Definiert ob ein Raster für die linke Y-Achse angezeigt wird.',
                    descriptionEN: 'Defines whether a grid for left y-axis is displayed.'
                },
                {
                    type: 'Number',
                    name: 'y2AxisMax ',
                    defaultValue: '',
                    description: 'Definiert den maximalen Wert für die rechte Y-Achse',
                    descriptionEN: 'Defines the max value for right y-axis.'
                },
                {
                    type: 'Number',
                    name: 'y2AxisMin ',
                    defaultValue: '',
                    description: 'Definiert den minimalen Wert für die linke Y-Achse.',
                    descriptionEN: 'Defines the min value for right y-axis.'
                },
                 {
                     type: 'Boolean',
                     name: 'y2AxisMaxSignal ',
                     defaultValue: 'false',
                     description: 'Verknüpft den Maximal-Wert für die rechte Y-Achse mit dem vorgegebenen Maximal-Wert ersten Signals aus lines mit axis = y2.',
                     descriptionEN: 'Binds the max value for right y-axis with the max value of the first signal from lines with axis = y2.'
                 },
                 {
                     type: 'Boolean',
                     name: 'y2AxisMinSignal ',
                     defaultValue: 'false',
                     description: 'Verknüpft den Minimal-Wert für die rechte Y-Achse mit dem vorgegebenen Minimal-Wert ersten Signals aus lines mit axis = y2.',
                     descriptionEN: 'Binds the min value for right y-axis with the min value of the first signal from lines with axis = y2.'
                 },
                {
                    type: 'Boolean',
                    name: 'x1AxisVisible',
                    defaultValue: 'true',
                    description: 'Definiert ob die X-Achse angezeigt wird.',
                    descriptionEN: 'Defines if the x-axis is displayed.'
                },
                {
                    type: 'String',
                    name: 'x1AxisLabel',
                    defaultValue: '',
                    description: 'Beschriftung an der X-Achase.',
                    descriptionEN: 'X-axis label text.'
                },
                {
                    type: 'String',
                    name: 'x1AxisTickFormat',
                    defaultValue: '%X',
                    description: 'Zeitstempelformat für die X-Achse. Weitere Formate sind in der Dokumentation von D3.js zu finden: https://github.com/mbostock/d3/wiki/Time-Formatting.',
                    descriptionEN: 'Timestamp format for the X-axis. Other formats are described on the documentation page of D3.js: https://github.com/mbostock/d3/wiki/Time-Formatting.'
                },
                {
                    type: 'Number',
                    name: 'x1TickCount',
                    defaultValue: '10',
                    description: 'Manuelle Anzahl der Scalenstriche.',
                    descriptionEN: 'Tick number for X scale.'
                },

                {
                    type: 'Boolean',
                    name: 'x1GridVisible ',
                    defaultValue: 'false',
                    description: 'Definiert ob ein Raster für die X-Achse angezeigt wird.',
                    descriptionEN: 'Defines whether a grid for X-axis is displayed.'
                },
                {
                    type: 'Boolean',
                    name: 'subChartVisible',
                    defaultValue: 'true',
                    description: 'Anzeige des Untercharts für Zooming.',
                    descriptionEN: 'Display of sub-charts for zooming.'
                },
                {
                    type: 'Number',
                    name: 'subChartHeight',
                    defaultValue: '50',
                    description: 'Höhe des Untercharts.',
                    descriptionEN: 'High of subcharts.'
                },

                {
                    type: 'Boolean',
                    name: 'legendVisible',
                    defaultValue: 'true',
                    description: 'Definiert ob die Legende angezeigt wird.',
                    descriptionEN: 'Defines whether or not the legend is displayed.'
                },

                {
                    type: 'String',
                    name: 'legendPosition',
                    defaultValue: 'true',
                    description: 'Definiert wo die Legende angezeicht wird. Zulässig sind "bottom", "right", "inset"',
                    descriptionEN: 'Defines where the legend is displayed. Valid inputs are "bottom", "right", "inset"'
                },

                {
                    type: 'Boolean',
                    name: 'pointsVisible',
                    defaultValue: 'false',
                    description: 'Definiert  ob für die Daten mit Punkten hervorgehoben werden.',
                    descriptionEN: 'Defines whether data are highlighted as dots.'
                },

                {
                    type: 'Boolean',
                    name: 'zoomEnabled',
                    defaultValue: 'false',
                    description: 'Aktiviert optionales Zooming direkt im Chart.',
                    descriptionEN: 'Enable optional zooming directly in the chart.'
                },
                {
                    type: 'Boolean',
                    name: 'zoomRescale',
                    defaultValue: 'true',
                    description: 'Aktiviert automatische Anpassung der Y-Achsenscala beim Zooming.',
                    descriptionEN: 'Enables automatic adjustment of Y-axis during zooming scale.'
                },
                // [ Obsolete properties ]
                //{
                //    type: 'String', name: 'trendColor',
                //    defaultValue: '#880100',
                //    description: 'Füllfarbe für die die Trendlinie bzw. Bars',
                //    descriptionEN: 'Fill color for the chart lines and bars'
                //},
                // [ Obsolete properties ]
                //{
                //    type: 'String', name: 'pointsFillColor',
                //    defaultValue: 'line color',
                //    description: 'Füllfarbe für die Punkte. Hinweis: die Opacity der Farbe wird bei der Anwendung auf 0.5 gesetzt.',
                //    descriptionEN: 'Fill color for the points. NOTE: The Opacity of the color is set in the application to 0.5.'
                //},
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
                    type: 'Boolean', name: 'signalsButtonVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob der Button für den Dialog mit Signal- und LogTagauswahl angezeigt wird.',
                    descriptionEN: 'Defines if the button for signal and logtags selection dialog should be shown.'
                },
                {
                    type: 'Boolean', name: 'exportButtonVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob der Button für den Export der Daten ins CSV-Format angezeigt wird.',
                    descriptionEN: 'Defines if the button ffor exporting the data to CSV format should be shown.'
                },
                {
                    type: 'String', name: 'exportFileName',
                    defaultValue: 'export.csv',
                    description: 'Definiert den Name der Exportdatei.',
                    descriptionEN: 'Defines the name of the export file.'
                },
                {
                    type: 'String', name: 'exportColumnDelimiter',
                    defaultValue: ';',
                    description: 'Definiert das Trennzeichen der Spalten in der Exportdatei.',
                    descriptionEN: 'Defines the delimiter of the columns in the export file.'
                },
                {
                    type: 'String', name: 'exportDateTimeFormat',
                    defaultValue: 'DD.MM.YYYY HH:mm:ss',
                    description: 'Definiert das Format der Datetime in der Exportdatei. Definiert das optionale Datums- und Uhrzeitformat für Zeitstempel an, zum Beispiel DD.MM.YYYY hh:mm:ss. Verfügbare Ausdrücke sind - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Weiterführende Informationen unter https://momentjs.com/docs/, Im Bereich \"Year, month, and day tokens\".',
                    descriptionEN: 'Defines the format of the datetime in the export file. Specifies optional date and time format for timestaps - e.g. DD.MM.YYYY hh:mm:ss. Available tokens are - YYYY, YY, Y, Q, MM, MMM, MMMM, D, DD. Further information are available under https://momentjs.com/docs/, chapter Year, month, and day tokens.'
                },
                
                {
                    type: 'Boolean', name: 'headerVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob die Kopfzeile angezeigt wird.',
                    descriptionEN: 'Defines whether the header is displayed.'
                },
                {
                    type: 'Boolean', name: 'footerVisibility',
                    defaultValue: 'false',
                    description: 'Definiert ob die Fusszeile angezeigt wird.',
                    descriptionEN: 'Defines whether the footer is displayed.'
                },
                {
                    type: 'Boolean', name: 'statisticsVisibility',
                    defaultValue: 'false', description: 'Leiste mit Minimum, Maximum und Durchschnittswert von den dargestellten Datenpunkten.',
                    descriptionEN: 'Bar with minimum, maximum and average value of the displayed data points.'
                },
                {
                    type: 'Boolean', name: 'tooltipVisibility',
                    defaultValue: 'true',
                    description: 'Definiert ob bei MouseOver ein Tooltip mit Werten angezeigt wird.',
                    descriptionEN: 'Defines whether a tooltip with values will be displayed on mouseover.'
                },
                // [ Deprecated properties ]
                //{
                //    type: 'String', name: 'buttonBarCss ',
                //    defaultValue: '', description: 'CSS Klasse für die Buttons in der Kopfleiste',
                //    descriptionEN: 'CSS class for buttons in the header toolbar'
                //},
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
                    type: "String ['Hide', 'Disable']",
                    name: "securityDenyAccessBehavior",
                    defaultValue: "Hide",
                    description: "Das Verhalten des Controls, wenn der angemeldete User nicht zur Berechtigungsgruppe gehört, die von der projectAuthorization-Eigenschaft angegeben wurde. In diesem Fall kann das Control deaktiviert oder ausgeblendet werden.",
                    descriptionEN: "The behavior of the element when the logged in user doesn't belong to the project authorization indicated by the projectAuthorization property. In this case, the element can be either disabled or hidden."
                },
                {
                    type: "String",
                    name: "signalSelectionProjectAuthorization",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Dialogs mit Signal- und LogTagauswahl mindestens erforderlich ist. Diese Eigenschaft verwendet sich in Kombination mit der Eigenschaft \'signalsButtonVisibility\'.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the signal and logtags selection dialog. This option is used in combination with the option \'signalsButtonVisibility\'.'
                },
                {
                    type: "String",
                    name: "exportProjectAuthorization",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Exportbutton mindestens erforderlich ist. Diese Eigenschaft verwendet sich in Kombination mit der Eigenschaft \'exportButtonVisibility\'.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the export button. This option is used in combination with the option \'exportButtonVisibility\'.'
                },
                {
                    type: "String",
                    name: "configurationProjectAuthorization",
                    defaultValue: "",
                    description: 'Projektberechtigung des Benutzers, welche für die Anzeige des Konfigurations-Manager mindestens erforderlich ist. Diese Eigenschaft verwendet  sich in Kombination mit der Eigenschaft \'configurationButtonVisibility\'.',
                    descriptionEN: 'Projectauthorization of the user, which are required for showing the configuration manager. This option is used in combination with the option \'configurationButtonVisibility\'.'
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
                },
                {
                    type: "Boolean",
                    name: "showIsStaticColumn",
                    defaultValue: "false",
                    description: 'Aktiviert die Einstellungsmöglichkeit Trendkurven als statisch zu markieren, kann verwendet werden wenn Signalwerte sich gelegentlich ändern, wenn die Option statisch für eine Trendkurve aktiviert wird, wird der letzte aufgezeichnete Signalwert garantiert zur Anzeige gebracht.',
                    descriptionEN: 'Enables the setting option to mark trend lines as static. This can be used if signal values change infrequently. If the option static will be enabled for a line, the last logged value will be shown guaranteed.'
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
                    type: 'Number',
                    name: 'maxSignalCount',
                    defaultValue: '50',
                    description: 'Legt maximale Anzahl für die Suchergebnisse (Signale und Log Tags) in der Signal- und LogTagauswahl.',
                    descriptionEN: 'Set the maximum count for search results in the signal and logtags selection.'
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


