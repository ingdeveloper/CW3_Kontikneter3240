/*
    Mit dieser Komponente kann ein S7-Datentyp "Data_and_Time (DT)" gelesen und geschrieben werden.
    Dieser Datentyp muss im WF-Studio mit einem Signal-Namen und einem Connector angegeben werden.
    Zum Beispiel: __Cip1Cw4.DB2000.B1002DT  (Anlage ; DB-Nr ; Byte-Anfang und gewünschtes Zeit-Format)
    
    Mit dem "format" kann das Popup-Fenster angespasst werden.

    Code in HTML:

    <ccw-wf-date-time-picker-s7datetime params="signalName: 'Verpack4010DB1B42DT', writeToBuffer:true, disableInputFeld: !userFreigabe()"></ccw-wf-date-time-picker-s7time>
    
    <ccw-wf-date-time-picker-s7dt params="signalName: 'TestDateAndTime', unitLabel: true, format:'DD.MM.YYYY HH:mm:ss'"></ccw-wf-date-time-picker-s7dt>
*/
define(
    ['../services/connector', "../components/services/secured.service", "../components/services/changed-field-animation.service", "../components/services/visual-security.service"],
    function (signalsConnector, securedService, changedFieldAnimationService, visualSecurityService) {
        var wfDateTime = function (params) {
            var self = this;
            self.settings = params;

            self.connector = new signalsConnector();

            self.objectID = ko.unwrap(self.settings.objectID);

            self.projectAuthorization = (ko.unwrap(self.settings.projectAuthorization) || "").stringPlaceholderResolver(self.objectID);
            self.securedService = new securedService(self.projectAuthorization);
            self.hasAuthorization = self.securedService.hasAuthorization;
            self.hasNoAuthorization = self.securedService.hasNoAuthorization;

            self.isModalDialogsDraggable = self.settings.isModalDialogsDraggable !== undefined ? self.settings.isModalDialogsDraggable : true;
            self.tooltipText = (ko.unwrap(self.connector.translate(self.settings.tooltipText)()) || "").stringPlaceholderResolver(self.objectID);
            self.format = ko.unwrap(self.settings.format) ? ko.unwrap(self.settings.format) : "";
            self.isUTC = ko.unwrap(self.settings.isUTC) !== undefined ? ko.unwrap(self.settings.isUTC) : false;
            self.writeUnix = ko.unwrap(self.settings.isUnix) !== undefined ? ko.unwrap(self.settings.writeUnix) : false;

            self.minDate = ko.unwrap(self.settings.minDate);
            self.maxDate = ko.unwrap(self.settings.maxDate);
            self.showClear = ko.unwrap(self.settings.showClear) !== undefined ? ko.unwrap(self.settings.showClear) : true;

            self.iconClass = ko.unwrap(self.settings.iconClass) || null;
            self.displayClass = ko.unwrap(self.settings.displayClass) || null;
            self.isBufferedClass = ko.unwrap(self.settings.isBufferedClass) || "label-info";
            self.inputSize = ko.unwrap(self.settings.inputSize) ? "input-group-" + ko.unwrap(self.settings.inputSize) : "";

            self.label = (ko.unwrap(self.settings.label) || '').stringPlaceholderResolver(self.objectID);
            self.signalNameLabel = ko.unwrap(self.settings.signalNameLabel) !== undefined ? ko.unwrap(self.settings.signalNameLabel) : false;
            self.unitLabel = ko.unwrap(self.settings.unitLabel) !== undefined ? ko.unwrap(self.settings.unitLabel) : false;
            self.staticUnitText = (ko.unwrap(self.settings.staticUnitText) || '').stringPlaceholderResolver(self.objectID);

            self.iconStyle = ko.unwrap(self.settings.iconStyle) || '';
            self.textStyle = ko.unwrap(self.settings.textStyle) || '';

            self.signalName = (ko.unwrap(self.settings.signalName) || '').stringPlaceholderResolver(self.objectID);
            self.uncommittedValue = ko.observable(null);

            self.autoCommit = ko.unwrap(self.settings.autoCommit) !== undefined ? ko.unwrap(self.settings.autoCommit) : false;
            self.isEditing = ko.observable(false);
            self.isSelected = ko.observable(false);

            self.datepickerOptions = ko.computed(function () {
                return {
                    locale: self.connector.getGenericCulture(ko.unwrap(self.connector.currentLanguageId)),
                    format: self.format,
                    minDate: self.minDate,
                    maxDate: self.maxDate,
                    showClear: self.showClear
                }
            });
            // freigabe des Inputfeldes
            self.disableInputFeld = ko.computed(function () { //Neu 14.09.2017 amueller
                var erg = ko.unwrap(self.settings.disableInputFeld) !== undefined ? ko.unwrap(self.settings.disableInputFeld) : false;
                // console.log("disableInputFeld");
                return erg;
            }, self);
            
            self.inputSignal = self.connector.getSignal(ko.unwrap(self.signalName));

            self.inputSignalValue = ko.computed(function (value) {
                if (ko.unwrap(self.inputSignal.value) != null && self.inputSignal.value != null) {
                    //konvertieren der Zeit
                    var myDate = self.convertS7TypDateAndTimeInDate(ko.unwrap(self.inputSignal.value()));  //Neu am 22.02.2018 amueller
                    if (self.isUTC) {
                        var utcDate = moment.utc(myDate);
                        return utcDate;
                    } else {
                        var date = moment(myDate);
                        return date;
                    }
                }
                return null;
            });

            self.writeSecure = ko.unwrap(self.settings.writeSecure) !== undefined ? ko.unwrap(self.settings.writeSecure) : false;
            self.writeSecureValue = ko.observable();
            self.showWriteSecure = ko.observable(false);

            self.writeToBuffer = ko.unwrap(self.settings.writeToBuffer) !== undefined ? ko.unwrap(self.settings.writeToBuffer) : true;

            self.isBuffered = ko.computed(function () {
                if (!self.writeToBuffer)
                    return false;

                return self.connector.existSignalInBuffer(self.signalName) && !self.connector.signalBufferIsEmpty();
            }, self);

            self.displayClassNames = ko.computed(function () {
                return self.isBuffered() == true ? self.isBufferedClass : self.displayClass;
            }, self);

            self.signalValue = ko.computed({
                read: function () {
                    if (self.autoCommit) return ko.unwrap(self.inputSignalValue);

                    if (!self.isEditing() && !self.isBuffered() && !self.showWriteSecure()) {
                        return ko.unwrap(self.inputSignalValue);
                    } else if (!self.isEditing() && self.isBuffered()) {
                        var val = self.connector.readSignalsFromBuffer([self.signalName]);  //Rückgabe ist eine Array von Objekten
                        var myDate = self.convertS7TypDateAndTimeInDate(val[0]);            //Aus dem Array das erste Objekt nehmen (hier ein Array)
                        if (self.isUTC) {
                            var utcDate = moment.utc(myDate);
                            return utcDate;
                        } else {
                            var date = moment(myDate);
                            return date;
                        }
                        //return value.length > 0 ? value[0] : null;
                    } else {
                        return ko.unwrap(self.uncommittedValue);
                    }
                },
                write: function (value) {
                    self.uncommittedValue(value);

                    if (self.autoCommit) {
                        self.writeInputValue();
                        return;
                    }

                    if (self.uncommittedValue() !== self.inputSignalValue())
                        self.isEditing(true);
                }
            });

            self.changedFieldAnimationService = new changedFieldAnimationService(self.settings, self.signalValue, self.displayClassNames);
            //self.changedFieldAnimationService.initialize();
            self.cssClass = ko.computed(function () {
                return self.changedFieldAnimationService ? self.changedFieldAnimationService.cssClass() || "" : "";
            });

            self.visualSecurityService = new visualSecurityService(self.settings, self.connector);
            //self.visualSecurityService.initialize();
            self.isVisible = self.visualSecurityService.isVisible;
            self.isDisabled = self.visualSecurityService.isDisabled;

            self.connector.getOnlineUpdates();//.fail(self.connector.handleError(self));
        }

        wfDateTime.prototype = {

            dispose: function () {
                var self = this;

                if (self.visualSecurityService)
                    self.visualSecurityService.dispose();

                self.changedFieldAnimationService.dispose();
                return self.connector.unregisterSignals(self.inputSignal);
            },

            writeInputValue: function () {
                var self = this;
                var values = {};

                if (!self.signalName) return;

                var value = null;

                if (ko.unwrap(self.uncommittedValue)) {
                    var date = moment(ko.unwrap(self.uncommittedValue).format(self.format));
                    var dateArr = self.convertDateInS7TypDateAndTime(ko.unwrap(self.uncommittedValue));  //Neu
                    value = dateArr;
                }

                values[self.signalName] = value;
                if (self.writeToBuffer) {
                    self.connector.writeSignalsToBuffer(values);
                    self.isEditing(false);
                }
                if (self.writeSecure)
                    self.writeInputValueSecure(value);
                else {
                    // Write signal values, warning if an error will be returned
                    self.connector.writeSignals(values).then(function (result) {
                        self.isEditing(false);
                        if (result) {
                            self.connector.warn("WriteSignal result", result);
                        }
                    });
                }
            },

            resetInputValue: function () {
                var self = this;
                self.isEditing(false);
            },

            writeInputValueSecure: function (value) {
                var self = this;

                self.isEditing(false);
                self.writeSecureValue(value);
                self.showWriteSecure(true);
            },

            cancelWriteSecure: function () {
                var self = this;
                self.isEditing(true);
            },
            
            convertS7TypDateAndTimeInDate: function (signalValue) {   //Neu am Febr. 2018
                var self = this;
                var valArr = signalValue;  //alles BCD-Codiert: [0]=Jahr; [1]=Monat; [2]=Tag; [3]=Stunde; [4]=Minute; [5]=Sekunde; [6]=MSC(high); [7]=MSC + WTag
                var myDate = {};

                if ((valArr !== undefined) && (valArr.length > 6)) {  //Überpüfen auf Länge
                    var werte = valArr.split(/[.:,\/ -]/);
                    var jahr = parseInt(werte[0].toString(16));   //wandeln in HEX-String
                    var monat = parseInt(werte[1].toString(16));
                    var tag = parseInt(werte[2].toString(16));
                    var stunde = parseInt(werte[3].toString(16));
                    var minute = parseInt(werte[4].toString(16));
                    var sekunde = parseInt(werte[5].toString(16));
                    var mSekunde = parseInt(werte[6].toString(16));
            
                    myDate = new Date(jahr, monat - 1, tag, stunde, minute, sekunde, mSekunde);  //!!! Monate sind Null-basiert
                    //console.log("Lesen S7-2 " + zeit.toLocaleString());
                    console.log("Übersetzes Datum: "+jahr + "/" + monat + "/" + tag + "/" + stunde + "/" + minute + "/" + sekunde + "/" + mSekunde);
                    
                    //console.log(bcd2number([38]));  //Ergibt 26 in HEX-Code
                    return myDate; 
                } else {
                    return new Date(0);
                }
            },

            convertDateInS7TypDateAndTime: function (valueDate) {   //Neu im Febr. 2018
                var self = this;
                var valArr = [2018, 07, 12, 6, 1, 30, 000]; //in S7 BCD-Codiert: [0]=Jahr; [1]=Monat; [2]=Tag; [3]=Stunde; [4]=Minute; [5]=Sekunde; [6]=Millisekunde
                var d = Date.parse(valueDate);  //Input-Value ist String und diesen nach Date konvertieren
                var valD = new Date(d);         //neues Datum erstellen mit vorgegebenen Werten
                valArr[0] = valD.getFullYear();       //Jahr
                var monat = valD.getMonth()+1;
                valArr[1] = ('00' + monat).slice(-2);      //Monate sind Null-Basiert, in S7 aber 1-12
                valArr[2] = ('00' + valD.getDate()).slice(-2);           
                valArr[3] = ('00' + valD.getHours()).slice(-2);          
                valArr[4] = ('00' + valD.getMinutes()).slice(-2);        
                valArr[5] = ('00' + valD.getSeconds()).slice(-2);        
                valArr[6] = ('000' + valD.getMilliseconds()).slice(-3);  
                var datetime = valArr[0] + '-' + valArr[1] + '-' + valArr[2] + '-' + valArr[3] + ':' + valArr[4] + ':' + valArr[5] + '.' + valArr[6];
                return datetime;
            },
            /*
            * number2bcd -> takes a number and returns the corresponding BCD in a nodejs buffer object.
            * input: 32 bit positive number, nodejs buffer size
            * output: nodejs buffer 
            */
            myNumber2bcd : function (number, size) {
                var s = size || 4; //default value: 4
                var bcd = new Array(s);
                bcd.fill(0);
                while (number !== 0 && s !== 0) {
                    s -= 1;
                    bcd[s] = (number % 10);
                    number = (number / 10) | 0;
                    bcd[s] += (number % 10) << 4;
                    number = (number / 10) | 0;
                }
                return bcd;
            }

        };

        return wfDateTime;
    });