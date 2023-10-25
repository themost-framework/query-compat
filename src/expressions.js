class SelectAnyExpression {
    constructor(expr, alias) {
        this.expression = expr;
        this.as = alias;
    }
    exprOf() {
        if (this.as != null) {
            const res = {};
            Object.defineProperty(res, this.as, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: this.expression.exprOf()
            });
            return res;
        }
        throw new Error('Expression alias cannot be empty');
    }
}

class AnyExpressionFormatter {
    constructor() {
        //
    }
    /**
     * @type {ExpressionBase}
     */
    format(expr) {
        return expr.exprOf();
    }
    /**
     * @type {Array<ExpressionBase>}
     */
     formatMany(expr) {
        return expr.map(function(item) {
            return item.exprOf();
        });
    }
}

class OrderByAnyExpression {
    constructor(expr, direction) {
        this.expression = expr;
        this.direction = direction || 'asc';
    }
    exprOf() {
        const res = {};
        Object.defineProperty(res, '$' + (this.direction || 'asc'), {
            configurable: true,
            enumerable: true,
            writable: true,
            value: this.expression.exprOf()
        });
        return res;
    }
}

export {
    SelectAnyExpression,
    OrderByAnyExpression,
    AnyExpressionFormatter
}