define(['../services/connector'],

    function (signalsConnector) {
        var ccwshape = function (params) {
            var self = this;

            self.connector = new signalsConnector();

            self.settings = params;

            self.signalEin = (ko.unwrap(self.settings.signalEin) || '');
            self.signalStoer = (ko.unwrap(self.settings.signalStoer) || '');
            self.signalHand = (ko.unwrap(self.settings.signalHand) || '');

            self.bmk = (ko.unwrap(self.settings.bmk) || '');
            self.nameShape = (ko.unwrap(self.settings.nameShape) || '');
            self.infoAktiv = ko.unwrap(self.settings.infoAktiv) !== undefined ? ko.unwrap(self.settings.infoAktiv) : true;
            self.ausrichtung = (ko.unwrap(self.settings.ausrichtung) || '');

            self.width = ko.unwrap(self.settings.width) !== undefined ? ko.unwrap(self.settings.width) : 20;
            self.height = ko.unwrap(self.settings.height) !== undefined ? ko.unwrap(self.settings.height) : 20;

            self.strokeColor = ko.unwrap(self.settings.strokeColor) !== undefined ? ko.unwrap(self.settings.strokeColor) : 'grey';
            self.strokeWidth = ko.unwrap(self.settings.strokeWidth) !== undefined ? ko.unwrap(self.settings.strokeWidth) : 2;
            self.shape = ko.unwrap(self.settings.shape) !== undefined ? ko.unwrap(self.settings.shape) : "circle"; // | "rect" | "schranke1" | "schranke2" ....
            self.tooltipText = (ko.unwrap(self.connector.translate(self.settings.tooltipText)()) || "").stringPlaceholderResolver(self.objectID);
            self.cssEin = ko.unwrap(self.settings.cssEin) !== undefined ? ko.unwrap(self.settings.cssEin) : 'ccw-wf-shape-ein';
            self.cssDefault = ko.unwrap(self.settings.cssDefault) !== undefined ? ko.unwrap(self.settings.cssDefault) : 'ccw-wf-shape-aus';
            self.text = ko.unwrap(self.settings.text) !== undefined ? ko.unwrap(self.settings.text) : '';

            // Für CIRCLE -----------------------------------------------------------
            self.cx = self.width / 2;
            self.cy = self.height / 2;
            self.r = (self.width - (2 * self.strokeWidth)) / 2;
            // -------------------------------------------
            // Für LICHT 1 -----------------------------------------------------------
            self.cxLicht1 = (self.width / 2);
            self.cyLicht1 = (self.height / 2);
            self.rLicht1 = (self.width - (2 * self.strokeWidth)) / 2;
            self.wLicht1 = self.width;
            self.hLicht1 = self.height;
            // -------------------------------------------

            // Für LICHT 2 -----------------------------------------------------------
            self.w1Licht2 = (self.width) - 6;
            self.h1Licht2 = (self.height) - 6;
            self.t1Licht2 = 3;
            self.l1Licht2 = 3;
            self.r1Licht2 = 4;
            self.wLicht2 = self.width;
            self.hLicht2 = self.height;
            // -------------------------------------------


            self.vDirection = ko.computed(function () {
                var self = this;
                var ventilDirection = self.ausrichtung;

                return 'rotate(' + ventilDirection + 'deg)';
            }, self);

            self.vStyle = ko.computed(function () {
                var self = this;
                var css = 'ccw-wf-shape-aus';
                var ein = 0;
                var stoer = 0;
                var hand = 0;
                var ohneSignal = false; //wenn Signalname nicht vorhanden ist

                // Abfragen, wieviele Signale abgefragt werden sollen. Ist der Parameter ein String, dann 
                if (typeof self.signalEin === "string") {
                    if (self.signalEin !== '') {
                        var signal = self.connector.getSignal(self.signalEin).value;
                        ein = signal() & 0x1;
                        // Ohne Signal auswerten
                        if ((signal() === undefined) || (signal() === null)) {
                            ohneSignal = true;
                            console.log("Ohne Signal: " + self.signalEin);
                        }
                    }
                    self.signalIsArray = false;
                } else if (Array.isArray(self.signalEin)) {
                    // mehrere Signale auswerten, Array übernehmen
                    self.sigArr = [];
                    self.signalEin.forEach(function (element, index) {
                        // console.log(element + " | " + index);
                        var neuSignalValue = "shape" + index;
                        self[neuSignalValue] = self.connector.getSignal(element).value();
                        self.sigArr.push(self[neuSignalValue]);
                    });
                    ein = 0;
                    for (var i2 = 0; i2 < self.sigArr.length; i2++) {
                        var element = self.sigArr[i2];
                        ein = ein || (self["shape" + i2] & 0x1);  //wenn 1 Signal "1" ist, dann "ein" ausgeben
                    }
                    self.signalIsArray = true;
                }

                if (self.signalStoer !== '') {
                    var signalStoer = self.connector.getSignal(self.signalStoer).value;
                    stoer = (signalStoer() & 0x1) != 0;
                }

                if (self.signalHand !== '') {
                    var signalHand = self.connector.getSignal(self.signalHand).value;
                    hand = (signalHand() & 0x1) != 0;
                }

                if (ohneSignal) {
                    css = 'ccw-wf-shape-ohneSignal';
                } else if (hand != 0) {
                    css = 'ccw-wf-shape-ein-gelb';
                } else if (stoer != 0) {
                    css = 'ccw-wf-shape-stoer';
                } else {
                    // console.log(self.signalEin + " | " + ein);
                    if (ein != 0) { //geändert amueller 13.07.2018
                        css = self.cssEin;
                    } else {
                        css = self.cssDefault;
                    }
                }
                return {
                    css: css
                };
            }, self);

            self.connector.getOnlineUpdates();
        };

        ccwshape.prototype.dispose = function () {
            var self = this;

            if (!self.signalEin)
                return;
            if (self.signalEin) self.connector.unregisterSignals(self.signalEin);
            if (self.sigArr) {
                self.connector.unregisterSignals(self.sigArr);
            }
            self.vDirection.dispose();
            self.vStyle.dispose();

            return;
        };

        ccwshape.prototype.shapeInfo = function () {
            var self = this;
            if (self.infoAktiv == true) {
                toastr.info("Signal-Name : " + self.signalEin + " " + self.signalStoer, self.bmk + " " + self.nameShape);
            }
        };

        return ccwshape;
    });