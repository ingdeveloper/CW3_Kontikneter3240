String.prototype.format = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return this.replace(/{(\d+)}/g, function (match, placeholder) { return (typeof args[placeholder] != 'undefined' ? args[placeholder] : match); });
};
//# sourceMappingURL=_wf.extensions.string.js.map