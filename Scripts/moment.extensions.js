(function (moment) {
    moment.fn.toDateTimeOffset = function () {
        var clone = this.clone().utc();

        var dto = {
            dateTime: clone,
            offsetMinutes: this.utcOffset()  /* Offset 60 minutes added by AH */
        };

        return dto;
    };

    moment.fn.toMSDateTimeOffset = function () {
        var dateTimeOffset = this.toDateTimeOffset();

        var dto = {
            DateTime: dateTimeOffset.dateTime.toMSDate(),
            OffsetMinutes: dateTimeOffset.offsetMinutes
        };

        return dto;
    };

    moment.fn.minimumMSDateTimeOffset = function () {
        var momentObject = moment("1900-01-01");

        return momentObject.toMSDateTimeOffset();
    };

    moment.fn.maximumMSDateTimeOffset = function () {
        var momentObject = moment().add(100, "years");

        return momentObject.toMSDateTimeOffset();
    };

    moment.fn.toMSDate = function () {
        return '/Date(' + this.toDate().getTime() + ')/';
    };

})(moment);