define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DialogToolboxButtons = exports.ToolboxButtons = void 0;
    var ToolboxButtons;
    (function (ToolboxButtons) {
        ToolboxButtons[ToolboxButtons["PauseResume"] = 0] = "PauseResume";
        ToolboxButtons[ToolboxButtons["TimeSettings"] = 1] = "TimeSettings";
        ToolboxButtons[ToolboxButtons["Export"] = 2] = "Export";
        ToolboxButtons[ToolboxButtons["LoadConfiguration"] = 3] = "LoadConfiguration";
        ToolboxButtons[ToolboxButtons["SaveConfiguration"] = 4] = "SaveConfiguration";
        ToolboxButtons[ToolboxButtons["Back"] = 5] = "Back";
        ToolboxButtons[ToolboxButtons["Forward"] = 6] = "Forward";
        ToolboxButtons[ToolboxButtons["Devider"] = 7] = "Devider";
    })(ToolboxButtons = exports.ToolboxButtons || (exports.ToolboxButtons = {}));
    var DialogToolboxButtons;
    (function (DialogToolboxButtons) {
        DialogToolboxButtons[DialogToolboxButtons["Axes"] = 0] = "Axes";
        DialogToolboxButtons[DialogToolboxButtons["Data"] = 1] = "Data";
        DialogToolboxButtons[DialogToolboxButtons["Regions"] = 2] = "Regions";
        DialogToolboxButtons[DialogToolboxButtons["Devider"] = 3] = "Devider";
    })(DialogToolboxButtons = exports.DialogToolboxButtons || (exports.DialogToolboxButtons = {}));
});
//# sourceMappingURL=toolbox-params.model.js.map