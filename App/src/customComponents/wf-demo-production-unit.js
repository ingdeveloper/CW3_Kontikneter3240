define(['../services/connector'],
    function (signalsConnector) {

        var demoProductionUnit = function (params) {
          
                var self = this;
                self.params = params;

                self.productionId = params.productionId;
                self.headerTitle = params.header || "Details";
                // For demo porposes the id is limited here to values  1 or 2
                self.id = params.id > 2 ? Math.round(Math.random() * (2 - 1) + 1) : params.id;
                self.parts = "Local Second";
                self.takt = "Local Minute";
                self.electricity = "Servo " + self.id;
                self.pressure = "Sensor " + self.id;

                var connector = new signalsConnector();
                self.connector = connector;
                self.statusSignal = connector.getSignal(params.statusSignal);
                self.status = self.statusSignal.value;
                self.connector.getOnlineUpdates();       
        };

        demoProductionUnit.prototype.dispose = function () {
            var self = this;

            if (!self.statusSignal)
                return;
            return self.connector.unregisterSignals(self.statusSignal);
        };

        return demoProductionUnit;
    });

