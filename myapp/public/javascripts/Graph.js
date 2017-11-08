const Vertex = require('./Vertex');
const Edge = require('./Edge');
const Cluster = require('./Cluster');
const app = require('../../app');

class Graph {
    constructor(n, m, vertices, edges) {
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

    init() {
        let d1 = new Date();
        let t1 = d1.getTime();

        this.calcDegrees();
        let d2 = new Date();
        let t2 = d2.getTime();
        console.log("Calculated Degrees in " + (t2 - t1) + " seconds.");

        // this.findNeighbors();
        // console.log("Calculated Neighbors");

        this.vertex_array = this.arrayForm();
        let d3 = new Date();
        let t3 = d3.getTime();
        console.log("Calculated ArrayForm in " + (t3 - t2) + " seconds.");

        this.edge_list = this.edgeList();
        let d4 = new Date();
        let t4 = d4.getTime();
        console.log("Calculated EdgeList in " + (t4 - t3) + " seconds.");

        this.adjacency_list = this.adjacencyList();
        let d5 = new Date();
        let t5 = d5.getTime();
        console.log("Calculated AdjacancyList in " + (t5 - t4) + " seconds.");
    }

    calcDegrees() {
        let maxDeg = 0;
        this.edges.forEach(function (edge) {
            edge.vfirst.degree += 1;
            edge.vsecond.degree += 1;
        });

        this.vertices.forEach(function (vert) {
            maxDeg = max(maxDeg, vert.degree);
        });

        this.maxDegree = maxDeg;
    }

    kcore() {
        let deg = [];
        let K = [];
        let vertices = this.vertex_array;
        let edges = this.edges;

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
                }
                else if (edge.vsecond === vert) {
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

    kcore_imp() {
        let K = [];
        let deg_array = this.vertex_array;
        let adjacency_list = this.adjacency_list;
        let vertices = this.vertices;
        let edges = this.edges;

        // Search through array of vertices sorted by degree
        deg_array.forEach(function (vert) {
            vert.core_val = vert.degree;
            let vert1index = vert.index;

            // Inspect incident edges to current vertex using adjacency list
            adjacency_list[vert1index].forEach(function (vert2index) {
                let vert2 = vertices.get(vert2index);

                // Check for the edge in the edges set
                // Decrement the degree of the vertex with higher degree (simulates removing the vertex of smaller degree)
                if (edges.has(vert.index + " " + vert2index)) {
                    let edge = edges.get(vert.index + " " + vert2index);
                    if (edge.vsecond.degree > edge.vfirst.degree) {
                        edge.vsecond.degree -= 1;
                    }
                }
                else if (edges.has(vert2index + " " + vert.index)) {
                    let edge = edges.get(vert2index + " " + vert.index);
                    if (edge.vfirst.degree > edge.vsecond.degree) {
                        edge.vfirst.degree -= 1;
                    }
                }
            });
        });

        // vertices.forEach(function (v) {
        //     console.log("" + (v.index + 1) + "\thas coreness: " + v.core_val);
        // });
    }

    BCCDecomp() {
        for (let i = 0; i < this.n; i++) {
            this.visited[i] = false;
        }
        console.log(this.visited);

        for (let i = 0; i < this.vertex_array.length; i++) {
            let u = this.vertex_array[i].index;
            if (this.visited[u] === false) {
                this.BCCUtil(u, -1);
            }
        }
    }

    BCCUtil(u, p) {
        this.visited[u] = true;
        this.lowlink[u] = this.tin[u] = this.time++;
        this.stack.push(u);
        let children = 0;
        let cutPoint = false;

        let len = this.adjacency_list[u].length;
        for (let i = 0; i < len; i++) {
            let v = this.adjacency_list[u][i];
            if (v === p)
                return;
            if (this.visited[v]) {
                // lowlink[u] = Math.min(lowlink[u], lowlink[v]);
                this.lowlink[u] = min(this.lowlink[u], this.tin[v]);
            } else {
                this.BCCUtil(v, u);
                this.lowlink[u] = min(this.lowlink[u], this.lowlink[v]);
                cutPoint |= this.lowlink[v] >= this.tin[u];
                //if (lowlink[v] == tin[v])
                if (this.lowlink[v] > this.tin[u])
                    this.bridges.push("(" + u + "," + v + ")");
                children += 1;
            }

            if (p === -1)
                cutPoint = children >= 2;
            if (cutPoint)
                this.cutPoints.push(u);
            if (this.lowlink[u] === this.tin[u]) {
                let component = [];
                while (true) {
                    let x = this.stack.pop();
                    component.push(x);
                    if (x === u)
                        break;
                }
                this.components.push(component);
            }
        }
    }

    BZKcore() {
        let verts = this.arrayForm();
        let pos = [], bin = [];

        for (let i = 0; i <= this.maxDegree; i++) {
            bin[i] = 0;
        }

        for (let i = 0; i < this.n; i++) {
            pos[verts[i]] = i;
        }

        let deg = verts[0].degree;
        for (let i = 0, deg; i < this.n - 1; i++) {
            while (deg === verts[i].degree) {
                i++;
            }
            deg = verts[i].degree;
            bin[deg] = i;
        }

        for (let i = 0; i < this.n - 1; i++) {
            let v = verts[i];

            v.neighbors.forEach(function (u) {
                if (u.degree > v.degree) {
                    let du = u.degree;
                    let pu = pos[u.index];
                    let pw = bin[du];
                    let w = verts[pw];
                    if (u.index !== w) {
                        pos[u.index] = pw;
                        pos[w] = pu;
                        verts[pu] = w;
                        verts[pw] = u;
                    }
                    bin[du] += 1;
                    u.degree -= 1;
                }
            })

        }

        this.vertices.forEach(function (v) {
            console.log("" + (v.index + 1) + "\thas coreness: " + v.core_val);
        });
    }

    arrayForm() {
        let verts = [];
        for (let i = 0; i < this.n; i++) {
            if (this.vertices.has(i)) {
                verts.push(this.vertices.get(i));
            }
            else {
                verts.push(null);
            }
        }
        verts.sort(function (a, b) {
            return (a.degree > b.degree) ? 1 : 0;
        });
        return verts;
    }

    edgeList() {
        let edge_list = [];
        this.edges.forEach(function (e) {
            edge_list.push(e);
        });
        edge_list.sort(function (e1, e2) {
            return (e1.weight > e2.weight) ? 1 : 0;
        });
        return edge_list;
    }

    adjacencyList() {
        let a_list = [];
        for (let i = 0; i < this.n; i++) {
            a_list[i] = []
        }
        this.edge_list.forEach(function (e) {
            let i1 = e.vfirst.index;
            let i2 = e.vsecond.index;
            a_list[i1].push(i2);
            a_list[i2].push(i1);
        });
        for (let i = 0; i < this.n; i++) {
            a_list[i].sort();
        }
        return a_list;
    }

    findNeighbors() {
        let vertices = this.vertices;
        let edges = this.edges;
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
                return (v1.index < v2.index) ? v1 : v2;
            });
        });
    }

    findVertexByIndex(index) {
        this.vertices.forEach(function (v) {
            if (v.index === index) {
                return v;
            }
        });
    }

    iterativeScan(seed, w_func) {
        let weight_function, increased = true, cluster = seed;
        let vertices = this.vertices;
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
        let w = weight_function(cluster);
        while (increased) {
            vertices.forEach(function (v) {
                let clust_prime = cluster;
                if (cluster.has(v)) {
                    clust_prime.remove(v);
                }
                else {
                    clust_prime.add(v);
                }
                if (weight_function(clust_prime) > weight_function(cluster)) {
                    cluster = clust_prime;
                }
            });
            if (weight_function(cluster) === w) {
                increased = false;
            }
            else {
                w = weight_function(cluster);
            }
        }

        return cluster;
    }
}

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
    return (a >= b) ? a : b;
}

function min(a, b) {
    return (a <= b) ? a : b;
}

module.exports = Graph;
