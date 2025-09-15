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
define(["require", "exports", "../viewModelBase"], function (require, exports, ViewModelBase) {
    "use strict";
    var ExamplesNavigation = /** @class */ (function (_super) {
        __extends(ExamplesNavigation, _super);
        function ExamplesNavigation() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.items = [{
                    url: '#test',
                    icon: 'wf wf-parent-unit',
                    text: 'VW_Werksübersicht',
                    active: false,
                }, {
                    url: '#test',
                    icon: 'wf wf-parent-unit',
                    text: 'Halle 12',
                    active: false
                }, {
                    url: '#test',
                    icon: 'wf wf-parent-unit',
                    text: 'Halle 12 Ebenen',
                    active: true,
                    childItems: [
                        {
                            url: '#test',
                            icon: 'wf wf-room3',
                            text: 'Ebene 1',
                            active: false
                        }, {
                            url: '#test',
                            icon: 'wf wf-room3',
                            text: 'Ebene 2',
                            active: false
                        }, {
                            url: '#test',
                            icon: 'wf wf-room3',
                            text: 'Ebene 3',
                            active: false
                        }
                    ]
                }, {
                    url: '#test',
                    icon: 'wf wf-room3',
                    text: 'Bereich 34',
                    active: false
                }];
            return _this;
        }
        return ExamplesNavigation;
    }(ViewModelBase));
    return ExamplesNavigation;
});
//# sourceMappingURL=examplesNavigation.js.map