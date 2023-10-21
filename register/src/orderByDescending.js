import { QueryExpression } from '@themost/query';
import { ClosureParser } from '@themost/query-compat/closures';

const superOrderByDescending = QueryExpression.prototype.orderByDescending;

/**
 * @this QueryExpression
 */
function orderByDescending(...args) {
    if (typeof args[0] === 'function') {
        const closureParser = new ClosureParser();
        const fields = closureParser.parseSelect.apply(closureParser, args);
        return superOrderByDescending.apply(this, fields);
    }
    return superOrderByDescending.apply(this, args);
}

if (superOrderByDescending != orderByDescending) {
    QueryExpression.prototype.orderByDescending = orderByDescending;
}