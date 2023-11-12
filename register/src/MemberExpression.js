const { MemberExpression } = require('@themost/query');

function exprOf() {
    return {
        $name: this.name
    }; 
}

if (MemberExpression.prototype.exprOf != exprOf) {
    Object.assign(MemberExpression.prototype, {
        exprOf
    });
}