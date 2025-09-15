define(['../../services/connector',
        'durandal/app',
    '../../components/services/states.service',
    'plugins/dialog',
    'src/viewmodels/cowi/dialoge/cwDialog'
    ],

    function (signalsConnector, app, statesService, dialog ,okCancelDialog ) {



        var ctor = function () {
            var self = this;

        };

        ctor.prototype = {
            activate: function () {
                var self = this;
                self.connector = new signalsConnector();

                self.myObservable = ko.observable(false);  
                self.sekunde = self.connector.getSignal('Local Second').value;

                return self.connector.getOnlineUpdates();//.fail(self.connector.handleError(self));

            },
            compositionComplete: function () {
                
            },
            attached: function () {
                
            },
            testFunktionFuerClick: function () {
                //console.log("testFunktionClick():");
            },
            testFunktionFuerAenderung: function () {
                //console.log("testFunktionAenderung():");
            },
            openMyDialog: function () {
                console.log("openMyDialog():");
                dialog.showMessage("Hall");

            }
        };
        return ctor;
    });