declare namespace d3 {
    export function localizedNumberFormat(specifier: string): (n: number) => string;
    export function localizedTimeFormat(specifier: string): time.Format;
    export function localizedTimeFormatUTC(specifier: string): time.Format;
}