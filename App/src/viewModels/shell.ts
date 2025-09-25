// import { userLogHandle } from "./cowi/services/logonHandling";

import router = require("plugins/router");
import ViewModelBase = require("./viewModelBase");

import CcwContextmenu = require("./cowi/services/ccw-contextmenu");

declare let window: any;
class Shell extends ViewModelBase {
  private router = router;
  private navbarClass = ko.observable("navbar-left"); // "navbar-left" for left sidebar navigation is also implemented

  public activate() {
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
  }

  public compositionComplete() {
    // userLogHandle;
  }

  public setNavbarType(typeClass: string) {
    if (typeClass) {
      this.navbarClass(typeClass);
      $.cookie("wf_navbarClass", typeClass);
    } else {
      this.navbarClass(null);
      $.cookie("wf_navbarClass", null);
    }
  }

  // Check if navigation bar class is stored in cookies and use the class it is present
  public checkLocalAppSettings() {
    const storedClassName = $.cookie("wf_navbarClass");
    if (!storedClassName) {
      $.cookie("wf_navbarClass", this.navbarClass(), { expires: 7 });
    } else {
      this.navbarClass(storedClassName);
    }
  }
}

export = Shell;
