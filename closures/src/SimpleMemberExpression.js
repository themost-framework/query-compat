import { MemberExpression } from '@themost/query';

class SimpleMemberExpression extends MemberExpression {
    constructor(name) {
        super(name);
    }
    exprOf() {
        return {
            $name: this.name
        };
    }
}

export {
    SimpleMemberExpression
}