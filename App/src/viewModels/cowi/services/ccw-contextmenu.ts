/*
 ******************************
 * Logik für ccw-contextmenü  *
 ******************************
 */
import "contextMenu";
import "uiPosition";

import dialog = require("plugins/dialog");
import MsgBox = require("../dialoge/cwRezDlg");
import cwDlgRezEdit = require("../dialoge/cwDlgRezEdit");
import Logger = require("../../../services/logger");
import LoginDialog = require("../dialoge/cwRezDlgLogInOut");
import Log = require("../../../viewModels/cowi/services/rezLog");
import { rezService } from "../../../viewModels/cowi/services/rezService";

declare var uuid: { v4: () => any };
declare var window: { rootUrlPrefix: any };
declare var $: IContextMenu;
interface IContextMenu extends JQueryStatic {
  contextMenu: any;
  ui: any;
}

class CcwContextmenu {
  /**
   * Aufgeschlüsselter Aliasname
   * @info im Falle einer globalen Rezeptur werden die Aliasnamen
   * nicht in Klartext in DB2 gespeichert. z.B. Var.Alias in WF-DB
   * 'M10_VAR01' wird unter Aliasnamen 'VAR01' gespeichert, somit
   * ist die Abfrage von 'self.getRecipeDiff' ohne Aufschlüsselung
   * nicht möglich gewesen.
   */
  // private static globalAlias: string[];
  protected static ident: IContextMneuIdentifier[] = [
    {
      wfServername: window.rootUrlPrefix, //+ '\\i4scada', // hinter dem Servernamen DB-Pfad eingeben
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

  private static RemoveIdent() {
    if (this.ident.length > 1) {
      this.ident.pop();
    }
  }

  public static AddIdent(ident: IContextMneuIdentifier) {
    this.RemoveIdent();
    this.ident.push(ident);
  }

  public static GetIdent(): IContextMneuIdentifier {
    return this.ident[this.ident.length - 1];
  }

  public static AddSelector(selector: string[]) {
    const self = this;
    for (const select of selector) {
      $.contextMenu({
        selector: select,
        className: "css-title",
        callback: function (key: string, options) {
          if (key === "edit") {
            // Error verhindern falls es keine Rez.Variable
            if (!!options.items["alias"].items.info)
              self.editDlg(
                options.items["alias"].items.info.html,
                options.items["status"].items.info // .alias, .db2Alias
              );
            else return false; // return false verhindert das Kontextmenü schließt
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
          } else {
            // determine contextMenu position
            var offset = {
              top: -9,
              left: this.outerWidth() - 5,
            };
            $menu.css(offset);
          }
        },
        build: function ($trigger, e) {
          let sigAlias = self.ident[self.ident.length - 1].alias
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

          let separator = '{ "trenn": "---------" }';
          let quitItem = {
            trenn: "---------",
            name: "Schließen",
            icon: function () {
              return "context-menu-icon context-menu-icon-quit";
            },
          };

          let subItems = {};
          // 1. - es handelt sich um eine Variable
          if (sigAlias.length === 1) {
            let signal = sigAlias[0];

            let props = self.getSigProperty(
              self.ident[self.ident.length - 1],
              signal
            );

            return {
              items: {
                alias: {
                  className: "css-sub",
                  name: signal,
                  icon: "status",
                  items: props
                    .then((value) =>
                      self.getRecipeDiff(
                        self.ident[self.ident.length - 1],
                        value["info"].db2Alias || signal
                      )
                    )
                    .catch(() =>
                      // falls was schief läuft
                      self.getRecipeDiff(
                        self.ident[self.ident.length - 1],
                        signal
                      )
                    ),
                },
                copy: { name: "Kopieren", icon: "copy" },
                edit: {
                  name: "Bearbeiten",
                  icon: "fa-edit",
                  disabled: true, // wird async. ein/aus-geschaltet
                },
                sep1: "---------",
                status: {
                  className: "css-sub",
                  name: "Eigenschaften",
                  icon: "status",
                  items: props,
                },
                separator,
                // test: {
                //   name: "di/enable",
                //   icon: "fa-regular fa-battery-bolt",
                // callback: disableEdit,
                // },
                quit: quitItem,
              },
              //#region ToDo um die Eigenschaft- Item zu dasblen/enablen
              // events: {
              //   activated: function (options) {
              //     console.log("activated callback");
              //   },
              //   create: function (options) {
              //     console.log("create callback");
              //   },
              //   hide: function (options) {
              //     console.log("hide callback");
              //   },
              //   layer: function (options) {
              //     console.log("layer callback");
              //   },
              //   processPromises: function (options) {
              //     console.log("processPromises callback");
              //   },
              //   resize: function (options) {
              //     console.log("resize callback");
              //   },
              //   update: function (options) {
              //     console.log("update callback");
              //   },
              //   show: function (options) {
              //     console.log("show callback");
              //     // Hier können Sie dynamische Bedingungen überprüfen und Menüpunkte aktivieren oder deaktivieren
              //     if (true) {
              //       options.items.edit.disabled = true;
              //       // options.items.cut.disabled = true;
              //     } else {
              //       options.items.edit.disabled = false;
              //       // options.items.cut.disabled = false;
              //     }
              //   },
              // },
              //#endregion
            };
          }
          // 2 - es handelt sich um mehrere Variablen
          let aliasItems: string[] = [];
          for (let i = 0; i < sigAlias.length; i++) {
            aliasItems.push(
              `"sub${i + 1}":{"className":"css-sub","name":"${sigAlias[i]
              }","icon":"status","items":{"recipe":{"className":"css-sub","name":"Rezepterte","icon":"status","recipeProperty":"${sigAlias[i]
              }"},"${sigAlias[i]
              }":{"name":"Kopieren","icon":"copy"},"trennzeichen":"---------","property":{"className":"css-sub","name":"Eigenschaften","icon":"status","signalProperty":"${sigAlias[i]
              }"}}}`
            );
          }
          subItems = JSON.parse(
            aliasItems
              .toString()
              .replace(/(^.{0})/g, "{")
              .replace(/(.{0}$)/g, "}")
          );

          let getSubItems = (subItems) => {
            for (let key in subItems) {
              if (typeof subItems[key] === "object") {
                getSubItems(subItems[key]);
              } else {
                let props: Promise<any> = null;
                let diffs: Promise<any> = null;

                if (key == "recipeProperty" || key == "signalProperty") {
                  props = self.getSigProperty(
                    self.ident[self.ident.length - 1],
                    subItems[key].toString()
                  );

                  diffs = props.then((value) =>
                    self.getRecipeDiff(
                      self.ident[self.ident.length - 1],
                      value["info"].db2Alias //|| subItems[key].toString()
                    )
                  );
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
              separator,
              quit: quitItem,
            },
          };
        },
      });
    }
  }

  public static getAliasName = ($trigger: JQuery) => {
    let resolve = [];

    let el = $trigger.attr("params");
    if (el === void 0) {
      return resolve;
    }

    let m: RegExpExecArray;
    const regex = /(?:signal\w+\s*\:)(?:\[?[^\:]*\]?)(?:\,.*?|\:{0}$)/gi;

    while ((m = regex.exec(el)) !== null) {
      // Dies ist erforderlich, um Endlosschleifen zu vermeiden
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // Auf das Ergebnis kann über die `m`-Variable zugegriffen werden.
      m.forEach((match) => {
        // Parameter auf einzelteile zerpflücken
        let params = match.split(/\s*(?:[:])\s*/g);

        let aliases = params[1]
          .replace(/^\[{1}|["']|]\s*,$/g, "")
          .split(/(?:\,)/g);

        for (const alias of aliases) {
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
            resolve.push(
              alias.match(/^[$]data/g)
                ? eval(`ko.contextFor($trigger[0]).${alias}`)
                : eval(`!!ko.contextFor($trigger[0]).$data.${alias}`)
                  ? eval(`ko.contextFor($trigger[0]).$data.${alias}`)
                  : alias
            );
          } catch (error) {
            resolve.push(alias);
          }
        }
      });
    }

    return resolve;
  };

  /**
   * liefert die Rez.Infos zu gewählten Alias
   * @param alias Signalalias
   */
  private static getRecipeDiff(
    ident: IContextMneuIdentifier,
    sigAlias: string
  ) {
    return rezService
      .GetSignRecipeDifferences({
        aiWerk: ident.werk,
        aiHalle: ident.halle,
        aiEtage: ident.etage,
        aiLinie: ident.linie,
        aiAbteil: ident.abteiNr || -1,
        aiMasch: ident.maschine || -1,
        asSigAlias: sigAlias,
      })
      .then((resp) => {
        if (resp.GetSignalRezInfoResult.Succeed)
          return resp.GetSignalRezInfoResult.Data;
        else throw new Error(resp.GetSignalRezInfoResult.ErrorMsg);
      })
      .then((data: { data: string | any[] }) => {
        // 1. - keine Daten vorhanden
        if (data.data.length == 0) {
          return {
            error: {
              type: "html",
              html: `<span style='color: tomato;'>Alias ist n. in Rez-DB vorhanden!<br><br>W:${ident.werk},H:${ident.halle},E:${ident.etage},L:${ident.linie},A:${ident.abteiNr},M:${ident.maschine}</span>`,
            },
          };
        }
        // 2. - Daten sind da
        // Edit-Item enablen
        $(".fa-edit.context-menu-disabled").removeClass(
          "context-menu-disabled"
        );
        let row = "",
          sel = "";
        $.each(data.data, (i, l) => {
          let rezparam = JSON.stringify({
            reznr: l.recipeNumber,
            rezver: l.recipeVersion,
          });
          row += `<tr title="${l.recipeName} - ${l.recipeNumber}[${l.recipeVersion}]"><td>${l.recipeName}</td><td>${l.recipeNumber}</td><td>${l.recipeVersion}</td><td id="rezVal_${i}" data-rezparam=${rezparam}>${l.recipeValue}</td></tr>`;
          sel += `<option value="${l.recipeNumber}"></option>`;
        });
        const tabId = uuid.v4();
        return {
          info: {
            type: "html",
            html: `<script>function filter(selValue) {const value = selValue == 'Alle' ? '' : selValue.toLowerCase(); const t = $('#${tabId} tr');for (var key in t) {if (t.hasOwnProperty(key)) {$(t[key]).toggle($(t[key]).text().toLowerCase().indexOf(value) > -1);$(t).filter(t[key]);}}}</script><style>table th {padding-inline: 1em;background-color:gainsboro;} table th:first-child {padding-inline:6em;}thead tr{position:-webkit-sticky;position:sticky;top:0;}</style><div style="font-weight:bold;">Filter&nbsp<input type="search" list="Filter" placeholder="z.B. 001" oninput="filter(this.value)" style="font-weight:normal"><datalist id="Filter">${sel}</datalist></div><hr><div style="max-height:20em;overflow:auto; display:grid;"><table frame="void" rules="all" white-space:nowrap;><thead><tr><th title="W:${ident.werk}, H:${ident.halle}, E:${ident.etage}, L:${ident.linie}, A:${ident.abteiNr}, M:${ident.maschine}">Rezeptname</th><th title="Rezeptnummer">Nummer</th><th title="Rezeptversion">Ver.</th><th title="Rezeptwert">Wert</th></tr></thead><tbody id="${tabId}">${row}</tbody></table></div>`,
          },
        };
      })
      .catch((ex: { message: any }) => {
        return {
          error: {
            type: "html",
            html: `<span style="color: tomato;">${ex.message}</span>`,
          },
        };
      });
  }

  /**
   * liefert die Rez.Infos zu gewählten Alias
   * @param alias Signalalias
   */
  public static GetSignRecipeValues(
    ident: IContextMneuIdentifier,
    sigAlias: string[],
    RezNr: string,
    RezVer: number
  ) {
    return rezService
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
      .then((resp) => {
        if (resp.GetSignalRezValueResult.Succeed)
          return resp.GetSignalRezValueResult.Data;
        else throw new Error(resp.GetSignalRezValueResult.ErrorMsg);
      })
      .then((data: { data: [{ aliasName: string; recipeValue: string }] }) => {
        return data.data;
      })
      .catch((ex) => {
        return Promise.reject(ex);
      });
  }

  /**
   * liefert Signaleigenschaften zu dem Alias
   * @param alias Signalalias
   */
  private static getSigProperty(
    ident: IContextMneuIdentifier,
    sigAlias: string
  ) {
    return rezService
      .GetSignalProperty({
        asWfServer: ident.wfServername,
        asWfDb: ident.wfDbName,
        asSigAlias: sigAlias,
      })
      .then((resp) => {
        if (resp.GetSignalPropertyResult.Succeed) {
          return resp.GetSignalPropertyResult.Data;
        } else throw new Error(resp.GetSignalPropertyResult.ErrorMsg);
      })
      .then((data: { data: string | any[] }) => {
        if (data.data.length == 0) {
          return {
            error: {
              type: "html",
              html: `<span style='color: tomato;'>Alias ist n. in WF-DB vorhanden!<br><br>Servername:'${ident.wfServername}'<br>DB:'${ident.wfDbName}'</span>`,
              alias: "",
              db2Alias: "",
            },
          };
        }
        let row = "",
          alias = "",
          globalAlias = "",
          description = "",
          factor = "";
        $.each(data.data, function (i, l) {
          // Zeile mit globalen Aliasnamen erzeugen, wenn das Feld nicht leer ist
          alias = l.Alias;
          globalAlias = l.Db2Alias;
          description = l.Beschreibung;
          factor = l.Factor;
          let gAlias = !!l.Db2Alias
            ? `<tr><td style="font-weight: bold;">DB2Alias</td><td>${l.Db2Alias}</td></tr>`
            : "";

          row += `<tr><td style="font-weight: bold;">Addr.</td><td>${l.Signalname}</td></tr><tr><td style="font-weight: bold;">Alias</td><td>${l.Alias}</td></tr>${gAlias}<tr><td style="font-weight: bold;">Beschr.</td><td>${l.Beschreibung}</td></tr><tr><td style="font-weight: bold;">Einh.</td><td>${l.Einheit}</td></tr><tr><td style="font-weight: bold;">Min.</td><td>${l.Min}</td></tr><tr><td style="font-weight: bold;">Max.</td><td>${l.Max}</td></tr><tr><td style="font-weight: bold;">Faktor</td><td>${l.Factor}</td></tr>`;
        });
        return {
          info: {
            type: "html",
            html: `<div><table border="1" frame="void" rules="all" cellpadding="5"><thead></thead><tbody>${row}</tbody></table></div>`,
            alias,
            db2Alias: globalAlias,
            description,
            factor,
          },
        };
      })
      .catch((ex: { message: any }) => {
        return {
          error: {
            type: "html",
            html: `<span style="color: tomato;">${ex.message}</span>`,
            alias: "",
            db2Alias: "",
          },
        };
      });
  }

  /** Max. zIndex von dem bevorstehnden Element ermitteln*/
  public static zIndex($t: JQuery) {
    var zin = 0,
      $tt = $t.prevAll();

    while (true) {
      zin = Math.max(zin, parseInt($tt.css("z-index"), 10) || 0);
      $tt = $tt.children();
      if (
        !$tt ||
        !$tt.length ||
        "html body".indexOf($tt.prop("nodeName").toLowerCase()) > -1
      ) {
        break;
      }
    }
    return zin;
  }
  // $.contextMenu.defaults.events.preShow()

  /** Max. zIndex ermittlen */
  public static zMax() {
    let maxZ = Math.max.apply(
      null,
      $.map($("body *"), function (e, n) {
        return parseInt($(e).css("z-index")) || 1;
      })
    );
    return maxZ;
  }

  // Quelle - https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
  private static copyToClipboard = (str: string) => {
    const el = document.createElement("textarea"); // Create a <textarea> element
    el.value = str; // Set its value to the string that you want copied
    el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
    el.style.position = "absolute";
    el.style.left = "-9999px"; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected =
      document.getSelection().rangeCount > 0 // Check if there is any content selected previously
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

  // Beispiel Aufruf des 'editDlg'
  private static async editDlg(html: string, info: JSON) {
    let response: boolean = false;
    try {
      let login = await LogInOut.logIn();
      if (login.state !== 1) return;
      // info-Objekt um 'user'-Eigenschaft erweitern
      info["user"] = login.vorname + " " + login.nachname;
      let dlgLoginResult = (await dialog.show(
        new cwDlgRezEdit(html, info, this.ident)
      )) as IDlgRezEdit;
      if (dlgLoginResult.state === 0) {
        return;
      }
    } catch (error) {
      let [response, dispose] = await dialog.show(
        new MsgBox("Error", "Fehler", "Tomato")
      );
      dispose();
    } finally {
      // Rückgabe Verarbeiten
      return response;
    }
  }
}
export = CcwContextmenu;

class LogInOut {
  private static dlgResult: IDlgRespLogInOut;
  /**
   * Login/out -Funktion
   * @returns true, bei der erfogreicher Anmeldung
   */
  static async logIn(): Promise<IDlgRespLogInOut> {
    let self = this;
    let defaultResp: IDlgRespLogInOut = {
      vorname: "",
      nachname: "",
      usberez: "",
      usid: "",
      state: 0,
    };
    try {
      // wenn der Timer noch läuft, dann nachtriggern und weiter
      if (logoutTimer.timer.getState()) {
        logoutTimer.timer.restart();
        return Promise.resolve(self.dlgResult);
      }

      self.dlgResult = (await dialog.show(
        new LoginDialog()
      )) as IDlgRespLogInOut;
      if (self.dlgResult.state === 1) {
        // self.adminIsLogged(true);
        // self.adminName(`${dlgResult.vorname} ${dlgResult.nachname}`);

        logoutTimer.timer.start();
        // logoutTimer.timer.start((timeCode: string, state: boolean) =>
        //   console.log(timeCode, state)
        // );

        return Promise.resolve(self.dlgResult);
      } else {
        return Promise.resolve(defaultResp);
      }
    } catch (error) {
      // Log.Add(
      //   "Fehler beim Anmelden" + " - " + error.toString(),
      //   LogType.Abbruch_durch_Programmfehler
      // );
      await dialog.show(
        new MsgBox("Fehler beim User-Logging", error, "Tomato")
      );
      return Promise.resolve(defaultResp);
    }
  }

  // /** schreibt Log in die Datenbank
  //  * @param msg Log-Message
  //  * @param logType Meldungstyp
  //  */
  // static AddLog(msg: string, logType: LogType): void {
  //   const self = this;

  //   Log.Add(
  //     parseInt(self.spsValue),
  //     JSON.stringify(self.ident),
  //     "`${self.userInfo()}; Admin: ${self.adminName()}`",
  //     logType,
  //     msg,
  //     "self.selectedPaNr()",
  //     "self.selectedRecipe.Nr()",
  //     "",
  //     "self.selectedRecipeVer()"
  //   ).catch((error) => Logger.errorToast(error));
  // }
}

class logoutTimer {
  /** Timersteuerung Restlaufzeit */
  static timer = {
    _tId: null, // zugewiesene Timer - ID
    _cb: null, // callback - Fnkt.
    _duration: null, // berechnete Restlaufzeit
    _min: 3, // init. Zeit 00:03:00
    _sec: 0,
    isOnFlag: false,

    /**
     * Start Timer Restlaufzeit
     * @param cb Callback Fnkt. wird nach Ablauf der Zeit ausgeführt
     */
    start: (cb?: Function) => {
      const self = logoutTimer.timer;

      self.stop();
      self._cb = typeof cb === "function" ? cb : null;

      self._duration = moment.duration({
        seconds: self._sec,
        minutes: self._min,
      });
      self.isOnFlag = true;
      self._tId = setInterval(() => {
        self._duration = moment.duration(
          self._duration.asSeconds() - 1,
          "seconds"
        );

        if (self._duration.asMilliseconds() <= 0) {
          self.isOnFlag = false;
          self.stop();
        }
        // Callback-Fnkt. aufrufen
        if (typeof self._cb === "function")
          self._cb(
            moment(self._duration.asMilliseconds()).format("mm:ss"),
            self.isOnFlag
          );
      }, 1000);
    },
    /**
     * Timerstatus
     * @returns true, wenn der Timer läuft
     */
    getState: () => logoutTimer.timer.isOnFlag,
    /** Restart Timer Restlaufzeit */
    restart: () => {
      const self = logoutTimer.timer;
      if (typeof self._cb === "function") {
        self._duration = moment.duration({
          seconds: self._sec,
          minutes: self._min,
        });
      }
    },
    /** Stopp Timer Restlaufzeit */
    stop: () => {
      const self = logoutTimer.timer;

      clearInterval(self._tId);
      self._tId = null;
      if (typeof self._cb === "function") self._cb("00:00", false);
      self._cb = null;
    },
  };
}
