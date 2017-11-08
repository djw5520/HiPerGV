'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vertex = require('./Vertex');
var Edge = require('./Edge');
var Cluster = require('./Cluster');
var app = require('../../app');

var Graph = function () {
    function Graph(n, m, vertices, edges) {
        _classCallCheck(this, Graph);

        this.vertices = vertices;
        this.edges = edges;
        this.n = n;
        this.m = m;
        this.maxDegree = 0;
        this.clusters = {};

        this.visited = [];
        this.stack = [];
        this.time = 0;
        this.tin = [n];
        this.lowlink = [n];
        this.components = [];
        this.cutPoints = [];
        this.bridges = [];
        this.vertex_array = [];
        this.edge_list = [];
        this.adjacency_list = [];
    }

    _createClass(Graph, [{
        key: 'init',
        value: function init() {
            var d1 = new Date();
            var t1 = d1.getTime();

            this.calcDegrees();
            var d2 = new Date();
            var t2 = d2.getTime();
            console.log("Calculated Degrees in " + (t2 - t1) + " seconds.");

            // this.findNeighbors();
            // console.log("Calculated Neighbors");

            this.vertex_array = this.arrayForm();
            var d3 = new Date();
            var t3 = d3.getTime();
            console.log("Calculated ArrayForm in " + (t3 - t2) + " seconds.");

            this.edge_list = this.edgeList();
            var d4 = new Date();
            var t4 = d4.getTime();
            console.log("Calculated EdgeList in " + (t4 - t3) + " seconds.");

            this.adjacency_list = this.adjacencyList();
            var d5 = new Date();
            var t5 = d5.getTime();
            console.log("Calculated AdjacancyList in " + (t5 - t4) + " seconds.");
        }
    }, {
        key: 'calcDegrees',
        value: function calcDegrees() {
            var maxDeg = 0;
            this.edges.forEach(function (edge) {
                edge.vfirst.degree += 1;
                edge.vsecond.degree += 1;
            });

            this.vertices.forEach(function (vert) {
                maxDeg = max(maxDeg, vert.degree);
            });

            this.maxDegree = maxDeg;
        }
    }, {
        key: 'kcore',
        value: function kcore() {
            var deg = [];
            var K = [];
            var vertices = this.vertex_array;
            var edges = this.edges;

            vertices.forEach(function (vert) {
                deg.push(vert);
            });

            deg.sort(function (a, b) {
                return a.degree - b.degree;
            });

            vertices.forEach(function (vert) {
                vert.core_val = vert.degree;
                edges.forEach(function (edge) {
                    if (edge.vfirst === vert) {
                        if (edge.vsecond.degree > edge.vfirst.degree) {
                            edge.vsecond.degree -= 1;
                        }
                    } else if (edge.vsecond === vert) {
                        if (edge.vfirst.degree > edge.vsecond.degree) {
                            edge.vfirst.degree -= 1;
                        }
                    }
                });
            });

            // deg.forEach(function (vert) {
            //     K[vert.index] = vert.degree;
            //     edges.forEach(function (edge) {
            //         if (edge.vfirst === vert) {
            //             if (deg[edge.vsecond.index] > deg[edge.vfirst.index]){
            //                 deg[edge.vsecond.index] -= 1;
            //             }
            //         }
            //         else if (edge.vsecond === vert) {
            //             if (deg[edge.vfirst.index] > deg[edge.vsecond.index]){
            //                 deg[edge.vfirst.index] -= 1;
            //             }
            //         }
            //     });
            //     deg.sort(function (a, b) {
            //         return a.degree - b.degree;
            //     });
            // });

            // vertices.forEach(function (v) {
            //     console.log("" + (v.index + 1) + "\thas coreness: " + v.core_val);
            // });
            return K;
        }
    }, {
        key: 'kcore_imp',
        value: function kcore_imp() {
            var K = [];
            var deg_array = this.vertex_array;
            var adjacency_list = this.adjacency_list;
            var vertices = this.vertices;
            var edges = this.edges;

            // Search through array of vertices sorted by degree
            deg_array.forEach(function (vert) {
                vert.core_val = vert.degree;
                var vert1index = vert.index;

                // Inspect incident edges to current vertex using adjacency list
                adjacency_list[vert1index].forEach(function (vert2index) {
                    var vert2 = vertices.get(vert2index);

                    // Check for the edge in the edges set
                    // Decrement the degree of the vertex with higher degree (simulates removing the vertex of smaller degree)
                    if (edges.has(vert.index + " " + vert2index)) {
                        var edge = edges.get(vert.index + " " + vert2index);
                        if (edge.vsecond.degree > edge.vfirst.degree) {
                            edge.vsecond.degree -= 1;
                        }
                    } else if (edges.has(vert2index + " " + vert.index)) {
                        var _edge = edges.get(vert2index + " " + vert.index);
                        if (_edge.vfirst.degree > _edge.vsecond.degree) {
                            _edge.vfirst.degree -= 1;
                        }
                    }
                });
            });

            // vertices.forEach(function (v) {
            //     console.log("" + (v.index + 1) + "\thas coreness: " + v.core_val);
            // });
        }
    }, {
        key: 'BCCDecomp',
        value: function BCCDecomp() {
            for (var i = 0; i < this.n; i++) {
                this.visited[i] = false;
            }
            console.log(this.visited);

            for (var _i = 0; _i < this.vertex_array.length; _i++) {
                var u = this.vertex_array[_i].index;
                if (this.visited[u] === false) {
                    this.BCCUtil(u, -1);
                }
            }
        }
    }, {
        key: 'BCCUtil',
        value: function BCCUtil(u, p) {
            this.visited[u] = true;
            this.lowlink[u] = this.tin[u] = this.time++;
            this.stack.push(u);
            var children = 0;
            var cutPoint = false;

            var len = this.adjacency_list[u].length;
            for (var i = 0; i < len; i++) {
                var v = this.adjacency_list[u][i];
                if (v === p) return;
                if (this.visited[v]) {
                    // lowlink[u] = Math.min(lowlink[u], lowlink[v]);
                    this.lowlink[u] = min(this.lowlink[u], this.tin[v]);
                } else {
                    this.BCCUtil(v, u);
                    this.lowlink[u] = min(this.lowlink[u], this.lowlink[v]);
                    cutPoint |= this.lowlink[v] >= this.tin[u];
                    //if (lowlink[v] == tin[v])
                    if (this.lowlink[v] > this.tin[u]) this.bridges.push("(" + u + "," + v + ")");
                    children += 1;
                }

                if (p === -1) cutPoint = children >= 2;
                if (cutPoint) this.cutPoints.push(u);
                if (this.lowlink[u] === this.tin[u]) {
                    var component = [];
                    while (true) {
                        var x = this.stack.pop();
                        component.push(x);
                        if (x === u) break;
                    }
                    this.components.push(component);
                }
            }
        }
    }, {
        key: 'BZKcore',
        value: function BZKcore() {
            var verts = this.arrayForm();
            var pos = [],
                bin = [];

            for (var i = 0; i <= this.maxDegree; i++) {
                bin[i] = 0;
            }

            for (var _i2 = 0; _i2 < this.n; _i2++) {
                pos[verts[_i2]] = _i2;
            }

            var deg = verts[0].degree;
            for (var _i3 = 0, _deg; _i3 < this.n - 1; _i3++) {
                while (_deg === verts[_i3].degree) {
                    _i3++;
                }
                _deg = verts[_i3].degree;
                bin[_deg] = _i3;
            }

            var _loop = function _loop(_i4) {
                var v = verts[_i4];

                v.neighbors.forEach(function (u) {
                    if (u.degree > v.degree) {
                        var du = u.degree;
                        var pu = pos[u.index];
                        var pw = bin[du];
                        var w = verts[pw];
                        if (u.index !== w) {
                            pos[u.index] = pw;
                            pos[w] = pu;
                            verts[pu] = w;
                            verts[pw] = u;
                        }
                        bin[du] += 1;
                        u.degree -= 1;
                    }
                });
            };

            for (var _i4 = 0; _i4 < this.n - 1; _i4++) {
                _loop(_i4);
            }

            this.vertices.forEach(function (v) {
                console.log("" + (v.index + 1) + "\thas coreness: " + v.core_val);
            });
        }
    }, {
        key: 'arrayForm',
        value: function arrayForm() {
            var verts = [];
            for (var i = 0; i < this.n; i++) {
                if (this.vertices.has(i)) {
                    verts.push(this.vertices.get(i));
                } else {
                    verts.push(null);
                }
            }
            verts.sort(function (a, b) {
                return a.degree > b.degree ? 1 : 0;
            });
            return verts;
        }
    }, {
        key: 'edgeList',
        value: function edgeList() {
            var edge_list = [];
            this.edges.forEach(function (e) {
                edge_list.push(e);
            });
            edge_list.sort(function (e1, e2) {
                return e1.weight > e2.weight ? 1 : 0;
            });
            return edge_list;
        }
    }, {
        key: 'adjacencyList',
        value: function adjacencyList() {
            var a_list = [];
            for (var i = 0; i < this.n; i++) {
                a_list[i] = [];
            }
            this.edge_list.forEach(function (e) {
                var i1 = e.vfirst.index;
                var i2 = e.vsecond.index;
                a_list[i1].push(i2);
                a_list[i2].push(i1);
            });
            for (var _i5 = 0; _i5 < this.n; _i5++) {
                a_list[_i5].sort();
            }
            return a_list;
        }
    }, {
        key: 'findNeighbors',
        value: function findNeighbors() {
            var vertices = this.vertices;
            var edges = this.edges;
            vertices.forEach(function (v) {
                edges.forEach(function (e) {
                    if (e.vfirst === v) {
                        v.neighbors.push(e.vsecond);
                    }
                    if (e.vsecond === v) {
                        v.neighbors.push(e.vfirst);
                    }
                });
                v.neighbors.sort(function (v1, v2) {
                    return v1.index < v2.index ? v1 : v2;
                });
            });
        }
    }, {
        key: 'findVertexByIndex',
        value: function findVertexByIndex(index) {
            this.vertices.forEach(function (v) {
                if (v.index === index) {
                    return v;
                }
            });
        }
    }, {
        key: 'iterativeScan',
        value: function iterativeScan(seed, w_func) {
            var weight_function = void 0,
                increased = true,
                cluster = seed;
            var vertices = this.vertices;
            switch (w_func) {
                case 0:
                    weight_function = wP;
                    break;
                case 1:
                    weight_function = wE;
                    break;
                case 2:
                    weight_function = wI;
                    break;
            }
            var w = weight_function(cluster);
            while (increased) {
                vertices.forEach(function (v) {
                    var clust_prime = cluster;
                    if (cluster.has(v)) {
                        clust_prime.remove(v);
                    } else {
                        clust_prime.add(v);
                    }
                    if (weight_function(clust_prime) > weight_function(cluster)) {
                        cluster = clust_prime;
                    }
                });
                if (weight_function(cluster) === w) {
                    increased = false;
                } else {
                    w = weight_function(cluster);
                }
            }

            return cluster;
        }
    }]);

    return Graph;
}();

function wP(cluster) {
    return Math.random() * 20 + 1 | 0;
}

function wE(cluster) {
    return Math.random() * 20 + 1 | 0;
}

function wI(cluster) {
    return Math.random() * 20 + 1 | 0;
}

function max(a, b) {
    return a >= b ? a : b;
}

function min(a, b) {
    return a <= b ? a : b;
}

module.exports = Graph;
//# sourceMappingURL=Graph.js.map