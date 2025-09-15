define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Pages = exports.UserType = exports.Action = exports.SortOrder = void 0;
    var SortOrder;
    (function (SortOrder) {
        SortOrder["Asc"] = "asc";
        SortOrder["Desc"] = "desc";
    })(SortOrder = exports.SortOrder || (exports.SortOrder = {}));
    var Action;
    (function (Action) {
        Action["Add"] = "add";
        Action["Edit"] = "edit";
    })(Action = exports.Action || (exports.Action = {}));
    var UserType;
    (function (UserType) {
        UserType["Scada"] = "scada";
        UserType["Domain"] = "domain";
    })(UserType = exports.UserType || (exports.UserType = {}));
    var Pages;
    (function (Pages) {
        Pages["Users"] = "users";
        Pages["AuthorizationGroups"] = "authorizationGroups";
        Pages["ProjectAuthorizations"] = "projectAuthorizations";
        Pages["AccessGroups"] = "accessGroups";
        Pages["AccessAuthorizations"] = "accessAuthorizations";
        Pages["UserActions"] = "userActions";
    })(Pages = exports.Pages || (exports.Pages = {}));
});
//# sourceMappingURL=wf-um-enyms.js.map