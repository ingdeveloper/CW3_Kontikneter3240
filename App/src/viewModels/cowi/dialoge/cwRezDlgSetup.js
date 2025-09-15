//  *************************************************************
//  * Model für das modale Fenster SPS und Dialog Einstellungen *
//  *************************************************************
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
define(["require", "exports", "plugins/dialog"], function (require, exports, dialog) {
    "use strict";
    var cwRezDlgSetup = /** @class */ (function () {
        function cwRezDlgSetup(_a) {
            var _b = __read(_a, 3), spsCfg = _b[0], dlgCfg = _b[1], dlgProps = _b[2];
            // UID für die eindeutige Identifizierung des Moduls
            this.uid = ko.observable(uuid.v4());
            // Felderdefinition SPS-Konfiguration
            this.fieldsSpsCnfg = [
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
            this.fieldTitlesSpsCnfg = [
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
            this.fieldsDlgCnfg = [
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
            this.fieldTitlesDlgCnfg = [
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
            this.fieldsVarStatus = [
                "Eigenschaft",
                "Wert",
                "SPS-aktualwert",
            ];
            // Titledefinition SPS-Konfiguration
            this.fieldTitlesVarStatus = [
                "Eigenschaftsname",
                "Signalname/Aliasname",
                "aktualwert gegenwärtig",
            ];
            this.data = { spsCfg: spsCfg, dlgCfg: dlgCfg, dlgProps: dlgProps };
        }
        cwRezDlgSetup.prototype.compositionComplete = function () {
            return __awaiter(this, void 0, void 0, function () {
                var tableContainer;
                return __generator(this, function (_a) {
                    this.container = document.getElementById("table-container");
                    tableContainer = this.createCnfgTable(this.data.spsCfg, "SPS-Konfiguration", this.fieldsSpsCnfg, this.fieldTitlesSpsCnfg);
                    this.container.appendChild(tableContainer);
                    tableContainer = this.createCnfgTable(this.data.dlgCfg, "Rez.Dlg.-Konfiguration", this.fieldsDlgCnfg, this.fieldTitlesDlgCnfg);
                    this.container.appendChild(tableContainer);
                    tableContainer = this.createPropTable(this.data.dlgProps, "Variablenstatus", this.fieldsVarStatus, this.fieldTitlesVarStatus);
                    this.container.appendChild(tableContainer);
                    return [2 /*return*/];
                });
            });
        };
        // Konfig.Tabellen erstellen
        cwRezDlgSetup.prototype.createCnfgTable = function (data, suffix, fields, fieldTitles) {
            var container = document.createElement("div");
            container.id = "table-container-" + this.uid() + "-" + suffix;
            var tittle = document.createElement("h2");
            tittle.textContent = suffix;
            var table = document.createElement("table");
            table.className = "blueTable";
            var thead = document.createElement("thead");
            var tbody = document.createElement("tbody");
            // Kopfzeile
            var headerRow = document.createElement("tr");
            fields.forEach(function (col) {
                var th = document.createElement("th");
                th.title = fieldTitles[fields.indexOf(col)];
                th.textContent = col;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            // Datenzeilen
            var rows = Array.isArray(data) ? data : [data]; // Sicherstellen, dass data ein Array ist
            rows.forEach(function (row) {
                var tr = document.createElement("tr");
                fields.forEach(function (col) {
                    var td = document.createElement("td");
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
        };
        // Eigenschaften-Tabelle erstellen
        cwRezDlgSetup.prototype.createPropTable = function (data, suffix, fields, fieldTitles) {
            var container = document.createElement("div");
            container.id = "table-container-" + this.uid() + "-" + suffix;
            var title = document.createElement("h2");
            title.textContent = suffix;
            var table = document.createElement("table");
            table.className = "blueTable";
            var thead = document.createElement("thead");
            var tbody = document.createElement("tbody");
            // Kopfzeile
            var headerRow = document.createElement("tr");
            fields.forEach(function (col, i) {
                var th = document.createElement("th");
                th.title = fieldTitles[i];
                th.textContent = col;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            var _loop_1 = function (key) {
                var tr = document.createElement("tr");
                var signal = data[key];
                fields.forEach(function (col, i) {
                    var td = document.createElement("td");
                    switch (i) {
                        case 0: // Eigenschaft
                            td.textContent = key;
                            break;
                        case 1: // SPS-Name
                            if (typeof signal.name === "object" && signal.name !== null) {
                                var timeParts = ["tag", "monat", "jahr", "stunde", "minute", "sekunde"];
                                var arrStrings_1 = [];
                                timeParts.forEach(function (part) {
                                    if (signal.name[part]) {
                                        var name_1 = signal.name[part].name || "n/a";
                                        arrStrings_1.push(part + ": " + name_1);
                                    }
                                });
                                if (arrStrings_1.length === 0) {
                                    Array.isArray(signal.name) && signal.name.forEach(function (item) {
                                        arrStrings_1.push("" + (item || "n/a"));
                                    });
                                }
                                td.innerHTML = arrStrings_1.join("<br>");
                            }
                            else if ((typeof signal.name === "string" && signal.name.trim() !== "") || typeof signal.name === "number") {
                                td.textContent = signal.name;
                            }
                            else {
                                td.textContent = "n/a";
                                td.style.color = "tomato";
                                td.title = "Ungültige oder fehlende Eingabe";
                            }
                            break;
                        case 2: // Knockout-Wert falls vorhanden
                            if (ko.isObservable(signal.value) && Array.isArray(signal.value())) {
                                // Observable Array – nur Werte untereinander anzeigen
                                // z.B. paStart/paStop als einzellne Bytes
                                var values = signal.value();
                                if (Array.isArray(values) && values.length > 0) {
                                    td.innerHTML = values.map(function (val) { return (val != null ? val.toString() : "n/a"); }).join("<br>");
                                }
                                else {
                                    td.textContent = "n/a";
                                    td.style.color = "tomato";
                                    td.title = "Leeres Array oder keine Werte";
                                }
                            }
                            else {
                                var span = document.createElement("span");
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
            };
            // Datenzeilen
            for (var key in data) {
                _loop_1(key);
            }
            table.appendChild(thead);
            table.appendChild(tbody);
            // Überschrift und Tabelle in Container einfügen
            container.appendChild(title);
            container.appendChild(table);
            return container;
        };
        cwRezDlgSetup.prototype.activate = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); });
        };
        cwRezDlgSetup.prototype.detached = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); });
        };
        cwRezDlgSetup.prototype.close = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Unregister Signals
                    this.detached();
                    dialog.close(this, Promise.resolve());
                    return [2 /*return*/];
                });
            });
        };
        return cwRezDlgSetup;
    }());
    return cwRezDlgSetup;
});
//# sourceMappingURL=cwRezDlgSetup.js.map