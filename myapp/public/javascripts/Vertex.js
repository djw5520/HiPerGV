class Vertex {
    constructor(index, id, color, radius, x, y) {
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
    }
}

module.exports = Vertex;
