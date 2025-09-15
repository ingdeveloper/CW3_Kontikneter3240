define(["require", "exports"], function (require, exports) {
    "use strict";
    var ErrorCodeService = /** @class */ (function () {
        function ErrorCodeService() {
        }
        ErrorCodeService.loginErrorCodes = {
            "-404": "I4SCADA_User_login_cannot_obtain_current_logged_in_user_name",
            "-4082": "I4SCADA_User_login_failed_the_number_of_failed_logins_exceeded_Username_blocked",
            "-4086": "I4SCADA_User_login_failed_invalid_command_syntax",
            "-4087": "I4SCADA_User_login_failed_expired_password",
            "-4089": "I4SCADA_User_login_failed_internal_server_error",
            "-4090": "I4SCADA_User_login_failed_max_count_reached",
            "-4091": "I4SCADA_User_login_failed_invalid_username_or_password",
            "-4092": "I4SCADA_User_login_already_logged_on",
            "-4094": "I4SCADA_User_login_failed_invalid_username_or_password"
        };
        ErrorCodeService.acknowledgmentErrorCodes = {
            "-4091": "I4SCADA_Acknowledgment_failed_WriteSecureInvalidPassword",
            "-4093": "I4SCADA_Acknowledgment_failed_NoAccessRight",
            "-4094": "I4SCADA_Acknowledgment_failed_NotLoggedIn"
        };
        ErrorCodeService.signalWriteErrorCodes = {
            "-4088": "I4SCADA_Signal_write_Signal_is_write_protected",
            "-4089": "I4SCADA_Signal_write_Unspecified_server_error",
            "-4093": "I4SCADA_Signal_write_Insufficient_user_authorizations",
            "-4094": "I4SCADA_Signal_write_No_user_logged_in"
        };
        return ErrorCodeService;
    }());
    return ErrorCodeService;
});
//# sourceMappingURL=errorCodeService.js.map