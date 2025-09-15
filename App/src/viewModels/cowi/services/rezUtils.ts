export default class rezUtils {
  /** xml -> json Konverter */
  static xmlToJson(xml: any): any {
    // Quelle - https://codepen.io/KurtWM/pen/JnLak?editors=1010
    // Rückgabe object
    let obj: any = {};

    if (xml.nodeType === 1) {
      // element
      // suche attributes
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < xml.attributes.length; j = j + 1) {
          const attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) {
      // text
      obj = xml.nodeValue;
    }

    // suche Kinder
    if (xml.hasChildNodes()) {
      for (let i: number = 0; i < xml.childNodes.length; i = i + 1) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        if (obj[nodeName] === undefined) {
          obj[nodeName] = this.xmlToJson(item);
        } else {
          if (obj[nodeName].push === undefined) {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this.xmlToJson(item));
        }
      }
    }
    return obj;
  }

  /** Kürztz den Text um Anzahl an angegeb. Länge */
  static msgCut = (txt: any, anzahl: number = 100): string => {
    // auf 100 Zeichen begrenzen
    if (typeof txt === "string") {
      return txt.length > anzahl ? `${txt.substring(-1, 100)} ..` : txt;
    } else {
      return "";
    }
  };

  /** Nachbildung einer Sleep-Funkt. */
  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** lifert das erste u. letzte Buchstabe des Strings */
  static stringUgly(s: string): string {
    return !isNullOrUndefined(s)
      ? s.slice(0, 1) + "***" + s.substr(s.length - 1, 1)
      : "***";
  }

  /** Das Tauschen der Bytes um Little Endian - Byteanordnung zu erreichen */
  static swapBytes(value: number): number {
    // Extrahiere das Low-Byte und das High-Byte
    const lowByte = value & 0x00ff;
    const highByte = (value & 0xff00) >> 8;

    // Tausche die Bytes und kombiniere sie wieder
    const swappedValue = (lowByte << 8) | highByte;

    return swappedValue;
  }

  /** UID in Kurz-ID umwandeln, max. 3 Stellen */
  static uidToShortId = (uid: string): number => {
    const maxId = 999;
    let sum = 0;
    for (let i = 0; i < uid.length; i++) {
      const char = uid[i];
      const value = parseInt(char, 16); // Wandelt hex-Zeichen in Zahl (0–15)
      if (!isNaN(value)) {
        sum += value * (i + 1); // Gewichtung nach Position
      }
    }
    return sum % (maxId + 1); // Begrenzung auf 3-stellige Zahl
  }
}
