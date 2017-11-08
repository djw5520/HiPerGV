class Edge {

    constructor(id, vfirst, vsecond, weight, direction = 0) {
        this.id = id;
        this.vfirst = vfirst;
        this.vsecond = vsecond;
        this.weight = weight;
        this.direction = direction;
    }
}

module.exports = Edge;

