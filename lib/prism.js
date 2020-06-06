function prism(text, grammar) {
  const highlighted = highlight(text, grammar);
  return highlighted;
}

function highlight(text, grammar) {
  const tokens = tokenize(text, grammar);
  return Token.stringify(encode(tokens));
}

function encode(tokens) {
  if (tokens instanceof Token) {
    return new Token(tokens.type, encode(tokens.content), tokens.alias);
  } else if (Array.isArray(tokens)) {
    return tokens.map(encode);
  } else {
    return tokens
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/\u00a0/g, " ");
  }
}

function tokenize(text, grammar) {
  var rest = grammar.rest;
  if (rest) {
    for (var token in rest) {
      grammar[token] = rest[token];
    }

    delete grammar.rest;
  }

  var tokenList = new LinkedList();
  addAfter(tokenList, tokenList.head, text);

  matchGrammar(text, tokenList, grammar, tokenList.head, 0);

  return toArray(tokenList);
}

function toArray(list) {
  var array = [];
  var node = list.head.next;
  while (node !== list.tail) {
    array.push(node.value);
    node = node.next;
  }
  return array;
}

function LinkedList() {
  var head = { value: null, prev: null, next: null };
  var tail = { value: null, prev: head, next: null };
  head.next = tail;
  this.head = head;
  this.tail = tail;
  this.length = 0;
}

function addAfter(list, node, value) {
  // assumes that node != list.tail && values.length >= 0
  var next = node.next;
  var newNode = { value: value, prev: node, next: next };
  node.next = newNode;
  next.prev = newNode;
  list.length++;
  return newNode;
}

function matchGrammar(
  text,
  tokenList,
  grammar,
  startNode,
  startPos,
  oneshot,
  target
) {
  for (var token in grammar) {
    if (!grammar.hasOwnProperty(token) || !grammar[token]) {
      continue;
    }

    var patterns = grammar[token];
    patterns = Array.isArray(patterns) ? patterns : [patterns];

    for (var j = 0; j < patterns.length; ++j) {
      if (target && target == token + "," + j) {
        return;
      }

      var pattern = patterns[j],
        inside = pattern.inside,
        lookbehind = !!pattern.lookbehind,
        greedy = !!pattern.greedy,
        lookbehindLength = 0,
        alias = pattern.alias;

      if (greedy && !pattern.pattern.global) {
        // Without the global flag, lastIndex won't work
        var flags = pattern.pattern.toString().match(/[imsuy]*$/)[0];
        pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
      }

      pattern = pattern.pattern || pattern;

      for (
        // iterate the token list and keep track of the current token/string position
        var currentNode = startNode.next, pos = startPos;
        currentNode !== tokenList.tail;
        pos += currentNode.value.length, currentNode = currentNode.next
      ) {
        var str = currentNode.value;

        if (tokenList.length > text.length) {
          // Something went terribly wrong, ABORT, ABORT!
          return;
        }

        if (str instanceof Token) {
          continue;
        }

        var removeCount = 1; // this is the to parameter of removeBetween

        if (greedy && currentNode != tokenList.tail.prev) {
          pattern.lastIndex = pos;
          var match = pattern.exec(text);
          if (!match) {
            break;
          }

          var from =
            match.index + (lookbehind && match[1] ? match[1].length : 0);
          var to = match.index + match[0].length;
          var p = pos;

          // find the node that contains the match
          p += currentNode.value.length;
          while (from >= p) {
            currentNode = currentNode.next;
            p += currentNode.value.length;
          }
          // adjust pos (and p)
          p -= currentNode.value.length;
          pos = p;

          // the current node is a Token, then the match starts inside another Token, which is invalid
          if (currentNode.value instanceof Token) {
            continue;
          }

          // find the last node which is affected by this match
          for (
            var k = currentNode;
            k !== tokenList.tail &&
            (p < to || (typeof k.value === "string" && !k.prev.value.greedy));
            k = k.next
          ) {
            removeCount++;
            p += k.value.length;
          }
          removeCount--;

          // replace with the new match
          str = text.slice(pos, p);
          match.index -= pos;
        } else {
          pattern.lastIndex = 0;

          var match = pattern.exec(str);
        }

        if (!match) {
          if (oneshot) {
            break;
          }

          continue;
        }

        if (lookbehind) {
          lookbehindLength = match[1] ? match[1].length : 0;
        }

        var from = match.index + lookbehindLength,
          match = match[0].slice(lookbehindLength),
          to = from + match.length,
          before = str.slice(0, from),
          after = str.slice(to);

        var removeFrom = currentNode.prev;

        if (before) {
          removeFrom = addAfter(tokenList, removeFrom, before);
          pos += before.length;
        }

        removeRange(tokenList, removeFrom, removeCount);

        var wrapped = new Token(
          token,
          inside ? tokenize(match, inside) : match,
          alias,
          match,
          greedy
        );
        currentNode = addAfter(tokenList, removeFrom, wrapped);

        if (after) {
          addAfter(tokenList, currentNode, after);
        }

        if (removeCount > 1)
          matchGrammar(
            text,
            tokenList,
            grammar,
            currentNode.prev,
            pos,
            true,
            token + "," + j
          );

        if (oneshot) break;
      }
    }
  }
}

function removeRange(list, node, count) {
  var next = node.next;
  for (var i = 0; i < count && next !== list.tail; i++) {
    next = next.next;
  }
  node.next = next;
  next.prev = node;
  list.length -= i;
}

function Token(type, content, alias, matchedStr, greedy) {
  this.type = type;
  this.content = content;
  this.alias = alias;
  // Copy of the full string this token was created from
  this.length = (matchedStr || "").length | 0;
  this.greedy = !!greedy;
}

Token.stringify = function stringify(o) {
  if (typeof o == "string") {
    return o;
  }
  if (Array.isArray(o)) {
    var s = "";
    o.forEach(function (e) {
      s += stringify(e);
    });
    return s;
  }

  var env = {
    type: o.type,
    content: stringify(o.content),
    tag: "span",
    classes: ["token", o.type],
    attributes: {},
  };

  var aliases = o.alias;
  if (aliases) {
    if (Array.isArray(aliases)) {
      Array.prototype.push.apply(env.classes, aliases);
    } else {
      env.classes.push(aliases);
    }
  }

  var attributes = "";
  for (var name in env.attributes) {
    attributes +=
      " " +
      name +
      '="' +
      (env.attributes[name] || "").replace(/"/g, "&quot;") +
      '"';
  }

  return (
    "<" +
    env.tag +
    ' class="' +
    env.classes.join(" ") +
    '"' +
    attributes +
    ">" +
    env.content +
    "</" +
    env.tag +
    ">"
  );
};

module.exports = prism;
