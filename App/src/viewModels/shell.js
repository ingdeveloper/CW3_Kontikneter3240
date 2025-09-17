// import { userLogHandle } from "./cowi/services/logonHandling";
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
define(["require", "exports", "plugins/router", "./viewModelBase", "../../src/viewModels/cowi/services/ccw-contextmenu"], function (require, exports, router, ViewModelBase, CcwContextmenu) {
    "use strict";
    var Shell = /** @class */ (function (_super) {
        __extends(Shell, _super);
        function Shell() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.router = router;
            _this.navbarClass = ko.observable("navbar-left"); // "navbar-left" for left sidebar navigation is also implemented
            return _this;
        }
        Shell.prototype.activate = function () {
            router
                .map([
                { route: "rezepturVMI/:id", title: "Rezepte Kontikneter", moduleId: "src/viewModels/cowi/rezepturVMI", nav: false, settings: { iconClass: "wf wf-logtag-1 ccw-color-light-blue" } },
                { route: "rezepturLinie/:id", title: "Rezepte Linie", moduleId: "src/viewModels/cowi/rezepturLinie", nav: false, settings: { iconClass: "wf wf-logtag-1 ccw-color-light-blue" } },
            ])
                .buildNavigationModel();
            this.checkLocalAppSettings();
            this.info("Application loaded!");
            CcwContextmenu.AddIdent({
                wfServername: window.rootUrlPrefix + "\\I4SCADA",
                wfDbName: "broet3240",
                werk: 2,
                halle: 3,
                etage: 2,
                linie: 4,
                abteiNr: 250,
                maschine: 11,
                anlagenNr: 7324020,
            });
            CcwContextmenu.AddSelector([
                "wf-value",
                "wf-value-display",
                "wf-meter",
                "wf-gauge-1",
                "wf-arc",
                "wf-bargraph",
                "wf-state-indicator",
                "wf-sensor",
                "wf-state-text",
                "wf-watchdog",
                "wf-signal-information",
                "wf-signal-information-popover",
                "wf-button",
                "wf-toggle-button",
                "wf-radio-buttons",
                "wf-switch",
                "wf-input",
                "wf-slider",
                "wf-date-time-picker",
                "wf-switch-3-states",
                "ccw-wf-input-tastatur",
                "ccw-wf-value",
                "ccw-wf-date-time-picker-s7dt",
                "ccw-wf-date-time-picker-s7datetime",
                "ccw-wf-date-time-picker-s7time",
                "ccw-wf-motor0",
                "ccw-wf-motor",
                "ccw-wf-motor0a",
                "ccw-wf-fan0",
                "ccw-wf-pump0",
                "ccw-wf-ventil2",
                "ccw-wf-weiche0",
                "ccw-wf-shape",
                "ccw-wf-on-off-switch",
                "ccw-wf-bargraph",
                "ccw-bargraph",
                "ccw-wf-action",
                "ccw-load-svg",
                "ccw-wf-fan2",
                "ccw-wf-input-tastatur-2",
                "ccw-wf-ventil2b",
                "ccw-wf-ventil2c",
                "ccw-wf-chart-1",
                "ccw-wf-motor3",
                "ccw-wf-ventil4",
                ".ccw_context",
                'rez-info',
                'rez-dlg',
                'rez-dlg-ofen',
                'rez-dlg-rez-only',
            ]);
            return router.activate();
        };
        Shell.prototype.compositionComplete = function () {
            // userLogHandle;
        };
        Shell.prototype.setNavbarType = function (typeClass) {
            if (typeClass) {
                this.navbarClass(typeClass);
                $.cookie("wf_navbarClass", typeClass);
            }
            else {
                this.navbarClass(null);
                $.cookie("wf_navbarClass", null);
            }
        };
        // Check if navigation bar class is stored in cookies and use the class it is present
        Shell.prototype.checkLocalAppSettings = function () {
            var storedClassName = $.cookie("wf_navbarClass");
            if (!storedClassName) {
                $.cookie("wf_navbarClass", this.navbarClass(), { expires: 7 });
            }
            else {
                this.navbarClass(storedClassName);
            }
        };
        return Shell;
    }(ViewModelBase));
    return Shell;
});
//# sourceMappingURL=shell.js.map