define(["durandal/system", "../../services/connector"],
    function (system, signalsConnector) {
        var ctor = function () {
            var self = this;
            self.routePrefix = "";
            self.selectedWidgetName = ko.observable("");
            self.id = ko.observable(uuid.v4());
            self.selectedLanguageId = ko.observable();

            self.widgets = ko.observableArray([
                {
                    category: "Visualisieren",
                    categoryEN: "Visualization",
                    icon: "wf wf-eye",
                    components: [
                        { name: "Signalwert", icon: "", widgetName: "wfValue", component: "wf-value" },
                        { name: "Signalwertanzeige", icon: "", widgetName: "wfValueDisplay", component: "wf-value-display" },
                        { name: "Zähleranzeige", icon: "", widgetName: "wfMeter", component: "wf-meter" },
                        { name: "Gauge", icon: "", widgetName: "wfValueGauge", component: "wf-gauge-1" },
                        { name: "Arc (Bogen)", icon: "", widgetName: "wfValueArc", component: "wf-arc" },
                        { name: "Bargraph", icon: "", widgetName: "wfValueBarGraph", component: "wf-bargraph" },
                        { name: "Sensorsymbol", icon: "", widgetName: "wfSensorValue", component: "wf-sensor" },
                        { name: "Signalinformationen", icon: "", widgetName: "wfSignalInformation", component: "wf-signal-information" },
                        { name: "Signalinformationen Popover", icon: "", widgetName: "wfSignalInformationPopover", component: "wf-signal-information-popover" },
                        { name: "Signalliste", icon: "", widgetName: "wfSignalList", component: "wf-signal-list" },
                        { name: "Rotation Container", icon: "", widgetName: "wfRotationContainer", component: "wf-rotation-container" },
                        { name: "Motion Container", icon: "", widgetName: "wfMotionContainer", component: "wf-motion-container" },
                        { name: "Modaler Dialog", icon: "", widgetName: "wfModalDialog", component: "wf-modal-dialog" },
                        { name: "Modaler Dialog Button", icon: "", widgetName: "wfModalDialogButton", component: "wf-modal-dialog-button" },
                        { name: "Popover", icon: "", widgetName: "wfPopover", component: "wf-popover" },
                        { name: "Sollwertkurve", icon: "", widgetName: "wfSetpointChart", component: "wf-setpoint-chart" },
                    ],
                    componentsEN: [
                        { name: "Signal value", icon: "", widgetName: "wfValue", component: "wf-value" },
                        { name: "Signal value display", icon: "", widgetName: "wfValueDisplay", component: "wf-value-display" },
                        { name: "Meter", icon: "", widgetName: "wfMeter", component: "wf-meter" },
                        { name: "Gauge", icon: "", widgetName: "wfValueGauge", component: "wf-gauge-1" },
                        { name: "Arc", icon: "", widgetName: "wfValueArc", component: "wf-arc" },
                        { name: "Bargraph", icon: "", widgetName: "wfValueBarGraph", component: "wf-bargraph" },
                        { name: "Sensor symbol", icon: "", widgetName: "wfSensorValue", component: "wf-sensor" },
                        { name: "Signal information", icon: "", widgetName: "wfSignalInformation", component: "wf-signal-information" },
                        { name: "Signal information popover", icon: "", widgetName: "wfSignalInformationPopover", component: "wf-signal-information-popover" },
                        { name: "Signal list", icon: "", widgetName: "wfSignalList", component: "wf-signal-list" },
                        { name: "Modal dialog", icon: "", widgetName: "wfModalDialog", component: "wf-modal-dialog" },
                        { name: "Modal Dialog Button", icon: "", widgetName: "wfModalDialogButton", component: "wf-modal-dialog-button" },
                        { name: "Popover", icon: "", widgetName: "wfPopover", component: "wf-popover" },
                        { name: "Setpoint chart", icon: "", widgetName: "wfSetpointChart", component:  "wf-setpoint-chart" },
                    ]
                },

                {
                    category: "Bedienen",
                    categoryEN: "Control",
                    icon: "wf wf-hand-o",
                    components: [
                        { name: "Button", icon: "", widgetName: "wfWriteValueButton", component: "wf-button" },
                        { name: "Pufferbutton", icon: "", widgetName: "wfBufferButton", component: "wf-buffer-button" },
                        { name: "Toggle Button", icon: "", widgetName: "wfToggleButton", component: "wf-toggle-button" },
                        { name: "Radio Buttons", icon: "", widgetName: "wfRadioButtons", component: "wf-radio-buttons" },
                        { name: "Switch", icon: "", widgetName: "wfSwitchValue", component: "wf-switch" },
                        { name: "ComboBox", icon: "", widgetName: "wfWriteValueCombobox", component: "wf-combobox" },
                        { name: "Eingabefeld", icon: "", widgetName: "wfInputValue", component: "wf-input" },
                        { name: "Slider", icon: "", widgetName: "wfSlider", component: "wf-slider" },
                        { name: "Datumsauswahl", icon: "", widgetName: "wfDateTimePicker", component: "wf-date-time-picker" },
                        { name: "Switch 3 States", icon: "", widgetName: "wfSwitchValue3States", component: "wf-switch-3-states" },
                        { name: "Signal und Alarmliste", icon: "", widgetName: "wfSignalAlarmList", component: "wf-signal-alarm-list" },
                    ],
                    componentsEN: [
                        { name: "Button", icon: "", widgetName: "wfWriteValueButton", component: "wf-button" },
                        { name: "Buffer Button", icon: "", widgetName: "wfBufferButton", component: "wf-buffer-button" },
                        { name: "Toggle Button", icon: "", widgetName: "wfToggleButton", component: "wf-toggle-button" },
                        { name: "Radio Buttons", icon: "", widgetName: "wfRadioButtons", component: "wf-radio-buttons" },
                        { name: "Switch", icon: "", widgetName: "wfSwitchValue", component: "wf-switch" },
                        { name: "ComboBox", icon: "", widgetName: "wfWriteValueCombobox", component: "wf-combobox" },
                        { name: "Input field", icon: "", widgetName: "wfInputValue", component: "wf-input" },
                        { name: "Slider", icon: "", widgetName: "wfSlider", component: "wf-slider" },
                        { name: "Datepicker", icon: "", widgetName: "wfDateTimePicker", component: "wf-date-time-picker" },
                        { name: "Switch 3 States", icon: "", widgetName: "wfSwitchValue3States", component: "wf-switch-3-states" },
                        { name: "Signal and alarm list", icon: "", widgetName: "wfSignalAlarmList", component: "wf-signal-alarm-list" },
                    ]
                },

                {
                    category: "Zustände",
                    categoryEN: "States",
                    icon: "wf wf-light-bulb-o",
                    components: [
                        { name: "Indikator", icon: "", widgetName: "wfStateIndicator", component: "wf-state-indicator" },
                        { name: "Status Komponente", icon: "", widgetName: "wfStateCssClass", component: "wf-state-symbol" },
                        { name: "Statussymbol Schaltanlage", icon: "", widgetName: "wfSwitchGear", component: "wf-switch-gear" },
                        { name: "Statussymbol Schalter", icon: "", widgetName: "wfSwitchSymbol", component: "wf-switch-symbol" },
                        { name: "Statussymbol Transformator", icon: "", widgetName: "wfSwitchTransformer", component: "wf-switch-transformer" },
                        { name: "Statustext", icon: "", widgetName: "wfStateText", component: "wf-state-text" },
                        { name: "Watchdog", icon: "", widgetName: "wfWatchdog", component: "wf-watchdog" },
                        { name: "Rotation Container", icon: "", widgetName: "wfRotationContainer", component: "wf-rotation-container" },
                        { name: "Motion Container", icon: "", widgetName: "wfMotionContainer", component: "wf-motion-container" },
                        { name: "SVG Pfad", icon: "", widgetName: "wfSvgPath", component: "wf-svg-path" },
                    ],
                    componentsEN: [
                        { name: "Indicator", icon: "", widgetName: "wfStateIndicator", component: "wf-state-indicator" },
                        { name: "State component", icon: "", widgetName: "wfStateCssClass", component: "wf-state-symbol" },
                        { name: "Status switch gear", icon: "", widgetName: "wfSwitchGear", component: "wf-switch-gear" },
                        { name: "Status switch symbol", icon: "", widgetName: "wfSwitchSymbol", component: "wf-switch-symbol" },
                        { name: "Status switch transformer", icon: "", widgetName: "wfSwitchTransformer", component: "wf-switch-transformer" },
                        { name: "State text", icon: "", widgetName: "wfStateText", component: "wf-state-text" },
                        { name: "Rotation container", icon: "", widgetName: "wfRotationContainer", component: "wf-rotation-container" },
                        { name: "Motion container", icon: "", widgetName: "wfMotionContainer", component: "wf-motion-container" },
                        { name: "Watchdog", icon: "", widgetName: "wfWatchdog", component: "wf-watchdog" },
                        { name: "SVG path", icon: "", widgetName: "wfSvgPath", component: "wf-svg-path" },
                    ]
                },

                {
                    category: "Historische Daten",
                    categoryEN: "Historical Data",
                    icon: "fa fa-bar-chart-o",
                    components: [
                        { name: "Logtag Chart", icon: "", widgetName: "wfLogTagTrend", component: "wf-chart-1" },
                        { name: "Logtag Tabelle", icon: "", widgetName: "wfLogTagTable", component: "wf-log-table" },
                        { name: "Logtag Arc", icon: "", widgetName: "wfLogTagArc", component: "wf-logtag-arc" },
                        { name: "Logtag Kennzahlen", icon: "", widgetName: "wfLogTagAnalytics", component: "wf-logtag-analytics" },
                        { name: "Historical Data Chart", icon: "", widgetName: "wfHistoricalDataChart", component: "wf-historical-data-chart" },
                        { name: "Historical Data Series Details", icon: "", widgetName: "wfHistoricalDataSeriesDetails", component: "wf-historical-data-series-details" },
                        { name: "Historical Data Cursor Details", icon: "", widgetName: "wfHistoricalDataCursorDetails", component: "wf-historical-data-cursor-details" },
                    ],
                    componentsEN: [
                        { name: "Logtag Trendchart", icon: "", widgetName: "wfLogTagTrend", component: "wf-chart-1" },
                        { name: "Logtag Table", icon: "", widgetName: "wfLogTagTable", component: "wf-log-table" },
                        { name: "Logtag Arc", icon: "", widgetName: "wfLogTagArc", component: "wf-logtag-arc" },
                        { name: "Logtag Characteristic Numbers", icon: "", widgetName: "wfLogTagAnalytics", component: "wf-logtag-analytics" },
                        { name: "Daten Diagramm", icon: "", widgetName: "wfHistoricalDataChart", component: "wf-historical-data-chart" },
                        { name: "Daten Serien Details", icon: "", widgetName: "wfHistoricalDataSeriesDetails", component: "wf-historical-data-series-details" },
                        { name: "Daten Cursor Details", icon: "", widgetName: "wfHistoricalDataCursorDetails", component: "wf-historical-data-cursor-details" },
                  ]
                },

                {
                    category: "Internationalisierung",
                    categoryEN: "Internationalisation",
                    icon: "fa fa-language",
                    components: [
                        { name: "Sprachauswahl", icon: "", widgetName: "wfLanguageDropdown", component: "wf-language-selector" },
                        { name: "Übersetzbarer Text", icon: "", widgetName: "wfSymbolicText", component: "wf-symbolictext" }
                    ],
                    componentsEN: [
                        { name: "Language selection", icon: "", widgetName: "wfLanguageDropdown", component: "wf-language-selector" },
                         { name: "Translatable text", icon: "", widgetName: "wfSymbolicText", component: "wf-symbolictext" }
                    ]
                },

                {
                    category: "Sicherheit",
                    categoryEN: "Security",
                    icon: "wf-lg wf-lock",
                    components: [
                        { name: "User Login", icon: "", widgetName: "wfUserLogin", component: "wf-user-login" },
                        { name: "Geschützter Bereich", icon: "", widgetName: "wfSecuredContainer", component: "wf-secured-container" },
                        { name: "User Berechtigungen", icon: "", widgetName: "wfUserAuthorizationsList", component: "wf-user-authorizations-list" },
                        { name: "Userinformationen", icon: "", widgetName: "wfUserInformation", component: "wf-user-information" },
                        { name: "Sichtbarer Bereich", icon: "", widgetName: "wfVisibilityContainer", component: "wf-visibility-container" },
                        { name: "Freigegebener Bereich", icon: "", widgetName: "wfEnableContainer", component: "wf-enable-container" },
                        { name: "Benutzer Manager", icon: "", widgetName: "wfUserManager", component: "wf-user-manager" },
                    ],
                    componentsEN: [
                        { name: "User Login", icon: "", widgetName: "wfUserLogin", component: "wf-user-login" },
                        { name: "Secured area", icon: "", widgetName: "wfSecuredContainer", component: "wf-secured-container" },
                        { name: "User permissions", icon: "", widgetName: "wfUserAuthorizationsList", component: "wf-user-authorizations-list" },
                        { name: "User information", icon: "", widgetName: "wfUserInformation", component: "wf-user-information" },
                        { name: "Visible area", icon: "", widgetName: "wfVisibilityContainer", component: "wf-visibility-container" },
                        { name: "Enabled area", icon: "", widgetName: "wfEnableContainer", component: "wf-enable-container" },
                        { name: "User manager", icon: "", widgetName: "wfUserManager", component: "wf-user-manager" },
                    ]
                },
                {
                    category: "Alarme und Meldungen",
                    categoryEN: "Alarms and Notifications",
                    icon: " wf-lg wf-alarm",
                    components: [
                        { name: "Alarmliste", icon: "", widgetName: "wfAlarmViewer", component: "wf-alarm-viewer" },
                        { name: "Logbook", icon: "", widgetName: "wfLogbook", component: "wf-logbook" },
                        // { name: "Logbook Viewer", icon: "", widgetName: "wfLogbookViewer", component: "wf-logbook-viewer" },
                        { name: "Alarmstatus Manager", icon: "", widgetName: "wfAlarmStateManager", component: "wf-alarm-state-manager" }
                    ],
                    componentsEN: [
                        { name: "Alarm list", icon: "", widgetName: "wfAlarmViewer", component: "wf-alarm-viewer" },
                        { name: "Logbook", icon: "", widgetName: "wfLogbook", component: "wf-logbook" },
                        // { name: "Logbook Viewer", icon: "", widgetName: "wfLogbookViewer", component: "wf-logbook-viewer" },
                        { name: "Alarm state manager", icon: "", widgetName: "wfAlarmStateManager", component: "wf-alarm-state-manager" }
                    ]
                },
                {
                    category: "Utilities",
                    categoryEN: "Utilities",
                    icon: " wf-lg wf-cog",
                    components: [
                        { name: "Lokales Skript", icon: "", widgetName: "wf-local-script", component: "wf-local-script" },
                        { name: "Localer Array Splitter", icon: "", widgetName: "wf-local-array-splitter", component: "wf-local-array-splitter" },
                    ],
                    componentsEN: [
                        { name: "Local Script", icon: "", widgetName: "wf-local-script", component: "wf-local-script" },
                        { name: "Local Array Splitter", icon: "", widgetName: "wf-local-array-splitter", component: "wf-local-array-splitter" },
                    ]
                }, 
                {
                    category: "Rezepte",
                    categoryEN: "Recipes",
                    icon: " wf wf-document",
                    components: [
                        { name: "Rezept", icon: "", widgetName: "wf-recipe", component: "wf-recipe" },
                        { name: "Rezeptverwaltung", icon: "", widgetName: "wf-recipe-management", component: "wf-recipe-management" },
                    ],
                    componentsEN: [
                        { name: "Recipe", icon: "", widgetName: "wf-recipe", component: "wf-recipe" },
                        { name: "Recipe Management", icon: "", widgetName: "wf-recipe-management", component: "wf-recipe-management" },
                    ]
                },
            ]);

        };

        ctor.prototype = {
            activate: function (settings) {
                var self = this;
                var connector = self.connector = new signalsConnector();
                self.settings = settings;
                self.selectedWidgetName = ko.observable(settings.selectedWidgetName || "");
                self.selectedCategory = settings.selectedCategory;

                switch (connector.currentLanguageId()) {
                    case -1:
                        self.selectedLanguageId(7); // Fall back to german language ID if no language ID available 
                        break;
                    default:
                        self.selectedLanguageId = connector.currentLanguageId;
                        break;
                }
            }
        };
        return ctor;
    });
