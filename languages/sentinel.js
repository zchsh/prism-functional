const extend = require("../lib/extend");
const grammar_clike = require("./clike");

/*
To Do: actually match language spec.
See: https://docs.hashicorp.com/sentinel/language/spec/
*/

const grammar_sentinel = extend(grammar_clike, {
  comment: [
    // Comments: https://docs.hashicorp.com/sentinel/language/spec/#comments
    {
      pattern: /(#|\/\/)(.*)/, // single-line comments
    },
    {
      pattern: /\/\*[\s\S]*?\*\//, // multi-line comments
    },
  ],
  /* Parts below were swiped from Go, they probably do not match the actual Sentinel spec */
  keyword: /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
  builtin: /\b(?:bool|byte|complex(?:64|128)|error|float(?:32|64)|rune|string|u?int(?:8|16|32|64)?|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print(?:ln)?|real|recover)\b/,
  boolean: /\b(?:_|iota|nil|true|false)\b/,
  operator: /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
  number: /(?:\b0x[a-f\d]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e[-+]?\d+)?)i?/i,
  string: {
    pattern: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/,
    greedy: true,
  },
});

module.exports = grammar_sentinel;
