const app = require('./../../app');
const Vertex = require('./Vertex');
const Edge = require('./Edge');
const Graph = require('./Graph');
const fs = require('fs');
const readline = require('readline');
const Stream = require('stream');

function parseInputTabs(filename, delimiter) {
    return new Promise(function(resolve, reject){
        let delim;
        switch (delimiter) {
            case "t":
                delim = '\t';
                break;
            case "s":
                delim = ' ';
                break;
        }
        let instream = fs.createReadStream(filename);
        let outstream = new Stream;
        let rl = readline.createInterface(instream, outstream);

        let x = 0, n = 0, m = 0, index = 0;
        let vertices = new Map();
        let edges = new Map();
        let lookup = new Map();
        let G = new Graph(n, m, vertices, edges);

        rl.on('line', function (line) {
            //console.log("Line: " + line);
            if (x === 0) {
                // Acquiring n and m for graph
                let specs = line.split(delim);
                n = parseInt(specs[0]);
                m = parseInt(specs[1]);
                G.n = n;
                G.m = m;
                x = 1;
            }
            else {
                let v1, v2, v1index, v2index;

                let verts = line.split(delim);

                let v1id = verts[0];
                let v2id = verts[1];

                if (lookup.has(v1id)) {
                    v1index = lookup.get(v1id);
                }
                else {
                    v1index = index;
                    lookup.set(v1id, v1index);
                    index += 1;
                }
                if (lookup.has(v2id)) {
                    v2index = lookup.get(v2id);
                }
                else {
                    v2index = index;
                    lookup.set(v2id, v2index);
                    index += 1;
                }

                // If first vertex in list does not exist, add it to the list of vertices
                if (!G.vertices.has(v1index)) {
                    v1 = make_vertex(v1index, v1id);
                    G.vertices.set(v1index, v1);

                    // If second vertex in list does not exist, add it to the list of vertices
                    if (!G.vertices.has(v2index)) {
                        v2 = make_vertex(v2index, v2id);
                        G.vertices.set(v2index, v2);
                    }
                    // Else acquire the already existing second vertex
                    else {
                        v2 = G.vertices.get(v2index);
                    }
                }
                // Else acquire the already existing first vertex
                else {
                    v1 = G.vertices.get(v1index);

                    // If second vertex in list does not exist, add it to the list of vertices
                    if (!G.vertices.has(v2index)) {
                        v2 = make_vertex(v2index, v2id);
                        G.vertices.set(v2index, v2);
                    }
                    // Else acquire the already existing second vertex
                    else {
                        v2 = G.vertices.get(v2index);
                    }
                }

                let edge_id = v1index + " " + v2index;
                let edge = new Edge(edge_id, v1, v2, Math.random() * 20 + 1 | 0);
                G.edges.set(edge_id, edge);
            }
        });

        rl.on('close', function () {
            console.log("Graph: " + G.vertices.size);
            if (G) {
                resolve(G);
            }
            else {
                const err = "Could not read file.";
                reject(err);
            }
        });
    });
}

function make_vertex(index, id) {
    return new Vertex(
        index,
        id,
        '#000080',
        (Math.random() * 5 + 10) | 0,
        (Math.random() * 500 + 1) | 0,
        (Math.random() * 500 + 1) | 0
    );
}

module.exports.parseInputTabs = parseInputTabs;
