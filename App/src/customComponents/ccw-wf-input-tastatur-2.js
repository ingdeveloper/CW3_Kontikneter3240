/*
 * ccw-wf-input-tastatur-2.js
 * Änderung:
 * 21.05.2021: - bei Funktion "keyupEventHandler" Taste Enter wird der Fehler self.settings.uncommittedValue nicht abgefangen. Das ist behoben (amueller)
 * 28.01.2021: -ueberpruefungsfehler korrigiert
 * 09.12.2020: -Parameter isBcd wandelt die Anzeige von INT nach BCD, beim Schreibvorgang wird die BCD in INT gewandelt (amueller)
 *             -Weitergabe des Parameters "parameter.unit" angepasst  (amueller)
 * 30.11.2020: -Parameter 'ueberpruefungsfehler' ist eine Möglichkeit das Feld so lange rot färben, bis eine neue Zahl übernommen wird. Von aussen wird das Feld gesetzt und innerhalb dieser Kompo wieder zurückgesetzt; zB ueberpruefungsfehler: Ueberpruefungsfehler -> self.Ueberpruefungsfehler = ko.observable(false); 
 * 30.11.2020: -Parameter 'uncommittedValue' ist eine Möglichkeit, die aktuelle Zahl oder die Pufferzahl auszulesen: es muss eine ko.observable() angegeben werden; zB uncommittedValue: anzahlValue   ->   self.anzahlValue = ko.observable(null);
 * 03.07.2019: -genaue Stellenabfrage bei Zifferneingabe "settings.anzahlZiffern", ansonsten Hinweistext
 * 03.07.2019: -Farbumschlag des Eingabefeldes, wenn settings.isTemperaturErreicht ansteht.Zusätzliche Class wird mit übergeben
 * 18.09.2018: - Komma Zahlen mit 0 konnte nicht eingegeben werden. ist berichtigt.
 *             - im Dialog ist jetzt auch MIN und MAX abgefragt.
 * 17.07.2018: - self.isSelected ist beim Aufruf von openPopup() bei aktiver Tastatur zurückgesetzt. Der Focus ist damit deaktiviert.
 * 06.07.2018: - Umbau auf Dialog-Fenster für Tastaturen
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

define(['../services/connector', "../components/services/secured.service", 'plugins/dialog', 'src/viewmodels/cowi/dialoge/ccwDialogInputTastatur'],
    function (signalsConnector, securedService, dialog, dialogZifferTastatur) {
        var wfInput = function (params) {
            var self = this;
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
            self.isBcd = ko.unwrap(self.settings.isBcd) !== undefined ? ko.unwrap(self.settings.isBcd) : false;  //neu 9.12.2020
            self.isAscii = ko.unwrap(self.settings.isAscii) !== undefined ? ko.unwrap(self.settings.isAscii) : false;  //neu 23.2.2022

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
            if (ko.unwrap(self.settings.uncommittedValue) !== undefined) self.settings.uncommittedValue();
            self.signalValue = null;

            self.isEditing = ko.observable(false);
            self.isEditingZiffer = ko.observable(false);
            self.isSelected = ko.observable(false);
            self.isEditingString = ko.observable(false);

            self.infoAktiv = ko.unwrap(self.settings.infoAktiv) !== undefined ? ko.unwrap(self.settings.infoAktiv) : true;
            self.isTemperaturErreichtClass = ko.unwrap(self.settings.isTemperaturErreichtClass) !== undefined ? ko.unwrap(self.settings.isTemperaturErreichtClass) : 'ccw-wf-input-tastatur-displayClass-tempOK-xs'; //default-Vorgabe geändert am 2.02.2018; Neu 25.09.2017 amueller
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

            self.anzahlZiffern = ko.unwrap(self.settings.anzahlZiffern) !== undefined ? ko.unwrap(self.settings.anzahlZiffern) : -1; //Neu 3.07.2019 amueller
            self.anzahlZiffernMarkierung = ko.observable(false);
            self.numberFehler = ko.observable(false);

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

            self.isTemperaturErreicht = ko.computed(function () { //Neu 3.07.2019 amueller/cgoldkamp
                var erg = ko.unwrap(self.settings.isTemperaturErreicht) !== undefined ? ko.unwrap(self.settings.isTemperaturErreicht) : false;
                //console.log("disableInputFeld");
                return erg;
            }, self);

            self.markierungEin = ko.computed(function () { //Neu 28.09.2017 amueller
                return ko.unwrap(self.settings.markierungEin) !== undefined ? ko.unwrap(self.settings.markierungEin) : false; //Neu 28.09.2017 amueller
            }, self);
            //ueberpruefungsfehler kann gesetzt werden, wenn die eingegebene Zahl nicht in Ordnung ist, wird aber durch Änderung des Feldes zurückgesetzt
            self.ueberpruefungsfehler = ko.computed(function () { //Neu 30.11.2020 amueller
                return ko.unwrap(self.settings.ueberpruefungsfehler) !== undefined ? self.settings.ueberpruefungsfehler() : false; //Neu 30.11.2020 amueller
            }, self);

            self.isAnzahlStellenFehler = ko.computed(function () { //Neu 28.09.2017 amueller
                var sollMarkieren = self.anzahlZiffernMarkierung();
                var nummerIstKeineGanzzahl = self.numberFehler();
                var erg = {};
                erg.anzeigen = sollMarkieren;
                if (nummerIstKeineGanzzahl) {
                    erg.text = "Fehler: Eingabe ist keine ganze Zahl!";
                } else {
                    erg.text = "Fehler: Anzahl Ziffern (" + self.anzahlZiffern + ")\n stimmen nicht überein!";
                }
                return erg;
            }, self);

            self.displayClassNames = ko.computed(function () {
                var lclass;
                var disable = self.disableInputFeld();
                var reached = self.isTemperaturErreicht();
                var markEin = self.markierungEin(); //Input-Feld kann von aussen markiert werden
                var ueberpruefungsfehler = self.ueberpruefungsfehler();
                var fehlerStellen = self.anzahlZiffernMarkierung();
                //console.log("%c------------" + self.markierungEin() + self.isEditing(), "background:yellow");
                if (fehlerStellen == true) {
                    lclass = "ccw-wf-input-tastatur-isFehlerAnzahlStellenClass";
                } else if (ueberpruefungsfehler == true) {
                    lclass = "ccw-wf-input-tastatur-isFehlerAnzahlStellenClass";
                } else if (self.isEditing() || self.isEditingZiffer() || self.isEditingString()) {
                    lclass = self.isFocusClass; //NEU 07.03.2018 amueller
                } else if (self.isBuffered() == true) {
                    lclass = self.isBufferedClass;
                } else if ((markEin === true) && (self.isMarkierungsClass != null)) {
                    lclass = self.isMarkierungsClass;
                } else if (reached === true) {
                    lclass = self.isTemperaturErreichtClass;
                } else if ((disable === true) && (self.isDisabledClass != null)) {
                    lclass = self.isDisabledClass; //NEU 24.09.2017 amueller
                } else {
                    lclass = self.displayClass;
                }
                return lclass;
            }, self);

            self.inputSignal = self.connector.getSignal(ko.unwrap(self.signalName));

            if (self.isAlphanumeric) {
                self.inputSignalValue = self.inputSignal.value;
                //console.log("inputTastaturValue");
                //console.log(self.inputSignalValue());
            } else if (self.isBcd) {
                self.inputSignalValue = self.inputSignal.value.extend({
                    isBCD: self.format
                });
            } else if (self.isAscii) {
                self.inputSignalValue = self.inputSignal.value.extend({
                    isAscii: 0
                });
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
                            if (ko.unwrap(self.settings.uncommittedValue) !== undefined) self.settings.uncommittedValue(ko.unwrap(self.inputSignalValue));
                            return parseFloat(ko.unwrap(self.inputSignalValue));
                        } else { //sonst den Input-Type als "text" formatieren
                            //console.log('%c<cccw-wf-input-tastatur>: isNaN = TRUE: ' + self.inputSignalValue, 'background:#2E9AFE');
                            self.textType('text');
                            if (ko.unwrap(self.settings.uncommittedValue) !== undefined) self.settings.uncommittedValue(ko.unwrap(self.inputSignalValue));
                            // wenn ein Char-Array angebunden wird, dann muss es hier über eine Schleife angezeigt werden
                            if (Array.isArray(ko.unwrap(self.inputSignalValue))) {
                                var str = "";
                                for (var i = 0; i < ko.unwrap(self.inputSignalValue).length; i++) {
                                    if (ko.unwrap(self.inputSignalValue)[i] >= 0) {
                                        if (ko.unwrap(self.inputSignalValue)[i] != 0) str = str + String.fromCharCode(ko.unwrap(self.inputSignalValue)[i]);
                                    } else {
                                        var newV = 256 - Math.abs(ko.unwrap(self.inputSignalValue)[i]); //Zahl ist negativ und deshalb von hinten in der ASCII-Tabelle abziehen
                                        if (ko.unwrap(self.inputSignalValue)[i] != 0) str = str + String.fromCharCode(newV);
                                    }
                                }
                                return str;
                            } else {
                                return ko.unwrap(self.inputSignalValue);
                            }
                        }
                    } else if (!self.isEditing() && self.isBuffered()) {
                        var value = self.connector.readSignalsFromBuffer([self.signalName]);
                        var erg = value.length > 0 ? value[0] : null;
                        if (ko.unwrap(self.settings.uncommittedValue) !== undefined) self.settings.uncommittedValue(value.length > 0 ? value[0] : null);
                        if (self.isBcd && (erg != null)) {
                            erg = parseInt(erg.toString(16));  //Hex-Wert in Integer wandeln 
                        }
                        return erg;
                    } else {
                        if (ko.unwrap(self.settings.uncommittedValue) !== undefined) self.settings.uncommittedValue(ko.unwrap(self.uncommittedValue));
                        return ko.unwrap(self.uncommittedValue);
                    }
                    return null;
                },
                write: function (value) {
                    self.uncommittedValue(value);
                    if (ko.unwrap(self.settings.uncommittedValue) !== undefined) self.settings.uncommittedValue(value);
                    self.anzahlZiffernMarkierung(false);
                    if (self.disableInputFeld() == false) { //Änderung 13.04.2018
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


            self.yClickPosition = ko.observable(0);
            self.xClickPosition = ko.observable(0);
            self.ElementWidth = ko.observable(0);
            self.elementTop = ko.observable(0);
            self.windowInnerHeight = 0;
            self.xClickOffsetImElement = ko.observable(0);
            self.cssAusrichtungKo = ko.observable('bottom');



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

            // Element-Breite: all=komplette Breite; val=das Anzeige-Feld für den Wert; Rest für das Label
            self.elemWidth = ko.computed(function () { //Emelement-Breite Neu 02.02.2018 amueller

                var all = self.elemBreite; //komplette Breite des Elementes
                var val = self.elemBreiteVal; //Breite der Input-Anzeige, Prozent von der kompletten Element-Breite

                return {
                    all: all,
                    val: val
                };
            }, self);
            //Enable OnlineUpdates
            self.connector.getOnlineUpdates(); //.fail(self.connector.handleError(self));
        };

        wfInput.prototype.writeInputValue = function () {
            var self = this;
            var values = {};

            if (!self.signalName) return;

            //--- neue Abfrage bei Min - Max-Werten und Meldungsausgabe ------------------
            if ((self.minValue || self.maxValue) && !self.isAlphanumeric) {
                var val = numeral(ko.unwrap(self.uncommittedValue)).value();
                //console.log(val);
                //console.log(typeof(val));
                if (self.minValue !== null) {
                    if (val < self.minValue) {
                        toastr.error('Min-Value (' + self.minValue + ') unterschritten!');
                        //console.log('Min-Value');
                        self.isEditing(false);
                        return;
                    }
                }
                if (self.maxValue !== null) {
                    if (val > self.maxValue) {
                        toastr.error('Max-Value (' + self.maxValue + ') überschritten!');
                        //console.log('Max-Value');
                        self.isEditing(false);
                        return;
                    }
                }
            }
            //--Ende minValue maxValue----------------------------------------------------------------

            // Abfrage, ob Parameter "anzahlZiffern" übereinstimmt -------------------------------------
            var uncommValue = self.uncommittedValue(); //String
            uncommValue = uncommValue.replace(/\s/g, ""); //alle Leerzeichen entfernen
            uncommValue = Number(uncommValue); //in Nummer konvertieren
            var len = uncommValue !== undefined ? uncommValue.toString().length : -1;  //Länge nur als String ermittelbar

            if (self.anzahlZiffern > 0) {
                if (!Number.isInteger(uncommValue)) {
                    self.anzahlZiffernMarkierung(true);
                    self.numberFehler(true);
                    toastr.error('Fehler: Eintrag ist keine ganze Zahl!');
                    return;
                } else if ((len !== self.anzahlZiffern) && (uncommValue !== 0)) {
                    // erg.anzeigen = len !== self.anzahlZiffern;
                    self.anzahlZiffernMarkierung(true);
                    self.numberFehler(false);
                    toastr.error('Fehler: Anzahl Ziffern (' + self.anzahlZiffern + ') stimmen nicht überein!');
                    return;

                } else {
                    self.anzahlZiffernMarkierung(false);
                    self.numberFehler(false);
                }
            } else {
                self.anzahlZiffernMarkierung(false);
                self.numberFehler(false);

            }
            // Ende: Abfrage AnzahlZiffern --------------------------------------------------------------

            if (self.isAlphanumeric) {
                values[self.signalName] = ko.unwrap(self.uncommittedValue);
            } else if (self.isBcd) {
                values[self.signalName] = numeral(parseInt(ko.unwrap(self.uncommittedValue), 16)).value();  //Hex-Wert in Integer wandeln 
            } else {
                values[self.signalName] = numeral(ko.unwrap(self.uncommittedValue)).value();
            }
            // values[self.signalName] = self.settings.isAlphanumeric ? ko.unwrap(self.uncommittedValue) : numeral(ko.unwrap(self.uncommittedValue)).value();



            //console.log("Ende min-max");
            if (self.writeToBuffer) {
                self.connector.writeSignalsToBuffer(values);
                self.zwischenWert = self.uncommittedValue();
                self.isEditing(false);
            } else
                // Write signal values, warning if an error will be returned
                self.connector.writeSignals(values).then(function (result) {
                    self.isEditing(false);
                    if (result.errorMessage) {
                        toastr.error(result.errorMessage);
                    }
                });
            if (ko.unwrap(self.settings.ueberpruefungsfehler) !== undefined) self.settings.ueberpruefungsfehler(false); //wenn neue Zahl eingegeben wurde, dann Markierung löschen

        };
        wfInput.prototype.resetInputValue = function () {
            var self = this;
            self.isEditing(false);
            self.uncommittedValue(self.zwischenWert); //den alten vorherigen Wert wieder bei Abbruch anzeigen
            if (ko.unwrap(self.settings.uncommittedValue) !== undefined) self.settings.uncommittedValue(self.zwischenWert);
            self.anzahlZiffernMarkierung(false);
        };


        wfInput.prototype.keyupEventHandler = function (data, event) {
            var self = this;
            // console.log("keyup");
            if (event.which === 13) {
                self.writeInputValue();
                if (ko.unwrap(self.settings.uncommittedValue) !== undefined) self.settings.uncommittedValue(false);
            }
            if (event.which === 27) { //Taste ESC
                self.isEditing(false);
                self.uncommittedValue(self.zwischenWert); //den alten vorherigen Wert wieder bei Abbruch anzeigen
                if (ko.unwrap(self.settings.uncommittedValue) !== undefined) self.settings.uncommittedValue(self.zwischenWert);
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
                    self.isSelected(false);
                    self.isEditingZiffer(true);
                    self.goDialog();

                    self.uncommittedValue(0); //Aenderung neue Zeile
                    if (ko.unwrap(self.settings.uncommittedValue) !== undefined) self.settings.uncommittedValue(0);

                    self.xClickPosition(event.clientX); //MouseClickPosition im sichtbaren Fensterbereich
                    self.yClickPosition(event.clientY); //MouseClickPosition im sichtbaren Fensterbereich
                    self.ElementWidth(event.target.offsetWidth); //Breite des angeklickten Element
                    self.xClickOffsetImElement(event.offsetX); //die Position im angeklickten Element
                    self.elementTop(0);
                }
            }
        };

        wfInput.prototype.aliasInfo = function () {
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

        wfInput.prototype.goDialog = function () {
            var self = this;
            console.log("goDialog");

            var parameter = {};
            parameter.signalName = self.signalName;
            parameter.writeToBuffer = self.writeToBuffer;
            parameter.label = self.label;
            parameter.unit = self.unitLabel === true ? self.staticUnitText : '';
            parameter.isText = self.isText();
            parameter.minValue = self.minValue;
            parameter.maxValue = self.maxValue;
            parameter.anzahlZiffern = self.anzahlZiffern;
            parameter.isAlphanumeric = self.isAlphanumeric;
            parameter.isBcd = self.isBcd;

            dialog.show(
                new dialogZifferTastatur(parameter)
            )
                .then(function (dialogResult) {
                    console.log(dialogResult);
                    self.isEditingZiffer(false);
                });
        };

        return wfInput;
    });