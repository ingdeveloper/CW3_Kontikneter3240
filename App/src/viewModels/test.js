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
define(["require", "exports", "./viewModelBase"], function (require, exports, ViewModelBase) {
    "use strict";
    var Test = /** @class */ (function (_super) {
        __extends(Test, _super);
        function Test() {
            var _this = _super.call(this) || this;
            _this.switchTypes = ko.observableArray([
                { switchType: 'switch-gear-base' },
                { switchType: 'switch-gear-feed' },
                { switchType: 'switch-gear-measuments' },
                { switchType: 'switch-gear-measuments out' },
                { switchType: 'switch-gear-box' },
                { switchType: 'switch-gear-box-fuse' },
                { switchType: 'switch-gear-box-fuse out' },
                { switchType: 'switch-gear-switch closed' },
                { switchType: 'switch-gear-switch opened' },
                { switchType: 'switch-gear-breaker opened' },
                { switchType: 'switch-gear-breaker closed' },
                { switchType: 'switch-gear-disconector opened' },
                { switchType: 'switch-gear-disconector closed' },
                { switchType: 'switch-gear-switch-disconector opened' },
                { switchType: 'switch-gear-switch-disconector closed' },
                { switchType: 'switch-gear-fuse-disconector opened fuse-blown' },
                { switchType: 'switch-gear-fuse-disconector closed fuse-intact' },
                { switchType: 'switch-gear-fuse-switch-disconector-1 opened fuse-intact' },
                { switchType: 'switch-gear-fuse-switch-disconector-1 closed fuse-intact' },
                { switchType: 'switch-gear-fuse-switch-disconector-2 opened fuse-intact' },
                { switchType: 'switch-gear-fuse-switch-disconector-2 closed fuse-blown' },
            ]);
            _this.switchExamples = ko.observableArray([
                { switchType: 'switch-gear-feed switch-gear-measuments', state1: 'in green', state2: 'out error' },
                { switchType: 'switch-gear-feed switch-gear-box switch-gear-switch', state1: 'closed in green', state2: 'opened out error' },
                { switchType: 'switch-gear-base switch-gear-box switch-gear-breaker', state1: 'in closed critical', state2: 'out opened blue' },
                { switchType: 'switch-gear-base switch-gear-box switch-gear-switch-disconector', state1: 'closed in green', state2: 'opened out error' },
                { switchType: 'switch-gear-base switch-gear-box switch-gear-disconector', state1: 'closed in green', state2: 'opened out error' },
                { switchType: 'switch-gear-base switch-gear-box switch-gear-fuse-disconector', state1: 'closed in green fuse-intact', state2: 'opened out error fuse-blown' },
                { switchType: 'switch-gear-base switch-gear-box switch-gear-fuse-switch-disconector-1', state1: 'closed in green fuse-intact', state2: 'opened out error fuse-blown' },
                { switchType: 'switch-gear-base switch-gear-box-fuse switch-gear-fuse-switch-disconector-2', state1: 'closed in green fuse-intact', state2: 'opened out error fuse-blown' }
                // {switchType:'switch-gear-feed'},
                // {switchType:'switch-gear-measuments'},
                // {switchType:'switch-gear-measuments out'},
                // {switchType:'switch-gear-box'},
                // {switchType:'switch-gear-box-fuse'},
                // {switchType:'switch-gear-box-fuse out'},
                // {switchType:'switch-gear-switch closed'},
                // {switchType:'switch-gear-switch opened'},
                // {switchType:'switch-gear-breaker opened'},
                // {switchType:'switch-gear-breaker closed'},
                // {switchType:'switch-gear-disconector opened'},
                // {switchType:'switch-gear-disconector closed'},
                // {switchType:'switch-gear-switch-disconector opened'},
                // {switchType:'switch-gear-switch-disconector closed'},
                // {switchType:'switch-gear-fuse-disconector opened'},
                // {switchType:'switch-gear-fuse-disconector closed'}, 
                // {switchType:'switch-gear-fuse-switch-disconector-1 opened'},
                // {switchType:'switch-gear-fuse-switch-disconector-1 closed'}, 
                // {switchType:'switch-gear-fuse-switch-disconector-2 opened'},
                // {switchType:'switch-gear-fuse-switch-disconector-2 closed'}, 
            ]);
            return _this;
        }
        Test.prototype.activate = function () {
        };
        ;
        return Test;
    }(ViewModelBase));
    return Test;
});
//# sourceMappingURL=test.js.map