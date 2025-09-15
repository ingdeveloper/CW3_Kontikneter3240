var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
define(["require", "exports", "plugins/dialog", "../viewModels/cowi/dialoge/cwRezDlg", "./component-rezept-base.model", "../viewModels/cowi/services/ccw-contextmenu", "contextMenu", "uiPosition"], function (require, exports, dialog, MsgBox, RezBase, CcwContextmenu) {
    "use strict";
    /**
     * @class RezeptWerteVergleichen
     * @description ViewModel für das Vergleichen von Rezeptwerten
     * @extends RezBase
     */
    var RezeptWerteVergleichen = /** @class */ (function (_super) {
        __extends(RezeptWerteVergleichen, _super);
        /**
         * @constructor
         * @param {T} params - Parameter für den Konstruktor
         */
        function RezeptWerteVergleichen(params) {
            var _this = _super.call(this, params) || this;
            /** Status Vergleicher */
            _this.isCompare = ko.observable(false);
            /** Status Editierbar */
            _this.editable = ko.observable(false);
            /** Countdown Anzeigewert vorformatiert "{mm:ss}" */
            _this.seessionTime = ko.observable("");
            /** letzter Wert für 'toreload' anzustossen */
            _this.lastTab = "";
            /** letzte gewählte Rez.Nr. um 'toreload' anzustossen */
            _this.lastSelectedRez = "";
            /** disposed die computed-Funktion */
            _this.disposeComputed = ko.observable(false);
            /**
             * @method logKey
             * @description Startet die Sitzung neu bei Mausbewegung
             * @param {this} self - Kontext der Klasse
             */
            _this.logKey = function (self) {
                return _.throttle(function (e) { return self.sessionCount.restart(); }, 3000);
            };
            /**
             * @method initSidebar
             * @description Initialisiert die Sidebar
             */
            _this.initSidebar = function () {
                // zIndex setzen
                $("#sidebar").css("zIndex", CcwContextmenu.zMax() + 1);
                $("#dismiss, .overlay, #sidebar ul li a").on("click", function () {
                    $("#sidebar").removeClass("active");
                    $(".overlay").fadeOut();
                });
                $("#sidebarCollapse").on("click", function () {
                    $("#sidebar").addClass("active");
                    $(".overlay").fadeIn();
                    $(".collapse.in").toggleClass("in");
                    $("a[aria-expanded=true]").attr("aria-expanded", "false");
                });
            };
            /**
             * @method sidebarOn
             * @description Fährt die Sidebar aus
             */
            _this.sidebarOn = function () {
                $("#sidebarCollapse").trigger("click");
            };
            /**
             * @method sidebarOff
             * @description Fährt die Sidebar ein
             */
            _this.sidebarOff = function () {
                $("#dismiss, .overlay, #sidebar ul li a").trigger("click");
            };
            /**
             * @method compareStatus
             * @description Gibt den Status des Vergleichers zurück
             * @returns {Object} Ein Objekt mit Symbol, Farbe und Text basierend auf dem Vergleichsstatus
             */
            _this.compareStatus = ko.pureComputed(function () {
                var self = _this;
                return {
                    symbol: self.isCompare() ? "fa fa-stop" : "fa fa-play",
                    color: self.isCompare() ? "tomato" : "dodgerblue",
                    text: self.isCompare()
                        ? "<i class=\"fa fa-stop\" style=\"margin-right: 0.5em; font-size: larger;\"></i>Vergleich stoppen " + self.seessionTime()
                        : '<i class="fa fa-play" style="margin-right: 0.5em; font-size: larger;"></i>Vergleich starten',
                };
            });
            /**
             * @property tostr
             * @description Steuert den Toaster
             */
            _this.tostr = {
                toastrCnfg: null,
                on: function () {
                    if (!_this.tostr.toastrCnfg) {
                        _this.tostr.toastrCnfg = toastr.options;
                        toastr.options = {
                            positionClass: "toast-top-center",
                            timeOut: 0,
                            extendedTimeOut: 0,
                            progressBar: false,
                            closeButton: true,
                            onCloseClick: function () {
                                // Vergleicher beenden, wenn auf Toast-Leiste gelickt wird.
                                _this.isCompare(false);
                                _this.compare();
                                _this.sidebarOff();
                            },
                            onclick: function () { return _this.sidebarOn(); },
                            tapToDismiss: false,
                            showDuration: 0,
                            hideDuration: 0,
                        };
                    }
                    toastr.remove();
                    var version = _this.rezVer() ? " V" + _this.rezVer() : "";
                    toastr.warning("<pre>Vergleichsrezept : " + _this.rezInfo() + "<br />SPS (gegenw\u00E4rtig): " + _this.rezNr() + version + " - " + _this.rezName() + "</pre>", "Rezeptwertvergleicher an! <div class=\"pull-right\">" + _this.seessionTime() + "</div>");
                    return true;
                },
                off: function () {
                    // zwischengespeicherte Toastr-Config zurückspielen
                    if (!!_this.tostr.toastrCnfg) {
                        toastr.options = _this.tostr.toastrCnfg;
                        _this.tostr.toastrCnfg = null;
                    }
                    toastr.remove();
                    toastr.success("Rezeptewertvergleicher beendet!", "Vergeleicher");
                    return true;
                },
            };
            /**
             * @property sessionCount
             * @description Steuert die Restlaufzeit des Timers
             */
            _this.sessionCount = {
                _tId: null,
                _cb: null,
                _duration: null,
                _min: 3,
                _sec: 0,
                /**
                 * @method start
                 * @description Startet den Timer für die Restlaufzeit
                 * @param {Function} cb - Callback-Funktion, die nach Ablauf der Zeit ausgeführt wird
                 */
                start: function (cb) {
                    var self = _this.sessionCount;
                    self.stop();
                    self._cb = cb;
                    self._duration = moment.duration({
                        seconds: self._sec,
                        minutes: self._min,
                    });
                    var isOnFlag = true;
                    self._tId = setInterval(function () {
                        self._duration = moment.duration(self._duration.asSeconds() - 1, "seconds");
                        if (self._duration.asMilliseconds() <= 0) {
                            isOnFlag = false;
                            self.stop();
                        }
                        // Callback-Fnkt. aufrufen
                        cb(moment(self._duration.asMilliseconds()).format("mm:ss"), isOnFlag);
                    }, 1000);
                },
                /**
                 * @method restart
                 * @description Startet den Timer für die Restlaufzeit neu
                 */
                restart: function () {
                    var self = _this.sessionCount;
                    if (self._cb) {
                        self._duration = moment.duration({
                            seconds: self._sec,
                            minutes: self._min,
                        });
                    }
                },
                /**
                 * @method stop
                 * @description Stoppt den Timer für die Restlaufzeit
                 */
                stop: function () {
                    var self = _this.sessionCount;
                    clearInterval(self._tId);
                    self._tId = null;
                    if (!!self._cb) {
                        self._cb("", false);
                        self._cb = null;
                    }
                },
            };
            var self = _this;
            self._compareElements = [];
            self.toreload = (ko.unwrap(self.settings.toreload) || "").stringPlaceholderResolver(self.objectID);
            return _this;
        }
        /**
         * @method compositionComplete
         * @description Initialisiert die Sidebar und überwacht Änderungen
         */
        RezeptWerteVergleichen.prototype.compositionComplete = function () {
            return __awaiter(this, void 0, void 0, function () {
                var reloadDebounce;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.compositionComplete.call(this)];
                        case 1:
                            _a.sent();
                            this.initSidebar();
                            // überwacht die Änderung der toreload-Variable und ggf.löst das Reload aus
                            ko.computed(function () {
                                if (_this.toreload) {
                                    var params = _this.fn.vmContext[_this.toreload];
                                    if (_this.lastTab != params()) {
                                        _this.lastTab = params();
                                        _this.reload(_this);
                                    }
                                }
                            });
                            reloadDebounce = _.debounce(function () { return _this.reload(_this); }, 160);
                            // überwacht die Änderung des Rez. und Vers. Nr. und ggf. löst das Reload aus
                            ko.computed(function () {
                                var newSelectedNr = _this.selectedRecipe.Nr() + _this.selectedRecipe.Vers();
                                if (_this.lastSelectedRez != newSelectedNr) {
                                    _this.lastSelectedRez = newSelectedNr;
                                    reloadDebounce();
                                }
                            });
                            document.addEventListener("mousemove", this.logKey(this));
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @method loadVarListe
         * @description Lädt relevante Variablen für das Rezept (Überschreibt die Methode der Basisklasse)
         */
        RezeptWerteVergleichen.prototype.loadVarListe = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); });
        };
        /**
         * @method makePaList
         * @description Erstellt eine Liste von PA-Elementen (Überschreibt die Methode der Basisklasse)
         */
        RezeptWerteVergleichen.prototype.makePaList = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); });
        };
        /**
         * @method initCtxtmenu
         * @description Initialisiert das Kontextmenü
         * @param {string} rezNr - Rezeptnummer
         * @param {string} rezVer - Rezeptversion
         * @param {IConnector} conn - Verbindungsobjekt
         * @returns {Promise<boolean>} Gibt 'true' zurück, wenn die Ausführung erfolgreich war
         */
        RezeptWerteVergleichen.prototype.initCtxtmenu = function (rezNr, rezVer, conn) {
            return __awaiter(this, void 0, void 0, function () {
                var self, q, data_1, editable_1, ex_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            self = this;
                            q = [];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            // 1. Elemente im DOM suchen und Signalparameter
                            Object.keys($.contextMenu.menus).forEach(function (menuName) {
                                $($.contextMenu.menus[menuName].selector).each(function (i, item) {
                                    var parentId, kindId;
                                    if ($(item).length > 0) {
                                        if ($(item).attr("id") && // da die 'ID' n. immer vorhanden
                                            $(item).attr("id").length > 0 // nur Elemente mit ID zulassen
                                        ) {
                                            parentId = item.id;
                                            kindId = "positionable_" + item.id;
                                        }
                                        else {
                                            var _id = uuid.v4();
                                            // sonst ID zuweisen
                                            $(item).attr("id", _id);
                                            parentId = _id;
                                            kindId = "positionable_" + _id;
                                        }
                                        q.push({
                                            parentId: parentId,
                                            kindId: kindId,
                                            signal: CcwContextmenu.getAliasName($(item))[0],
                                            value: null,
                                        });
                                    }
                                });
                            });
                            return [4 /*yield*/, CcwContextmenu.GetSignRecipeValues(CcwContextmenu.GetIdent(), q.map(function (item) { return item.signal; }), rezNr, parseInt(rezVer, 10))];
                        case 2:
                            data_1 = _a.sent();
                            // 3. Werte zuweisen
                            q.map(function (val) {
                                data_1.map(function (v) {
                                    if (v.aliasName == val.signal)
                                        val.value = v.recipeValue;
                                });
                            });
                            // 4. Liste nur auf Value-vorhandene Items reduzieren
                            self._compareElements = q.filter(function (val) { return val.value; });
                            editable_1 = self.editable();
                            // 5. Visuelle Elemente einfügen
                            self._compareElements.forEach(function (item) {
                                var spsValue = conn.getSignal(item.signal).value();
                                var title = "DB-Wert: " + item.value + "; SPS-Wert: " + spsValue;
                                var discr = item.value != spsValue ? "diff" : "equal";
                                var alias = JSON.stringify({ alias: item.signal });
                                editable_1
                                    ? $("<input type=\"number\" class=\"positionable " + discr + "\" title=\"" + title + "\" id=\"" + item.kindId + "\" value=\"" + item.value + "\" data-signalinfo=" + alias + " data-bind=\"event:{change:function(data,event){valChanged(data, event)}}\">").insertAfter("#" + item.parentId)
                                    : $("<div class=\"positionable " + discr + "\" title=\"" + title + "\" id=\"" + item.kindId + "\"><p>" + item.value + "</p></div>").insertAfter("#" + item.parentId);
                                // 6. Positionieren
                                // @ts-ignore
                                $("#" + item.kindId).position({
                                    of: $("#" + item.parentId),
                                    my: "left top",
                                    at: "left top",
                                    offset: "0 0",
                                    collision: "flip flip",
                                });
                                // 7. zIndex zuweisen
                                $("#" + item.kindId).css("zIndex", CcwContextmenu.zIndex($("#" + item.kindId)) + 1);
                                editable_1 && ko.applyBindings(self, $("#" + item.kindId)[0]);
                            });
                            return [2 /*return*/, true];
                        case 3:
                            ex_1 = _a.sent();
                            alert(ex_1);
                            return [2 /*return*/, Promise.reject(ex_1)];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @method removeCompareElements
         * @description Löscht vorhandene Rezeptvergleichselemente
         */
        RezeptWerteVergleichen.prototype.removeCompareElements = function () {
            this._compareElements.forEach(function (value) { return $("#" + value.kindId).remove(); });
        };
        /**
         * @method reload
         * @description Initialisiert das Kontextmenü ohne den Timer zu beeinflussen
         * @param {this} context - Kontext der Klasse
         */
        RezeptWerteVergleichen.prototype.reload = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var self;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            self = context;
                            if (!self.isCompare())
                                return [2 /*return*/];
                            self.isLoading(true); // Lade-Spinner on
                            self.removeCompareElements();
                            return [4 /*yield*/, self.initCtxtmenu(self.selectedRecipe.Nr(), self.selectedRecipe.Vers(), self.connector)];
                        case 1:
                            _a.sent();
                            self.isLoading(false); // Lade-Spinner off
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @method cmpBtn
         * @description Funktion für den Vergleichsbutton
         */
        RezeptWerteVergleichen.prototype.cmpBtn = function () {
            return __awaiter(this, void 0, void 0, function () {
                var self;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            self = this;
                            // 1. Prüfen ob etwas aus der Liste gewählt wurde
                            if (!!!self.selectedRecipe.Nr()) {
                                dialog.show(new MsgBox("Info", "kein Rezept ausgewählt", "Orange"));
                                return [2 /*return*/];
                            }
                            if (!self.editable()) return [3 /*break*/, 2];
                            return [4 /*yield*/, self.userLog()];
                        case 1:
                            if (!(_a.sent()))
                                return [2 /*return*/];
                            _a.label = 2;
                        case 2:
                            // Lade-Spinner on
                            self.isLoading(true);
                            // Toggle Status
                            self.isCompare(!self.isCompare());
                            self.compare().then(function () { return self.isLoading(false); } // Lade-Spinner off;
                            );
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @method compare
         * @description Startet/Stoppt den Vergleicher
         * @returns {Promise<boolean>} Gibt 'true' zurück, wenn die Ausführung erfolgreich war
         */
        RezeptWerteVergleichen.prototype.compare = function () {
            return __awaiter(this, void 0, void 0, function () {
                var self;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            self = this;
                            if (!self.isCompare()) {
                                self.sessionCount.stop();
                                self.removeCompareElements();
                                return [2 /*return*/, true];
                            }
                            return [4 /*yield*/, self.initCtxtmenu(self.selectedRecipe.Nr(), self.selectedRecipe.Vers(), self.connector)];
                        case 1:
                            if (_a.sent()) {
                                self.sessionCount.start(self.sessionTimeCtrl.bind(self));
                                self.sidebarOff();
                            }
                            else {
                                self.sessionCount.stop();
                                self.removeCompareElements();
                                self.isCompare(false);
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
         * @method sessionTimeCtrl
         * @description Steuert die Restlaufzeit für den Toaster
         * @param {string} value - Restlaufzeit in {"mm:ss"}
         * @param {boolean} isOn - Timerstatus
         */
        RezeptWerteVergleichen.prototype.sessionTimeCtrl = function (value, isOn) {
            this.seessionTime(value);
            if (isOn) {
                this.tostr.on();
                return;
            }
            this.tostr.off();
            // falls Zeit abgelaufen
            if (!!this.isCompare()) {
                this.isCompare(false);
                this.compare();
            }
        };
        /**
         * @method dispose
         * @description Bereinigt die Instanz
         * @returns {Promise<any>} Eine Promise, die signalisiert, dass die Bereinigung abgeschlossen ist
         */
        RezeptWerteVergleichen.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.dispose.call(this)];
                        case 1:
                            _a.sent();
                            !!this.isCompare() && this.sessionTimeCtrl("", false);
                            this.logKey(this).cancel();
                            document.removeEventListener("mousemove", this.logKey(this));
                            if (this.toreload)
                                this.disposeComputed(true);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return RezeptWerteVergleichen;
    }(RezBase));
    return RezeptWerteVergleichen;
});
//# sourceMappingURL=rez-dlg-compare.component.js.map