define(["../../services/connector"],
function (signalsConnector) {
    var ctor = function () {
        var self = this;
        self.selectedLanguageId = ko.observable();
        self.widgetName = "wfUserManager";
        self.widgetCategory = "Sicherheit";

        self.widgetProperties =
            [
                {
                    type: 'Boolean',
                    name: 'autoUpdate',
                    defaultValue: 'false',
                    description: 'Wenn diese Eigenschaft mit dem Wert true gesetzt ist, wird der "user actions" zyklisch automatisch aktualisiert.',
                    descriptionEN: 'When this property is active, then "user actions" will auto update the data. Applicable to user actions page.'
                },
                {
                    type: 'Number',
                    name: 'updateRate',
                    defaultValue: '2000',
                    description: 'Das Aktualisierungsgeschwindigkeit in Millisekunden. Diese Eigenschaft wird nur berücksichtigt, wenn die Eigenschaft autoUpdate auf den Wert true gesetzt ist. Minimumwert ist 1000',
                    descriptionEN: 'The update rate in milliseconds. This property will be taken into consideration only if the autoUpdate is true. The minimum value is 1000. Applicable to user actions page.'
                },
                {
                    type: 'String',
                    name: 'startOffset',
                    defaultValue: 'minutes',
                    description: 'Mögliche Vorgaben: seconds, minutes, days, weeks, months, years.',
                    descriptionEN: 'Possible targets: seconds, minutes, days, weeks, months, years. Applicable to user actions page.'
                },
                {
                    type: 'Number',
                    name: 'startOffsetIntervall',
                    defaultValue: '30',
                    description: 'Nummerischer Wert für die startOffset-Eigenschaft.',
                    descriptionEN: 'Numeric value for the start offset property.. Applicable to user actions page.'
                },
                {
                    type: 'String',
                    name: 'endOffset',
                    defaultValue: 'minutes',
                    description: 'Mögliche Vorgaben: seconds, minutes, days, weeks, months, years.',
                    descriptionEN: 'Possible targets: seconds, minutes, days, weeks, months, years. Applicable to user actions page.'
                },
                {
                    type: 'Number',
                    name: 'endOffsetIntervall',
                    defaultValue: '0',
                    description: 'Nummerischer Wert für die endOffset-Eigenschaft.',
                    descriptionEN: 'Numeric value for the start end offset property.. Applicable to user actions page.'
                },
            ];

    };

    ctor.prototype.attached = function () {
        var self = this;
        prettyPrint();
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
        };

    };

    return ctor;
});


