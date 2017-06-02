module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "standard",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "prefer-const": [
            "error", 
            {
                "destructuring": "any",
                "ignoreReadBeforeAssign": false
            }
        ],
        "no-var":"error"
    }
};