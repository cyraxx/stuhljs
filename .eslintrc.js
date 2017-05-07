module.exports = {
    "root": true,
    "extends": "airbnb-base",
    "env": {
        "es6": true,
        "browser": false,
        "node": true
    },
    "rules": {
        "arrow-parens": [1, "as-needed"],
        "comma-dangle": 0,
        "curly": [2, "multi-line"],
        "eol-last": 0,
        "func-names": 0,
        "global-require": 0,
        "import/no-dynamic-require": 0,
        "indent": [2, 4, {
            "SwitchCase": 1
        }],
        "linebreak-style": 0,
        "max-len": [1, {
            "tabWidth": 4,
            "code": 120,
            "comments": 100
        }],
        "new-cap": 0,
        "no-bitwise": 0,
        "no-console": 0,
        "no-continue": 0,
        "no-else-return": 0,
        "no-mixed-operators": 0,
        "no-param-reassign": 0,
        "no-plusplus": 0,
        "no-prototype-builtins": 0,
        "no-restricted-properties": 0,
        "no-use-before-define": 1,
        "no-var": 1,
        "object-shorthand": [2, "consistent"],
        "one-var": 0,
        "prefer-template": 0,
        "quote-props": [1, "consistent"],
        "quotes": [2, "single"],
        "space-before-function-paren": [2, "never"],
        "strict": 1
    }
};
