define(["require", "exports"], function (require, exports) {
    "use strict";
    var Language;
    (function (Language) {
        Language[Language["Danish"] = 6] = "Danish";
        Language[Language["German"] = 7] = "German";
        Language[Language["English"] = 9] = "English";
        Language[Language["Holland"] = 19] = "Holland";
        Language[Language["Russian"] = 25] = "Russian";
        Language[Language["Swedish"] = 29] = "Swedish";
    })(Language || (Language = {}));
    var LocalSymbolicTextService = /** @class */ (function () {
        function LocalSymbolicTextService() {
        }
        LocalSymbolicTextService.getData = function (languageId) {
            var dtos = [];
            dtos.push(this.getCommonData(languageId));
            dtos.push(this.getSchowCaseData(languageId));
            var dto = {};
            for (var i = 0; i < dtos.length; i++)
                _.extend(dto, dtos[i]);
            var result = [];
            for (var propertyName in dto) {
                var item = {};
                item.SymbolicText = propertyName;
                var translation = {};
                translation.LanguageID = languageId;
                translation.Translation = dto[propertyName];
                item.Translations = [translation];
                result.push(item);
            }
            return result;
        };
        LocalSymbolicTextService.getCommonData = function (languageId) {
            switch (languageId) {
                case Language.German:
                    return {
                        I4SCADA_Table_Headline: 'Eigenschaften für diese Komponente',
                        I4SCADA_Properties: 'Eigenschaft',
                        I4SCADA_Type: 'Typ',
                        I4SCADA_Default_Value: 'Standard Wert',
                        I4SCADA_Description: 'Beschreibung',
                        I4SCADA_Examples: 'Beispiele',
                        I4SCADA_Parts: 'Inhalt innerhalb der Komponente einfügen',
                        I4SCADA_Binary_Operator: 'Indicator - Binärer Operator',
                        I4SCADA_Characteristics: '* Verfügbare Optionen',
                        I4SCADA_Example_Header: 'Voll konfigurierbare Gauges mit beliebigen Wertebereichen.',
                        I4SCADA_Examples_TipMode: 'Beispiel als Taster',
                        I4SCADA_Examples_Increment: 'Beispiel mit in­kre­men­tellen Zuwachs',
                        I4SCADA_Size: 'Größe',
                        I4SCADA_Examples_StaticUnitText: 'Beispiele mit staticUnitText',
                        I4SCADA_Examples_DisplayClass: 'Beispiele mit displayClass',
                        I4SCADA_Examples_DisplaySize: 'Beispiele mit displaySize',
                        I4SCADA_Examples_Right: 'Beispiele - rechtsseitige Ausrichtung',
                        I4SCADA_Examples_Left: 'Beispiele - linksseitige Ausrichtung',
                        I4SCADA_Examples_Vertical: 'Beispiele - vertikale Ausrichtung',
                        I4SCADA_Examples_Flexible: 'Beispiele - flexible Breite',
                        I4SCADA_Examples_Scale: 'Beispiele für unterschiedliche Skalen',
                        I4SCADA_Examples_Scale_Linear: 'Slider mit linearen Skala und Labels',
                        I4SCADA_Examples_Scale_Logarithmic: 'Slider mit logarithmischen Skala und Labels',
                        I4SCADA_Examples_Color: 'Optionale, vordefinierten Farben',
                        I4SCADA_Examples_Handle: 'Beispiele mit unterschiedlichen Slider-Handles',
                        I4SCADA_Examples_Handle_Custom: 'Kundenspezifischer Handle',
                        I4SCADA_Examples_Tooltip: 'Beispiele für Tooltip',
                        I4SCADA_Examples_Tooltip_WithOut: 'Slider ohne Tooltip',
                        I4SCADA_Examples_Tooltip_With: 'Slider mit permanent sichtbaren Tooltip',
                        I4SCADA_Examples_Write_Secure: 'Beispiel für passwordgesichertes Schreiben (writeSecure)',
                        I4SCADA_Components_Highlights: 'WEBfactory i4SCADA App HTML/JS Komponenten',
                        I4SCADA_Visualization: 'Visualisieren',
                        I4SCADA_Control: 'Bedienen',
                        I4SCADA_Historical_Data: 'Historische Daten',
                        I4SCADA_Internationalisation: 'Internationalisierung',
                        I4SCADA_Security: 'Sicherheit',
                        I4SCADA_Alarms_Notifications: 'Alarme und Meldungen',
                        I4SCADA_Symbol_Library: 'WEBfactory Symbolbibliothek',
                        I4SCADA_Visualization_Description: 'Anzeigen von Prozessadaten und Anlagenzuständen',
                        I4SCADA_Control_Description: 'Schreiben von Prozessdatenpunkten',
                        I4SCADA_Historical_Data_Description: 'Anzeigen von historischen Daten als Tabelle oder Charts',
                        I4SCADA_Internationalisation_Description: 'Sprachumschaltung und übersetzbare Texte',
                        I4SCADA_Security_Description: 'Benutzeranmeldung und Anzeigen von Inhalten in Abhängigkeit von Benutzerberechtigungen.',
                        I4SCADA_Alarms_Notifications_Description: 'Anzeigen und Quittieren von aktuellen und historischen Alarmierungen und Meldungen',
                        I4SCADA_Symbol_Library_Description: 'WEBfactory Symbolbibliothek mit über 1200 vektorbasierten Icons und Symbolen aus HVAC, Elektro- und Prozesstechnik',
                        I4SCADA_Comnponents_Examples: 'Beispiele für die Komponenten',
                        I4SCADA_Icons_Reference: 'Icons Referenz',
                        I4SCADA_Binding_Handlers: 'Übersicht Knockout JS "Binding Handler"',
                        I4SCADA_Tutorial_Dynamic_Properties: 'Dynamische Komponenten',
                        I4SCADA_Graphical_Components_Overview: 'Übersicht grafische Komponenten',
                        I4SCADA_TutorialOnlineValues: 'Tutorial für online Signalwerte',
                        I4SCADA_Tutorial_Ko: 'Tutorial Knockout JS Grundlagen',
                        I4SCADA_Tutorial_Log_Tags: 'Tutorial für Abfrage von historischen Signalwerten',
                        I4SCADA_Tutorial_External_Webservice: 'Tutorial Verwendung von einem Webservice',
                        I4SCADA_Tutorial_Secured_Service: 'Secured Service',
                        I4SCADA_Tutorial_Visual_Security_Service: 'Security Service',
                        I4SCADA_Tutorial_States_Service: 'States Service',
                        I4SCADA_Tutorial_Changed_Field_Animation_Service: 'Changed Field Animation Service',
                        I4SCADA_Tutorial_Buffer_Write: 'Buffer Write',
                        I4SCADA_Tutorial_Signals: 'Signal List'
                    };
                default:
                    return {
                        I4SCADA_Table_Headline: 'Properties of the component',
                        I4SCADA_Properties: 'Property',
                        I4SCADA_Type: 'Type',
                        I4SCADA_Default_Value: 'Default value',
                        I4SCADA_Description: 'Description',
                        I4SCADA_Examples: 'Examples',
                        I4SCADA_Parts: 'Content injection inside the component',
                        I4SCADA_Binary_Operator: 'Indicator - binary operator',
                        I4SCADA_Characteristics: '* Available options',
                        I4SCADA_Example_Header: 'Configurable gauge with optional treshholds.',
                        I4SCADA_Examples_TipMode: 'Examples with TipMode',
                        I4SCADA_Examples_Increment: 'Examples with increment',
                        I4SCADA_Size: 'Size',
                        I4SCADA_Examples_StaticUnitText: 'Examples with staticUnitText',
                        I4SCADA_Examples_DisplayClass: 'Examples with displayClass',
                        I4SCADA_Examples_DisplaySize: 'Examples with displaySize',
                        I4SCADA_Examples_Right: 'Examples - right alignment',
                        I4SCADA_Examples_Left: 'Examples - left alignment',
                        I4SCADA_Examples_Vertical: 'Examples - vertical alignment',
                        I4SCADA_Examples_Flexible: 'Examples - flexible width',
                        I4SCADA_Examples_Scale: 'Examples for different scales',
                        I4SCADA_Examples_Scale_Linear: 'Slider with a linearen scale and labels',
                        I4SCADA_Examples_Scale_Logarithmic: 'Slider with a logarithmic scale and labels',
                        I4SCADA_Examples_Color: 'Optional predefined colors',
                        I4SCADA_Examples_Handle: 'Examples with different slide handles',
                        I4SCADA_Examples_Handle_Custom: 'Custom Handle',
                        I4SCADA_Examples_Tooltip: 'Examples for Tooltip',
                        I4SCADA_Examples_Tooltip_WithOut: 'Slider without Tooltip',
                        I4SCADA_Examples_Tooltip_With: 'Slider with a permanant visible Tooltip',
                        I4SCADA_Examples_Write_Secure: 'Example for password protected writing (writeSecure)',
                        I4SCADA_Components_Highlights: 'WEBfactory i4SCADA App HTML/JS Components',
                        I4SCADA_Visualization: 'Visualization',
                        I4SCADA_Control: 'Control',
                        I4SCADA_Historical_Data: 'Historical Data',
                        I4SCADA_Internationalisation: 'Internationalisation',
                        I4SCADA_Security: 'Security',
                        I4SCADA_Alarms_Notifications: 'Alarms and Notifications',
                        I4SCADA_Symbol_Library: 'WEBfactory Symbol Library',
                        I4SCADA_Visualization_Description: 'Display of process data and plant status',
                        I4SCADA_Control_Description: 'Writing to process data points',
                        I4SCADA_Historical_Data_Description: 'Display of historical data as a table or chart',
                        I4SCADA_Internationalisation_Description: 'Language selector and translatable texts',
                        I4SCADA_Security_Description: 'User login and display of content depending on user permissions',
                        I4SCADA_Alarms_Notifications_Description: 'Display and acknowledge current and historical alarms and notifications',
                        I4SCADA_Symbol_Library_Description: 'WEBfactory icon library with over 1200 vector-based icons and symbols from HVAC, electrical and process engineering',
                        I4SCADA_Comnponents_Examples: 'Examples for such components',
                        I4SCADA_Icons_Reference: 'Icons reference',
                        I4SCADA_Binding_Handlers: 'Overview of Knockout JS "Binding Handlers"',
                        I4SCADA_Tutorial_Dynamic_Properties: 'Dynamic components',
                        I4SCADA_Graphical_Components_Overview: 'Graphical components overview',
                        I4SCADA_TutorialOnlineValues: 'Tutorial online values',
                        I4SCADA_Tutorial_Ko: 'Tutorial Knockout JS basics',
                        I4SCADA_Tutorial_Log_Tags: 'Tutorial for historical data retrieval',
                        I4SCADA_Tutorial_External_Webservice: 'Tutorial for using an external webservice',
                        I4SCADA_Tutorial_Secured_Service: 'Secured service',
                        I4SCADA_Tutorial_Visual_Security_Service: 'Security service',
                        I4SCADA_Tutorial_States_Service: 'States service',
                        I4SCADA_Tutorial_Changed_Field_Animation_Service: 'Changed field animation service',
                        I4SCADA_Tutorial_Buffer_Write: 'Buffer Write',
                        I4SCADA_Tutorial_Signals: 'Signal List'
                    };
            }
        };
        LocalSymbolicTextService.getSchowCaseData = function (languageId) {
            switch (languageId) {
                case Language.German:
                    return {
                        I4SCADA_AllWidgets_Header: 'WEBfactory i4SCADA App - Components Referenzliste',
                        //#region scwfValue
                        I4SCADA_scwfValue_Widget_Header: "Einfache Anzeige von einem Signalwert.",
                        I4SCADA_scwfValue_Component_Header: "Einfache Anzeige von einem Signalwert.",
                        //#endregion
                        //#region scwfValueDisplay
                        I4SCADA_scwfValueDisplay_Widget_Header: "Erweitertes, konfigurierbares Widget für die Ausgabe von einem Signalwert.",
                        I4SCADA_scwfValueDisplay_Component_Header: "Erweiterte, konfigurierbare Komponente für die Ausgabe von einem Signalwert.",
                        //#endregion
                        //#region scwfValueGauge
                        I4SCADA_scwfValueGauge_Widget_Header: "Einfaches, konfigurierbares Gauge Widget mit einfärbbaren Wertebereichen.",
                        I4SCADA_scwfValueGauge_Component_Header: "Einfache, konfigurierbare Gauge Komponente mit einfärbbaren Wertebereichen.",
                        //#endregion
                        //#region scwfValueArc
                        I4SCADA_scwfValueArc_Widget_Header: "Arc / Bogen Widget für das Anzeigen von Signalwerten.",
                        I4SCADA_scwfValueArc_Component_Header: "Arc / Bogen Komponente für das Anzeigen von Signalwerten.",
                        //#endregion
                        //#region scwfValueBarGraph
                        I4SCADA_scwfValueBarGraph_Widget_Header: "Konfigurierbare Fortschrittsanzeige (Bargraph) für die Ausgabe von einem Signalwert.",
                        I4SCADA_scwfValueBarGraph_Component_Header: "Konfigurierbare Fortschrittsanzeige (Bargraph) für die Ausgabe von einem Signalwert.",
                        //#endregion
                        //#region scwfStateIndicator
                        I4SCADA_scwfStateIndicator_Widget_Header: "Grafische, konfigurierbare Statusanzeige.",
                        I4SCADA_scwfStateIndicator_Component_Header: "Grafische, konfigurierbare Statusanzeige.",
                        //#endregion
                        //#region scwfSensorValue
                        I4SCADA_scwfSensorValue_Widget_Header: "Einfaches Widget mit einem Sensorsymbol und Signalwert.",
                        I4SCADA_scwfSensorValue_Component_Header: "Einfache Komponente mit einem Sensorsymbol und Signalwert.",
                        //#endregion
                        //#region scwfStateCssClass
                        I4SCADA_scwfStateCssClass_Widget_Header: "Einfaches Widget für die Ausgabe von einem Status basierend auf CSS Klassennamen analog zu Signalwerten.",
                        I4SCADA_scwfStateCssClass_Component_Header: "Einfache Komponente für die Ausgabe von einem Status basierend auf CSS Klassennamen analog zu Signalwerten.",
                        //#endregion
                        //#region scwfStateText
                        I4SCADA_scwfStateText_Widget_Header: "Einfaches Widget für die Ausgabe von einem Statustext analog zu Signalwerten.",
                        I4SCADA_scwfStateText_Component_Header: "Einfache Komponente für die Ausgabe von einem Statustext analog zu Signalwerten.",
                        //#endregion
                        //#region scwfStateDisplay
                        I4SCADA_scwfStateDisplay_Widget_Header: "Konfigurierbares Widget für die Ausgabe von einem Statustext analog zu Signalwerten.",
                        //#endregion
                        //#region scwfWatchdog
                        I4SCADA_scwfWatchdog_Widget_Header: "Ein Watchdog Widget für Überwachung der dauerhaften Kommunikation zum Server.",
                        I4SCADA_scwfWatchdog_Component_Header: "Ein Watchdog Komponente für Überwachung der dauerhaften Kommunikation zum Server.",
                        //#endregion
                        //#region scwfSignalInformation
                        I4SCADA_scwfSignalInformation_Widget_Header: "Einfaches Widget für die Ausgabe von Signalinformationen aus der Webfactory Projektdatenbank – z.B. Einheit (Unit), Signalbeschreibung (Description).",
                        I4SCADA_scwfSignalInformation_Component_Header: "Einfache Komponente für die Ausgabe von Signalinformationen aus der Webfactory Projektdatenbank – z.B. Einheit (Unit), Signalbeschreibung (Description).",
                        //#endregion
                        //#region scwfSignalList
                        I4SCADA_scwfSignalList_Component_Header: "Komponente für die Ausgabe einer Signalliste als Signalwertanzeige, Signalwerteingabe oder Signalinformationen als Tabelle.",
                        I4SCADA_scwfSignalList_preconfigured_signal_selection: "Signalliste mit eingschränkter Signalauswahl zur Laufzeit",
                        I4SCADA_scwfSignalList_preconfigured_signal_group_selection: "Signalliste mit eingschränkter Signalgruppenauswahl zur Laufzeit",
                        //#endregion
                        //#region scwfWriteValueButton
                        I4SCADA_scwfWriteValueButton_Widget_Header: "Konfigurierbares Button Widget für das Schreiben von einem Signalwert.",
                        I4SCADA_scwfWriteValueButton_Component_Header: "Konfigurierbare Button Komponente für das Schreiben von einem Signalwert.",
                        //#endregion
                        //#region scwfSwitchValue
                        I4SCADA_scwfSwitchValue_Widget_Header: "Konfigurierbarer Schalter zum schreiben von Signalwerten.",
                        I4SCADA_scwfSwitchValue_Component_Header: "Konfigurierbarer Schalter zum schreiben von Signalwerten.",
                        //#endregion
                        //#region scwfSwitchValue3States
                        I4SCADA_scwfSwitchValue3States_Widget_Header: "Konfigurierbarer Kippschalter mit drei Zuständen.",
                        I4SCADA_scwfSwitchValue3States_Component_Header: "Konfigurierbarer Kippschalter mit drei Zuständen.",
                        //#endregion
                        //#region scwfWriteValueCombobox
                        I4SCADA_scwfWriteValueCombobox_Widget_Header: "Konfigurierbares Combobox Widget für die Auswahl und Schreiben von Signalwerten.",
                        I4SCADA_scwfWriteValueCombobox_Component_Header: "Konfigurierbare Komponente für die Auswahl und Schreiben von Signalwerten.",
                        //#endregion
                        //#region scwfInputValue
                        I4SCADA_scwfInputValue_Widget_Header: "Konfigurierbares Widget für die Eingabe von einem Signalwert.",
                        I4SCADA_scwfInputValue_Component_Header: "Konfigurierbare Komponente für die Eingabe von einem Signalwert.",
                        //#endregion
                        //#region scwfSlider
                        I4SCADA_scwfSlider_Widget_Header: "Einfaches Widget zum Anzeigen eines Signalwert.",
                        I4SCADA_scwfSlider_Component_Header: "Einfache Komponente Anzeigen eines Signalwert.",
                        //#endregion
                        //#region scwfLogTagTrend
                        I4SCADA_scwfLogTagTrend_Widget_Header: "Anzeige historischer Werte von Datenaufzeichnungspunkten (LogTags) als Trendkurve.",
                        I4SCADA_scwfLogTagTrend_Component_Header: "Anzeige historischer Werte von Datenaufzeichnungspunkten (LogTags) als Trendkurve.",
                        //#endregion
                        //#region scwfLogTagTable
                        I4SCADA_scwfLogTagTable_Widget_Header: "Anzeige historischer Werte von Datenaufzeichnungspunkten (LogTags) als Tabelle.",
                        I4SCADA_scwfLogTagTable_Component_Header: "Anzeige historischer Werte von Datenaufzeichnungspunkten (LogTags) als Tabelle.",
                        //#endregion
                        //#region scwfLanguageDropdown
                        I4SCADA_scwfLanguageDropdown_Widget_Header: "Einfaches Widget für die Sprachauswahl von WEBfactory.",
                        I4SCADA_scwfLanguageDropdown_Component_Header: "Einfache Komponente für die Sprachauswahl von WEBfactory.",
                        //#endregion
                        //#region scwfSymbolicText
                        I4SCADA_scwfSymbolicText_Widget_Header: "Einfaches Widget für die Ausgabe von Übersetzungstexten.",
                        I4SCADA_scwfSymbolicText_Component_Header: "Einfache Komponente für die Ausgabe von Übersetzungstexten.",
                        //#endregion
                        //#region scwfUserLogin
                        I4SCADA_scwfUserLogin_Widget_Header: "Einfaches Widget für die Ausgabe von Informationen über den angemeldeten Benutzers.",
                        I4SCADA_scwfUserLogin_Component_Header: "Einfache Komponente für die Ausgabe von Informationen über den angemeldeten Benutzers.",
                        //#endregion
                        //#region scwfSecuredContainer
                        I4SCADA_scwfSecuredContainer_Widget_Header: "Ausgabe und Ausblenden von Inhalten in Abhängigkeit von Projektberechtigungen des Benutzers.",
                        I4SCADA_scwfSecuredContainer_Component_Header: "Ausgabe und Ausblenden von Inhalten in Abhängigkeit von Projektberechtigungen des Benutzers.",
                        //#endregion
                        //#region scwfUserAuthorizationsList
                        I4SCADA_scwfUserAuthorizationsList_Widget_Header: "Ausgabe von Benutzerberechtigungen - Projektberechtigungen.",
                        I4SCADA_scwfUserAuthorizationsList_Component_Header: "Ausgabe von Benutzerberechtigungen - Projektberechtigungen.",
                        //#endregion
                        //#region scwfUserInformation
                        I4SCADA_scwfUserInformation_Widget_Header: "Einfaches Widget für die Ausgabe von Informationen über den angemeldeten Benutzers.",
                        I4SCADA_scwfUserInformation_Component_Header: "Einfache Komponente für die Ausgabe von Informationen über den angemeldeten Benutzers.",
                        //#endregion
                        //#region scwfAlarmViewer
                        I4SCADA_scwfAlarmViewer_Widget_Header: "Widget für die Ausgabe von online und historischen Alarmen.",
                        I4SCADA_scwfAlarmViewer_Component_Header: "Konfigurierbare Komponente für die Eingabe von einem Signalwert.",
                        //#endregion
                        //#region scwfAlarmViewer
                        I4SCADA_scwfAlarmStateManager_Widget_Header: "Widget für das Ändern des Alarm Bearbeitungsstatus.",
                        I4SCADA_scwfAlarmStateManager_Component_Header: "Konfigurierbare Komponente für das Ändern des Alarm Bearbeitungsstatus.",
                        //#endregion
                        //#region scwfLogbook
                        I4SCADA_scwfLogbook_Widget_Header: "Logbuch Widget welches dem Benutzer ermöglicht zur Laufzeit Ereignislogs zu speziellen Themen einzugeben, anzuzeigen und zu filtern.",
                        I4SCADA_scwfLogbook_Component_Header: "Logbuch Widget welches dem Benutzer ermöglicht zur Laufzeit Ereignislogs zu speziellen Themen einzugeben, anzuzeigen und zu filtern.",
                        //#endregion
                        //#region scwfLogbookViewer
                        I4SCADA_scwfLogbookViewer_Widget_Header: "Logbook Viewer Widget.",
                        I4SCADA_scwfLogbookViewer_Component_Header: "Logbook Viewer Komponente.",
                        //#endregion
                        //#region scwfConfiguration
                        I4SCADA_scwfConfiguration_Component_Header: "Komponente für eine Anzeige eines Konfigurationsmanagers.",
                        //#endregion
                        //#region scwfLogTagTable
                        I4SCADA_scwfLogTagAnalytics_Widget_Header: "Konfigurierbare Anzeige von Minimum-, Maximum- und Durchschnittwert für Datenaufzeichnungspunkte (LogTags).",
                        I4SCADA_scwfLogTagAnalytics_Component_Header: "Konfigurierbare Anzeige von Minimum, Maximum und Durchschnittwert für Datenaufzeichnungspunkte (LogTags).",
                        //#endregion
                        //#region scwfVisibilityContainer
                        I4SCADA_scwfVisibilityContainer_Widget_Header: "Ein- oder Ausblenden von Inhalten in Abhängigkeit von einem Signalwert.",
                        I4SCADA_scwfVisibilityContainer_Component_Header: "Ein- oder Ausblenden von Inhalten in Abhängigkeit von einem Signalwert.",
                        //#endregion
                        //#region scwfEnableContainer
                        I4SCADA_scwfEnableContainer_Widget_Header: "Freigabe und Sperre von Inhalten in Abhängigkeit vom Signalwert.",
                        I4SCADA_scwfEnableContainer_Component_Header: "Freigabe und Sperre von Inhalten in Abhängigkeit vom Signalwert.",
                        //#endregion
                        //#region scwfWriteValueButton
                        I4SCADA_scwfToggleButton_Widget_Header: "Toggle Button Widget für die Umschaltung von zwei Signalwerten.",
                        I4SCADA_scwfToggleButton_Component_Header: "Toggle Button Komponente für die Umschaltung von zwei Signalwerten.",
                        //#endregion
                        //#region scwfRotationContainer
                        I4SCADA_scwfRotationContainer_Widget_Header: "Container Komponente, die abhängig von einem Signalwert den Drehwinkel ihres Inhalts dynamisch ändern kann.",
                        I4SCADA_scwfRotationContainer_Component_Header: "Container Komponente, die abhängig von einem Signalwert den Drehwinkel ihres Inhalts dynamisch ändern kann.",
                        //#endregion
                        //#region scwfMotionContainer
                        I4SCADA_scwfMotionContainer_Widget_Header: "Container Komponente, die abhängig von einem Signalwert den Position Offset ihres Inhalts dynamisch ändern kann.",
                        I4SCADA_scwfMotionContainer_Component_Header: "Container Komponente, die abhängig von einem Signalwert den Position Offset ihres Inhalts dynamisch ändern kann.",
                        //#endregion
                        //#region scWfBufferButton
                        I4SCADA_scwfBufferButton_Widget_Header: "Konfigurierbares Pufferbutton Widget für das Schreiben von einem Signalwert vom Puffer direkt in den Signal.",
                        I4SCADA_scwfBufferButton_Component_Header: "Konfigurierbare Pufferbutton Komponente das Schreiben von einem Signalwert vom Puffer direkt in den Signal.",
                        //#endregion
                        //#region scWfRadioButtons
                        I4SCADA_scWfRadioButtons_Widget_Header: "Konfigurierbarer Radiobutton zum Schreiben von Signalwerten.",
                        I4SCADA_scWfRadioButtons_Component_Header: "Konfigurierbare Radiobuttons zum Schreiben von Signalwerten.",
                        //#endregion
                        //#region scwfSignalInformationPopover
                        I4SCADA_scwfSignalInformationPopover_Widget_Header: "Das Widget für die Ausgabe von Signalinformationen aus der Webfactory Projektdatenbank als Popover – z.B. Einheit (Unit), Signalbeschreibung (Description).",
                        I4SCADA_scwfSignalInformationPopover_Component_Header: "Eine Komponente für die Anzeige von Datenpunktinformationen (z.B. Einheit, Signalbeschreibung) und Signalwert in einem Popover.",
                        //#endregion
                        //#region scwfModalDialog
                        I4SCADA_scwfModalDialog_Component_Header: "Komponente für eine Anzeige von modalen Dialogen mit Parametern.",
                        //#endregion
                        //#region scwfPopover
                        I4SCADA_scwfPopover_Component_Header: "Komponente für eine Anzeige eines Popover.",
                        //#endregion
                        //#region scwfValueArc
                        I4SCADA_scwfLogTagArc_Component_Header: "Konfigurierbare Arc / Bogen Komponente für Minimum, Maximum und Durchschnittwert von einem Datenaufzeichnungspunkt (LogTag).",
                        //#endregion
                        //#region tutorialBufferWrite
                        I4SCADA_tutorialBufferWrite_Page_Header: "Buffer Write",
                        I4SCADA_tutorialBufferWrite_Buffer_Description: "The three input fields are configured to write the quantities of three ingredients that compose a recipe. As the recipe must be updated all at once, the new quantities will be written to a buffer. You can use the Write Buffer or Reset Buffer buttons to either write the buffered values and change the recipe at once or reset the buffer.",
                        I4SCADA_tutorialBufferWrite_Buffer_Panel_Title: "Buffered Ingredients Quantities",
                        I4SCADA_tutorialBufferWrite_Signal_Label1: "Flour",
                        I4SCADA_tutorialBufferWrite_Signal_Label2: "Sugar",
                        I4SCADA_tutorialBufferWrite_Signal_Label3: "Salt",
                        I4SCADA_tutorialBufferWrite_Write_Buffer: "Write Buffer",
                        I4SCADA_tutorialBufferWrite_Reset_Buffer: "Reset Buffer",
                        I4SCADA_tutorialBufferWrite_Write_Description: "Once the Write Buffer button is pressed, the buffered values will be written to the assigned signals and the change will be reflected by the Written Ingredients Quantities panel.",
                        I4SCADA_tutorialBufferWrite_Written_Panel_Title: "Written Ingredients Quantities",
                        //#endregion
                        //#region scwfSvgPath                    
                        I4SCADA_scwfSvgPath_Component_Header: "Flexibles Statuselement mit einem Vektorpfad und optionaler Wertanzeige. Diese Komponente kann optional als Navigationslik fungieren.",
                        //#endregion
                        //#region scwfSwitchGear
                        I4SCADA_scwfSwitchGear_Component_Header: "Konfigurierbares Statussymbol für elektrotechnische Schaltanlagen.",
                        //#endregion
                        //#region scwfSwitchTransformer
                        I4SCADA_scwfSwitchTransformer_Component_Header: "Konfigurierbares Statussymbol für elektrotechnischen Transformator mit Schaltanlage.",
                        //#endregion
                        //#region wf-local-script
                        I4SCADA_scwfLocalScript_Component_Header: "Konfigurierbare Lokales Skript für Lokale Signale.",
                        I4SCADA_Script_Example_Sum_Values: "Summieren von Werten",
                        I4SCADA_Script_Example_Connector: "Ein Connector Objekt",
                        I4SCADA_Script_Example_Conditional: "Einfache Bedingung",
                        //#endregion
                        //#region wf-local-array-splitter
                        I4SCADA_scwfLocalArraySplitter_Component_Header: "Konfigurierbarer Array Splitter für das splitten von Lokalen Signale.",
                        //#endregion
                        //#region Recipes
                        I4SCADA_scwfRecipe_Component_Header: "Konfigurierbare Rezept Komponente.",
                        I4SCADA_scwfRecipeManagement_Component_Header: "Konfigurierbare Rezept verwaltungs Komponente.",
                        //#endregion
                        //#region user-manager
                        I4SCADA_scwfUserManager_Component_Header: "Benutzerverwaltungs Komponente.",
                        //#endregion
                        //#region wf-setpoint-chart
                        I4SCADA_scwfSetpointChart_Component_Header: "Sollwertkurve.",
                        //#endregion
                        //#region wf-historical-data-chart
                        I4SCADA_scwfHistoricalDataChart_Component_Header: "Anzeige historischer Daten als Trendkurve.",
                        //#endregion
                        //#region wf-historical-data-series-details
                        I4SCADA_scwfHistoricalDataSeriesDetails_Component_Header: "Anzeige historischer Daten Details.",
                        //#endregion
                        //#region wf-historical-data-series-details
                        I4SCADA_scwfHistoricalDataCursorDetails_Component_Header: "Anzeige Cursor Details.",
                        //#endregion
                        //#region wf-signal-alarm-list
                        I4SCADA_scwfSignalAlarmList_Component_Header: "Anzeige Signalliste mit online Alarmen und Verarbeitungsinformationen.",
                    };
                default:
                    return {
                        I4SCADA_AllWidgets_Header: 'WEBfactory i4SCADA App - Components Reference List',
                        //#region scwfValue
                        I4SCADA_scwfValue_Widget_Header: "Simple Widget for outputting a signal value.",
                        I4SCADA_scwfValue_Component_Header: "Simple component for outputting a signal value.",
                        //#endregion
                        //#region scwfValueDisplay
                        I4SCADA_scwfValueDisplay_Widget_Header: "Advanced, configurable widget for outputting a signal value.",
                        I4SCADA_scwfValueDisplay_Component_Header: "Advanced, configurable component for outputting a signal value.",
                        //#endregion
                        //#region scwfValueGauge
                        I4SCADA_scwfValueGauge_Widget_Header: "Simple, configurable Gauge widget with colorable value ranges.",
                        I4SCADA_scwfValueGauge_Component_Header: "Simple, configurable Gauge component with colorable value ranges.",
                        //#endregion
                        //#region scwfValueArc
                        I4SCADA_scwfValueArc_Widget_Header: "Arc widget to show signalvalues.",
                        I4SCADA_scwfValueArc_Component_Header: "Arc component to show signalvalues.",
                        //#endregion
                        //#region scwfValueBarGraph
                        I4SCADA_scwfValueBarGraph_Widget_Header: "Configurable progress indicator (bar graph) for displaying a signal value.",
                        I4SCADA_scwfValueBarGraph_Component_Header: "Configurable progress indicator (bar graph) for displaying a signal value.",
                        //#endregion
                        //#region scwfStateIndicator
                        I4SCADA_scwfStateIndicator_Widget_Header: "Graphical, configurable status display.",
                        I4SCADA_scwfStateIndicator_Component_Header: "Graphical, configurable status display.",
                        //#endregion
                        //#region scwfSensorValue
                        I4SCADA_scwfSensorValue_Widget_Header: "Simple Widget to show a signal value with a sensor symbol.",
                        I4SCADA_scwfSensorValue_Component_Header: "Simple component to show a signal value with a sensor symbol.",
                        //#endregion
                        //#region scwfStateCssClass
                        I4SCADA_scwfStateCssClass_Widget_Header: "Simple widget for issuing a status based on CSS class names analogous to signal values.",
                        I4SCADA_scwfStateCssClass_Component_Header: "Simple component for issuing a status based on CSS class names analogous to signal values.",
                        //#endregion
                        //#region scwfStateText
                        I4SCADA_scwfStateText_Widget_Header: "Simple widget to show a state text analog to signal values.",
                        I4SCADA_scwfStateText_Component_Header: "Simple component to show a state text analog to signal values.",
                        //#endregion
                        //#region scwfStateDisplay
                        I4SCADA_scwfStateDisplay_Widget_Header: "Configurable widget for issuing a status text analogous to signal values.",
                        //#endregion
                        //#region scwfWatchdog
                        I4SCADA_scwfWatchdog_Widget_Header: "A watchdog widget to monnitoring the communication to the server.",
                        I4SCADA_scwfWatchdog_Component_Header: "A watchdog component to monnitoring the communication to the server.",
                        //#endregion
                        //#region scwfSignalInformation
                        I4SCADA_scwfSignalInformation_Widget_Header: "Simple widget on the issue of signal information from the Webfactory project database  - for example, Unit (Unit), signal description (Description).",
                        I4SCADA_scwfSignalInformation_Component_Header: "Simple component on the issue of signal information from the Webfactory project database  - for example, Unit (Unit), signal description (Description).",
                        //#endregion
                        //#region scwfSignalList
                        I4SCADA_scwfSignalList_Component_Header: "Component for a signal list output as a signal value display, signal value input or signal information table.",
                        I4SCADA_scwfSignalList_preconfigured_signal_selection: "Signal list with a limited signal selection at runtime.",
                        I4SCADA_scwfSignalList_preconfigured_signal_group_selection: "Signal list with a limited signal group selection at runtime.",
                        //#endregion
                        //#region scwfWriteValueButton
                        I4SCADA_scwfWriteValueButton_Widget_Header: "Configurable button for write signal value.",
                        I4SCADA_scwfWriteValueButton_Component_Header: "Configurable button for write signal value.",
                        //#endregion
                        //#region scwfSwitchValue
                        I4SCADA_scwfSwitchValue_Widget_Header: "Configurable switch for writing signal values.",
                        I4SCADA_scwfSwitchValue_Component_Header: "Configurable switch for writing signal values.",
                        //#endregion
                        //#region scwfSwitchValue3States
                        I4SCADA_scwfSwitchValue3States_Widget_Header: "Configurable tumbler switch with  three states.",
                        I4SCADA_scwfSwitchValue3States_Component_Header: "Configurable tumbler switch with  three states.",
                        //#endregion
                        //#region scwfWriteValueCombobox
                        I4SCADA_scwfWriteValueCombobox_Widget_Header: "Configurable combobox widget for writing signal values.",
                        I4SCADA_scwfWriteValueCombobox_Component_Header: "Configurable combobox component for writing signal values.",
                        //#endregion
                        //#region scwfInputValue
                        I4SCADA_scwfInputValue_Widget_Header: "Configurable widget to make a request with a signal value.",
                        I4SCADA_scwfInputValue_Component_Header: "Configurable component to make a request with a signal value.",
                        //#endregion
                        //#region scwfSlider
                        I4SCADA_scwfSlider_Widget_Header: "Simple Widget for outputting a signal value.",
                        I4SCADA_scwfSlider_Component_Header: "Simple Component for outputting a signal value.",
                        //#endregion
                        //#region scwfLogTagTrend
                        I4SCADA_scwfLogTagTrend_Widget_Header: "Display historical values of data recording points (LogTags) as Trendchart.",
                        I4SCADA_scwfLogTagTrend_Component_Header: "Display historical values of data recording points (LogTags) as Trendchart.",
                        //#endregion
                        //#region scwfLogTagTable
                        I4SCADA_scwfLogTagTable_Widget_Header: "Display historical values of data recording points (LogTags) as table.",
                        I4SCADA_scwfLogTagTable_Component_Header: "Display historical values of data recording points (LogTags) as table.",
                        //#endregion
                        //#region scwfLanguageDropdown
                        I4SCADA_scwfLanguageDropdown_Widget_Header: "Simple Widget for the languageselector from WEBfactory.",
                        I4SCADA_scwfLanguageDropdown_Component_Header: "Simple component for the languageselector from WEBfactory.",
                        //#endregion
                        //#region scwfSymbolicText
                        I4SCADA_scwfSymbolicText_Widget_Header: "Simple Widget for outputting of symbolic texts.",
                        I4SCADA_scwfSymbolicText_Component_Header: "Simple component for outputting of symbolic texts.",
                        //#endregion
                        //#region scwfUserLogin
                        I4SCADA_scwfUserLogin_Widget_Header: "Simple widget for outputting information about the logged-in user.",
                        I4SCADA_scwfUserLogin_Component_Header: "Simple component for outputting information about the logged-in user.",
                        //#endregion
                        //#region scwfSecuredContainer
                        I4SCADA_scwfSecuredContainer_Widget_Header: "Show and hide content depending on the user project permissions.",
                        I4SCADA_scwfSecuredContainer_Component_Header: "Show and hide content depending on the user project permissions.",
                        //#endregion
                        //#region scwfUserAuthorizationsList
                        I4SCADA_scwfUserAuthorizationsList_Widget_Header: "List of user permissions - project permissions.",
                        I4SCADA_scwfUserAuthorizationsList_Component_Header: "List of user permissions - project permissions.",
                        //#endregion
                        //#region scwfUserInformation
                        I4SCADA_scwfUserInformation_Widget_Header: "Simple widget for outputting information about the logged-in user.",
                        I4SCADA_scwfUserInformation_Component_Header: "Simple component for outputting information about the logged-in user.",
                        //#endregion
                        //#region scwfAlarmViewer
                        I4SCADA_scwfAlarmViewer_Widget_Header: "Widget for the issue of online and historical alarms.",
                        I4SCADA_scwfAlarmViewer_Component_Header: "Component for the issue of online and historical alarms.",
                        //#endregion
                        //#region scwfAlarmStateManager
                        I4SCADA_scwfAlarmStateManager_Widget_Header: "Widget for changing the processing state of alarms.",
                        I4SCADA_scwfAlarmStateManager_Component_Header: "Component for changing the processing state of alarms.",
                        //#endregion
                        //#region scwfLogbook
                        I4SCADA_scwfLogbook_Widget_Header: "Logbook widget that gives to the users the possibility to add, show and filter at runtime log entries about any kind of events marked with a topic.",
                        I4SCADA_scwfLogbook_Component_Header: "Logbook widget that gives to the users the possibility to add, show and filter at runtime log entries about any kind of events marked with a topic.",
                        //#endregion
                        //#region scwfLogbookViewer
                        I4SCADA_scwfLogbookViewer_Widget_Header: "Logbook Viewer Widget.",
                        I4SCADA_scwfLogbookViewer_Component_Header: "Logbook Viewer Component.",
                        //#endregion
                        //#region scwfConfiguration
                        I4SCADA_scwfConfiguration_Component_Header: "Component for manage of configurations.",
                        //#endregion
                        //#region scwfLogTagTable
                        I4SCADA_scwfLogTagAnalytics_Widget_Header: "Configurable output component for minimum, maximum and average values of log tags.",
                        I4SCADA_scwfLogTagAnalytics_Component_Header: "Configurable output component for minimum, maximum and average values of log tags.",
                        //#endregion
                        //#region scwfVisibilityContainer
                        I4SCADA_scwfVisibilityContainer_Widget_Header: "Show or hide content depending on a signal value.",
                        I4SCADA_scwfVisibilityContainer_Component_Header: "Show or hide content depending on a signal value",
                        //#endregion
                        //#region scwfEnableContainer
                        I4SCADA_scwfEnableContainer_Widget_Header: "Enable or disable content depending on a signal value.",
                        I4SCADA_scwfEnableContainer_Component_Header: "Enable or disable content depending on a signal value.",
                        //#endregion
                        //#region scwfWriteValueButton
                        I4SCADA_scwfToggleButton_Widget_Header: "Toggle button widget for switch between two signal values.",
                        I4SCADA_scwfToggleButton_Component_Header: "Toggle button component for switch between two signal values.",
                        //#endregion
                        //#region scwfRotationContainer
                        I4SCADA_scwfRotationContainer_Widget_Header: "Container component that can dynamically change the rotation of its content  depending on a signal value.",
                        I4SCADA_scwfRotationContainer_Component_Header: "Container component that can dynamically change the rotation of its content depending on a signal value.",
                        //#endregion
                        //#region scwfMotionContainer
                        I4SCADA_scwfMotionContainer_Widget_Header: "Container component that can dynamically change the position offset of its content depending on a signal value.",
                        I4SCADA_scwfMotionContainer_Component_Header: "Container component that can dynamically change the position offset of its content depending on a signal value.",
                        //#endregion
                        //#region scwfBufferButton
                        I4SCADA_scwfBufferButton_Widget_Header: "Configurable buffer button for write signal value from buffer into the signal.",
                        I4SCADA_scwfBufferButton_Component_Header: "Configurable buffer button for write signal value from buffer into the signal.",
                        //#endregion
                        //#region scWfRadioButtons
                        I4SCADA_scWfRadioButtons_Widget_Header: "Configurable radio button for selecting and writing of signal values.",
                        I4SCADA_scWfRadioButtons_Component_Header: "Configurable radio buttons writing of signal values.",
                        //#endregion
                        //#region scwfSignalInformationTooltip
                        I4SCADA_scwfSignalInformationPopover_Widget_Header: "The widget for outputting signal information from the WebFactory project database as popover - e.g. Unit (unit), signal description (Description).",
                        I4SCADA_scwfSignalInformationPopover_Component_Header: "A component that allows to show signal information (e.g. unit, description) and signal value as a popover.",
                        //#endregion
                        //#region scwfModalDialog
                        I4SCADA_scwfModalDialog_Component_Header: "Component for modal dialogs with parameters.",
                        //#endregion
                        //#region scwfPopover
                        I4SCADA_scwfPopover_Component_Header: "Component for popover.",
                        //#endregion
                        //#region scwfValueArc
                        I4SCADA_scwfLogTagArc_Component_Header: "Configurable arc component for minimum, maximum and average values of a log tag.",
                        //#endregion
                        //#region scwfSvgPath
                        I4SCADA_scwfSvgPath_Component_Header: "Flexible status component based on vector data with optional value display. This component can be also used as navigation link.",
                        //#endregion
                        //#region scwfSwitchGear
                        I4SCADA_scwfSwitchGear_Component_Header: "Configurable state symbol for electrotechnical switch gear.",
                        //#endregion
                        //#region scwfSwitchTransformer
                        I4SCADA_scwfSwitchTransformer_Component_Header: "Configurable state symbol for electrotechnical transformer with optional switch.",
                        //#endregion
                        //#region tutorialBufferWrite
                        I4SCADA_tutorialBufferWrite_Page_Header: "Buffer Write",
                        I4SCADA_tutorialBufferWrite_Buffer_Description: "The three input fields are configured to write the quantities of three ingredients that compose a recipe. As the recipe must be updated all at once, the new quantities will be written to a buffer. You can use the Write Buffer or Reset Buffer buttons to either write the buffered values and change the recipe at once or reset the buffer.",
                        I4SCADA_tutorialBufferWrite_Buffer_Panel_Title: "Buffered Ingredients Quantities",
                        I4SCADA_tutorialBufferWrite_Signal_Label1: "Flour",
                        I4SCADA_tutorialBufferWrite_Signal_Label2: "Sugar",
                        I4SCADA_tutorialBufferWrite_Signal_Label3: "Salt",
                        I4SCADA_tutorialBufferWrite_Write_Buffer: "Write Buffer",
                        I4SCADA_tutorialBufferWrite_Reset_Buffer: "Reset Buffer",
                        I4SCADA_tutorialBufferWrite_Write_Description: "Once the Write Buffer button is pressed, the buffered values will be written to the assigned signals and the change will be reflected by the Written Ingredients Quantities panel.",
                        I4SCADA_tutorialBufferWrite_Written_Panel_Title: "Written Ingredients Quantities",
                        //#endregion
                        //#region wf-local-script
                        I4SCADA_scwfLocalScript_Component_Header: "Configurable Local Script Component.",
                        I4SCADA_Script_Example_Sum_Values: "Sum values",
                        I4SCADA_Script_Example_Connector: "Connector object",
                        I4SCADA_Script_Example_Conditional: "Simple if condition",
                        //#endregion
                        //#region wf-local-array-splitter
                        I4SCADA_scwfLocalArraySplitter_Component_Header: "Configurable local array splitter for splitting local array signals.",
                        //#endregion
                        //#region Recipes
                        I4SCADA_scwfRecipe_Component_Header: "Configurable recipe component.",
                        I4SCADA_scwfRecipeManagement_Component_Header: "Configurable recipe management component.",
                        //#endregion
                        //#region user-manager
                        I4SCADA_scwfUserManager_Component_Header: "User manager component.",
                        //#endregion
                        //#region wf-setpoint-chart
                        I4SCADA_scwfSetpointChart_Component_Header: "Setpoint chart component.",
                        //#endregion
                        //#region wf-historical-data-chart
                        I4SCADA_scwfHistoricalDataChart_Component_Header: "Display historical data as Trendchart.",
                        //#endregion
                        //#region wf-historical-data-series-details
                        I4SCADA_scwfHistoricalDataSeriesDetails_Component_Header: "Display historical data details.",
                        //#endregion
                        //#region wf-historical-data-series-details
                        I4SCADA_scwfHistoricalDataCursorDetails_Component_Header: "Display Cursor details.",
                        //#endregion
                        //#region wf-signal-alarm-list
                        I4SCADA_scwfSignalAlarmList_Component_Header: "Display signal list with online alarms and processing information.",
                    };
            }
        };
        return LocalSymbolicTextService;
    }());
    return LocalSymbolicTextService;
});
//# sourceMappingURL=localSymbolicTextService.js.map