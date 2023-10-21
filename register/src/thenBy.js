import { QueryExpression } from '@themost/query';
import { ClosureParser } from '@themost/query-compat/closures';

const superThenBy = QueryExpression.prototype.thenBy;

/**
 * @this QueryExpression
 */
function thenBy(...args) {
    if (typeof args[0] === 'function') {
        const closureParser = new ClosureParser();
        const fields = closureParser.parseSelect.apply(closureParser, args);
        return superThenBy.apply(this, fields);
    }
    return superThenBy.apply(this, args);
}

if (superThenBy != thenBy) {
    QueryExpression.prototype.thenBy = thenBy;
}