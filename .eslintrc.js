module.exports = {
  "extends": "eslint:recommended",
  "env": {
    "es6": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-var": "error",
    "no-console": [
      "error",
      {
        allow: ["log", "warn", "error"]
      }
    ]
  }
};
