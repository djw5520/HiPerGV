"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vertex = function Vertex(index, id, color, radius, x, y) {
    _classCallCheck(this, Vertex);

    this.index = index;
    this.id = id;
    this.radius = radius;
    this.color = color;
    this.x = x;
    this.y = y;
    this.edge_list = [];
    this.neighbors = [];
    this.degree = 0;
    this.core_val = 0;
};

module.exports = Vertex;
//# sourceMappingURL=Vertex.js.map