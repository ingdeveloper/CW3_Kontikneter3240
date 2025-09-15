/*
    Mit dieser Komponente kann ein S7-Datentyp "Time (T)" gelesen und geschrieben werden. 
    Dieser Datentyp muss im WF-Studio mit einem Signal-Namen und einem Connector angegeben werden.
    Zum Beispiel: __Cip1Cw4.DB2000.B1002T  (Anlage ; DB-Nr ; Byte-Anfang und gewünschtes Zeit-Format)
    
    Mit dem "format" kann das Popup-Fenster angespasst werden.
    Eingabe von Tagen, Stunden, Minuten Sekunden und Millisekunden möglich

    format: hh:mm:ss:SSS

    Code in HTML:
    <ccw-wf-date-time-picker-s7time params="nameTimer:'Ausschaltverzögerung Stopper Gruppierband', dialogAktiv: true, infoAktiv: true, elemBreite: '100%', elemBreiteVal:'65%', signalName: 'Verpack4010DB221B32T', format:'ss.SSS',writeToBuffer:true, einheit:'Sek', disableInputFeld: !userFreigabe()"></ccw-wf-date-time-picker-s7time> -->
*/
define(['../services/connector', 'plugins/dialog', 'src/viewmodels/cowi/dialoge/cwDialogDateTimePickerS7Time'],

    function (signalsConnector, dialog, cwDialogDateTimePickerS7Time) {
        var ccwtimepicker = function (params) {
            var self = this;

            self.connector = new signalsConnector();

            self.settings = params;
            // console.log(params);


            self.id = ko.observable(uuid.v4());
            self.show1 = ko.observable(false);
            self.show2 = ko.observable(false);
            self.writeToBuffer = ko.unwrap(self.settings.writeToBuffer) !== undefined ? ko.unwrap(self.settings.writeToBuffer) : true;
            // Prüfen ob Signal editiert wird
            self.isEditing = ko.observable(false);
            //Prüfen ob Signal gebuffert ist
            self.isBuffered = ko.computed(function () {
                if (!self.writeToBuffer)
                    return false;
                return self.connector.existSignalInBuffer(self.signalName) && !self.connector.signalBufferIsEmpty();
            }, self);
            self.iconClass = ko.unwrap(self.settings.iconClass) || null;
            self.inputSize = ko.unwrap(self.settings.inputSize) ? "input-group-" + ko.unwrap(self.settings.inputSize) : "";

            self.nameTimer = (ko.unwrap(self.settings.nameTimer) || '');
            self.dialogAktiv = ko.unwrap(self.settings.dialogAktiv) !== undefined ? ko.unwrap(self.settings.dialogAktiv) : false;
            self.infoAktiv = ko.unwrap(self.settings.infoAktiv) !== undefined ? ko.unwrap(self.settings.infoAktiv) : true;
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
            //Verwendete CSS Klassen
            self.isDisabledClass = ko.unwrap(self.settings.isDisabledClass) !== undefined ? ko.unwrap(self.settings.isDisabledClass) : 'ccw-wf-time-picker-disabledClass-xs'; //default-Vorgabe geändert am 2.02.2018; Neu 25.09.2017 amueller
            self.isBufferedClass = ko.unwrap(self.settings.isBufferedClass) !== undefined ? ko.unwrap(self.settings.isBufferedClass) : 'ccw-wf-time-picker-isBufferesClass-xs'; //default-Vorgabe geändert am 2.02.2018
            self.isFocusClass = ko.unwrap(self.settings.isFocusClass) !== undefined ? ko.unwrap(self.settings.isFocusClass) : 'ccw-wf-time-picker-focusClass-xs'; //default-Vorgabe geändert am 2.02.2018; Neu 25.09.2017 amueller
            self.labelClass = ko.unwrap(self.settings.labelClass) !== undefined ? ko.unwrap(self.settings.labelClass) : 'ccw-wf-time-picker-labelClass-xs'; //default-Vorgabe geändert am 2.02.2018; Neu 25.09.2017 amueller
            self.isMarkierungsClass = ko.unwrap(self.settings.isMarkierungsClass) !== undefined ? ko.unwrap(self.settings.isMarkierungsClass) : 'ccw-wf-time-picker-markierungsClass-xs'; //default-Vorgabe geändert am 2.02.2018;Neu 28.09.2017 amueller
            self.displayClass = ko.unwrap(self.settings.displayClass) !== undefined ? ko.unwrap(self.settings.displayClass) : 'ccw-wf-time-picker-displayClass-xs'; //default-Vorgabe geändert am 2.02.2018
            // Style und Parameter für Signalinformationen
            self.tooltipText = (ko.unwrap(self.connector.translate(self.settings.tooltipText)()) || "").stringPlaceholderResolver(self.objectID);
            self.inputSize = ko.unwrap(self.settings.inputSize) !== undefined ? "input-group-" + ko.unwrap(self.settings.inputSize) : "";
            self.fontSize = ko.unwrap(self.settings.fontSize) !== undefined ? ko.unwrap(self.settings.fontSize) : 'inherit';
            self.elemBreite = ko.unwrap(self.settings.elemBreite) !== undefined ? ko.unwrap(self.settings.elemBreite) : "100%";
            self.elemBreiteVal = ko.unwrap(self.settings.elemBreiteVal) !== undefined ? ko.unwrap(self.settings.elemBreiteVal) : "70%";
            self.textAlign = ko.unwrap(self.settings.textAlign) !== undefined ? ko.unwrap(self.settings.textAlign) : "right";
            // Zwischenspeicherung des alten Wertes
            self.zwischenWert = 0; //Aenderung Neu
            self.zwischenWertTag = 0; //Aenderung Neu
            self.zwischenWertStunde = 0; //Aenderung Neu
            self.zwischenWertMinute = 0; //Aenderung Neu
            self.zwischenWertSekunde = 0; //Aenderung Neu
            self.zwischenWertMillisekunde = 0; //Aenderung Neu
            
            self.fuerDialogTag = 0; //Aenderung Neu
            self.fuerDialogStunde = 0; //Aenderung Neu
            self.fuerDialogMinute = 0; //Aenderung Neu
            self.fuerDialogSekunde = 0; //Aenderung Neu
            self.fuerDialogMillisekunde = 0; //Aenderung Neu
            
            
            // Signalwerte für enable Eigenschaft
            self.enableSignal = self.enableSignalName ? self.connector.getSignal(self.enableSignalName) : null;
            self.enableSignalValue = ko.unwrap(self.settings.enableSignalValue) !== undefined ? ko.unwrap(self.settings.enableSignalValue) : '';


            // freigabe des Inputfeldes
            self.disableInputFeld = ko.computed(function () { //Neu 14.09.2017 amueller
                var erg = ko.unwrap(self.settings.disableInputFeld) !== undefined ? ko.unwrap(self.settings.disableInputFeld) : false;
                // console.log("disableInputFeld");
                return erg;
            }, self);
            // Markierung des Inputfeldes
            self.markierungEin = ko.computed(function () { //Neu 28.09.2017 amueller
                return ko.unwrap(self.settings.markierungEin) !== undefined ? ko.unwrap(self.settings.markierungEin) : false; //Neu 28.09.2017 amueller
            }, self);

            self.displayClassNames = ko.computed(function () {
                var lclass;
                var disable = self.disableInputFeld();
                var markEin = self.markierungEin(); //Input-Feld kann von aussen markiert werden
                //console.log("%c------------" + self.markierungEin(), "background:yellow");
                if (self.isEditing() == true) {
                    lclass = self.isFocusClass; //NEU 07.03.2018 amueller
                } else if (self.isBuffered() == true) {
                    lclass = self.isBufferedClass;
                } else if ((markEin === true) && (self.isMarkierungsClass != null)) {
                    lclass = self.isMarkierungsClass;
                } else if ((disable === true) && (self.isDisabledClass != null)) {
                    lclass = self.isDisabledClass; //NEU 24.09.2017 amueller
                } else {
                    lclass = self.displayClass;
                }
                // console.log("%c------------" + lclass, "background:yellow");

                return lclass;
                //return self.isBuffered() == true ? self.isBufferedClass : self.displayClass;

            }, self);

            self.isDisabled = ko.computed(function () {
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
            self.visibleDialog1 = ko.observable(false);
            self.visibleDialogSenden = ko.observable(false);
            self.uncommittedValueDay = ko.observable();
            self.uncommittedValueHour = ko.observable();
            self.uncommittedValueMinute = ko.observable();
            self.uncommittedValueSecond = ko.observable();
            self.uncommittedValueMillisecond = ko.observable(0);
            self.visibleMeldung = ko.observable(false);

            self.writeSecure = ko.unwrap(self.settings.writeSecure) !== undefined ? ko.unwrap(self.settings.writeSecure) : false;
            self.writeSecureValue = ko.observable();
            self.showWriteSecure = ko.observable(false);

            self.autoCommit = ko.unwrap(self.settings.autoCommit) !== undefined ? ko.unwrap(self.settings.autoCommit) : false;
            self.isSelected = ko.observable(false);

            self.inputSignal = self.connector.getSignal(ko.unwrap(self.signalName));

            // console.log("s7time---1");
            // console.log(self.inputSignal.value());

            self.inputJSON = ko.computed(function () {
                // console.log("%csignalValue READ " + self.inputSignal.value() + " ", "background:red");

                if (ko.unwrap(self.inputSignal.value) != null && self.inputSignal.value != null) {
                    var myJSON = self.convertS7TypDateAndTimeInDate(ko.unwrap(self.inputSignal.value())); //Neu am 22.02.2018 amueller
                    // console.log("%csignalValue READ " + self.inputSignal.value() + " " + JSON.stringify(myJSON), "background:red");
                    return myJSON;
                }
                return null;
            });

            self.inputDay = ko.computed(function () {
                if (ko.unwrap(self.inputJSON) != null) {
                    var _JSON = ko.unwrap(self.inputJSON);
                    // console.log(_JSON);

                    return _JSON.tage;
                }
                return null;
            });
            self.inputHour = ko.computed(function () {
                if (ko.unwrap(self.inputJSON) != null) {
                    var _JSON = ko.unwrap(self.inputJSON);
                    return _JSON.stunden;
                }
                return null;
            });
            self.inputMinute = ko.computed(function () {
                if (ko.unwrap(self.inputJSON) != null) {
                    var _JSON = ko.unwrap(self.inputJSON);

                    return _JSON.minuten;
                }
                return null;
            });
            self.inputSecond = ko.computed(function () {
                if (ko.unwrap(self.inputJSON) != null) {
                    var _JSON = ko.unwrap(self.inputJSON);
                    return _JSON.sekunden;
                }
                return null;
            });
            self.inputMillisecond = ko.computed(function () {
                if (ko.unwrap(self.inputJSON) != null) {
                    var _JSON = ko.unwrap(self.inputJSON);
                    return _JSON.millisekunden;
                }
                return null;
            });
            self.signalValue = ko.computed({
                read: function () {
                    // console.log("%csignalValue READ " + self.inputSignalValue, "background:red");
                    if (self.autoCommit) return ko.unwrap(self.inputSignalValue);
                    if (!self.isBuffered()) { //&& !self.showWriteSecure()
                        if (ko.unwrap(self.inputJSON) != null) {
                            var myTime = ko.unwrap(self.inputJSON);
                            var _myDay = (self.hasDay) ? myTime.tage : '';
                            var _myDaySplitter = (self.hasDay && self.hasHour) ? "T " : '';
                            var _myHour = (self.hasHour) ? ('00' + myTime.stunden).slice(-2) : ''; //führende Nullen anzeigen
                            var _myHourSplitter = (self.hasHour && self.hasMinute) ? ":" : '';
                            var _myMinute = (self.hasMinute) ? ('00' + myTime.minuten).slice(-2) : '';
                            var _myMinuteSplitter = (self.hasMinute && self.hasSecond) ? ":" : '';
                            var _mySecond = (self.hasSecond) ? ('00' + myTime.sekunden).slice(-2) : '';
                            var _mySecondSplitter = (self.hasSecond && self.hasMillisecond) ? "." : '';
                            var _myMillisecond = (self.hasMillisecond) ? ('000' + myTime.millisekunden).slice(-3) : '';
                            var _myTime = _myDay + _myDaySplitter + _myHour + _myHourSplitter + _myMinute + _myMinuteSplitter + _mySecond + _mySecondSplitter + _myMillisecond;
                            // console.log(_myTime);
                            // console.log(self.hasMillisecond);
                            // console.log(_myMillisecond);
                            // console.log(myTime);
                            // console.log(myTime.millisekunden);

                            self.fuerDialogTag = _myDay; 
                            self.fuerDialogStunde = _myHour; 
                            self.fuerDialogMinute = _myMinute; 
                            self.fuerDialogSekunde = _mySecond; 
                            self.fuerDialogMillisekunde = _myMillisecond; 


                            return _myTime;
                        }
                    } else if (self.isBuffered()) {
                        // console.log("%csignalValue isBuffered", "background:red");
                        var _myDay = (self.hasDay) ? self.uncommittedValueDay() : '';
                        var _myDaySplitter = (self.hasDay && self.hasHour) ? "T " : '';
                        var _myHour = (self.hasHour) ? ('00' + self.uncommittedValueHour()).slice(-2) : '';
                        var _myHourSplitter = (self.hasHour && self.hasMinute) ? ":" : '';
                        var _myMinute = (self.hasMinute) ? ('00' + self.uncommittedValueMinute()).slice(-2) : '';
                        var _myMinuteSplitter = (self.hasMinute && self.hasSecond) ? ":" : '';
                        var _mySecond = (self.hasSecond) ? ('00' + self.uncommittedValueSecond()).slice(-2) : '';
                        var _mySecondSplitter = (self.hasSecond && self.hasMillisecond) ? "." : '';
                        var _myMillisecond = (self.hasMillisecond) ? ('000' + self.uncommittedValueMillisecond()).slice(-3) : '';
                        var _myTime = _myDay + _myDaySplitter + _myHour + _myHourSplitter + _myMinute + _myMinuteSplitter + _mySecond + _mySecondSplitter + _myMillisecond;
                        // console.log(_myTime);
                        // console.log(self.hasSecond);
                        // console.log(_mySecond, self.uncommittedValueSecond());
                        // console.log(self.hasMillisecond);
                        // console.log(_myMillisecond);

                        self.fuerDialogTag = _myDay; 
                        self.fuerDialogStunde = _myHour; 
                        self.fuerDialogMinute = _myMinute; 
                        self.fuerDialogSekunde = _mySecond; 
                        self.fuerDialogMillisekunde = _myMillisecond; 


                        return _myTime;



                    }
                },
                write: function (value) {
                    // console.log(value);
                }
            });

            self.sendBtnCss = ko.computed(function () {
                var self = this;
                var css = '';
                var sendBufferLeer = self.connector.signalBufferIsEmpty();

                if (!sendBufferLeer) {
                    return 'ccw-flash-bg';
                }
            }, self);

            // Element-Breite: all=komplette Breite; val=das Anzeige-Feld für den Wert; Rest für das Label
            self.elemWidth = ko.computed(function () { //Emelement-Breite Neu 02.02.2018 amueller

                var all = self.elemBreite; //komplette Breite des Elementes
                var val = self.elemBreiteVal; //Breite der Input-Anzeige, Prozent von der kompletten Element-Breite

                return {
                    all: all,
                    val: val
                };
            }, self);
            self.connector.getOnlineUpdates();
        };

        ccwtimepicker.prototype.writeInputValue = function () {
            var self = this;
            var values = {};

            if (!self.signalName) return;

            var value = null;

            if (ko.unwrap(self.uncommittedValue)) {
                var date = moment(ko.unwrap(self.uncommittedValue).format(self.format));
                var dateArr = self.convertDateInS7TypDateAndTime(ko.unwrap(self.uncommittedValue)); //Neu
                value = dateArr;
            }

            values[self.signalName] = value;
            if (self.writeToBuffer) {
                self.connector.writeSignalsToBuffer(values);
                self.isEditing(false);
            }
            if (self.writeSecure) {
                self.writeInputValueSecure(value);
            } else {
                // Write signal values, warning if an error will be returned
                self.connector.writeSignals(values).then(function (result) {
                    self.isEditing(false);
                    if (result) {
                        self.connector.warn("WriteSignal result", result);
                    }
                });
            }
        };
        ccwtimepicker.prototype.keyupEventHandler = function (data, event) {
            var self = this;
            // console.log(event.which);

            if (event.which === 13) {
                self.writeInputValue();
            }
            if (event.which === 27) { //Taste ESC
                self.isEditing(false);
            }
        };
        ccwtimepicker.prototype.aliasInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                var txt = "Signal: " + self.signalName;
                if (self.tooltipText !== '') {
                    txt = txt + "<br>TooltipText: " + self.tooltipText;
                }
                toastr.info(txt);
            }
            return false;
        };
        ccwtimepicker.prototype.resetInputValue = function () {
            var self = this;
            self.isEditing(false);
        };
        ccwtimepicker.prototype.writeInputValueSecure = function (signalValue) {
            var self = this;
            self.isEditing(false);
            self.writeSecureValue(value);
            self.showWriteSecure(true);
        };
        ccwtimepicker.prototype.cancelWriteSecure = function () {
            var self = this;
            self.isEditing(true);
        };
        ccwtimepicker.prototype.convertS7TypDateAndTimeInDate = function (signalValue) {
            var self = this;
            var valArr = signalValue; // Zeitstempel als String  
            // console.log("%csignalValue Func", "background:red");
            // console.log(signalValue);
            var myTime = [];
            var myUnits = [];
            var myValues = [];
            var time = '';
            var value = '';
            // console.log(typeof valArr);
            if ((valArr !== undefined && valArr != 'n/a') && (typeof valArr === "string")) { //Überpüfen auf definiert
                //lösche alle Leerzeichen am Anfang und Ende des Strings
                valArr = valArr.trim();
                //lösche alle "" Anführungszeichen im String
                valArr = valArr.replace(/"/g, "");
                //lösche alle "_" Unterstriche im String
                valArr = valArr.replace(/_/g, "");
                //alle Zeichen klein darstellen
                valArr = valArr.toLowerCase();

                //   console.log(valArr);
                for (var i = 0; i < valArr.length; i++) {
                    var test = valArr.substring(i, i + 1);
                    if (isNaN(test)) {
                        time = time + test;
                    } else {
                        if (time != '') {
                            myUnits.push(time);
                            myValues.push(value);
                            time = '';
                            value = '';
                        }
                        value = value + test;
                    }
                    if (i == valArr.length - 1) {
                        myUnits.push(time);
                        myValues.push(value);
                    }
                }
                // console.log("Convert");
                // console.log(myUnits);
                // console.log(myValues);

                var obj = {};
                obj.tage = '0';
                obj.stunden = '0';
                obj.minuten = '0';
                obj.sekunden = '0';
                obj.millisekunden = '0';
                for (i = 0; i <= myUnits.length - 1; i++) {
                    if (myUnits[i] === "d") {
                        obj.tage = myValues[i];
                    }
                    if (myUnits[i] === "h") {
                        obj.stunden = myValues[i];
                    }
                    if (myUnits[i] === "m") {
                        obj.minuten = myValues[i];
                    }
                    if (myUnits[i] === "s") {
                        obj.sekunden = myValues[i];
                    }
                    if (myUnits[i] === "ms") {
                        obj.millisekunden = myValues[i];
                    }
                }
                // myTime.push(obj);
                // console.log(JSON.stringify(obj));
                // console.log(myTime);

                return obj;
            } else {
                return null;
            }
        };
        ccwtimepicker.prototype.dispose = function () {
            var self = this;

            if (!self.signal)
                return;
            return self.connector.unregisterSignals(self.signal);
        };
        ccwtimepicker.prototype.wertAendern = function (id, _value) {
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
        };
   

        ccwtimepicker.prototype.timerDialogCloseOK = function () {
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

            self.zwischenWert = zwischendays + zwischenhours + zwischenminutes + zwischenseconds + zwischenmilliseconds

            // console.log(self.zwischenWert + "/ " + _myTime);
            if (self.zwischenWert != _myTime) {
                var valueBuffer = _days + _hours + _minutes + _seconds + _milliseconds;
                values[self.signalName] = valueBuffer;
                if (self.writeToBuffer) {
                    self.connector.writeSignalsToBuffer(values);
                    self.isEditing(false);
                } else {
                    self.connector.writeSignals(values).then(function (result) {
                        if (result.errorMessage) {
                            toastr.error(result.errorMessage);
                        }
                    });
                    self.isEditing(false);
                }
                self.visibleDialogSenden(false);
                self.visibleDialog1(false);
                self.show1(false);
                self.show2(false);
            } else {
                self.isEditing(false);
            }
        };
        ccwtimepicker.prototype.timerDialogClose = function () {
            var self = this;
            self.isEditing(false);
            self.visibleDialogSenden(false);
            self.visibleDialog1(false);
            self.show1(false);
            self.show2(false);
            //self.connector.clearSignalBuffer();
        };

        ccwtimepicker.prototype.dialogSenden = function () {
            var self = this;
            var bufferSignale = self.connector.getSignalsFromBuffer(); //Signale vom Buffer lesen
            var len = bufferSignale.length;

            if (len > 0) {
                self.show2(true);
                self.visibleDialogSenden(true);
            } else {
                toastr.warning("Es wurden keine Werte ver&auml;ndert !", "Senden nicht m&ouml;glich !");
            }
        };

        ccwtimepicker.prototype.sendWerte = function () {
            var self = this;
            var bufferSignale = self.connector.getSignalsFromBuffer(); //Signale vom Buffer lesen
            var len = bufferSignale.length;
            var i;

            for (i = 0; i < len; i++) {
                console.info('%cSendBuffer AliasName = ' + bufferSignale[i].key + ' / Value = ' + bufferSignale[i].value, 'background: yellow;');
            }

            self.connector.writeSignalsFromBuffer();
            toastr.success('Send-Werte geschrieben');
            self.visibleDialogSenden(false);
            self.show2(false);
        };

        ccwtimepicker.prototype.openDialog = function () {
            var self = this;
            console.log("myDialog");
            self.isEditing(true);
            dialog.show(
                new cwDialogDateTimePickerS7Time(self.settings, self.fuerDialogTag, self.fuerDialogStunde, self.fuerDialogMinute, self.fuerDialogSekunde, self.fuerDialogMillisekunde)
            )
                .then(function (dialogResult) {
                    // console.info('%cDialog-Fenster geschlossen:' + dialogResult, 'background: yellow;'); //Dialog-Fenster geschlossen

                    if (self.dialogAktiv == true) {
                        // self.zwischenWert = self.signalValue();
                        self.isEditing(true);
                        var myTime;
                        if (self.isEditing() && self.isBuffered()) {
                            var val = self.connector.readSignalsFromBuffer([self.signalName]); //Rückgabe ist eine Array von Objekten
                            var myDate = self.convertS7TypDateAndTimeInDate(val[0]); //Aus dem Array das erste Objekt nehmen (hier ein Array)
                            myTime = myDate;
                        } else {
                            myTime = ko.unwrap(self.inputJSON);
                        }
                        var wert;

                        if (myTime !== null) {
                            wert = (self.hasDay) ? ('00' + myTime.tage).slice(-2) : '00';
                            self.uncommittedValueDay(Number(wert));
                            self.zwischenWertTag = Number(wert);

                            wert = (self.hasHour) ? ('00' + myTime.stunden).slice(-2) : '00';
                            self.uncommittedValueHour(Number(wert));
                            self.zwischenWertStunde = Number(wert);

                            wert = (self.hasMinute) ? ('00' + myTime.minuten).slice(-2) : '00';
                            self.uncommittedValueMinute(Number(wert));
                            self.zwischenWertMinute = Number(wert);


                            wert = (self.hasSecond) ? ('00' + myTime.sekunden).slice(-2) : '00';
                            self.uncommittedValueSecond(Number(wert));
                            self.zwischenWertSekunde = Number(wert);

                            wert = self.hasMillisecond ? ('000' + myTime.millisekunden).slice(-3) : '000';
                            self.uncommittedValueMillisecond(Number(wert));
                            self.zwischenWertMillisekunde = Number(wert);
                        } else {
                            self.visibleMeldung(true);
                        }
                        self.isEditing(false);

                    }


                });

        };


        return ccwtimepicker;
    });