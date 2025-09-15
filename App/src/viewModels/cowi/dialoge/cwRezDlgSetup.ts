//  *************************************************************
//  * Model für das modale Fenster SPS und Dialog Einstellungen *
//  *************************************************************

import dialog = require("plugins/dialog");
declare let uuid: any;

class cwRezDlgSetup {
  // UID für die eindeutige Identifizierung des Moduls
  protected uid: KnockoutObservable<string> = ko.observable(uuid.v4());
  // Tabelle anzeigen
  protected container: HTMLElement
  data: { spsCfg: any, dlgCfg: any, dlgProps: any };
  table: HTMLTableElement;
  // Felderdefinition SPS-Konfiguration
  fieldsSpsCnfg = [
    "ProdTyp",
    "Bit15",
    "Bit14",
    "Bit13",
    "Bit12",
    "Bit11",
    "Bit10",
    "Bit09",
    "Bit08",
    "Bit07",
    "Bit06",
    "Bit05",
    "Bit04",
    "Bit03",
    "Bit02",
    "Bit01",
    "Bit00",
    "SpsCfg",
    "SpsCfgLiEnd",
    "ExEnCr",
  ];
  // Titledefinition SPS-Konfiguration
  fieldTitlesSpsCnfg = [
    "ProdTyp",
    "Bit15",
    "Bit14",
    "Bit13",
    "Bit12",
    "Bit11",
    "Bit10",
    "Bit09",
    "Bit08",
    "Bit07",
    "Bit06",
    "Freigabe MES (Chargen)",
    "Freigabe ASE (Zähler)",
    "Freigabe MES (Zähler, Betriebsdaten)",
    "Freigabe Übergabe",
    "Freigabe Reinigung",
    "Freigabe Produktion",
    "SpsConfig in dezimalen Wert",
    "SpsConfig in little-endian Byte-Reihenfolge (für SPS)",
    "Letzte Änderung (ExEnCr)",
  ];
  // Felderdefinition SPS-Konfiguration
  fieldsDlgCnfg = [
    "LbstSvc_Enabl",
    "LbstRngMld_Enabl",
    "Auftr_33333_Enabl",
    "Auftr_77777_Enabl",
    "Auftr_88888_Enabl",
    "Auftr_99999_Enabl",
    "TestEnv_Enabl",
    "ServicePfad",
    "ExEnCr",
  ];
  // Titledefinition SPS-Konfiguration
  fieldTitlesDlgCnfg = [
    "Lobster Service aktiviert",
    "Reinigungspersonal Meldung aktiviert",
    "Rüsten/Reinigen Aufträge aktiviert",
    "Auftrag Leitung vorziehen aktiviert",
    "Auftrag Tankentnahme aktiviert",
    "Auftrag Dummyauftrag aktiviert",
    "OPUS - Testumgebung aktiviert",
    "Service Pfad",
    "Letzte Änderung (ExEnCr)",
  ];
  // Felderdefinition SPS-Konfiguration
  fieldsVarStatus = [
    "Eigenschaft",
    "Wert",
    "SPS-aktualwert",
  ];
  // Titledefinition SPS-Konfiguration
  fieldTitlesVarStatus = [
    "Eigenschaftsname",
    "Signalname/Aliasname",
    "aktualwert gegenwärtig",
  ];
  constructor([spsCfg, dlgCfg, dlgProps]) {//(dataSpsCnfg: any[], dataDlgCnfg: any[]) {
    this.data = { spsCfg, dlgCfg, dlgProps };
  }

  public async compositionComplete() {
    this.container = document.getElementById("table-container");

    let tableContainer = this.createCnfgTable(this.data.spsCfg, "SPS-Konfiguration", this.fieldsSpsCnfg, this.fieldTitlesSpsCnfg);
    this.container.appendChild(tableContainer);
    tableContainer = this.createCnfgTable(this.data.dlgCfg, "Rez.Dlg.-Konfiguration", this.fieldsDlgCnfg, this.fieldTitlesDlgCnfg);
    this.container.appendChild(tableContainer);
    tableContainer = this.createPropTable(this.data.dlgProps, "Variablenstatus", this.fieldsVarStatus, this.fieldTitlesVarStatus);
    this.container.appendChild(tableContainer);
  }

  // Konfig.Tabellen erstellen
  private createCnfgTable(data, suffix: string, fields: string[], fieldTitles: string[]) {
    const container = document.createElement("div");
    container.id = `table-container-${this.uid()}-${suffix}`;

    const tittle = document.createElement("h2");
    tittle.textContent = suffix;

    const table = document.createElement("table");
    table.className = "blueTable";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Kopfzeile
    const headerRow = document.createElement("tr");
    fields.forEach((col) => {
      const th = document.createElement("th");
      th.title = fieldTitles[fields.indexOf(col)];
      th.textContent = col;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    // Datenzeilen
    const rows = Array.isArray(data) ? data : [data]; // Sicherstellen, dass data ein Array ist
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      fields.forEach((col) => {
        const td = document.createElement("td");
        td.title = fieldTitles[fields.indexOf(col)];
        // Spezielle Behandlung für Bit-Felder und Auftragsfelder,
        // um sie als Häkchen oder Punkt darzustellen
        td.textContent = (col.startsWith("Bit") || col.startsWith("Auftr") || col.endsWith("Enabl"))
          ? row[col]
            ? "✓"
            : "∙"
          : row[col];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    // Überschrift und Tabelle in Container einfügen
    container.appendChild(tittle);
    container.appendChild(table);

    return container;
  }

  // Eigenschaften-Tabelle erstellen
  private createPropTable(data: JSON, suffix: string, fields: string[], fieldTitles: string[]) {
    const container = document.createElement("div");
    container.id = `table-container-${this.uid()}-${suffix}`;

    const title = document.createElement("h2");
    title.textContent = suffix;

    const table = document.createElement("table");
    table.className = "blueTable";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Kopfzeile
    const headerRow = document.createElement("tr");
    fields.forEach((col, i) => {
      const th = document.createElement("th");
      th.title = fieldTitles[i];
      th.textContent = col;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Datenzeilen
    for (const key in data) {
      const tr = document.createElement("tr");
      const signal = data[key];

      fields.forEach((col, i) => {
        const td = document.createElement("td");

        switch (i) {
          case 0: // Eigenschaft
            td.textContent = key;
            break;

          case 1: // SPS-Name
            if (typeof signal.name === "object" && signal.name !== null) {
              const timeParts = ["tag", "monat", "jahr", "stunde", "minute", "sekunde"];
              const arrStrings: string[] = [];

              timeParts.forEach(part => {
                if (signal.name[part]) {
                  const name = signal.name[part].name || "n/a";
                  arrStrings.push(`${part}: ${name}`);
                }
              });
              if (arrStrings.length === 0) {
                Array.isArray(signal.name) && signal.name.forEach((item) => {
                  arrStrings.push(`${item || "n/a"}`);
                });
              }
              td.innerHTML = arrStrings.join("<br>");
            } else if ((typeof signal.name === "string" && signal.name.trim() !== "") || typeof signal.name === "number") {
              td.textContent = signal.name;
            } else {
              td.textContent = "n/a";
              td.style.color = "tomato";
              td.title = "Ungültige oder fehlende Eingabe";
            }
            break;

          case 2: // Knockout-Wert falls vorhanden
            if (ko.isObservable(signal.value) && Array.isArray(signal.value())) {
              // Observable Array – nur Werte untereinander anzeigen
              // z.B. paStart/paStop als einzellne Bytes
              const values = signal.value();
              if (Array.isArray(values) && values.length > 0) {
                td.innerHTML = values.map(val => (val != null ? val.toString() : "n/a")).join("<br>");
              } else {
                td.textContent = "n/a";
                td.style.color = "tomato";
                td.title = "Leeres Array oder keine Werte";
              }
            } else {
              const span = document.createElement("span");

              // if (ko.isObservable(signal.value) && signal.value() !== undefined && signal.value() !== null) {
              // Knockout-Bindung für Einzelwert
              span.setAttribute("data-bind", "text: value");
              td.appendChild(span);
              ko.applyBindings({ value: signal.value }, span);
              // } else {
              //   // Fallback: Wert direkt anzeigen
              //   span.textContent = 'n/a';
              //   span.style.color = "tomato";
              //   span.title = "kein SPS-Wert vorhanden";
              //   td.appendChild(span);
              // }
            }
            break;

        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    // Überschrift und Tabelle in Container einfügen
    container.appendChild(title);
    container.appendChild(table);

    return container;
  }

  public async activate() { }
  public async detached() { }
  protected async close() {
    // Unregister Signals
    this.detached();

    dialog.close(this, Promise.resolve());
  }
}
export = cwRezDlgSetup;
