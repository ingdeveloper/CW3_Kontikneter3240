var ccwFuelleLeerzeichen = function (anzahl) {
    var str = ""
};

var ccwBcdToInt2 = function (value) {
    var str = value.toString();
    var mul = str.length;  //Zeichenlänge
    var val = 0;
    for (var index = 0; index < str.length; index++) {
        var element = str[index];
        var zahl = parseInt(element);
        mul = mul - 1;  // alle 4 Bits den Multiplikator verringern
        val = val + (zahl * Math.pow(2, (mul * 4)));   // zahl * 2^x  -> alle 4 Bits ein neuer Wert
    }
    return val;
}
var ccwBcdToInt = function (num) {
    var val = Number.isNaN(num) ? String.toString(parseInt(num), 16) : num.toString(16);
    var val2 = val;
    return val2;
}

var ccwIntToAscii = function (value) {
    var str = value.toString();
    var erg = str.charCodeAt(0);
    if (erg == NaN) erg = 0;
    return erg;
}

var ccwIntToBcd = function (num) {
    var val = Number.isNaN(num) ? String.toString(parseInt(num)) : num.toString();
    var val2 = parseInt(val, 16);
    return val2;
}

var ccwIntToHex = function (number) {
    var str = number.toString(16);
    return parseInt(str);
}

//-- Eine REAL-Zahl, die ein String ist, in eine REAL oder INTERGER wandeln
var ccwStringRealToReal = function (number) {
    var r = parseFloat(number);
    if (!isNaN(r)) {
        if (Number.isInteger(r)) {
            return parseInt(r);
        } else {
            return r;
        }
    } else {
        return r;
    }
}

var ccwStringToAsciiArray = function (str, len) {
    var arr = [];
    var l = len || 1;  //mindest Länge = 1
    var c;
    for (var index = 0; index < l; index++) {
        if (index < (str.length)) {
            c = str[index];
        } else {
            c = ' ';
        }
        arr.push(c.charCodeAt(0));
    }
    return arr;

}

var ccwStringToBcdArray = function (str, len) {
    if (Number.isInteger(str)) {
        str = str.toString();
    }
    var arr = [];
    var l = str.length || 1;
    var c;
    for (var index = 0; index < l; index++) {
        if (index < (str.length)) {
            c = str[index];
        } else {
            c = 0;
        }
        arr.push(parseInt(c));
    }
    // console.log(arr);
    //wenn String kürzer als Vorgabe, dann auf der linken Seite mit Nullen auffüllen
    if (str.length < len) {
        var anz = len - str.length;
        for (var index3 = 0; index3 < anz; index3++) {
            arr.unshift(0); //am Anfang eine 0 einfügen
        }
    }
    // console.log(arr);
    var arr2 = [];
    var val = 0;
    for (var index2 = 0; index2 < arr.length; index2++) {
        if (index2 % 2 == 0) {
            // console.log("Gerade");
            val = arr[index2] << 4;
        } else {
            // console.log("Ungerade");
            val = val + arr[index2];
            arr2.push(val);
        }
    }
    // console.log(arr2);
    return arr2;

}


var ccwStringToIntArray = function (str, len) {
    if (Number.isInteger(str)) {
        str = str.toString();
    }
    var arr = [];
    var l = str.length || 1;
    var c;
    for (var index = 0; index < l; index++) {
        if (index < (str.length)) {
            c = str[index];
        } else {
            c = 0;
        }
        arr.push(parseInt(c));
    }
    //  console.log(arr);
    //wenn String kürzer als Vorgabe, dann auf der linken Seite mit Nullen auffüllen
    if (str.length < len) {
        var anz = len - str.length;
        for (var index3 = 0; index3 < anz; index3++) {
            arr.unshift(0); //am Anfang eine 0 einfügen
        }
    }
    // console.log(arr);
    var arr2 = [];
    var val = 0;
    for (var index2 = 0; index2 < arr.length; index2++) {
        if (index2 % 2 == 0) {
            // console.log("Gerade");
            val = arr[index2] * 10;  //Zehner-Stelle
        } else {
            // console.log("Ungerade");
            val = val + arr[index2];
            arr2.push(parseInt(val));
        }
    }
    //  console.log(arr2);
    return arr2;

}

//ASCII-Array in ein String konvertieren ; Parameter maxLaenge: -1 bedeutet automaische Länge
//es kann sein, das ein ASCII-Code über 127 als Minus-Zahl angezeigt wird. Dieses wird korrigiert (wahrscheinlich SPS abhängig)
var ccwAsciiArrayToString = function (arr, maxLaenge) {
    var newValueAsString = arr === null || typeof (arr) === "undefined" ? "Convert nicht möglich" : arr;
    var str = "";  //default Ausgabe mit Leerstring

    //max Länge berechnen, -1 bedeutet automatische Länge
    var len = ((maxLaenge < newValueAsString.length) && (maxLaenge > 0)) ? maxLaenge : newValueAsString.length;
    //String aus den einzelnen ASCII-Zahlen zusammensetzen
    if ((Array.isArray(newValueAsString)) && (newValueAsString[0] != 0)) {
        str = "";
        for (var i = 0; i < len; i++) {
            // console.log("%c" + newValueAsString[i], "background: yellow");
            if (newValueAsString[i] >= 0) {
                if (newValueAsString[i] != 0) str = str + String.fromCharCode(newValueAsString[i]);
            } else {
                var newV = 256 - newValueAsString[i];
                if (newValueAsString[i] != 0) str = str + String.fromCharCode(newV);
            }
        }
    }
    return str;  //Ausgabe ist ein String
}


//Byte-Array in ein String konvertieren ; Parameter maxLaenge: -1 bedeutet automaische Länge
var ccwArrayToString = function (arr, maxLaenge) {
    var newValueAsString = arr === null || typeof (arr) === "undefined" ? "" : arr;
    var str = "";  //default Ausgabe mit Leerstring

    //max Länge berechnen, -1 bedeutet automatische Länge
    var len = ((maxLaenge < newValueAsString.length) && (maxLaenge > 0)) ? maxLaenge : newValueAsString.length;

    //String aus den einzelnen ASCII-Zahlen zusammensetzen
    if ((Array.isArray(newValueAsString))) {
        str = "";
        for (var i = 0; i < len; i++) {
            var bcd = newValueAsString[i].toString();
            var z = ((bcd.length <= 1) && (i >= 1)) ? "0" + bcd : bcd;   //mit "0" auffüllen
            str = str + z;
        }
    }
    return str;  //Ausgabe ist ein String
}

//Scale-Funktion (in _gulp/bundles/scripts.js angeben)
//min_Wert = minimaler Eingangswert, max_Wert = maximaler Einganswert, Wert = aktueller Wert, min_OUT = scalierter min. Out, max_OUT = scalierter max. Out
var ccwScale = function (min_Wert, max_Wert,Wert, min_OUT, max_OUT) {
    var x1 = min_Wert;
    var x2 = max_Wert;
    var x = (x1 - x2);
    if (x == 0.0) { //Division durch NULL verhindern
        x = 0.00000001;
    }
    var y1 = min_OUT;
    var y2 = max_OUT;
    var m = (y1 - y2) / x;
    var b = y1 - (m * x1);
    return (m * Wert) + b; 
}