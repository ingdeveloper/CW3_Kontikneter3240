if (typeof (isNullOrUndefined) === "undefined") {
    isNullOrUndefined = function (obj) {
        if (obj === undefined || obj === null) {
            return true;
        }
        return false;
    };
}
if (typeof (evaluateCondition) === "undefined") {
    evaluateCondition = function (param1, param2, operator) {
        switch (operator) {
            case "==":
                return param1 == param2;
            case "!=":
                return param1 != param2;
            case "<":
                return param1 < param2;
            case ">":
                return param1 > param2;
            case "<=":
                return param1 <= param2;
            case ">=":
                return param1 >= param2;
            default:
                return false;
        }
    };
}
//# sourceMappingURL=wf.extensions.js.map