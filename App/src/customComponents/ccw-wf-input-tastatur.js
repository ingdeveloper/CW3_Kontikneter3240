/*
 * ccw-wf-input-tastatur.js
 * Änderung:
 * 06.07.2018: - Function elemBreite() umbenannt in elemWidth(), weil es eine KO-Variable elemBreite gab.
 * 22.06.2018: - Beim Schreibvorgang die Meldung "toastr.error(result.errorMessage)" mit reingenommen.
 * 16.04.2018: - das Dialog-Fenster war hinter einem Dialog-Aufruf-Fenster und mit dem Parameter Z-Index ist dieses behoben.
 *               <div class="modal fade" ..... style="display: none; z-index: 9999 !important;"
 * 13.04.2018: - wenn das Input-Feld disabled war, konnte mit einem Rechtsklick der AliasName nicht mehr angezeigt werden. Das wurde durch disable verhindert.
 *               Statt disable am Input-HTML-Element wird jetzt readOnly beschrieben.
 *               Die CSS fur Disable-Input ist mit cursor:default erweitert worden. amueller
 * 10.04.2018: - fontSize Parameter mit reingenommen. Dann kann jede Komponente separat vergrößert werden.
 * 09.04.2018: - self.infoAktiv mit reingenommen. Damit kann das Info-feld bei Rechtsklick deaktiviert werden.
 * 06.04.2018: - Umstellung auf modales Fenster. Der Hintergrund wird gräulich und nicht anklickbar. Mit Escape kann das Fenster geschlossen werden.
 * 04.04.2018: - Bei Rechtsklick auf das Input-Feld wird der SignalName mit einem Info-Toastr-Feld angezeigt. Neue funktion aliasInfo().
 *               Mit "oncontextmenu="return false"" wird der Aufruf des Kontextmenüs gesperrt.
 *  
 * 07.03.2018: - Ausrichtung des Ziffernblockes und Tastatur. Wenn der Abstand zum Rand (top, bottom, left, right) zu klein ist, wird das
 *               Anzeigefeld dementspechend weiter nach innen verschoben. 
 *               Das aktuelle input-Feld wird gelb markiert.
 *
 * 05.02.2018: - komplette Breite und AnzeigeWert-Breite als Übergabe-Parameter (% oder px). Der Rest ist für 
 *               das Label.
 *             - Wenn Modal-Fenster geöffnet wird, dann ein gräuliche´s Rechteck auf den restlichen Bildschirm
 *               gelegt, damit andere Input-Felder gesperrt sind.
 * 02.02.2018: - Die Übergabe-Paraemter wurden zuviele und deshalb sind viele Default-Werte in der
 *               Komponente vorgegeben
 * 28.11.2017: - Zeichentastatur weitergemacht. 
 *               Änderung in dem HTML-DIV und Funktion "setZeichen" neu erstellt.
 * 10.10.2017: - Ausprobieren einer Keyboard-Bibliothek
 * 06.10.2017: - Neuer Parameter "isText" für Anzeige der QWERTZ-Tastatur, Nummernblock bleibt ausgeblendet.
 * 28.09.2017: - Neuer Parameter "markierungEin" und "isMarkierungsClass" für Farbumschlag, wenn der Parameter "True" ist.
 *               amueller
 * 27.09.2017: - Es fehlt eine ID für das Input-Feld, damit auch Werte des Input-Elementes von aussen mit GetElementById abgefragt werden können.
 *               Neuer Parameter "inputId"
 *               amueller
 * 25.09.2017: - Css für Disable-Modus fehlte. Nachgepflegt als params-Eingang.
 *               amueller
 * 18.09.2017: - Abfrage, ob Gerät ein mobiles Gerät ist. Wenn mobil, dann wird das Input-Feld evtl. auf "type: number" gestellt.
 *               Quelltext in Funktion self.signalValue geändert. amueller
 * 14.09.2017: - Parameter enableInputFeld jetzt umbenannt in disableInputFeld:
 *              wenn der Parameter TRUE ist, dann wird das Feld gesperrt. D.h. userFreigabe() muss dann auf FALSE abgefragt werden.
 * 11.09.2017: - Input-Type ist jetzt variable, 'number' oder 'text':
 *               Ist die Empfangszahl als Nummer darstellbar, dann wird der Type-Parameter vom Input-Feld angepasst.
 *               Vorteil ist die Mobile Seite: bei click auf Input-Feld wird das Zahlenfeld vom IPhone geöffnet.
 * 08.09.2017: - neuer Parameter über HTML-Seite -> enableInputFeld:
 *              wenn der Parameter TRUE ist, dann wird das Input-Feld freigegeben.
 *              Den Parameter kann man gut mit einer UserFreigabe verknüpfen
 * 06.09.2017: - wenn Tastatur abgeschaltet ist (LocalSession "VirtuelleTastaturEIN"), dann wird bei Tastatureingabe trotzdem das Fenster geöffnet.
 *              Fehlerbehebung in Zeile 98:
 *              write: function (value) {
                    self.uncommittedValue(value);
                    self.isEditing(true);
                    self.isEditingZiffer(false);   <- von true auf false
                }
 * 01.08.2017:  - minValue & maxValue für Bereichsüberschreitungsfehler
 *              amueller
 * 20.06.2017:  - der Wert aus dem Buffer wurde nicht bei Seitenaufruf zurückgelesen.
 *              bei self.signalValue habe ich readSignalsFromBuffer dazu genommen
 *              amueller
 * 
 */

define(['../services/connector', "../components/services/secured.service"],//, 'plugins/dialog','src/viewmodels/cowi/dialoge/cwDialog'],
    function (signalsConnector, securedService) { //, dialog, okCancelDialog) {
        var dialog = require('plugins/dialog');
        var wfInput = function (params) {
            var self = this;
            //console.log("DIALOG");
            //console.log(dialog);
            //console.log(this);
            self.settings = params;
            self.connector = new signalsConnector();

            self.objectID = ko.unwrap(self.settings.objectID);
            self.id = ko.observable(uuid.v4());
            self.draggable = self.settings.draggable !== undefined ? ko.unwrap(self.settings.draggable) : true;
            self.show = ko.observable(false);

            self.projectAuthorization = (ko.unwrap(params.projectAuthorization) || "").stringPlaceholderResolver(self.objectID);
            self.securedService = new securedService(self.projectAuthorization);
            self.hasAuthorization = self.securedService.hasAuthorization;

            self.tooltipText = (ko.unwrap(self.connector.translate(self.settings.tooltipText)()) || "").stringPlaceholderResolver(self.objectID);
            self.format = ko.unwrap(self.settings.format) ? ko.unwrap(self.settings.format) : "0,0.0";
            self.isAlphanumeric = ko.unwrap(self.settings.isAlphanumeric) !== undefined ? ko.unwrap(self.settings.isAlphanumeric) : false;

            self.iconClass = ko.unwrap(self.settings.iconClass) || null;
            self.displayClass = ko.unwrap(self.settings.displayClass) !== undefined ? ko.unwrap(self.settings.displayClass) : 'ccw-wf-input-tastatur-displayClass-xs'; //default-Vorgabe geändert am 2.02.2018
            self.isBufferedClass = ko.unwrap(self.settings.isBufferedClass) !== undefined ? ko.unwrap(self.settings.isBufferedClass) : 'ccw-wf-input-tastatur-isBufferesClass-xs'; //default-Vorgabe geändert am 2.02.2018
            self.inputSize = ko.unwrap(self.settings.inputSize) !== undefined ? "input-group-" + ko.unwrap(self.settings.inputSize) : "";
            self.fontSize = ko.unwrap(self.settings.fontSize) !== undefined ? ko.unwrap(self.settings.fontSize) : 'inherit';

            self.label = (ko.unwrap(self.settings.label) || '').stringPlaceholderResolver(self.objectID);
            self.signalNameLabel = ko.unwrap(self.settings.signalNameLabel) !== undefined ? ko.unwrap(self.settings.signalNameLabel) : false;

            self.staticUnitText = (ko.unwrap(self.settings.staticUnitText) || '').stringPlaceholderResolver(self.objectID);
            self.unitLabel = ko.unwrap(self.settings.unitLabel) !== undefined ? ko.unwrap(self.settings.unitLabel) : false;

            self.iconStyle = ko.unwrap(self.settings.iconStyle) || '';
            self.textStyle = ko.unwrap(self.settings.textStyle) || 'text';

            self.signalName = (ko.unwrap(self.settings.signalName) || '').stringPlaceholderResolver(self.objectID);

            self.minValue = ko.unwrap(self.settings.minValue) !== undefined ? ko.unwrap(self.settings.minValue) : null; //Neu 
            self.maxValue = ko.unwrap(self.settings.maxValue) !== undefined ? ko.unwrap(self.settings.maxValue) : null; //Neu

            self.uncommittedValue = ko.observable();
            self.signalValue = null;

            self.isEditing = ko.observable(false);
            self.isEditingZiffer = ko.observable(false);
            self.isSelected = ko.observable(false);
            self.isEditingString = ko.observable(false);
            self.infoAktiv = ko.unwrap(self.settings.infoAktiv) !== undefined ? ko.unwrap(self.settings.infoAktiv) : true;

            self.isDisabledClass = ko.unwrap(self.settings.isDisabledClass) !== undefined ? ko.unwrap(self.settings.isDisabledClass) : 'ccw-wf-input-tastatur-disabledClass-xs'; //default-Vorgabe geändert am 2.02.2018; Neu 25.09.2017 amueller
            self.isMarkierungsClass = ko.unwrap(self.settings.isMarkierungsClass) !== undefined ? ko.unwrap(self.settings.isMarkierungsClass) : 'ccw-wf-input-tastatur-markierungsClass-xs'; //default-Vorgabe geändert am 2.02.2018;Neu 28.09.2017 amueller
            self.isFocusClass = ko.unwrap(self.settings.isFocusClass) !== undefined ? ko.unwrap(self.settings.isFocusClass) : 'ccw-wf-input-tastatur-focusClass-xs'; //default-Vorgabe geändert am 2.02.2018; Neu 25.09.2017 amueller
            self.labelClass = ko.unwrap(self.settings.labelClass) !== undefined ? ko.unwrap(self.settings.labelClass) : 'ccw-wf-input-tastatur-labelClass-xs'; //default-Vorgabe geändert am 2.02.2018; Neu 25.09.2017 amueller

            self.inputId = ko.unwrap(self.settings.inputId) !== undefined ? ko.unwrap(self.settings.inputId) : null; //Neu 27.09.2017 amueller 
            self.isText = ko.observable(ko.unwrap(self.settings.isText) !== undefined ? ko.unwrap(self.settings.isText) : false); //Neu 06.10.2017 amueller 

            self.writeToBuffer = ko.unwrap(self.settings.writeToBuffer) !== undefined ? ko.unwrap(self.settings.writeToBuffer) : true; //geändert auf TRUE am 2.02.2018

            self.elemBreite = ko.unwrap(self.settings.elemBreite) !== undefined ? ko.unwrap(self.settings.elemBreite) : "100%";
            self.elemBreiteVal = ko.unwrap(self.settings.elemBreiteVal) !== undefined ? ko.unwrap(self.settings.elemBreiteVal) : "70%";

            self.textAlign = ko.unwrap(self.settings.textAlign) !== undefined ? ko.unwrap(self.settings.textAlign) : "right";

            self.breite = ko.observable(285); //Breite des Panels nur der Zifferneingabe

            // Stop here and return if no signalName was configured
            if (!self.signalName) {
                return null;
            }

            self.isBuffered = ko.computed(function () {
                if (!self.writeToBuffer)
                    return false;

                return self.connector.existSignalInBuffer(self.signalName) && !self.connector.signalBufferIsEmpty();
            }, self);

            self.disableInputFeld = ko.computed(function () { //Neu 14.09.2017 amueller
                var erg = ko.unwrap(self.settings.disableInputFeld) !== undefined ? ko.unwrap(self.settings.disableInputFeld) : false;
                //console.log("disableInputFeld");
                return erg;
            }, self);

            self.markierungEin = ko.computed(function () { //Neu 28.09.2017 amueller
                return ko.unwrap(self.settings.markierungEin) !== undefined ? ko.unwrap(self.settings.markierungEin) : false; //Neu 28.09.2017 amueller
            }, self);


            self.displayClassNames = ko.computed(function () {
                var lclass;
                var disable = self.disableInputFeld();
                var markEin = self.markierungEin(); //Input-Feld kann von aussen markiert werden
                //console.log("%c------------" + self.markierungEin(), "background:yellow");
                if (self.isEditing() || self.isEditingZiffer() || self.isEditingString()) {
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
                //console.log("%c------------" + lclass, "background:yellow");
                return lclass;
                //return self.isBuffered() == true ? self.isBufferedClass : self.displayClass;

            }, self);

            self.inputSignal = self.connector.getSignal(ko.unwrap(self.signalName));

            if (self.settings.isAlphanumeric) {
                self.inputSignalValue = self.inputSignal.value;
            } else {
                self.inputSignalValue = self.inputSignal.value.extend({
                    numeralNumber: self.format
                });
            }

            self.textType = ko.observable('text');
            self.signalValue = ko.computed({
                read: function () {
                    //console.log('%cCCW-Input-Ziffer READ1: ' + self.signalName, 'background:#2E9AFE');
                    if (!self.isEditing() && !self.isEditingZiffer() && !self.isBuffered()) {
                        //console.log('%cCCW-Input-Ziffer READ2: ' + typeof (self.inputSignalValue), 'background:#2E9AFE');
                        //return ko.unwrap(self.inputSignalValue);
                        var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|blackberry|android|Kindle|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i);
                        if ((isNaN(parseFloat(ko.unwrap(self.inputSignalValue))) === false) && (isMobile == true)) { //wenn Number und Mobil-Gerät, dann Input-Type als "number" formatieren
                            //console.log('%c<cccw-wf-input-tastatur>: isNaN = FALSE: ', 'background:#2E9AFE');
                            self.textType('number');
                            return parseFloat(ko.unwrap(self.inputSignalValue));
                        } else { //sonst den Input-Type als "text" formatieren
                            //console.log('%c<cccw-wf-input-tastatur>: isNaN = TRUE: ' + self.inputSignalValue, 'background:#2E9AFE');
                            self.textType('text');
                            return ko.unwrap(self.inputSignalValue);
                        }
                    } else if (!self.isEditing() && self.isBuffered()) {
                        var value = self.connector.readSignalsFromBuffer([self.signalName]);
                        return value.length > 0 ? value[0] : null;
                    } else {
                        return ko.unwrap(self.uncommittedValue);
                    }
                    return null;
                },
                write: function (value) {
                    self.uncommittedValue(value);
                    if (self.disableInputFeld() == false) {   //Änderung 13.04.2018
                        self.isEditing(true);   
                    }    
                    self.isEditingZiffer(false);
                }
            }, self);

            self.enableSignalName = (ko.unwrap(self.settings.enableSignalName) || '').stringPlaceholderResolver(self.objectID);
            self.visibilitySignalName = (ko.unwrap(self.settings.visibilitySignalName) || '').stringPlaceholderResolver(self.objectID);

            self.enableSignalValue = ko.unwrap(self.settings.enableSignalValue) !== undefined ? ko.unwrap(self.settings.enableSignalValue) : '';
            self.visibilitySignalValue = ko.unwrap(self.settings.visibilitySignalValue) !== undefined ? ko.unwrap(self.settings.visibilitySignalValue) : '';

            self.enableOperator = ko.unwrap(self.settings.enableOperator) || "==";
            self.visibilityOperator = ko.unwrap(self.settings.visibilityOperator) || "==";

            self.visibilitySignal = self.visibilitySignalName ? self.connector.getSignal(self.visibilitySignalName) : null;
            self.isVisible = ko.computed(function () {
                var self = this;

                if (!self.visibilitySignal || !self.visibilitySignalValue)
                    return true;

                return evaluateCondition(self.visibilitySignal.value(), self.visibilitySignalValue, self.visibilityOperator);
            }, self);

            self.enableSignal = self.enableSignalName ? self.connector.getSignal(self.enableSignalName) : null;


            self.isDisabled = ko.computed(function () {
                var self = this;
                var disable = ko.unwrap(self.disableInputFeld());
                //console.log('%cccw-wf-input-tastatur.isDisable = ' + self.enableInputFeld(), 'background: #819FF7');
                if (disable === true) { //Aenderung neu, wenn Disable, dann Feld sperren
                    return true;
                }

                if (!self.enableSignal || !self.enableSignalValue)
                    return false;
                return !evaluateCondition(self.enableSignal.value(), self.enableSignalValue, self.enableOperator);
            }, self);

            self.zwischenWert = 0; //Aenderung Neu

            self.signalWfDbWert = self.inputSignalValue; //Aenderung neu
            self.kommaBetaetigt = 0; //Aenderung Neu

            self.yClickPosition = ko.observable(0);
            self.xClickPosition = ko.observable(0);
            self.ElementWidth = ko.observable(0);
            self.elementTop = ko.observable(0);
            self.windowInnerHeight = 0;
            self.xClickOffsetImElement = ko.observable(0);
            self.cssAusrichtungKo = ko.observable('bottom');


            self.cssAusrichtung = ko.computed(function () {
                var linksFreierPlatz = self.xClickPosition() - self.xClickOffsetImElement(); //X-Position der Mouse und X im Element abziehen
                var rechtsFreierPlatz = window.innerWidth - self.xClickPosition() - self.xClickOffsetImElement(); //X-Position der Mouse und X im Element abziehen
                //console.log("LinksFreierPlatz:" + linksFreierPlatz + " RechtsFreierPlatz:" + rechtsFreierPlatz);
                var erg = 'bottom';
                if ((self.yClickPosition() > 400) && (rechtsFreierPlatz > 280) && (linksFreierPlatz > 280)) {
                    //console.log('top ' + self.yClickPosition());
                    erg = 'top';
                } else if ((self.yClickPosition() < 300) && (rechtsFreierPlatz > 280) && (linksFreierPlatz > 280)) {
                    //console.log('bottom ' + self.yClickPosition());
                    erg = 'bottom';
                } else {
                    //console.log('%cFreier Platz auf linker Seite = ' + linksFreierPlatz, 'background: lime');
                    if (linksFreierPlatz > 280) {
                        erg = 'left';
                    } else {
                        erg = 'right';
                    }
                }

                self.cssAusrichtungKo(erg);
                //console.log("%cCss:" + erg, 'background: #FFBF00');
                return erg;
            });

            self.top = ko.computed(function () {
                var myi = ko.unwrap(self.cssAusrichtungKo()); //unwrap = eine nicht obserable zu einer obserable machen
                var x = self.xClickPosition(); //X-Position der Mouse und X im Element abziehen
                var y = self.yClickPosition();
                var abstand = 0;

                var erg = 0;
                if (myi == 'top') {
                    erg = y - 460;
                } else if (myi == 'bottom') {
                    erg = y + 20;
                } else if (myi == 'left') {
                    erg = y - 230;
                    if (y < 230) erg = 0; //wenn nicht halbe Höhe, dann den Top-Punkt auf 0 setzen
                } else if (myi == 'right') {
                    erg = y - 230;
                    if (y < 230) {
                        erg = 0; //wenn nicht halbe Höhe, dann den Top-Punkt auf 0 setzen

                    }
                } else {
                    erg = 100;
                }
                //console.log("%cTop:" + y + " Erg:" + erg, 'background: #FFBF00');
                return erg;

            }, self);

            self.left = ko.computed(function () {
                var myi = ko.unwrap(self.cssAusrichtung); //unwrap = eine nicht obserable zu einer obserable machen
                var x = self.xClickPosition(); //X-Position der Mouse und X im Element abziehen
                var erg = 0;
                if (myi == 'top') {
                    erg = x - self.xClickOffsetImElement();

                } else if (myi == 'bottom') {
                    erg = x - self.xClickOffsetImElement();

                } else if (myi == 'left') {
                    erg = x - self.xClickOffsetImElement() - 310;

                } else if (myi == 'right') {
                    //self.ElementWidth(event.target.offsetWidth); //Breite des angeklickten Element
                    //self.xClickOffsetImElement = event.offsetX; //die Position im angeklickten Element
                    //console.log("LEFT: " + self.ElementWidth() + " / " + self.xClickOffsetImElement() + " / " + x);
                    erg = x + (self.ElementWidth() - self.xClickOffsetImElement()) + 30;
                } else {

                    erg = 20;
                }
                //console.log("Left:" + erg + " myi=" + myi);
                return erg;

            }, self);


            self.keyboardLayout = {
                'qwertz': {
                    'normal': [
                        '1 2 3 4 5 6 7 8 9 0 - = {bksp}',
                        '{tab} q w e r t z u i o p [ ] \\',
                        'a s d f g h j k l ; \' {enter}',
                        '{shift} y x c v b n m , . / {shift}',
                        '{accept} {space} {cancel}'
                    ],
                    'shift': [
                        '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
                        '{tab} Q W E R T Z U I O P { } |',
                        'A S D F G H J K L : " {enter}',
                        '{shift} Y X C V B N M < > ? {shift}',
                        '{accept} {space} {cancel}'
                    ]
                }
            };

            self.keyboardTastenAnzeigen = ko.observableArray([]);
            self.keyboardTastenArray = ko.observableArray([]);
            self.configKeyboardLayout = ko.observable(self.keyboardLayout.qwertz.normal);
            //console.log("--layout--");
            //console.log(self.configKeyboardLayout());
            self.keyboardTasten = ko.computed(function () {
                var str, str2; //     "  1 2 3 4";
                var nA = [];
                var nA2, minWidth; //["1", "2", "3"];

                var i, j, k;
                self.keyboardTastenAnzeigen([]);
                self.keyboardTastenArray([]);
                for (i = 0; i < self.configKeyboardLayout().length; i++) {

                    str = self.configKeyboardLayout()[i];
                    nA = [];
                    str2 = str.split(" ");
                    //console.log("%c---- nach SPLIT ---", "background:lime");
                    //console.log(str2);
                    for (k = 0; k < str2.length; k++) {
                        var obj = {};
                        obj["char"] = str2[k];
                        obj["minWidth"] = 40;
                        obj["bgcolor"] = 'btn-success';
                        nA.push(obj);
                        //console.log("%c---- nach FOR----", "background:lime");
                        //console.log(nA);
                    }
                    nA2 = str.split(" ");
                    for (j = 0; j < nA.length; j++) {
                        if (nA[j].char == '{shift}') {
                            nA[j].char = '<i class="glyphicon glyphicon-arrow-up"></i>';
                        }
                        if (nA[j].char == '{enter}') {
                            nA[j].char = '<i class="fa fa-level-down fa-rotate-90"></i>';
                        }
                        if (nA[j].char == '{tab}') {
                            nA[j].char = '<i class="fa fa fa-arrows-h"></i>';
                        }
                        if (nA[j].char == '{bksp}') {
                            nA[j].char = '<i class="fa fa-long-arrow-left"></i>';
                        }
                        if (nA[j].char == '{accept}') {
                            nA[j].char = 'Accept';
                            nA[j].bgcolor = 'btn-warning';
                        }
                        if (nA[j].char == '{cancel}') {
                            nA[j].char = 'Cancel';
                            nA[j].bgcolor = 'btn-primary';
                        }
                        if (nA[j].char == '{space}') {
                            nA[j].char = '&nbsp';
                            nA[j].minWidth = 200;
                        }
                    }
                    //console.log("%c---- Layout Ausgabe----", "background:lime");
                    //console.log(nA);

                    self.keyboardTastenAnzeigen.push(nA); //wird angezeigt
                    self.keyboardTastenArray.push(nA2); //intern zum weiterbearbeiten
                }
                //console.log("%c---- Layout ----", "background:lime");
                //console.log(self.keyboardTastenAnzeigen());
                //console.log(self.keyboardTastenArray());
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

            // self.fensterSchliessen = ko.computed(function () {
            //     var foc = self.isSelected();
            //     if (foc === false) {
            //         self.isEditing(false);
            //         self.isEditingZiffer(false);
            //         self.isEditingString(false);
            //         $("#ccw-wf-input-tastatur-overlay").remove();
            //     }

            // });

            //Enable OnlineUpdates
            self.connector.getOnlineUpdates();//.fail(self.connector.handleError(self));

        };

        wfInput.prototype.writeInputValue = function () {
            var self = this;
            var values = {};

            if (!self.signalName) return;

            //--- neue Abfrage bei Min - Max-Werten und Meldungsausgabe ------------------
            if ((self.minValue || self.maxValue) && !self.settings.isAlphanumeric) {
                var val = numeral(ko.unwrap(self.uncommittedValue)).value();
                //console.log(val);
                //console.log(typeof(val));
                if (self.minValue !== null) {
                    if (val < self.minValue) {
                        toastr.error('Min-Value (' + self.minValue + ') unterschritten!');
                        //console.log('Min-Value');
                        self.isEditing(false);
                        self.isEditingZiffer(false);
                        self.isEditingString(false);
                        self.show(false);
                        $("#ccw-wf-input-tastatur-overlay").remove();
                        return;
                    }
                }
                if (self.maxValue !== null) {
                    if (val > self.maxValue) {
                        toastr.error('Max-Value (' + self.maxValue + ') überschritten!');
                        //console.log('Max-Value');
                        self.isEditing(false);
                        self.isEditingZiffer(false);
                        self.isEditingString(false);
                        self.show(false);
                        $("#ccw-wf-input-tastatur-overlay").remove();
                        return;
                    }
                }
            }
            //--Ende minValue maxValue----------------------------------------------------------------

            values[self.signalName] = self.settings.isAlphanumeric ? ko.unwrap(self.uncommittedValue) : numeral(ko.unwrap(self.uncommittedValue)).value();
            //console.log("Ende min-max");
            if (self.writeToBuffer) {
                self.connector.writeSignalsToBuffer(values);
                self.zwischenWert = self.uncommittedValue();
                self.isEditing(false);
                self.isEditingZiffer(false);
                self.isEditingString(false);
                self.show(false);
                //console.log("Ende min-max , danach writeToBuffer");
                $("#ccw-wf-input-tastatur-overlay").remove();

            } else
                // Write signal values, warning if an error will be returned
                self.connector.writeSignals(values).then(function (result) {
                    self.isEditing(false);
                    self.isEditingZiffer(false);
                    self.isEditingString(false);
                    self.show(false);

                    if (result.errorMessage) {
                        toastr.error(result.errorMessage);
                    }
                    $("#ccw-wf-input-tastatur-overlay").remove();
                });
        };

        wfInput.prototype.resetInputValue = function () {
            var self = this;

            self.isEditing(false);
            self.isEditingZiffer(false);
            self.isEditingString(false);
            self.show(false);
            self.uncommittedValue(self.zwischenWert); //den alten vorherigen Wert wieder bei Abbruch anzeigen
            // $("#ccw-wf-input-tastatur-overlay").remove();
        };

        wfInput.prototype.keyupEventHandler = function (data, event) {
            var self = this;
            if (event.which === 13) {
                self.writeInputValue();
            }
        };

        wfInput.prototype.keyupEventHandler2 = function (data, event) {
            var self = this;
            if (event.which === 27) { //Taste ESC
                self.isEditing(false);
                self.isEditingZiffer(false);
                self.isEditingString(false);
                self.show(false);
                self.uncommittedValue(self.zwischenWert); //den alten vorherigen Wert wieder bei Abbruch anzeigen
                //console.log("ESC");
            }
        };

        wfInput.prototype.dispose = function () {
            var self = this;
            if (!self.inputSignal) return;
            return self.connector.unregisterSignals(self.inputSignal);
        };

        wfInput.prototype.openPopup = function (data, event) { //data=Funktionsübergabe, event=Click-Ereignis und viele Positionen usw.
            var self = this;
            self.windowInnerHeight = window.innerHeight;
            //auslesen der gespeicherten Variablen
            if (self.disableInputFeld() == false) { //Änderung 13.04.2018
                if (localStorage.getItem("VirtuelleTastaturEIN") === "true") {
                    if (self.isText() === true) { //Neu am 6.10.2017
                        self.isEditingString(true); //Neu am 6.10.2017
                        self.show(true);
                        self.breite(635); //Breite des Panels nur der Stringeingabe
                    } else {

                        self.isEditingZiffer(true);
                        self.show(true);
                        self.breite(285); //Breite des Panels nur der Ziffereingabe
                    }
                    self.uncommittedValue(0); //Aenderung neue Zeile
 
                    self.xClickPosition(event.clientX); //MouseClickPosition im sichtbaren Fensterbereich
                    self.yClickPosition(event.clientY); //MouseClickPosition im sichtbaren Fensterbereich
                    self.ElementWidth(event.target.offsetWidth); //Breite des angeklickten Element
                    self.xClickOffsetImElement(event.offsetX); //die Position im angeklickten Element
                    self.elementTop(0);
                    // console.log('Y=' + self.yClickPosition() + ' X=' + self.xClickPosition() + ' Breite=' + self.ElementWidth() + ' xImElem=' + self.xClickOffsetImElement());
                    // console.log(event.target.scale);
                }
            }    
            
        };

        wfInput.prototype.setZiffer = function (wert) {
            var self = this;
            var newVal;
            if (self.kommaBetaetigt) {
                newVal = self.uncommittedValue().toString() + '.' + wert;
                self.kommaBetaetigt = 0;
            } else {
                newVal = self.uncommittedValue().toString() + wert;
            }
            self.uncommittedValue(parseFloat(newVal));
        };

        wfInput.prototype.setPlusMinus = function () {
            var self = this;
            var newVal, newVal2;
            newVal2 = self.uncommittedValue() * (-1);
            newVal = newVal2.toString();
            self.uncommittedValue(parseFloat(newVal));
        };

        wfInput.prototype.setKomma = function () {
            var self = this;
            var newVal;
            self.kommaBetaetigt = 1; //zwischenspeichern, weil Javasript nur einen Punkt(Komma) nicht verarbeitet. Es fehlt eine Zahl hinter dem Punkt.
        };

        wfInput.prototype.setCLR = function () {
            var self = this;
            var newVal;
            self.uncommittedValue(0);
        };
        wfInput.prototype.toggleAnzeigeZifferBuchstaben = function () {
            var self = this;
            if (self.isEditingZiffer() == true) {
                self.isEditingZiffer(false);
                self.isEditingString(true);
                self.breite(635); //Breite des Panels nur der Stringeingabe
                //console.log('%cUmschaltung Tastatur auf STRING', 'background:yellow');
            } else {
                self.isEditingZiffer(true);
                self.isEditingString(false);
                self.breite(285); //Breite des Panels nur der Zifferneingabe
                //console.log('%cUmschaltung Tastatur auf ZIFFER', 'background:yellow');
            }
        };





        wfInput.prototype.setZeichen = function (basis, index) {
            var self = this;
            var taste;
            var newVal;
            //console.log("%csetZeichen():basis=" + basis + " index=" + index, "background:yellow");
            //if (self.kommaBetaetigt) {
            //    newVal = self.uncommittedValue().toString() + '.' + wert;
            //    self.kommaBetaetigt = 0;
            //} else {
            //    newVal = self.uncommittedValue().toString() + wert;
            //}
            taste = self.keyboardTastenArray()[basis][index];
            if (taste == "{shift}") {
                if (self.configKeyboardLayout() == self.keyboardLayout.qwertz.shift) {
                    self.configKeyboardLayout(self.keyboardLayout.qwertz.normal);
                } else {
                    self.configKeyboardLayout(self.keyboardLayout.qwertz.shift);
                }
            } else if (taste == "{bksp}") {
                newVal = self.uncommittedValue().toString();
                newVal = newVal.slice(0, -1);
                self.uncommittedValue((newVal));
            } else if (taste == "{space}") {
                newVal = self.uncommittedValue().toString() + ' ';
                //console.log(this.getCursorPosition);

                //console.log(this.selectionStart);
                self.uncommittedValue((newVal));
            } else if (taste == "{tab}") {
                newVal = self.uncommittedValue().toString() + '\t';
                //console.log(this.getCursorPosition);

                //console.log(this.selectionStart);
                self.uncommittedValue((newVal));
            } else if (taste == "{accept}") {
                self.writeInputValue();
            } else if (taste == "{cancel}") {
                self.resetInputValue();
            } else if (taste == "{enter}") {
                newVal = self.uncommittedValue().toString() + '\r';
                self.uncommittedValue((newVal));
            } else {
                newVal = self.uncommittedValue().toString() + taste;
                self.uncommittedValue((newVal));
            }

        };

        wfInput.prototype.openDialog = function () { //Parameter: Text für Ja-Button, Text für Nein-Button, Text für Überschrift
            var self = this;
            dialog.show(
                function () {
                    console.log("show");
                }
            );

        };

        wfInput.prototype.aliasInfo = function () {
            var self = this;

            if (self.infoAktiv == true) {
                toastr.info("Signal: " + self.signalName);
            }
            return false;
        };

        wfInput.prototype.dragStart = function () {
            var self = this;

            toastr.info("dragStart: ");
            return true;

        };
        return wfInput;
    });