var uniqueId = 0;

// Deep clone a language definition (e.g. to extend it)
function deepClone(o, visited) {
  var clone,
    id,
    type = typeUtil(o);
  visited = visited || {};

  switch (type) {
    case "Object":
      id = objId(o);
      if (visited[id]) {
        return visited[id];
      }
      clone = {};
      visited[id] = clone;

      for (var key in o) {
        if (o.hasOwnProperty(key)) {
          clone[key] = deepClone(o[key], visited);
        }
      }

      return clone;

    case "Array":
      id = objId(o);
      if (visited[id]) {
        return visited[id];
      }
      clone = [];
      visited[id] = clone;

      o.forEach(function (v, i) {
        clone[i] = deepClone(v, visited);
      });

      return clone;

    default:
      return o;
  }
}

function typeUtil(o) {
  return Object.prototype.toString.call(o).slice(8, -1);
}

function objId(obj) {
  if (!obj["__id"]) {
    Object.defineProperty(obj, "__id", { value: ++uniqueId });
  }
  return obj["__id"];
}

module.exports = deepClone;
