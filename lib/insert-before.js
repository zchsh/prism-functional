function insertBefore(grammar, before, insert) {
  var ret = {};

  for (var token in grammar) {
    if (grammar.hasOwnProperty(token)) {
      if (token == before) {
        for (var newToken in insert) {
          if (insert.hasOwnProperty(newToken)) {
            ret[newToken] = insert[newToken];
          }
        }
      }

      // Do not insert token which also occur in insert. See #1525
      if (!insert.hasOwnProperty(token)) {
        ret[token] = grammar[token];
      }
    }
  }

  return ret;
}

module.exports = insertBefore;
