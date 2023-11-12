import { ArithmeticExpression } from '@themost/query';
/**
 * @this {ArithmeticExpression}
 * @returns {*}
 */
function exprOf() {
    if (this.left == null) {
        throw new Error('Expected left operand');
    }
    if (this.operator == null)
        throw new Error('Expected arithmetic operator.');
    if (this.operator.match(ArithmeticExpression.OperatorRegEx) == null) {
        throw new Error('Invalid arithmetic operator.');
    }
    let result = {};
    Object.defineProperty(result, this.operator, {
        value: [
            (this.left != null) ? (typeof this.left.exprOf === 'function' ? this.left.exprOf() : this.left) : null,
            (this.right != null) ? (typeof this.right.exprOf === 'function' ? this.right.exprOf() : this.right) : null,
        ],
        enumerable: true,
        configurable: true
    });
    return result;
}

if (ArithmeticExpression.prototype.exprOf !== exprOf) {
    Object.assign(ArithmeticExpression.prototype, {
        exprOf
    });
}

