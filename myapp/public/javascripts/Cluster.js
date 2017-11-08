class Cluster {
    constructor(cluster) {
        this.cluster = cluster;
        this.edges = {};
        // If this.edges is the edges in the cluster, this.outedges is defined as the set of edges which connect C to its complement
        this.outedges = {};
    }
}
