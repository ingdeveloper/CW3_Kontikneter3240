import { ArraySignalType } from "./array-signal-type";
import { ArrayValueType } from "./array-value-type";
import { UndefinedValueHandling } from "./undefined-value-handling";
import { OutputWriteBufferingMode } from "./output-write-buffering-mode";

export interface IWfLocalArraySplitterParams extends IUtilityComponentBaseParams {
    inputSignalName: string;
    inputArrayType?: ArraySignalType;
    inputArrayLeftDelimiter?: string;
    inputArrayRightDelimiter?: string;
    inputArrayElementSeparator?: string;
    inputArrayElementQuote?: string;
    inputArrayStripWhitespace?: boolean;
    arrayValueType?: ArrayValueType;
    arrayMaxSize?: number;
    arrayMinSize?: number;
    arrayNameTemplate?: string;
    outputSignalName?: string;
    outputArrayType?: ArraySignalType;
    outputArrayLeftDelimiter?: string;
    outputArrayRightDelimiter?: string;
    outputArrayElementSeparator?: string;
    outputArrayElementQuote?: string;
    outputKeepNulls?: boolean;
    undefinedValueHandling?: UndefinedValueHandling;
    undefinedDefaultValue?: any;
    outputWriteBufferingMode?: OutputWriteBufferingMode;
    outputWriteBufferingInterval?; number;
    outputWriteTriggerSignalName?: string;
    writeOnRead?: boolean;
}

