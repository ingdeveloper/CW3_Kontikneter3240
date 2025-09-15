define(['../../services/connector'],
    function (signalsConnector) {
        var ctor = function () {
            var self = this;
        };
        ctor.prototype = {
            activate: function () {
                var self = this;
                self.connector = new signalsConnector();
                self.auswahlTrend = ko.observable(1);

                self._vorwahlWartung = self.connector.getSignal('VMI3240DB1DBX10'); //Wartungsbetrieb Waage 5
                self.vorwahlWartung = ko.computed(function () {
                    var self = this;
                    var css = 'btn-primary';
                    var text = 'Wartung AUS';
                    var sichtbar = false;                    
                    var signalName = self._vorwahlWartung.signalName();
                    var vorwahl = self._vorwahlWartung.value();
                    if (vorwahl !== null) {
                        if (vorwahl != 0) {
                            css = 'btn-danger ccw-flash-bg';
                            css2 = 'badge-danger ccw-flash-bg';
                            text = 'Wartungbetrieb EIN';
                            sichtbar = true;
                        } else {
                            css = 'btn-default';
                            css2 = 'badge-default';
                            text = 'Wartungbetrieb AUS';
                            sichtbar = false;                            
                        }
                    }
                    return {
                        newSichtbar: sichtbar,
                        signalName: signalName,
                        newCss: css,
                        newCss2: css2,
                        newText: text
                    };
                }, self);
                
                return self.connector.getOnlineUpdates();
            },
            setAuswahl: function (wert) {
                var self = this;
                self.auswahlTrend(wert);
            },


        }
        return ctor;
    });