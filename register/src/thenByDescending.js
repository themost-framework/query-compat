import { QueryExpression } from '@themost/query';
import { ClosureParser } from '@themost/query-compat/closures';

const superThenByDescending = QueryExpression.prototype.thenByDescending;

/**
 * @this QueryExpression
 */
function thenByDescending(...args) {
    if (typeof args[0] === 'function') {
        const closureParser = new ClosureParser();
        const fields = closureParser.parseSelect.apply(closureParser, args);
        return superThenByDescending.apply(this, fields);
    }
    return superThenByDescending.apply(this, args);
}

if (superThenByDescending != thenByDescending) {
    QueryExpression.prototype.orderByDescending = thenByDescending;
}