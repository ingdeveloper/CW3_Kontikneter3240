export enum PaStatus {
  laden = 0,
  start = 1,
  pause = 2,
  ende = 3,
}

/** Enum zur Kennzeichnung von Funktionsarten innerhalb einer Anwendung.
 * 
 * Die Werte dienen zur Unterscheidung verschiedener Betriebsmodi oder Zugriffsbeschränkungen
 * für bestimmte Funktionen, z. B. in einer Benutzeroberfläche oder Prozesssteuerung.
 * 
 * @enum {string} 
 */
export enum FnktKennung {
  /** Standardfunktion ohne besondere Einschränkungen. */
  standard = "standard",
  /** Funktion ist nur im Rezepturmodus. */
  rezOnly = "rezOnly",
  /** Funktion ist nur im Produktionsauftragsmodus (PA). */
  paOnly = "paOnly",
  /** Funktion ist speziell für den Ofenbetrieb vorgesehen. */
  ofen = "ofen",
}

/** Enum zur Klassifizierung von Logeinträgen innerhalb eines Systems.
 * 
 * Die Einträge beschreiben verschiedene Arten von Systemereignissen, 
 * wie z. B. erfolgreiche Abläufe, Abbrüche, Benutzeraktionen oder Debug-Informationen.
 * 
 * @enum {number}
 */
export enum LogType {
  /**
   * Erfolgreicher Ablauf ohne Fehler.
   */
  OK = 1,

  /**
   * Abbruch des Vorgangs durch den Bediener.
   */
  Abbruch_durch_Bediener,

  /**
   * Abbruch des Vorgangs aufgrund einer Zeitüberschreitung.
   */
  Abbruch_durch_Zeitüberschreitung,

  /**
   * Abbruch des Vorgangs aufgrund eines Programmfehlers.
   */
  Abbruch_durch_Programmfehler,

  /**
   * Allgemeiner Abbruch ohne spezifische Ursache.
   */
  Abbruch,

  /**
   * Benutzeranmeldung im System.
   */
  Login,

  /**
   * Benutzerabmeldung aus dem System.
   */
  Logout,

  /**
   * Start eines Prozessabschnitts (PA).
   */
  PA_Start,

  /**
   * Stopp eines Prozessabschnitts (PA).
   */
  PA_Stopp,

  /**
   * Debug-Informationen für Entwickler oder zur Fehleranalyse.
   */
  Debug,
}

/** Wahl des Webservices */
export enum ServiceWahl {
  /** Pfad = http://.../wcfSiem/WcfPlcRezept.. */
  wcfSiem,
  /** Pfad = http://.../WcfRezept/WsRezept.. */
  WcfRezept,
  /** Pfad = http://.../WsCwSAP/CwSAPService.. */
  WsCwSAP,
  /** Pfad = http://.../WsCcwBde/CcwBdeService.. */
  WsCcwBde,
}

export enum LogBereich {
  Chargen = 2,
  Betrieb = 3,
  Logdaten = 4,
  Anlagendaten = 5,
}

/** Auftragsarten aus OPUS/MES Vorgaben */
export enum eAuftArt {
  PV = 1,
  PB,
  PF,
  PU,
  PL,
  RR = 9,
}
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
export enum eProdTypCode {
  Basisartikel = 1,
  Nachpack = 3,
  Reinigung = 9,
  Ofenstart = 125,
  Nachlaufzeit = 253,
  Dummy = 255,
}

// Typenbezeichnungen mit Gruppenzugehörigkeit
export const eProdTyp: Record<string, eProdTypCode> = {
  PV: eProdTypCode.Basisartikel,
  PB: eProdTypCode.Basisartikel,
  PF: eProdTypCode.Basisartikel,
  PL: eProdTypCode.Basisartikel,
  PU: eProdTypCode.Nachpack,
  RR: eProdTypCode.Reinigung,
  OF: eProdTypCode.Ofenstart,
  NL: eProdTypCode.Nachlaufzeit,
  DU: eProdTypCode.Dummy,
}

/**
 * Enum zur Definition von Funktionszuständen innerhalb eines Arbeits- oder Produktionsprozesses.
 * 
 * Die Werte repräsentieren typische Ereignisse oder Statusmeldungen, die z. B. in einem
 * Fertigungs-, Reinigungs- oder Störungsprotokoll verwendet werden.
 * 
 * @enum {number}
 */
export enum eAuftFn {
  /** Beginn eines Vorgangs oder einer Aktivität. */
  Start = 1,
  /** Ende eines Vorgangs oder einer Aktivität. */
  Ende,
  /** Kurzreinigung, z. B. zwischen zwei Produktionsschritten. */
  ReinigKurz,
  /** Gründliche Reinigung. */
  Reinig,
  /** Störung im Ablauf oder an einer Maschine. */
  Stoerung,
  /** Produktionsentwicklungsprozess oder spezieller Prozessschritt.*/
  PEP = 9,
}
