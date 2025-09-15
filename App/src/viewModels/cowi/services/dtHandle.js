define(["require", "exports"], function (require, exports) {
    "use strict";
    var DtHandle = /** @class */ (function () {
        /**
         * Bootstrap 3 Datepicker handling
         * @param dtPickerStart ID des Start-Pickers
         * @param dtPickerStop ID des End-Pickers
         */
        function DtHandle(dtPickerStart, dtPickerStop, startDT, stopDT) {
            this.format = "DD.MM.YYYY HH:mm:ss";
            this.$dtPickerStart = $("#" + dtPickerStart).length
                ? $("#" + dtPickerStart)
                : null;
            this.$dtPickerStop = $("#" + dtPickerStop).length
                ? $("#" + dtPickerStop)
                : null;
            // if (!this.$dtPickerStart || !this.$dtPickerStop) {
            //     console.log(`%cHtmlElement m. ID - ${dtPickerStart} bzw. ${dtPickerStop} n. gefunden`, "color:red");
            //     return;
            // }
            // man geht davon dass, vorgegebene Initialisierungszeiten erfordern auch die Aktivierung der Prüfungslogik
            this.checkDT = startDT === void 0 || stopDT === void 0 ? false : true;
            this.initDTs(startDT === void 0
                ? moment(moment().subtract(1, "days"))
                : moment(moment(startDT, this.format)), stopDT === void 0
                ? moment(moment().add(1, "days"))
                : moment(moment(stopDT, this.format)));
        }
        /** Bootstrap 3 Datepicker initialisieren */
        DtHandle.prototype.initDTs = function (startDT, stopDT) {
            var self = this;
            var minDT = new Date(1990, 1, 1, 0, 0, 0);
            var maxDT = new Date(2088, 12, 31, 23, 59, 59);
            if (self.$dtPickerStart) {
                self.$dtPickerStart.datetimepicker({
                    date: startDT,
                    format: self.format,
                    maxDate: maxDT,
                    minDate: minDT,
                });
                self.startDT = self.$dtPickerStart.children("input").length
                    ? self.$dtPickerStart.children("input")
                    : undefined;
                self.startDT
                    .on("blur", function () {
                    self.checkDTInputs(self);
                })
                    .on("input", function () {
                    self.checkDTInputs(self);
                });
            }
            if (self.$dtPickerStop) {
                self.$dtPickerStop.datetimepicker({
                    date: stopDT,
                    format: self.format,
                    maxDate: maxDT,
                    minDate: minDT,
                });
                self.stopDT = self.$dtPickerStop.children("input").length
                    ? self.$dtPickerStop.children("input")
                    : undefined;
                // if (!self.startDT || !self.stopDT) {
                //   console.log(`%c'Input' - HtmlElement n. gefunden`, "color:red");
                //   return;
                // }
                self.stopDT
                    .on("blur", function () {
                    self.checkDTInputs(self);
                })
                    .on("input", function () {
                    self.checkDTInputs(self);
                });
            }
            self.checkDTInputs(self);
        };
        Object.defineProperty(DtHandle.prototype, "startZeit", {
            get: function () {
                return this.startDtValue != void 0
                    ? this.startDtValue.format(this.format)
                    : moment(this.startDT[0].value, this.format).format(this.format);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DtHandle.prototype, "stoppZeit", {
            get: function () {
                return this.stopDtValue != void 0
                    ? this.stopDtValue.format(this.format)
                    : moment(this.stopDT[0].value, this.format).format(this.format);
            },
            enumerable: false,
            configurable: true
        });
        /** Settzt die Startzeit auf aktuelles Datum/-Zeit */
        DtHandle.prototype.setStart = function () {
            this.startDT[0].value = moment().format(this.format);
            this.checkDTInputs(this);
        };
        /** Settzt die Stopptzeit auf aktuelles Datum/-Zeit */
        DtHandle.prototype.setStop = function () {
            this.stopDT[0].value = moment().format(this.format);
            this.checkDTInputs(this);
        };
        /** Plausibilitätsprüfung */
        DtHandle.prototype.checkDTInputs = function (self) {
            if (!(this.$dtPickerStart && this.$dtPickerStop))
                return;
            this.startDtValue = moment(self.startDT[0].value, this.format);
            this.stopDtValue = moment(self.stopDT[0].value, this.format);
            if (this.startDtValue.diff(this.stopDtValue) >= 0) {
                var txtInfo = "die Startzeit darf nicht größer als Stoppzeit sein";
                this.startDT[0].setCustomValidity(txtInfo);
                this.stopDT[0].setCustomValidity(txtInfo);
                // } else if (this.checkDT && this.stopDtValue.diff(moment()) < 0) {
            }
            else if (this.checkDT && this.stopDtValue.diff(this.startDtValue) < 0) {
                var txtInfo = "die Stoppzeit darf nicht in der Vergangeheit liegen";
                this.startDT[0].setCustomValidity("");
                this.stopDT[0].setCustomValidity(txtInfo);
            }
            else {
                this.startDT[0].setCustomValidity("");
                this.stopDT[0].setCustomValidity("");
            }
        };
        return DtHandle;
    }());
    return DtHandle;
});
//# sourceMappingURL=dtHandle.js.map