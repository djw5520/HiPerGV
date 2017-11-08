"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cluster = function Cluster(cluster) {
    _classCallCheck(this, Cluster);

    this.cluster = cluster;
    this.edges = {};
    // If this.edges is the edges in the cluster, this.outedges is defined as the set of edges which connect C to its complement
    this.outedges = {};
};
//# sourceMappingURL=Cluster.js.map