import { QueryExpression } from '@themost/query';
import { ClosureParser } from '@themost/query-compat/closures';

const superGroupBy = QueryExpression.prototype.groupBy;

/**
 * @this QueryExpression
 */
function groupBy(...args) {
    if (typeof args[0] === 'function') {
        const closureParser = new ClosureParser();
        const fields = closureParser.parseSelect.apply(closureParser, args);
        return superGroupBy.apply(this, fields);
    }
    return superGroupBy.apply(this, args);
}

if (superGroupBy != groupBy) {
    QueryExpression.prototype.groupBy = groupBy;
}