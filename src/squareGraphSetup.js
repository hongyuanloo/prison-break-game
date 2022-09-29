import { Graph } from "./Graph.js";

// get shortest path nodes names
const getshortestPathNodesNames = function (squareGraph, startNode, finalNode) {
  const shortestPaths = squareGraph.nodes.shortestPathFrom(startNode);
  const nodesNames = shortestPaths.nodesNames;
  const shortestDistanceFromSource = shortestPaths.shortestDistanceFromSource;
  const prevNodesNames = shortestPaths.prevNodesNames;
  const shortestDistanceToEndNode = 3;
  const shortestNodeNamesToEndNode = [];

  let node = finalNode;
  while (
    shortestNodeNamesToEndNode[shortestNodeNamesToEndNode.length - 1] !==
    startNode
  ) {
    shortestNodeNamesToEndNode.push(node);
    let indexOfNode = nodesNames.indexOf(node);
    let prevNode = prevNodesNames[indexOfNode];
    node = prevNode;
  }

  shortestNodeNamesToEndNode.reverse();
  return shortestNodeNamesToEndNode;
};

const squareGraphSetup = function (totalNodesPerSide) {
  //---Graph Setup---//
  /* 
    Graph.squareGraphGenerator(4) returns
    nodes: graph,
    nodesNames: nodesNames,
    adjacentNodesNames: adjacentNodesNames,
    adjacentNodesDistances: adjacentNodesDistances,
    rows: totalVerticalNodes,
    columns: totalHorizontalNodes,
    horizontalDistances: horizontalDistances,
    verticalDistances: verticalDistances,*/
  const squareGraph = Graph.squareGraphGenerator(totalNodesPerSide);
  const nodes = squareGraph.nodes; //[]
  const nodesNames = squareGraph.nodesNames; //[]
  const adjacentNodesNames = squareGraph.adjacentNodesNames; //[][]
  const adjacentNodesDistances = squareGraph.adjacentNodesDistances; //[][]
  const rows = squareGraph.rows;
  const columns = squareGraph.columns;
  const horizontalDistances = squareGraph.horizontalDistances; //[][]
  const verticalDistances = squareGraph.verticalDistances; //[][]

  //---ShortestPath Setup---//
  const startNode = nodesNames[0]; //"a";
  const finalNode = nodesNames[nodesNames.length - 1]; //"p";
  const shortestPathNodesNamesSolution = getshortestPathNodesNames(
    squareGraph,
    startNode,
    finalNode
  );
  console.log("solution: ", shortestPathNodesNamesSolution);

  return {
    nodes,
    nodesNames,
    adjacentNodesNames,
    adjacentNodesDistances,
    rows,
    columns,
    horizontalDistances,
    verticalDistances,
    startNode,
    finalNode,
    shortestPathNodesNamesSolution,
  };
};
export { squareGraphSetup };
