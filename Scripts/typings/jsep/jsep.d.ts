interface JsepNode {
    left: JsepNode;
    right: JsepNode;
    operator: string;
    argument: JsepNode;
    value: any;
    raw: any;
    prefix: string;
}

interface Jsep{
    addBinaryOp(operatorName: string, precedence: number): void;
    addUnaryOp(operatorName: string): void;
    removeBinaryOp(operatorName: string): void;
    removeUnaryOp(operatorName: string): void;
}

declare function jsep(expression: string) : JsepNode;