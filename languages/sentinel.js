/*
To Do: actually match language spec.
See: https://docs.hashicorp.com/sentinel/language/spec/
*/

const grammar_sentinel = {
  comment: [
    // Comments: https://docs.hashicorp.com/sentinel/language/spec/#comments
    {
      pattern: /(#|\/\/)(.*)/, // single-line comments
    },
    {
      pattern: /\/\*[\s\S]*?\*\//, // multi-line comments
    },
  ],
  string: {
    pattern: /"[^"\r\n]*"|'[^'\r\n]*'/,
    greedy: true,
  },
};

module.exports = grammar_sentinel;
