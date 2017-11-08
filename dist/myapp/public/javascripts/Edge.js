"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Edge = function Edge(id, vfirst, vsecond, weight) {
    var direction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    _classCallCheck(this, Edge);

    this.id = id;
    this.vfirst = vfirst;
    this.vsecond = vsecond;
    this.weight = weight;
    this.direction = direction;
};

module.exports = Edge;
//# sourceMappingURL=Edge.js.map