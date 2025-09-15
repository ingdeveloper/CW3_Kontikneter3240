interface IC3Format {
    y?: any
}

interface IC3Padding {
    top?: number;
    bottom?: number;
    left?: number;    
    right?: number;
}

interface IC3Labels {
    show?: boolean;
    format?: IC3Format;
    padding?: IC3Padding;
}

interface IC3ChartData {
    x?: any;
    xs?: any;
    xFormat?: string;
    columns: any[][];
    type?: string;
    types?: string[];
    labels?: IC3Labels;
    
    color?: (color, d) => any;
    onclick?: (data: any) => any;
    hide?: string[];
    groups?: string[][];
    order?: any;
}