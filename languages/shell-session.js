const grammar_bash = require("./bash");

var strings = [
  // normal string
  // 1 capturing group
  /(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\1)[^\\])*\1/.source,

  // here doc
  // 1 capturing group
  /<<-?\s*(\w+?)[ \t]*(?!.)[\s\S]*?[\r\n]\2/.source,

  // here doc quoted
  // 2 capturing group
  /<<-?\s*(["'])(\w+)\3[ \t]*(?!.)[\s\S]*?[\r\n]\4/.source,
].join("|");

const grammar_shell_session = {
  info: {
    // foo@bar:~/files$ exit
    // foo@bar$ exit
    pattern: /^[^\r\n$#*!]+(?=[$#])/m,
    alias: "punctuation",
    inside: {
      path: {
        pattern: /(:)[\s\S]+/,
        lookbehind: true,
      },
      user: /^[^\s@:$#*!/\\]+@[^\s@:$#*!/\\]+(?=:|$)/,
      punctuation: /:/,
    },
  },
  command: {
    pattern: RegExp(
      /[$](?:[^\\\r\n'"<]|\\.|<<str>>)+/.source.replace(
        /<<str>>/g,
        function () {
          return strings;
        }
      )
    ),
    greedy: true,
    inside: {
      bash: {
        pattern: /(^[$#]\s*)[\s\S]+/,
        lookbehind: true,
        alias: "language-bash",
        inside: grammar_bash,
      },
      "shell-symbol": {
        pattern: /^[$#]/,
        alias: "important",
      },
    },
  },
  output: /.(?:.*(?:[\r\n]|.$))*/,
};

module.exports = grammar_shell_session;
