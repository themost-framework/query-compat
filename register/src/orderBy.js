import { QueryExpression } from '@themost/query';
import { ClosureParser } from '@themost/query-compat/closures';

const superOrderBy = QueryExpression.prototype.orderBy;

/**
 * @this QueryExpression
 */
function orderBy(...args) {
    if (typeof args[0] === 'function') {
        const closureParser = new ClosureParser();
        const fields = closureParser.parseSelect.apply(closureParser, args);
        return superOrderBy.apply(this, fields);
    }
    return superOrderBy.apply(this, args);
}

if (superOrderBy != orderBy) {
    QueryExpression.prototype.orderBy = orderBy;
}