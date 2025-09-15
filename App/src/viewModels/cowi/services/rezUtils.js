define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var rezUtils = /** @class */ (function () {
        function rezUtils() {
        }
        /** xml -> json Konverter */
        rezUtils.xmlToJson = function (xml) {
            // Quelle - https://codepen.io/KurtWM/pen/JnLak?editors=1010
            // Rückgabe object
            var obj = {};
            if (xml.nodeType === 1) {
                // element
                // suche attributes
                if (xml.attributes.length > 0) {
                    obj["@attributes"] = {};
                    for (var j = 0; j < xml.attributes.length; j = j + 1) {
                        var attribute = xml.attributes.item(j);
                        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                    }
                }
            }
            else if (xml.nodeType === 3) {
                // text
                obj = xml.nodeValue;
            }
            // suche Kinder
            if (xml.hasChildNodes()) {
                for (var i = 0; i < xml.childNodes.length; i = i + 1) {
                    var item = xml.childNodes.item(i);
                    var nodeName = item.nodeName;
                    if (obj[nodeName] === undefined) {
                        obj[nodeName] = this.xmlToJson(item);
                    }
                    else {
                        if (obj[nodeName].push === undefined) {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(this.xmlToJson(item));
                    }
                }
            }
            return obj;
        };
        /** Nachbildung einer Sleep-Funkt. */
        rezUtils.sleep = function (ms) {
            return new Promise(function (resolve) { return setTimeout(resolve, ms); });
        };
        /** lifert das erste u. letzte Buchstabe des Strings */
        rezUtils.stringUgly = function (s) {
            return !isNullOrUndefined(s)
                ? s.slice(0, 1) + "***" + s.substr(s.length - 1, 1)
                : "***";
        };
        /** Das Tauschen der Bytes um Little Endian - Byteanordnung zu erreichen */
        rezUtils.swapBytes = function (value) {
            // Extrahiere das Low-Byte und das High-Byte
            var lowByte = value & 0x00ff;
            var highByte = (value & 0xff00) >> 8;
            // Tausche die Bytes und kombiniere sie wieder
            var swappedValue = (lowByte << 8) | highByte;
            return swappedValue;
        };
        /** Kürztz den Text um Anzahl an angegeb. Länge */
        rezUtils.msgCut = function (txt, anzahl) {
            if (anzahl === void 0) { anzahl = 100; }
            // auf 100 Zeichen begrenzen
            if (typeof txt === "string") {
                return txt.length > anzahl ? txt.substring(-1, 100) + " .." : txt;
            }
            else {
                return "";
            }
        };
        /** UID in Kurz-ID umwandeln, max. 3 Stellen */
        rezUtils.uidToShortId = function (uid) {
            var maxId = 999;
            var sum = 0;
            for (var i = 0; i < uid.length; i++) {
                var char = uid[i];
                var value = parseInt(char, 16); // Wandelt hex-Zeichen in Zahl (0–15)
                if (!isNaN(value)) {
                    sum += value * (i + 1); // Gewichtung nach Position
                }
            }
            return sum % (maxId + 1); // Begrenzung auf 3-stellige Zahl
        };
        return rezUtils;
    }());
    exports.default = rezUtils;
});
//# sourceMappingURL=rezUtils.js.map