(function(moment) {

    moment.fn.forceUTC = function() {
        return this.add(this.utcOffset(), "minutes");
    };
    moment.fn.toUTCISOString = function() {
        var array = this.toArray();

        return moment.utc(array).toISOString();
    };
})(moment);