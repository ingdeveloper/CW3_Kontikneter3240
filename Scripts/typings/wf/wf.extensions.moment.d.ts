declare type DateTime = string;

declare module moment {   
    interface DateTimeOffset {
        dateTime: Moment;
        offsetMinutes: number;
    }

    interface MSDateTimeOffset {
        DateTime: DateTime;
        OffsetMinutes: number;
    }

    interface Moment {
        toDateTimeOffset(): DateTimeOffset;

        toMSDateTimeOffset(): MSDateTimeOffset;

        minimumMSDateTimeOffset(): MSDateTimeOffset;

        maximumMSDateTimeOffset(): MSDateTimeOffset;

        toMSDate(): DateTime;
    }
}