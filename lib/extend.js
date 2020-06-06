const clone = require("./clone");

function extend(grammar, redef) {
  var extendedGrammar = clone(grammar);

  for (var key in redef) {
    extendedGrammar[key] = redef[key];
  }

  return extendedGrammar;
}

module.exports = extend;
