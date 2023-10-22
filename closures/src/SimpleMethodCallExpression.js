import { MemberExpression, MethodCallExpression } from '@themost/query';

class SimpleMethodCallExpression extends MethodCallExpression {
    constructor(name, args) {
        super(name, args);
    }
    /**
     * Converts the current method to the equivalent query expression e.g. { orderDate: { $year: [] } } which is equivalent with year(orderDate)
     * @returns {*}
     */
    exprOf() {
        let method = {};
        let name = '$'.concat(this.name);
        //set arguments array
        if (this.args.length === 0) {
            method[name] = [];
            return method;
        }
        if (this.args.length === 1) {
            method[name] = {};
            let arg;
            if (this.args[0] instanceof MemberExpression) {
                arg = {
                    $name: this.args[0].name
                }
            }
            else if (typeof this.args[0].exprOf === 'function') {
                arg = this.args[0].exprOf();
            } else {
                arg = this.args[0];
            }
            Object.assign(method[name], arg);
            return method;
        } else {
            method[name] = this.args.map(function (item) {
                if (typeof item.exprOf === 'function') {
                    return item.exprOf();
                } else {
                    return item;
                }
            });
            return method;
        }

    }
}

export {
    SimpleMethodCallExpression
}