define(["require", "exports"], function (require, exports) {
    "use strict";
    var CheckBoxObs = /** @class */ (function () {
        function CheckBoxObs(item, textProperty) {
            this.Selected = ko.observable(false);
            this.Name = textProperty ? item[textProperty] : item.Name;
            this.ID = item.ID;
        }
        return CheckBoxObs;
    }());
    return CheckBoxObs;
});
//# sourceMappingURL=wf-um-check-box-obs-model.js.map