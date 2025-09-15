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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
define(["require", "exports", "plugins/dialog", "../dialoge/cwRezDlg", "../dialoge/cwDlgRezEdit", "../dialoge/cwRezDlgLogInOut", "../../../viewModels/cowi/services/rezService", "contextMenu", "uiPosition"], function (require, exports, dialog, MsgBox, cwDlgRezEdit, LoginDialog, rezService_1) {
    "use strict";
    var CcwContextmenu = /** @class */ (function () {
        function CcwContextmenu() {
        }
        CcwContextmenu.RemoveIdent = function () {
            if (this.ident.length > 1) {
                this.ident.pop();
            }
        };
        CcwContextmenu.AddIdent = function (ident) {
            this.RemoveIdent();
            this.ident.push(ident);
        };
        CcwContextmenu.GetIdent = function () {
            return this.ident[this.ident.length - 1];
        };
        CcwContextmenu.AddSelector = function (selector) {
            var e_1, _a;
            var self = this;
            try {
                for (var selector_1 = __values(selector), selector_1_1 = selector_1.next(); !selector_1_1.done; selector_1_1 = selector_1.next()) {
                    var select = selector_1_1.value;
                    $.contextMenu({
                        selector: select,
                        className: "css-title",
                        callback: function (key, options) {
                            if (key === "edit") {
                                // Error verhindern falls es keine Rez.Variable
                                if (!!options.items["alias"].items.info)
                                    self.editDlg(options.items["alias"].items.info.html, options.items["status"].items.info // .alias, .db2Alias
                                    );
                                else
                                    return false; // return false verhindert das Kontextmenü schließt
                            }
                            key === "copy"
                                ? self.copyToClipboard(options.items["alias"].name)
                                : self.copyToClipboard(key);
                        },
                        // overriede position the sub-menu
                        positionSubmenu: function ($menu) {
                            if (typeof $menu === "undefined") {
                                // When user hovers over item (which has sub items) handle.focusItem will call this.
                                // but the submenu does not exist yet if opt.items is a promise. just return, will
                                // call positionSubmenu after promise is completed.
                                return;
                            }
                            if ($.ui && $.ui.position) {
                                // .position() is provided as a jQuery UI utility
                                // (...and it won't work on hidden elements)
                                $menu
                                    .css("display", "block")
                                    .css("z-index", "10")
                                    .position({
                                    my: "left top-5",
                                    at: "right top",
                                    of: this,
                                    collision: "flipfit fit",
                                })
                                    .css("display", "");
                            }
                            else {
                                // determine contextMenu position
                                var offset = {
                                    top: -9,
                                    left: this.outerWidth() - 5,
                                };
                                $menu.css(offset);
                            }
                        },
                        build: function ($trigger, e) {
                            var sigAlias = self.ident[self.ident.length - 1].alias
                                ? self.ident[self.ident.length - 1].alias
                                : self.getAliasName($trigger);
                            if (sigAlias.length == 0) {
                                // Schaltet das Kontextmenü bei betroffenen Element aus
                                // $trigger.addClass('context-menu-disabled')
                                return {
                                    items: {
                                        error: {
                                            type: "html",
                                            html: "<span style='color: tomato;'>Parameter 'signalName' nicht gesetzt!</span>",
                                        },
                                    },
                                };
                            }
                            var separator = '{ "trenn": "---------" }';
                            var quitItem = {
                                trenn: "---------",
                                name: "Schließen",
                                icon: function () {
                                    return "context-menu-icon context-menu-icon-quit";
                                },
                            };
                            var subItems = {};
                            // 1. - es handelt sich um eine Variable
                            if (sigAlias.length === 1) {
                                var signal_1 = sigAlias[0];
                                var props = self.getSigProperty(self.ident[self.ident.length - 1], signal_1);
                                return {
                                    items: {
                                        alias: {
                                            className: "css-sub",
                                            name: signal_1,
                                            icon: "status",
                                            items: props
                                                .then(function (value) {
                                                return self.getRecipeDiff(self.ident[self.ident.length - 1], value["info"].db2Alias || signal_1);
                                            })
                                                .catch(function () {
                                                // falls was schief läuft
                                                return self.getRecipeDiff(self.ident[self.ident.length - 1], signal_1);
                                            }),
                                        },
                                        copy: { name: "Kopieren", icon: "copy" },
                                        edit: {
                                            name: "Bearbeiten",
                                            icon: "fa-edit",
                                            disabled: true,
                                        },
                                        sep1: "---------",
                                        status: {
                                            className: "css-sub",
                                            name: "Eigenschaften",
                                            icon: "status",
                                            items: props,
                                        },
                                        separator: separator,
                                        // test: {
                                        //   name: "di/enable",
                                        //   icon: "fa-regular fa-battery-bolt",
                                        // callback: disableEdit,
                                        // },
                                        quit: quitItem,
                                    },
                                };
                            }
                            // 2 - es handelt sich um mehrere Variablen
                            var aliasItems = [];
                            for (var i = 0; i < sigAlias.length; i++) {
                                aliasItems.push("\"sub" + (i + 1) + "\":{\"className\":\"css-sub\",\"name\":\"" + sigAlias[i] + "\",\"icon\":\"status\",\"items\":{\"recipe\":{\"className\":\"css-sub\",\"name\":\"Rezepterte\",\"icon\":\"status\",\"recipeProperty\":\"" + sigAlias[i] + "\"},\"" + sigAlias[i] + "\":{\"name\":\"Kopieren\",\"icon\":\"copy\"},\"trennzeichen\":\"---------\",\"property\":{\"className\":\"css-sub\",\"name\":\"Eigenschaften\",\"icon\":\"status\",\"signalProperty\":\"" + sigAlias[i] + "\"}}}");
                            }
                            subItems = JSON.parse(aliasItems
                                .toString()
                                .replace(/(^.{0})/g, "{")
                                .replace(/(.{0}$)/g, "}"));
                            var getSubItems = function (subItems) {
                                for (var key in subItems) {
                                    if (typeof subItems[key] === "object") {
                                        getSubItems(subItems[key]);
                                    }
                                    else {
                                        var props = null;
                                        var diffs = null;
                                        if (key == "recipeProperty" || key == "signalProperty") {
                                            props = self.getSigProperty(self.ident[self.ident.length - 1], subItems[key].toString());
                                            diffs = props.then(function (value) {
                                                return self.getRecipeDiff(self.ident[self.ident.length - 1], value["info"].db2Alias //|| subItems[key].toString()
                                                );
                                            });
                                        }
                                        switch (key) {
                                            case "recipeProperty":
                                                subItems.items = diffs;
                                                delete subItems[key];
                                                break;
                                            case "signalProperty":
                                                subItems.items = props;
                                                delete subItems[key];
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                }
                                return Promise.resolve(subItems);
                            };
                            return {
                                items: {
                                    status: {
                                        className: "css-sub",
                                        name: "Variablen",
                                        icon: "fa-certificate",
                                        items: getSubItems(subItems),
                                    },
                                    separator: separator,
                                    quit: quitItem,
                                },
                            };
                        },
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (selector_1_1 && !selector_1_1.done && (_a = selector_1.return)) _a.call(selector_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        /**
         * liefert die Rez.Infos zu gewählten Alias
         * @param alias Signalalias
         */
        CcwContextmenu.getRecipeDiff = function (ident, sigAlias) {
            return rezService_1.rezService
                .GetSignRecipeDifferences({
                aiWerk: ident.werk,
                aiHalle: ident.halle,
                aiEtage: ident.etage,
                aiLinie: ident.linie,
                aiAbteil: ident.abteiNr || -1,
                aiMasch: ident.maschine || -1,
                asSigAlias: sigAlias,
            })
                .then(function (resp) {
                if (resp.GetSignalRezInfoResult.Succeed)
                    return resp.GetSignalRezInfoResult.Data;
                else
                    throw new Error(resp.GetSignalRezInfoResult.ErrorMsg);
            })
                .then(function (data) {
                // 1. - keine Daten vorhanden
                if (data.data.length == 0) {
                    return {
                        error: {
                            type: "html",
                            html: "<span style='color: tomato;'>Alias ist n. in Rez-DB vorhanden!<br><br>W:" + ident.werk + ",H:" + ident.halle + ",E:" + ident.etage + ",L:" + ident.linie + ",A:" + ident.abteiNr + ",M:" + ident.maschine + "</span>",
                        },
                    };
                }
                // 2. - Daten sind da
                // Edit-Item enablen
                $(".fa-edit.context-menu-disabled").removeClass("context-menu-disabled");
                var row = "", sel = "";
                $.each(data.data, function (i, l) {
                    var rezparam = JSON.stringify({
                        reznr: l.recipeNumber,
                        rezver: l.recipeVersion,
                    });
                    row += "<tr title=\"" + l.recipeName + " - " + l.recipeNumber + "[" + l.recipeVersion + "]\"><td>" + l.recipeName + "</td><td>" + l.recipeNumber + "</td><td>" + l.recipeVersion + "</td><td id=\"rezVal_" + i + "\" data-rezparam=" + rezparam + ">" + l.recipeValue + "</td></tr>";
                    sel += "<option value=\"" + l.recipeNumber + "\"></option>";
                });
                var tabId = uuid.v4();
                return {
                    info: {
                        type: "html",
                        html: "<script>function filter(selValue) {const value = selValue == 'Alle' ? '' : selValue.toLowerCase(); const t = $('#" + tabId + " tr');for (var key in t) {if (t.hasOwnProperty(key)) {$(t[key]).toggle($(t[key]).text().toLowerCase().indexOf(value) > -1);$(t).filter(t[key]);}}}</script><style>table th {padding-inline: 1em;background-color:gainsboro;} table th:first-child {padding-inline:6em;}thead tr{position:-webkit-sticky;position:sticky;top:0;}</style><div style=\"font-weight:bold;\">Filter&nbsp<input type=\"search\" list=\"Filter\" placeholder=\"z.B. 001\" oninput=\"filter(this.value)\" style=\"font-weight:normal\"><datalist id=\"Filter\">" + sel + "</datalist></div><hr><div style=\"max-height:20em;overflow:auto; display:grid;\"><table frame=\"void\" rules=\"all\" white-space:nowrap;><thead><tr><th title=\"W:" + ident.werk + ", H:" + ident.halle + ", E:" + ident.etage + ", L:" + ident.linie + ", A:" + ident.abteiNr + ", M:" + ident.maschine + "\">Rezeptname</th><th title=\"Rezeptnummer\">Nummer</th><th title=\"Rezeptversion\">Ver.</th><th title=\"Rezeptwert\">Wert</th></tr></thead><tbody id=\"" + tabId + "\">" + row + "</tbody></table></div>",
                    },
                };
            })
                .catch(function (ex) {
                return {
                    error: {
                        type: "html",
                        html: "<span style=\"color: tomato;\">" + ex.message + "</span>",
                    },
                };
            });
        };
        /**
         * liefert die Rez.Infos zu gewählten Alias
         * @param alias Signalalias
         */
        CcwContextmenu.GetSignRecipeValues = function (ident, sigAlias, RezNr, RezVer) {
            return rezService_1.rezService
                .GetSignRecipeValues({
                aiWerk: ident.werk,
                aiHalle: ident.halle,
                aiEtage: ident.etage,
                aiLinie: ident.linie,
                aiAbteil: ident.abteiNr,
                aiMasch: ident.maschine,
                asSigAlias: sigAlias,
                asRezNr: RezNr,
                asRezVer: RezVer,
                asWfServer: ident.wfServername,
                asWfDb: ident.wfDbName,
            })
                .then(function (resp) {
                if (resp.GetSignalRezValueResult.Succeed)
                    return resp.GetSignalRezValueResult.Data;
                else
                    throw new Error(resp.GetSignalRezValueResult.ErrorMsg);
            })
                .then(function (data) {
                return data.data;
            })
                .catch(function (ex) {
                return Promise.reject(ex);
            });
        };
        /**
         * liefert Signaleigenschaften zu dem Alias
         * @param alias Signalalias
         */
        CcwContextmenu.getSigProperty = function (ident, sigAlias) {
            return rezService_1.rezService
                .GetSignalProperty({
                asWfServer: ident.wfServername,
                asWfDb: ident.wfDbName,
                asSigAlias: sigAlias,
            })
                .then(function (resp) {
                if (resp.GetSignalPropertyResult.Succeed) {
                    return resp.GetSignalPropertyResult.Data;
                }
                else
                    throw new Error(resp.GetSignalPropertyResult.ErrorMsg);
            })
                .then(function (data) {
                if (data.data.length == 0) {
                    return {
                        error: {
                            type: "html",
                            html: "<span style='color: tomato;'>Alias ist n. in WF-DB vorhanden!<br><br>Servername:'" + ident.wfServername + "'<br>DB:'" + ident.wfDbName + "'</span>",
                            alias: "",
                            db2Alias: "",
                        },
                    };
                }
                var row = "", alias = "", globalAlias = "", description = "", factor = "";
                $.each(data.data, function (i, l) {
                    // Zeile mit globalen Aliasnamen erzeugen, wenn das Feld nicht leer ist
                    alias = l.Alias;
                    globalAlias = l.Db2Alias;
                    description = l.Beschreibung;
                    factor = l.Factor;
                    var gAlias = !!l.Db2Alias
                        ? "<tr><td style=\"font-weight: bold;\">DB2Alias</td><td>" + l.Db2Alias + "</td></tr>"
                        : "";
                    row += "<tr><td style=\"font-weight: bold;\">Addr.</td><td>" + l.Signalname + "</td></tr><tr><td style=\"font-weight: bold;\">Alias</td><td>" + l.Alias + "</td></tr>" + gAlias + "<tr><td style=\"font-weight: bold;\">Beschr.</td><td>" + l.Beschreibung + "</td></tr><tr><td style=\"font-weight: bold;\">Einh.</td><td>" + l.Einheit + "</td></tr><tr><td style=\"font-weight: bold;\">Min.</td><td>" + l.Min + "</td></tr><tr><td style=\"font-weight: bold;\">Max.</td><td>" + l.Max + "</td></tr><tr><td style=\"font-weight: bold;\">Faktor</td><td>" + l.Factor + "</td></tr>";
                });
                return {
                    info: {
                        type: "html",
                        html: "<div><table border=\"1\" frame=\"void\" rules=\"all\" cellpadding=\"5\"><thead></thead><tbody>" + row + "</tbody></table></div>",
                        alias: alias,
                        db2Alias: globalAlias,
                        description: description,
                        factor: factor,
                    },
                };
            })
                .catch(function (ex) {
                return {
                    error: {
                        type: "html",
                        html: "<span style=\"color: tomato;\">" + ex.message + "</span>",
                        alias: "",
                        db2Alias: "",
                    },
                };
            });
        };
        /** Max. zIndex von dem bevorstehnden Element ermitteln*/
        CcwContextmenu.zIndex = function ($t) {
            var zin = 0, $tt = $t.prevAll();
            while (true) {
                zin = Math.max(zin, parseInt($tt.css("z-index"), 10) || 0);
                $tt = $tt.children();
                if (!$tt ||
                    !$tt.length ||
                    "html body".indexOf($tt.prop("nodeName").toLowerCase()) > -1) {
                    break;
                }
            }
            return zin;
        };
        // $.contextMenu.defaults.events.preShow()
        /** Max. zIndex ermittlen */
        CcwContextmenu.zMax = function () {
            var maxZ = Math.max.apply(null, $.map($("body *"), function (e, n) {
                return parseInt($(e).css("z-index")) || 1;
            }));
            return maxZ;
        };
        // Beispiel Aufruf des 'editDlg'
        CcwContextmenu.editDlg = function (html, info) {
            return __awaiter(this, void 0, void 0, function () {
                var response, login, dlgLoginResult, error_1, _a, response_1, dispose;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            response = false;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, 6, 7]);
                            return [4 /*yield*/, LogInOut.logIn()];
                        case 2:
                            login = _b.sent();
                            if (login.state !== 1)
                                return [2 /*return*/];
                            // info-Objekt um 'user'-Eigenschaft erweitern
                            info["user"] = login.vorname + " " + login.nachname;
                            return [4 /*yield*/, dialog.show(new cwDlgRezEdit(html, info, this.ident))];
                        case 3:
                            dlgLoginResult = (_b.sent());
                            if (dlgLoginResult.state === 0) {
                                return [2 /*return*/];
                            }
                            return [3 /*break*/, 7];
                        case 4:
                            error_1 = _b.sent();
                            return [4 /*yield*/, dialog.show(new MsgBox("Error", "Fehler", "Tomato"))];
                        case 5:
                            _a = __read.apply(void 0, [_b.sent(), 2]), response_1 = _a[0], dispose = _a[1];
                            dispose();
                            return [3 /*break*/, 7];
                        case 6: 
                        // Rückgabe Verarbeiten
                        return [2 /*return*/, response];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Aufgeschlüsselter Aliasname
         * @info im Falle einer globalen Rezeptur werden die Aliasnamen
         * nicht in Klartext in DB2 gespeichert. z.B. Var.Alias in WF-DB
         * 'M10_VAR01' wird unter Aliasnamen 'VAR01' gespeichert, somit
         * ist die Abfrage von 'self.getRecipeDiff' ohne Aufschlüsselung
         * nicht möglich gewesen.
         */
        // private static globalAlias: string[];
        CcwContextmenu.ident = [
            {
                wfServername: window.rootUrlPrefix,
                wfDbName: "TestSps",
                werk: 9,
                halle: 9,
                etage: 9,
                linie: 9,
                alias: "",
                abteiNr: 9,
                maschine: 8,
                anlagenNr: 7321022,
            },
        ];
        CcwContextmenu.getAliasName = function ($trigger) {
            var resolve = [];
            var el = $trigger.attr("params");
            if (el === void 0) {
                return resolve;
            }
            var m;
            var regex = /(?:signal\w+\s*\:)(?:\[?[^\:]*\]?)(?:\,.*?|\:{0}$)/gi;
            while ((m = regex.exec(el)) !== null) {
                // Dies ist erforderlich, um Endlosschleifen zu vermeiden
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                // Auf das Ergebnis kann über die `m`-Variable zugegriffen werden.
                m.forEach(function (match) {
                    var e_2, _a;
                    // Parameter auf einzelteile zerpflücken
                    var params = match.split(/\s*(?:[:])\s*/g);
                    var aliases = params[1]
                        .replace(/^\[{1}|["']|]\s*,$/g, "")
                        .split(/(?:\,)/g);
                    try {
                        for (var aliases_1 = (e_2 = void 0, __values(aliases)), aliases_1_1 = aliases_1.next(); !aliases_1_1.done; aliases_1_1 = aliases_1.next()) {
                            var alias = aliases_1_1.value;
                            if (!alias || alias === "" || alias == void 0 || alias === "null") {
                                continue;
                            }
                            // die Magie beginnt..
                            // folgende Fälle werden untersucht
                            // 1. Name hat prefix $data
                            // 2. Name hat kein prefix $data, es wird versucht ein ViewModel zu erreichen
                            // 3. Name liegt ofen vor
                            // im Fall 1 und 2 geht man davon aus das die KnockoutJS eingesetzt ist
                            try {
                                resolve.push(alias.match(/^[$]data/g)
                                    ? eval("ko.contextFor($trigger[0])." + alias)
                                    : eval("!!ko.contextFor($trigger[0]).$data." + alias)
                                        ? eval("ko.contextFor($trigger[0]).$data." + alias)
                                        : alias);
                            }
                            catch (error) {
                                resolve.push(alias);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (aliases_1_1 && !aliases_1_1.done && (_a = aliases_1.return)) _a.call(aliases_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                });
            }
            return resolve;
        };
        // Quelle - https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
        CcwContextmenu.copyToClipboard = function (str) {
            var el = document.createElement("textarea"); // Create a <textarea> element
            el.value = str; // Set its value to the string that you want copied
            el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
            el.style.position = "absolute";
            el.style.left = "-9999px"; // Move outside the screen to make it invisible
            document.body.appendChild(el); // Append the <textarea> element to the HTML document
            var selected = document.getSelection().rangeCount > 0 // Check if there is any content selected previously
                ? document.getSelection().getRangeAt(0) // Store selection if found
                : false; // Mark as false to know no selection existed before
            el.select(); // Select the <textarea> content
            document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
            document.body.removeChild(el); // Remove the <textarea> element
            if (selected) {
                // If a selection existed before copying
                document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
                document.getSelection().addRange(selected); // Restore the original selection
            }
        };
        return CcwContextmenu;
    }());
    var LogInOut = /** @class */ (function () {
        function LogInOut() {
        }
        /**
         * Login/out -Funktion
         * @returns true, bei der erfogreicher Anmeldung
         */
        LogInOut.logIn = function () {
            return __awaiter(this, void 0, void 0, function () {
                var self, defaultResp, _a, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            self = this;
                            defaultResp = {
                                vorname: "",
                                nachname: "",
                                usberez: "",
                                usid: "",
                                state: 0,
                            };
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 5]);
                            // wenn der Timer noch läuft, dann nachtriggern und weiter
                            if (logoutTimer.timer.getState()) {
                                logoutTimer.timer.restart();
                                return [2 /*return*/, Promise.resolve(self.dlgResult)];
                            }
                            _a = self;
                            return [4 /*yield*/, dialog.show(new LoginDialog())];
                        case 2:
                            _a.dlgResult = (_b.sent());
                            if (self.dlgResult.state === 1) {
                                // self.adminIsLogged(true);
                                // self.adminName(`${dlgResult.vorname} ${dlgResult.nachname}`);
                                logoutTimer.timer.start();
                                // logoutTimer.timer.start((timeCode: string, state: boolean) =>
                                //   console.log(timeCode, state)
                                // );
                                return [2 /*return*/, Promise.resolve(self.dlgResult)];
                            }
                            else {
                                return [2 /*return*/, Promise.resolve(defaultResp)];
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            error_2 = _b.sent();
                            // Log.Add(
                            //   "Fehler beim Anmelden" + " - " + error.toString(),
                            //   LogType.Abbruch_durch_Programmfehler
                            // );
                            return [4 /*yield*/, dialog.show(new MsgBox("Fehler beim User-Logging", error_2, "Tomato"))];
                        case 4:
                            // Log.Add(
                            //   "Fehler beim Anmelden" + " - " + error.toString(),
                            //   LogType.Abbruch_durch_Programmfehler
                            // );
                            _b.sent();
                            return [2 /*return*/, Promise.resolve(defaultResp)];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return LogInOut;
    }());
    var logoutTimer = /** @class */ (function () {
        function logoutTimer() {
        }
        /** Timersteuerung Restlaufzeit */
        logoutTimer.timer = {
            _tId: null,
            _cb: null,
            _duration: null,
            _min: 3,
            _sec: 0,
            isOnFlag: false,
            /**
             * Start Timer Restlaufzeit
             * @param cb Callback Fnkt. wird nach Ablauf der Zeit ausgeführt
             */
            start: function (cb) {
                var self = logoutTimer.timer;
                self.stop();
                self._cb = typeof cb === "function" ? cb : null;
                self._duration = moment.duration({
                    seconds: self._sec,
                    minutes: self._min,
                });
                self.isOnFlag = true;
                self._tId = setInterval(function () {
                    self._duration = moment.duration(self._duration.asSeconds() - 1, "seconds");
                    if (self._duration.asMilliseconds() <= 0) {
                        self.isOnFlag = false;
                        self.stop();
                    }
                    // Callback-Fnkt. aufrufen
                    if (typeof self._cb === "function")
                        self._cb(moment(self._duration.asMilliseconds()).format("mm:ss"), self.isOnFlag);
                }, 1000);
            },
            /**
             * Timerstatus
             * @returns true, wenn der Timer läuft
             */
            getState: function () { return logoutTimer.timer.isOnFlag; },
            /** Restart Timer Restlaufzeit */
            restart: function () {
                var self = logoutTimer.timer;
                if (typeof self._cb === "function") {
                    self._duration = moment.duration({
                        seconds: self._sec,
                        minutes: self._min,
                    });
                }
            },
            /** Stopp Timer Restlaufzeit */
            stop: function () {
                var self = logoutTimer.timer;
                clearInterval(self._tId);
                self._tId = null;
                if (typeof self._cb === "function")
                    self._cb("00:00", false);
                self._cb = null;
            },
        };
        return logoutTimer;
    }());
    return CcwContextmenu;
});
//# sourceMappingURL=ccw-contextmenu.js.map