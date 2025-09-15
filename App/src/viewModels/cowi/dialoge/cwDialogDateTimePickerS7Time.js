define(['src/services/connector', 'src/services/usersService', "src/components/services/secured.service"],
    function (signalsConnector, usersService, securedService) {
        var dialog = require('plugins/dialog');

        var ctor = function (params, tag, stunde, minute, sekunde, millisekunde) {
            var self = this;
            console.log(params);
            self.connector = new signalsConnector();

            self.settings = params;

            // self.id = ko.observable(uuid.v4());
            
            self.writeToBuffer = ko.unwrap(self.settings.writeToBuffer) !== undefined ? ko.unwrap(self.settings.writeToBuffer) : true;
            //Prüfen ob Signal gebuffert ist
            self.isBuffered = ko.computed(function() {
                if (!self.writeToBuffer)
                    return false;
                return self.connector.existSignalInBuffer(self.signalName) && !self.connector.signalBufferIsEmpty();
            }, self);

            self.nameTimer = (ko.unwrap(self.settings.nameTimer) || '');
            self.signalName = (ko.unwrap(self.settings.signalName) || '');
            self.format = (ko.unwrap(self.settings.format) || 'hh:mm:ss.SSS');
            // Einheit der dargestellten Zeiteinheit            
            self.einheit = (ko.unwrap(self.settings.einheit) || '');
            // welche Zeiteinheiten einstellbar sind
            self.hasDay = (ko.unwrap(self.settings.format.search("dd"))) >= 0;
            self.hasHour = (ko.unwrap(self.settings.format.search("hh"))) >= 0;
            self.hasMinute = (ko.unwrap(self.settings.format.search("mm"))) >= 0;
            self.hasSecond = (ko.unwrap(self.settings.format.search("ss"))) >= 0;
            self.hasMillisecond = (ko.unwrap(self.settings.format.search("SSS"))) >= 0;
            // Zwischenspeicherung des alten Wertes
            self.zwischenWert = 0; //Aenderung Neu
            self.zwischenWertTag = 0; //Aenderung Neu
            self.zwischenWertStunde = 0; //Aenderung Neu
            self.zwischenWertMinute = 0; //Aenderung Neu
            self.zwischenWertSekunde = 0; //Aenderung Neu
            self.zwischenWertMillisekunde = 0; //Aenderung Neu
            // Signalwerte für enable Eigenschaft
            self.enableSignal = self.enableSignalName ? self.connector.getSignal(self.enableSignalName) : null;
            self.enableSignalValue = ko.unwrap(self.settings.enableSignalValue) !== undefined ? ko.unwrap(self.settings.enableSignalValue) : '';


            // freigabe des Inputfeldes
            self.disableInputFeld = ko.computed(function() { //Neu 14.09.2017 amueller
                var erg = ko.unwrap(self.settings.disableInputFeld) !== undefined ? ko.unwrap(self.settings.disableInputFeld) : false;
                // console.log("disableInputFeld");
                return erg;
            }, self);
 

            self.isDisabled = ko.computed(function() {
                var self = this;
                var disable = ko.unwrap(self.disableInputFeld());
                // console.log('%cccw-wf-input-tastatur.isDisable = ' + self.disableInputFeld(), 'background: #819FF7');
                if (disable === true) { //Aenderung neu, wenn Disable, dann Feld sperren
                    return true;
                }

                if (!self.enableSignal || !self.enableSignalValue)
                    return false;
                return !evaluateCondition(self.enableSignal.value(), self.enableSignalValue, self.enableOperator);
            }, self);
            self.uncommittedValueDay = ko.observable(Number(tag));
            self.uncommittedValueHour = ko.observable(Number(stunde));
            self.uncommittedValueMinute = ko.observable(Number(minute));
            self.uncommittedValueSecond = ko.observable(Number(sekunde));
            self.uncommittedValueMillisecond = ko.observable(Number(millisekunde));

            self.visibleMeldung = ko.observable(false);

            
        };

        ctor.prototype = {
            closeOk: function () {
                var self = this;
                dialog.close(self, 'ClosedOkay');
            },
            close: function () {
                var self = this;
                dialog.close(self, 'Closed');
            },
           
            wertAendern : function(id, _value) {
                var self = this;
                switch (id) {
                    case 'Tag':
                        var val = self.uncommittedValueDay() + _value;
                        if (val <= 23 && val >= 0) {
                            self.uncommittedValueDay(val);
                        } else {
                            toastr.info('Der Wert für Stunden muss im Bereich von 0-23 liegen.')
                        }
                        break;
                    case 'Stunde':
                        var val = self.uncommittedValueHour() + _value;
                        if (val <= 23 && val >= 0) {
                            self.uncommittedValueHour(val);
                        } else {
                            toastr.info('Der Wert für Stunden muss im Bereich von 0-23 liegen.')
                        }
    
                        break;
    
                    case 'Minute':
                        var val = self.uncommittedValueMinute() + _value;
                        if (val <= 59 && val >= 0) {
                            self.uncommittedValueMinute(val);
                        } else {
                            toastr.info('Der Wert für Minuten muss im Bereich von 0-59 liegen.')
                        }
                        break;
    
                    case 'Sekunde':
                        var val = self.uncommittedValueSecond() + _value;
                        if (val <= 59 && val >= 0) {
                            self.uncommittedValueSecond(val);
                        } else {
                            toastr.info('Der Wert für Sekunden muss im Bereich von 0-59 liegen.')
                        }
                        break;
    
                    case 'Millisekunde':
                        var val = self.uncommittedValueMillisecond() + _value;
                        if (val <= 999 && val >= 0) {
                            self.uncommittedValueMillisecond(val);

                        } else {
                            toastr.info('Der Wert für Millisekunden muss im Bereich von 0-999 liegen.')
                        }
                        break;
                }
            },
    
            timerDialogCloseOK : function() {
                //CloseOk: Werte in String-Format "0d0h0m1s120ms" verpacken
                var self = this;
                var values = {};
                if (!self.signalName) return;
                var _days = (self.hasDay) ? self.uncommittedValueDay() + "d" : '00d';
                var _hours = (self.hasHour) ? self.uncommittedValueHour() + "h" : '00h';
                var _minutes = (self.hasMinute) ? self.uncommittedValueMinute() + "m" : '00m';
                var _seconds = (self.hasSecond) ? self.uncommittedValueSecond() + "s" : '00s';
                var _milliseconds = (self.hasMillisecond) ? self.uncommittedValueMillisecond() + "ms" : '000ms';
    
                var days = (self.hasDay) ? ('00' + self.uncommittedValueDay()).slice(-2) : '';
                var _myDaySplitter = (self.hasDay && self.hasHour) ? "T " : '';
                var hours = (self.hasHour) ? ('00' + self.uncommittedValueHour()).slice(-2) : '';
                var _myHourSplitter = (self.hasHour && self.hasMinute) ? ":" : '';
                var minutes = (self.hasMinute) ? ('00' + self.uncommittedValueMinute()).slice(-2) : '';
                var _myMinuteSplitter = (self.hasMinute && self.hasSecond) ? ":" : '';
                var seconds = (self.hasSecond) ? ('00' + self.uncommittedValueSecond()).slice(-2) : '';
                var _mySecondSplitter = (self.hasSecond && self.hasMillisecond) ? "." : '';
                var milliseconds = (self.hasMillisecond) ? ('000' + self.uncommittedValueMillisecond()).slice(-3) : '';
    
                var _myTime = days + _myDaySplitter + hours + _myHourSplitter + minutes + _myMinuteSplitter + seconds + _mySecondSplitter + milliseconds;
    
                var zwischendays = (self.hasDay) ? ('00' + self.zwischenWertTag).slice(-2) + _myDaySplitter : '';
                var zwischenhours = (self.hasHour) ? ('00' + self.zwischenWertStunde).slice(-2) + _myHourSplitter : '';
                var zwischenminutes = (self.hasMinute) ? ('00' + self.zwischenWertMinute).slice(-2) + _myMinuteSplitter : '';
                var zwischenseconds = (self.hasSecond) ? ('00' + self.zwischenWertSekunde).slice(-2) + _mySecondSplitter : '';
                var zwischenmilliseconds = (self.hasMillisecond) ? ('000' + self.zwischenWertMillisekunde).slice(-3) : '';
    
                self.zwischenWert = zwischendays + zwischenhours + zwischenminutes + zwischenseconds + zwischenmilliseconds;
    
                console.log(self.zwischenWert + "/ " + _myTime);
                // if (self.zwischenWert != _myTime) {
                    var valueBuffer = _days + _hours + _minutes + _seconds + _milliseconds;
                    values[self.signalName] = valueBuffer;
                    console.log(valueBuffer);
                    if (self.writeToBuffer) {
                        self.connector.writeSignalsToBuffer(values);
                    } else {
                        self.connector.writeSignals(values).then(function(result) {
                            if (result.errorMessage) {
                                toastr.error(result.errorMessage);
                            }
                        });
                    }
                // }
                self.closeOk();
            },
            
            timerDialogClose : function() {
                var self = this;
                self.close();
            },

        };
        
        
        
        
        return ctor;
    });