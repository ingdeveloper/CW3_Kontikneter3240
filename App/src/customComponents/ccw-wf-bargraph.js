/*
    ccw-wf-value.js
    Änderung:
    30.06.2018: -CSS-Klasse mit als Übergabeparameter

    */

define([
  "../services/connector",
  "../components/services/secured.service"
], function(signalsConnector, securedService) {
  var ccwwfValue = function(params) {
    var self = this;
    self.connector = new signalsConnector();

    self.settings = params;
    self.objectID = ko.unwrap(self.settings.objectID);

    self.projectAuthorization = (
      ko.unwrap(params.projectAuthorization) || ""
    ).stringPlaceholderResolver(self.objectID); //!!!
    self.securedService = new securedService(self.projectAuthorization);
    self.hasAuthorization = self.securedService.hasAuthorization;

    self.tooltipText = (
      ko.unwrap(self.connector.translate(self.settings.tooltipText)()) || ""
    ).stringPlaceholderResolver(self.objectID);

    self.format = ko.unwrap(self.settings.format)
      ? ko.unwrap(self.settings.format)
      : "0,0.0";
    self.isAlphanumeric =
      ko.unwrap(self.settings.isAlphanumeric) !== undefined
        ? ko.unwrap(self.settings.isAlphanumeric)
        : false;

    self.displayClass =
      ko.unwrap(self.settings.displayClass) !== undefined
        ? ko.unwrap(self.settings.displayClass)
        : "ccw-bar";

    self.unitLabel =
      ko.unwrap(self.settings.unitLabel) !== undefined
        ? ko.unwrap(self.settings.unitLabel)
        : false;
    self.staticUnitText = (
      ko.unwrap(self.settings.staticUnitText) || ""
    ).stringPlaceholderResolver(self.objectID);
    self.precision = ko.unwrap(self.settings.precision)
      ? ko.unwrap(self.settings.precision)
      : 1;

    self.breite =
      ko.unwrap(self.settings.breite) !== undefined
        ? ko.unwrap(self.settings.breite)
        : "100%";

    self.hoehe =
      ko.unwrap(self.settings.hoehe) !== undefined
        ? ko.unwrap(self.settings.hoehe)
        : "100%";
    self.border =
      ko.unwrap(self.settings.border) !== undefined
        ? ko.unwrap(self.settings.border)
        : "1px solid grey"; //Bitte in dieser Schreibweise eingeben

    self.border = self.border.toLowerCase();
    self.borderBreiteArr = self.border.split(" ");
    self.borderBreiteArr.forEach(function(item) {
      if (item.indexOf("px") >= 0) {
        self.borderBreite = parseInt(item);
      }
    });

    self.elemBreiteVal =
      ko.unwrap(self.settings.elemBreiteVal) !== undefined
        ? ko.unwrap(self.settings.elemBreiteVal)
        : "70%";
    self.fontSize =
      ko.unwrap(self.settings.fontSize) !== undefined
        ? ko.unwrap(self.settings.fontSize)
        : "inherit";
    self.infoAktiv =
      ko.unwrap(self.settings.infoAktiv) !== undefined
        ? ko.unwrap(self.settings.infoAktiv)
        : true;

    self.value =
      ko.unwrap(self.settings.value) !== undefined
        ? ko.unwrap(self.settings.value)
        : null;
    self.min =
      ko.unwrap(self.settings.min) !== undefined
        ? ko.unwrap(self.settings.min)
        : 0;
    self.max =
      ko.unwrap(self.settings.min) !== undefined
        ? ko.unwrap(self.settings.max)
        : 100;
    self.grenzeGelbMax =
      ko.unwrap(self.settings.grenzeGelbMax) !== undefined
        ? ko.unwrap(self.settings.grenzeGelbMax)
        : null;
    self.grenzeRotMax =
      ko.unwrap(self.settings.grenzeRotMax) !== undefined
        ? ko.unwrap(self.settings.grenzeRotMax)
        : null;
    self.grenzeGelbMin =
      ko.unwrap(self.settings.grenzeGelbMin) !== undefined
        ? ko.unwrap(self.settings.grenzeGelbMin)
        : null;
    self.grenzeRotMin =
      ko.unwrap(self.settings.grenzeRotMin) !== undefined
        ? ko.unwrap(self.settings.grenzeRotMin)
        : null;

    self.ccwFuncScale = function(min_Wert, max_Wert, min_OUT, max_OUT, Wert) {
      var x1 = min_Wert;
      var x2 = max_Wert;
      var x = x1 - x2;
      if (x == 0.0) {
        //Division durch NULL verhindern
        x = 0.00000001;
      }
      var y1 = min_OUT;
      var y2 = max_OUT;
      var m = (y1 - y2) / x;
      var b = y1 - (m * x1);
      return (m * Wert) + b;
    };

    //-- Nulllinie ermitteln
    self.nullp = self.ccwFuncScale(self.min, self.max, 0, 100, 0); //  (self.min / (self.max + self.min)) * 100; //self.ccwFuncScale(self.min, self.max, -100, 100, self.value); //
    // self.zw(self.ccwFuncScale(self.min, self.max, 0, 100, self.value)); //(self.value / (self.max + self.min)) * 100;
    // self.zw2 = self.zw - self.nullp; //   (self.nullp / 100) * (self.zw / 100);

    self.nulllinie = self.nullp + "%";
    console.log(self.nulllinie);
    console.log(self.ccwFuncScale(-20, 100, 0, 100, 20));
    // self.pos = self.ccwFuncScale(0, self.max, 0, 100, self.value); //(self.value / (self.max + self.min)) * 100;

    // self.anzeigeValue = self.value;
    self.anzeigeValue = ko.computed(function() {
      return ko.unwrap(self.settings.value);
    });
    // self.anzeigeHoehe = ko.observable(0);
    self.anzeigeHoehe = ko.computed(function() {
      var self = this;
      var zw = self.ccwFuncScale(
        self.min,
        self.max,
        0,
        100,
        ko.unwrap(self.settings.value)
      );
      
      return zw;
    }, self);

    self.marginTopAnzeigeValue = ko.computed(function() {
      var self = this;
      var marginTopAnzeigeValue = -18;
      if (self.anzeigeHoehe() > 80) {
        marginTopAnzeigeValue = 0;
      }
      if (self.anzeigeHoehe() < self.nullp - 2) {
        //Nullinie aus dem Weg gehen
        marginTopAnzeigeValue = 0;
      }
      if (self.anzeigeHoehe() < 8) {
        marginTopAnzeigeValue = -18;
      }

      return marginTopAnzeigeValue;
    }, self);

    self.nulllinieVisible = self.min < 0;


    // Stop here and return if no signalName was configured
    if (!self.signalName) {
      return null;
    }

    self.connector = new signalsConnector();
    self.signal = self.connector.getSignal(self.signalName);

    if (self.isAlphanumeric) {
      self.signalValue = self.signal.value;
    } else {
      //console.info("Type vom Value.extend=" + (self.signal.value));//2.02.2017  "* self.signalFaktor" neu hinzugefügt AM
      self.signalValue = self.signal.value.extend({
        numeralNumber: self.format
      });
      //self.signalValue = self.signal.value.extend({ numericfactor: self.signalFaktor, numeric: self.precision, numeralNumber: self.format, fillNull: self.vorKommaStellen });
      //self.signalValue = self.signalValue2.value.extend({ pluseins: 1 });
      // self.signalValue = self.signal.value.extend({ numericfactor: self.signalFaktor, numeric: self.precision, ccwFormat: self.ccwFormat });//, numeric: self.precision , ccwFormat: self.ccwFormat
      //self.signalValue = self.signal.value.extend({ numericfactor: self.signalFaktor, numeric: self.precision });//, numeric: self.precision , ccwFormat: self.ccwFormat
      //self.signalValue = self.signal.value.extend({ numeralNumber: self.format });
    }

    self.connector.getOnlineUpdates(); //.fail(self.connector.handleError(self));
  };

  ccwwfValue.prototype.dispose = function() {
    var self = this;

    if (!self.signal) return;
    return self.connector.unregisterSignals(self.signal);
  };

  ccwwfValue.prototype.aliasInfo = function() {
    var self = this;

    if (self.infoAktiv == true) {
      toastr.info("Signal: " + self.signalName);
    }
    return false;
  };

  return ccwwfValue;
});
