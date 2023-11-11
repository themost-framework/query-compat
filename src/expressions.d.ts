export declare interface ExpressionBase {
    exprOf(): any;
    source?: string;
}

export declare class SelectAnyExpression implements SelectExpressionBase {
    constructor(expr: ExpressionBase, alias: string);
    exprOf(): any;
}

export declare class OrderByAnyExpression implements SelectExpressionBase {
    constructor(expr: ExpressionBase, direction?: string | 'asc' | 'desc');
    exprOf(): any;
}

export declare class AnyExpressionFormatter {
    format(expr: ExpressionBase): any;
    formatMany(expr: Array<ExpressionBase>): any;
}