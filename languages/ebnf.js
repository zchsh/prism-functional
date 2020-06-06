const grammar_ebnf = {
  comment: /\(\*[\s\S]*?\*\)/,
  string: {
    pattern: /"[^"\r\n]*"|'[^'\r\n]*'/,
    greedy: true,
  },
  special: {
    pattern: /\?[^?\r\n]*\?/,
    greedy: true,
    alias: "class-name",
  },

  definition: {
    pattern: /^(\s*)[a-z]\w*(?:[ \t]+[a-z]\w*)*(?=\s*=)/im,
    lookbehind: true,
    alias: ["rule", "keyword"],
  },
  rule: /[a-z]\w*(?:[ \t]+[a-z]\w*)*/i,

  punctuation: /\([:/]|[:/]\)|[.,;()[\]{}]/,
  operator: /[-=|*/!]/,
};

module.exports = grammar_ebnf;
