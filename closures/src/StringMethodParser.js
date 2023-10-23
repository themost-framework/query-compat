// MOST Web Framework Codename Zero Gravity Copyright (c) 2017-2023, THEMOST LP All rights reserved

import { SimpleMethodCallExpression } from './SimpleMethodCallExpression';
import { PrototypeMethodParser } from './PrototypeMethodParser';

class StringMethodParser extends PrototypeMethodParser {
    constructor() {
        super();
    }
    startsWith(args) {
        // use startswith instead of startsWith (for resolving backwards compatibility issues)
        return new SimpleMethodCallExpression('startswith', args);
    }
    endsWith(args) {
        // use endswith instead of endsWith (for resolving backwards compatibility issues)
        return new SimpleMethodCallExpression('endswith', args);
    }
    toLowerCase(args) {
        return new SimpleMethodCallExpression('toLower', args);
    }
    toLocaleLowerCase(args) {
        return new SimpleMethodCallExpression('toLower', args);
    }
    toUpperCase(args) {
        return new SimpleMethodCallExpression('toUpper', args);
    }
    toLocaleUpperCase(args) {
        return new SimpleMethodCallExpression('toUpper', args);
    }
    indexOf(args) {
        return new SimpleMethodCallExpression('indexOfBytes', args);
    }
    substr(args) {
        return new SimpleMethodCallExpression('substr', args);
    }
    substring(args) {
        return new SimpleMethodCallExpression('substring', args);
    }
    trim(args) {
        return new SimpleMethodCallExpression('trim', args);
    }
    concat(args) {
        return new SimpleMethodCallExpression('concat', args);
    }
    includes(args) {
        return new SimpleMethodCallExpression('contains', args);
    }
}

export {
    StringMethodParser
};
