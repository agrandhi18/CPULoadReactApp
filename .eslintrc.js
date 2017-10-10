module.exports = {
    "env": {
        "node": true,
        "es6": true,
        "browser": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
       "no-console": ["error", { allow: ["log", "error"] }],
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
    }
};