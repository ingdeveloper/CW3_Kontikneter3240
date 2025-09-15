/*
    Mit dieser Komponente kann ein Byte-Array gelesen und geschrieben werden.
    Im WF-Studio müssen pro Byte ein Signal-Name angegeben werden.
    Connector muss ein/mehrere Bytes sein. Zum Beispiel: __Cip1Cw4.DB2000.B0  (Anlage ; DB-Nr ; Byte-Anfang und Länge)
    Übergabe-Parameter: y=Jahr, mo=Monat, d=Tag, h=Stunde, mi=Minute, s=Sekunde
    Die Parameter müssen nicht alle angegeben werden, der Fehler wird abgefangen.
    
    Mit dem "format" kann das Popup-Fenster angespasst werden.

    Code in HTML:
    <ccw-wf-date-time-picker-s7bytes params="signalName: {y:'Signal11',mo:'Signal12',d:'Signal13',h:'Signal14',mi:'Signal15', s:'Signal16'}, format:'DD.MM.YYYY HH:mm:ss'"></ccw-wf-date-time-picker-s7bytes>
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
            self.signalNameYear   = (ko.unwrap(self.settings.signalName.y) || '').stringPlaceholderResolver(self.objectID);
            self.signalNameMonth  = (ko.unwrap(self.settings.signalName.mo) || '').stringPlaceholderResolver(self.objectID);
            self.signalNameDay    = (ko.unwrap(self.settings.signalName.d) || '').stringPlaceholderResolver(self.objectID);
            self.signalNameHour   = (ko.unwrap(self.settings.signalName.h) || '').stringPlaceholderResolver(self.objectID);
            self.signalNameMinute = (ko.unwrap(self.settings.signalName.mi) || '').stringPlaceholderResolver(self.objectID);
            self.signalNameSecond = (ko.unwrap(self.settings.signalName.s) || '').stringPlaceholderResolver(self.objectID);
            
            self.uncommittedValue = ko.observable(null);

            self.autoCommit = ko.unwrap(self.settings.autoCommit) !== undefined ? ko.unwrap(self.settings.autoCommit) : false;
            self.isEditing  = ko.observable(false);
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

            self.inputSignalYear = self.signalNameYear !== ''  ? self.connector.getSignal(ko.unwrap(self.signalNameYear)) : 0;
            self.inputSignalMonth = self.signalNameMonth !== ''  ? self.connector.getSignal(ko.unwrap(self.signalNameMonth)) : 0;
            self.inputSignalDay = self.signalNameDay !== ''  ? self.connector.getSignal(ko.unwrap(self.signalNameDay)) : 0;
            self.inputSignalHour = self.signalNameHour !== ''  ? self.connector.getSignal(ko.unwrap(self.signalNameHour)) : 0;
            self.inputSignalMinute = self.signalNameMinute !== ''  ? self.connector.getSignal(ko.unwrap(self.signalNameMinute)) : 0;
            self.inputSignalSecond = self.signalNameSecond !== ''  ? self.connector.getSignal(ko.unwrap(self.signalNameSecond)) : 0;
            
            self.inputSignalValue = ko.computed(function (value) {
                if ((ko.unwrap(self.inputSignalYear.value) != null && self.inputSignalYear.value != null) ||
                    (ko.unwrap(self.inputSignalMonth.value) != null && self.inputSignalMonth.value != null) ||
                    (ko.unwrap(self.inputSignalDay.value) != null && self.inputSignalDay.value != null) ||
                    (ko.unwrap(self.inputSignalHour.value) != null && self.inputSignalHour.value != null) ||
                    (ko.unwrap(self.inputSignalMinute.value) != null && self.inputSignalMinute.value != null) ||
                    (ko.unwrap(self.inputSignalSecond.value) != null && self.inputSignalSecond.value != null) ) {
                    //konvertieren der Zeit
                    var y = self.signalNameYear !== ''  ? ko.unwrap(self.inputSignalYear.value) : 0;
                    var mo = self.signalNameMonth !== ''  ? ko.unwrap(self.inputSignalMonth.value) : 1;  //1 weil 1 wieder abgezogen wird, Monat ist Null-basiert
                    var d = self.signalNameDay !== ''  ? ko.unwrap(self.inputSignalDay.value) : 1;
                    var h = self.signalNameHour !== ''  ? ko.unwrap(self.inputSignalHour.value) : 0;
                    var mi = self.signalNameMinute !== ''  ? ko.unwrap(self.inputSignalMinute.value) : 0;
                    var s = self.signalNameSecond !== ''  ? ko.unwrap(self.inputSignalSecond.value) : 0;
                    
                    var myDate = self.convertS7BytesInDate([y,mo,d,h,mi,s]);  //Neu am 23.02.2018 amueller
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
                var inBuff = (self.connector.existSignalInBuffer(self.signalNameYear) || 
                    self.connector.existSignalInBuffer(self.signalNameMonth) ||
                    self.connector.existSignalInBuffer(self.signalNameDay) ||
                    self.connector.existSignalInBuffer(self.signalNameHour) ||
                    self.connector.existSignalInBuffer(self.signalNameMinute) ||
                    self.connector.existSignalInBuffer(self.signalNameSecond));
                return inBuff && !self.connector.signalBufferIsEmpty();  //wenn Signal
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
                        //var value = self.connector.readSignalsFromBuffer([self.signalNameHour]);  //
                        console.log("isBuffered");
                        var y = self.signalNameYear !== ''  ? self.connector.readSignalsFromBuffer([self.inputSignalYear]) : 0;
                        var mo = self.signalNameMonth !== ''  ? self.connector.readSignalsFromBuffer([self.inputSignalMonth]) : 1;  //1 weil 1 wieder abgezogen wird, Monat ist Null-basiert
                        var d = self.signalNameDay !== ''  ? self.connector.readSignalsFromBuffer([self.inputSignalDay]) : 1;
                        var h = self.signalNameHour !== ''  ? self.connector.readSignalsFromBuffer([self.inputSignalHour]) : 0;
                        var mi = self.signalNameMinute !== ''  ? self.connector.readSignalsFromBuffer([self.inputSignalMinute]) : 0;
                        var s = self.signalNameSecond !== ''  ? self.connector.readSignalsFromBuffer([self.inputSignalSecond]) : 0;
                        
                        var myDate = self.convertS7BytesInDate([y,mo,d,h,mi,s]);  //Neu am 23.02.2018 amueller
                        return myDate;

                        //return value.length > 0 ? value[0] : null;
                    } else {
                        console.log("uncommited value");
                        console.log(self.uncommittedValue());
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

                var disp = self.connector.unregisterSignals(self.inputSignalYear) ||
                    self.connector.unregisterSignals(self.inputSignalMonth) ||
                    self.connector.unregisterSignals(self.inputSignalDay) ||
                    self.connector.unregisterSignals(self.inputSignalHour) ||
                    self.connector.unregisterSignals(self.inputSignalMinute) ||
                    self.connector.unregisterSignals(self.inputSignalSecond);
                return disp;
            },

            writeInputValue: function () {
                var self = this;
                var values = {};

                if (!self.signalNameYear && !self.signalNameMonth && !self.signalNameDay && !self.signalNameHour && !self.signalNameMinute && !self.signalNameSecond ) return;  // Neu 23.02.2018

                var value = null;

                if (ko.unwrap(self.uncommittedValue)) {
                    var date = moment(ko.unwrap(self.uncommittedValue).format(self.format));
                    var dateArr = self.convertDateInS7Bytes(ko.unwrap(self.uncommittedValue));  //Neu
                    value = dateArr;
                }

                if (self.signalNameYear !== '') values[self.signalNameYear]   = value[0];
                if (self.signalNameMonth !== '') values[self.signalNameMonth]  = value[1];
                if (self.signalNameDay !== '') values[self.signalNameDay]    = value[2];
                if (self.signalNameHour !== '') values[self.signalNameHour]   = value[3];
                if (self.signalNameMinute !== '') values[self.signalNameMinute] = value[4];
                if (self.signalNameSecond !== '') values[self.signalNameSecond] = value[5];

                if (self.writeToBuffer) {
                    self.connector.writeSignalsToBuffer(values);
                    self.isEditing(false);
                }else{
                    if (self.writeSecure)
                        self.writeInputValueSecure(value);
                    else {
                        // Write signal values, warning if an error will be returned
                        self.connector.writeSignals(values).then(function (result) {
                            self.isEditing(false);
                            if (result.errorMessage) {
                                self.connector.warn("WriteSignal result (ccw-wf-date-time-picker-s7bytes)", result);
                                toastr.error(result.errorMessage);
                            }
                        });
                    }
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
            
            convertS7BytesInDate: function (signalValues) {   //Neu am Febr. 2018
                var self = this;
                
                var valArr = signalValues;  //alles BCD-Codiert: [0]=Jahr; [1]=Monat; [2]=Tag; [3]=Stunde; [4]=Minute; [5]=Sekunde;
                //console.log("ccw-dtp-Read");
                //console.log(valArr);
                //console.log("Lesen S7 " + zeit.toLocaleString());
                var myDate = {};
                if ((valArr !== undefined) && (valArr.length > 5) && (typeof valArr === "object")) {  //Überpüfen auf Länge und Typ=Objekt
                    var jahr    = parseInt(valArr[0]) + 2000;   //wandeln in Date-format
                    var monat   = parseInt(valArr[1]);
                    var tag     = parseInt(valArr[2]);
                    var stunde  = parseInt(valArr[3]);
                    var minute  = parseInt(valArr[4]);
                    var sekunde = parseInt(valArr[5]);
            
                    myDate = new Date(jahr, monat - 1, tag, stunde, minute, sekunde);  //!!! Monate sind Null-basiert
                    //console.log("Lesen S7-2 " + zeit.toLocaleString());
                    //console.log("Übersetzes Datum: "+jahr + "/" + monat + "/" + tag + "/" + stunde + "/" + minute + "/" + sekunde + "/" + mSekunde + "/" + wTag);
                    
                    //console.log(bcd2number([38]));  //Ergibt 26 in HEX-Code
                    return myDate; 
                } else {
                    return new Date(0);
                }
            },

            convertDateInS7Bytes: function (valueDate) {   //Neu im Febr. 2018
                var self = this;
                
                var valArr = [18, 2, 22, 10, 11, 12];      //in S7: [0]=Jahr; [1]=Monat; [2]=Tag; [3]=Stunde; [4]=Minute; [5]=Sekunde;
                var d = Date.parse(valueDate);  //Input-Value ist String und diesen nach Date konvertieren
                var valD = new Date(d);         //neues Datum erstellen mit vorgegebenen Werten

                valArr[0] = valD.getFullYear() - 2000;   //nur 2-stelliges Jahr
                valArr[1] = valD.getMonth() + 1;         //Monate sind Null-Basiert, in S7 aber 1-12
                valArr[2] = valD.getDate();              //Monate sind Null-Basiert, in S7 aber 1-12
                valArr[3] = valD.getHours();             //Monate sind Null-Basiert, in S7 aber 1-12
                valArr[4] = valD.getMinutes();           //Monate sind Null-Basiert, in S7 aber 1-12
                valArr[5] = valD.getSeconds();           //Sekunden
                
                return valArr;
            }

        };

        return wfDateTime;
    });