import { QueryExpression } from '@themost/query';
import { ClosureParser } from '@themost/query-compat/closures';

const superSelect = QueryExpression.prototype.select;

/**
 * @this QueryExpression
 */
function select(...args) {
    if (typeof args[0] === 'function') {
        const closureParser = new ClosureParser();
        const fields = closureParser.parseSelect.apply(closureParser, args);
        return superSelect.apply(this, fields);
    }
    return superSelect.apply(this, args);
}

if (superSelect != select) {
    QueryExpression.prototype.select = select;
}