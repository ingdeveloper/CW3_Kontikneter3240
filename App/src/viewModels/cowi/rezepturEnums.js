define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.eAuftFn = exports.eProdTyp = exports.eProdTypCode = exports.eAuftArt = exports.LogBereich = exports.ServiceWahl = exports.LogType = exports.FnktKennung = exports.PaStatus = void 0;
    var PaStatus;
    (function (PaStatus) {
        PaStatus[PaStatus["laden"] = 0] = "laden";
        PaStatus[PaStatus["start"] = 1] = "start";
        PaStatus[PaStatus["pause"] = 2] = "pause";
        PaStatus[PaStatus["ende"] = 3] = "ende";
    })(PaStatus = exports.PaStatus || (exports.PaStatus = {}));
    /** Enum zur Kennzeichnung von Funktionsarten innerhalb einer Anwendung.
     *
     * Die Werte dienen zur Unterscheidung verschiedener Betriebsmodi oder Zugriffsbeschränkungen
     * für bestimmte Funktionen, z. B. in einer Benutzeroberfläche oder Prozesssteuerung.
     *
     * @enum {string}
     */
    var FnktKennung;
    (function (FnktKennung) {
        /** Standardfunktion ohne besondere Einschränkungen. */
        FnktKennung["standard"] = "standard";
        /** Funktion ist nur im Rezepturmodus. */
        FnktKennung["rezOnly"] = "rezOnly";
        /** Funktion ist nur im Produktionsauftragsmodus (PA). */
        FnktKennung["paOnly"] = "paOnly";
        /** Funktion ist speziell für den Ofenbetrieb vorgesehen. */
        FnktKennung["ofen"] = "ofen";
    })(FnktKennung = exports.FnktKennung || (exports.FnktKennung = {}));
    /** Enum zur Klassifizierung von Logeinträgen innerhalb eines Systems.
     *
     * Die Einträge beschreiben verschiedene Arten von Systemereignissen,
     * wie z. B. erfolgreiche Abläufe, Abbrüche, Benutzeraktionen oder Debug-Informationen.
     *
     * @enum {number}
     */
    var LogType;
    (function (LogType) {
        /**
         * Erfolgreicher Ablauf ohne Fehler.
         */
        LogType[LogType["OK"] = 1] = "OK";
        /**
         * Abbruch des Vorgangs durch den Bediener.
         */
        LogType[LogType["Abbruch_durch_Bediener"] = 2] = "Abbruch_durch_Bediener";
        /**
         * Abbruch des Vorgangs aufgrund einer Zeitüberschreitung.
         */
        LogType[LogType["Abbruch_durch_Zeit\u00FCberschreitung"] = 3] = "Abbruch_durch_Zeit\u00FCberschreitung";
        /**
         * Abbruch des Vorgangs aufgrund eines Programmfehlers.
         */
        LogType[LogType["Abbruch_durch_Programmfehler"] = 4] = "Abbruch_durch_Programmfehler";
        /**
         * Allgemeiner Abbruch ohne spezifische Ursache.
         */
        LogType[LogType["Abbruch"] = 5] = "Abbruch";
        /**
         * Benutzeranmeldung im System.
         */
        LogType[LogType["Login"] = 6] = "Login";
        /**
         * Benutzerabmeldung aus dem System.
         */
        LogType[LogType["Logout"] = 7] = "Logout";
        /**
         * Start eines Prozessabschnitts (PA).
         */
        LogType[LogType["PA_Start"] = 8] = "PA_Start";
        /**
         * Stopp eines Prozessabschnitts (PA).
         */
        LogType[LogType["PA_Stopp"] = 9] = "PA_Stopp";
        /**
         * Debug-Informationen für Entwickler oder zur Fehleranalyse.
         */
        LogType[LogType["Debug"] = 10] = "Debug";
    })(LogType = exports.LogType || (exports.LogType = {}));
    /** Wahl des Webservices */
    var ServiceWahl;
    (function (ServiceWahl) {
        /** Pfad = http://.../wcfSiem/WcfPlcRezept.. */
        ServiceWahl[ServiceWahl["wcfSiem"] = 0] = "wcfSiem";
        /** Pfad = http://.../WcfRezept/WsRezept.. */
        ServiceWahl[ServiceWahl["WcfRezept"] = 1] = "WcfRezept";
        /** Pfad = http://.../WsCwSAP/CwSAPService.. */
        ServiceWahl[ServiceWahl["WsCwSAP"] = 2] = "WsCwSAP";
        /** Pfad = http://.../WsCcwBde/CcwBdeService.. */
        ServiceWahl[ServiceWahl["WsCcwBde"] = 3] = "WsCcwBde";
    })(ServiceWahl = exports.ServiceWahl || (exports.ServiceWahl = {}));
    var LogBereich;
    (function (LogBereich) {
        LogBereich[LogBereich["Chargen"] = 2] = "Chargen";
        LogBereich[LogBereich["Betrieb"] = 3] = "Betrieb";
        LogBereich[LogBereich["Logdaten"] = 4] = "Logdaten";
        LogBereich[LogBereich["Anlagendaten"] = 5] = "Anlagendaten";
    })(LogBereich = exports.LogBereich || (exports.LogBereich = {}));
    /** Auftragsarten aus OPUS/MES Vorgaben */
    var eAuftArt;
    (function (eAuftArt) {
        eAuftArt[eAuftArt["PV"] = 1] = "PV";
        eAuftArt[eAuftArt["PB"] = 2] = "PB";
        eAuftArt[eAuftArt["PF"] = 3] = "PF";
        eAuftArt[eAuftArt["PU"] = 4] = "PU";
        eAuftArt[eAuftArt["PL"] = 5] = "PL";
        eAuftArt[eAuftArt["RR"] = 9] = "RR";
    })(eAuftArt = exports.eAuftArt || (exports.eAuftArt = {}));
    // /** Produktionstyp nach Vereinbarung mit SPS`lern
    //  *  Festlegung Produktionstypen (DB4 Wort 38) */
    // export enum eProdTyp {
    //   /** Produktion Basisartikel */
    //   PB = 1,
    //   /** Produktion Fertigartikel */
    //   PF = 1,
    //   /** Produktion Linie */
    //   PL = 1,
    //   /** Nachpackaufträge */
    //   PU = 3,
    //   /** Reinigungsauftrag */
    //   RR = 9,
    //   /** Ofenautostart-Auftrag */
    //   OF = 125,
    //   /** Nachlaufzeit nach Reinigung */
    //   NL = 253,
    //   /** Dummy-Auftrag */
    //   DU = 255,
    // }
    // Eindeutige Werte für die Gruppen
    var eProdTypCode;
    (function (eProdTypCode) {
        eProdTypCode[eProdTypCode["Basisartikel"] = 1] = "Basisartikel";
        eProdTypCode[eProdTypCode["Nachpack"] = 3] = "Nachpack";
        eProdTypCode[eProdTypCode["Reinigung"] = 9] = "Reinigung";
        eProdTypCode[eProdTypCode["Ofenstart"] = 125] = "Ofenstart";
        eProdTypCode[eProdTypCode["Nachlaufzeit"] = 253] = "Nachlaufzeit";
        eProdTypCode[eProdTypCode["Dummy"] = 255] = "Dummy";
    })(eProdTypCode = exports.eProdTypCode || (exports.eProdTypCode = {}));
    // Typenbezeichnungen mit Gruppenzugehörigkeit
    exports.eProdTyp = {
        PV: eProdTypCode.Basisartikel,
        PB: eProdTypCode.Basisartikel,
        PF: eProdTypCode.Basisartikel,
        PL: eProdTypCode.Basisartikel,
        PU: eProdTypCode.Nachpack,
        RR: eProdTypCode.Reinigung,
        OF: eProdTypCode.Ofenstart,
        NL: eProdTypCode.Nachlaufzeit,
        DU: eProdTypCode.Dummy,
    };
    /**
     * Enum zur Definition von Funktionszuständen innerhalb eines Arbeits- oder Produktionsprozesses.
     *
     * Die Werte repräsentieren typische Ereignisse oder Statusmeldungen, die z. B. in einem
     * Fertigungs-, Reinigungs- oder Störungsprotokoll verwendet werden.
     *
     * @enum {number}
     */
    var eAuftFn;
    (function (eAuftFn) {
        /** Beginn eines Vorgangs oder einer Aktivität. */
        eAuftFn[eAuftFn["Start"] = 1] = "Start";
        /** Ende eines Vorgangs oder einer Aktivität. */
        eAuftFn[eAuftFn["Ende"] = 2] = "Ende";
        /** Kurzreinigung, z. B. zwischen zwei Produktionsschritten. */
        eAuftFn[eAuftFn["ReinigKurz"] = 3] = "ReinigKurz";
        /** Gründliche Reinigung. */
        eAuftFn[eAuftFn["Reinig"] = 4] = "Reinig";
        /** Störung im Ablauf oder an einer Maschine. */
        eAuftFn[eAuftFn["Stoerung"] = 5] = "Stoerung";
        /** Produktionsentwicklungsprozess oder spezieller Prozessschritt.*/
        eAuftFn[eAuftFn["PEP"] = 9] = "PEP";
    })(eAuftFn = exports.eAuftFn || (exports.eAuftFn = {}));
});
//# sourceMappingURL=rezepturEnums.js.map