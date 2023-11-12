/**
 * @param {string} s
 * @returns {Array}
 * @private
 */
function testSplitExpandExpression(s) {
    let ix = 0;
    let paren = -1;
    let charAt;
    let ix1 = -1;
    let isLiteral = false;
    let lastSplitIndex = 0;
    let hasParen = false;
    let matches = [];
    let match = null;
    while(ix<s.length) {
        charAt=s.charAt(ix);
        if ((charAt==='(') && !isLiteral) {
            if (paren<0) {
                match = [];
                match[0] = s.substr(lastSplitIndex, ix-lastSplitIndex);
                paren = 0;
            }
            if (ix1 === -1) { ix1 = ix; }
            // eslint-disable-next-line no-unused-vars
            hasParen = true;
            paren += 1;
        }
        else if ((charAt===')') && !isLiteral) {
            if (paren>0) { paren -= 1; }
        }
        else if (charAt==='\'') {
            isLiteral = !isLiteral;
        }
        else if ((charAt === ',') && (paren === -1)) {
            if (match==null) {
                matches.push([s.substr(lastSplitIndex, ix-lastSplitIndex)]);
            }
            lastSplitIndex = ix+1;
        }

        if ((ix === s.length - 1) && (paren === -1)) {
            matches.push([s.substr(lastSplitIndex, ix-lastSplitIndex+1)]);
            match = null;
        }
        else if (paren === 0) {
            match = match || [ ];
            match[1] = s.substr(ix1+1, ix-ix1-1);
            matches.push(match);
            paren = -1;
            ix1 = -1;
        }
        ix += 1;
    }
    return matches;
}

/**
 * @constructor
 */
class DataExpandResolver {

    constructor() {
        //
    }
    /**
     * Tests a string expression and returns an array of matched expandable entities
     * @param {string} s
     */
    testExpandExpression(s) {
        if (s == null) {
            return [];
        }
        const result = []
        const reOptions = /(;|^)(\$expand|\$filter|\$levels|\$orderby|\$groupby|\$select|\$top|\$skip|\$search|\$count)=(.*?)(;\$|$)/ig;
        let matches = testSplitExpandExpression(s);
        for (let i = 0; i < matches.length; i++) {
            let match = matches[i];
            if (typeof match[1] === 'undefined') {
                result.push({ name: match[0].replace(/^\s+|\s+$/, '') });
            }
            else {
                let expand = {};
                expand['name'] = match[0].replace(/^\s+|\s+$/, '');
                reOptions.lastIndex = 0;
                let params = {};
                let expandOptions = match[1];
                let matchOption = reOptions.exec(expandOptions);
                while (matchOption) {
                    if (matchOption[3]) {
                        params[matchOption[2]] = matchOption[3];
                        reOptions.lastIndex = reOptions.lastIndex - 2;
                    }
                    matchOption = reOptions.exec(expandOptions);
                }
                expand.options = params;
                result.push(expand);
            }
        }
        return result;
    }
    /**
     * Tests a string expression and returns an array of matched expandable entities
     * @param {string} s
     */
    test(s) {
        return this.testExpandExpression(s);
    }
}

export {
    DataExpandResolver
}