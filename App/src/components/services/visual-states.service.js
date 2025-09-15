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
define(["require", "exports", "./states.service"], function (require, exports, StatesService) {
    "use strict";
    var VisualStatesService = /** @class */ (function (_super) {
        __extends(VisualStatesService, _super);
        function VisualStatesService(settings) {
            var _this = _super.call(this, settings) || this;
            _this.createCssStates(settings);
            _this.createSymbolicTextStates(settings);
            _this.initializeComputeds();
            _this.currentStatesModels.subscribe(function (items) {
                items.map(function (x, i) {
                    x.cssClassName = _this.cssClassNames[i];
                    x.symbolicText = _this.symbolicTexts[i];
                    return x;
                });
            });
            ko.computed(function () {
                _this.currentStateModel().cssClassName = _this.getCssClassName();
                _this.currentStateModel().symbolicText = _this.getSymbolicText();
            });
            return _this;
        }
        VisualStatesService.prototype.createSymbolicTextStates = function (settings) {
            var _this = this;
            this.symbolicTexts = [settings.symbolicTextNormalState];
            if (_.any(settings.states)) {
                _.each(settings.states, function (state) {
                    _this.symbolicTexts.push(state.symbolicText);
                });
            }
            else if (!Array.isArray(settings.symbolicTexts)) {
                this.symbolicTexts.push(settings.symbolicTextState1);
                this.symbolicTexts.push(settings.symbolicTextState2);
                this.symbolicTexts.push(settings.symbolicTextState3);
                this.symbolicTexts.push(settings.symbolicTextState4);
                this.symbolicTexts.push(settings.symbolicTextState5);
                this.symbolicTexts.push(settings.symbolicTextState6);
                this.symbolicTexts.push(settings.symbolicTextState7);
                this.symbolicTexts.push(settings.symbolicTextState8);
            }
            else {
                this.symbolicTexts.push.apply(this.symbolicTexts, settings.symbolicTexts);
            }
            this.replacePlaceholderObjectID(this.symbolicTexts, settings.objectID);
        };
        VisualStatesService.prototype.createCssStates = function (settings) {
            var _this = this;
            this.cssClassNames = [settings.cssClassNormalState || "normal"];
            if (_.any(settings.states)) {
                _.each(settings.states, function (state) {
                    _this.cssClassNames.push(state.cssClassName);
                });
            }
            else if (!Array.isArray(settings.cssClassStates)) {
                this.cssClassNames.push(settings.cssClassState1 || "state1");
                this.cssClassNames.push(settings.cssClassState2 || "state2");
                this.cssClassNames.push(settings.cssClassState3 || "state3");
                this.cssClassNames.push(settings.cssClassState4 || "state4");
                this.cssClassNames.push(settings.cssClassState5 || "state5");
                this.cssClassNames.push(settings.cssClassState6 || "state6");
                this.cssClassNames.push(settings.cssClassState7 || "state7");
                this.cssClassNames.push(settings.cssClassState8 || "state8");
            }
            else {
                this.cssClassNames.push.apply(this.cssClassNames, settings.cssClassStates);
            }
        };
        VisualStatesService.prototype.initializeComputeds = function () {
            var _this = this;
            _super.prototype.initializeComputeds.call(this);
            this.statusCssClass = ko.pureComputed(function () {
                var stateNumber = ko.unwrap(_this.currentStateIndex);
                var cssClass = _.isNaN(stateNumber) ||
                    stateNumber >= _this.cssClassNames.length ?
                    _this.cssClassNames[0] :
                    _this.cssClassNames[stateNumber];
                return cssClass;
            });
            this.statusText = ko.pureComputed(function () {
                var stateNumber = ko.unwrap(_this.currentStateIndex);
                var stateText = _.isNaN(stateNumber) ||
                    stateNumber >= _this.symbolicTexts.length ?
                    _this.symbolicTexts[0] :
                    _this.symbolicTexts[stateNumber];
                return stateText;
            });
            this.css = ko.pureComputed(function () {
                return _this.currentState() + " " + _this.statusCssClass();
            }, this);
            this.multipleCss = ko.pureComputed(function () {
                var e_1, _a;
                var currentStates = "";
                var currentStatesIndex = ko.unwrap(_this.currentStatesIndex);
                if (currentStatesIndex === null || currentStatesIndex === undefined || currentStatesIndex.length === 0) {
                    return _this.cssClassNames[0] + " state" + 0;
                }
                try {
                    for (var currentStatesIndex_1 = __values(currentStatesIndex), currentStatesIndex_1_1 = currentStatesIndex_1.next(); !currentStatesIndex_1_1.done; currentStatesIndex_1_1 = currentStatesIndex_1.next()) {
                        var index = currentStatesIndex_1_1.value;
                        var cssClass = _this.cssClassNames[index + 1];
                        if (cssClass) {
                            currentStates = currentStates + " state" + (index + 1) + " " + cssClass;
                        }
                        else {
                            currentStates = currentStates + " state" + (index + 1);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (currentStatesIndex_1_1 && !currentStatesIndex_1_1.done && (_a = currentStatesIndex_1.return)) _a.call(currentStatesIndex_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return currentStates;
            }, this);
        };
        VisualStatesService.prototype.getCssClassName = function () {
            return this.cssClassNames[0];
        };
        VisualStatesService.prototype.getSymbolicText = function () {
            return this.symbolicTexts[0];
        };
        return VisualStatesService;
    }(StatesService));
    return VisualStatesService;
});
//# sourceMappingURL=visual-states.service.js.map