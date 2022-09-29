import { Node } from "./Node.js";
//-----------------//
// Graph class
//-----------------//
class Graph {
  constructor() {
    // "this.nodes" contains a list "nodeName:NodeObject" pair.
    // e.g. "a": Node { name: 'a', adjacentNodes: [Array], linesDistances: [Array] }
    this.nodes = {};
  }

  #isNodeExist(nodeName) {
    // check if "nodeName" already exist in " this.nodes", return true or false.
    if (this.nodes.hasOwnProperty(nodeName) === true) {
      return true;
    }
    return false;
  }

  addNode(nodeName) {
    // If "nodeName" does not exist in "this.nodes", add new Node to it.
    // else return fail message.
    if (this.#isNodeExist(nodeName) === false) {
      let newNode = new Node(nodeName);
      this.nodes[nodeName] = newNode;
      return newNode;
    } else {
      return `'${nodeName}' is already exist.`;
    }
  }

  getNode(nodeName) {
    if (this.#isNodeExist(nodeName) === true) {
      return this.nodes[nodeName];
    } else {
      return `'${nodeName}' doesn't exist.`;
    }
  }

  addLine(nodeName1, nodeName2, distance) {
    // if both "nodeName1" and "nodeName2" exist in "this.nodes", add their "addAdjacentNode" and "distance".
    // else return fail message.
    if (
      this.#isNodeExist(nodeName1) === true &&
      this.#isNodeExist(nodeName2) === true
    ) {
      let node1 = this.getNode(nodeName1);
      let node2 = this.getNode(nodeName2);

      node1.addAdjacentNode(node2, distance);
      node2.addAdjacentNode(node1, distance);
      return distance;
    } else {
      if (this.#isNodeExist(nodeName1) === true) {
        return `'${nodeName2}' doesn't not exist.`;
      }
      return `'${nodeName1}' doesn't not exist.`;
    }
  }

  printGraph() {
    /*print out the graph in formate below:
        Node -> {AdjacentNodes}
        'a'  -> { 'c' 'd' }
        Node -> [linesDistances]
        'a'  -> [6,3]*/
    console.log(`Node -> {AdjacentNodes}`);
    for (const property in this.nodes) {
      let node = this.nodes[property];
      let adjacentNodes = node.getAdjacentNodes();
      let adjacentNodesNames = "";

      adjacentNodes.forEach((node) => {
        adjacentNodesNames += `'${node.getName()}' `;
      });
      console.log(`'${node.getName()}'  -> { ${adjacentNodesNames.trim()} }`);
    }

    console.log(`Node -> [linesDistances]`);
    for (const property in this.nodes) {
      let node = this.nodes[property];
      let adjacentNodes = node.getAdjacentNodes();
      let linesDistances = node.getLinesDistances();
      console.log(`'${node.getName()}'  -> [${linesDistances}]`);
    }
  }

  getNodes() {
    return this.nodes;
  }

  getNodesNames() {
    const nodesNames = [];
    for (const property in this.nodes) {
      nodesNames.push(property);
    }
    return nodesNames;
  }

  shortestPathFrom(srcNodeName) {
    if (this.#isNodeExist(srcNodeName) !== true) {
      return `'${srcNodeName}' doesn't exist.`;
    }
    /* Algorithm procedures:
        0.Initialized "srcNodeName":
        - "currentNodeName" = "srcNodeName"
        - "currentVisitedDistance" = 0;
        - "currentNodeNameIndex" = nodesNames.indexOf(srcNodeName);
        - shortestKnownDistanceFromSource[currentNodeNameIndex] = currentVisitedDistance;
        - prevNodesNames[currentNodeNameIndex] = currentNodeName;

        1.currentNodeName:
        - get all unvisited adjNodes, and update to shortestKnownDistanceFromSource[].
          a. Compare "newDistanceToAdjNode" to "knownDistanceToAdjNode".
          b. newDistanceToAdjNode = currentVisitedDistance + adjNodeDistance
          c. "knownDistanceToAdjNode" = shortestKnownDistanceFromSource[unvisitedAdjNodeIndex].
          d. if "newDistanceToAdjNode" < "knownDistanceToAdjNode"
            - update "newDistanceToAdjNode" to shortestKnownDistanceFromSource[unvisitedAdjNodeIndex].
            - prevNodesNames[currentNodeNameIndex] = currentNodeName;
        - update "unvisitedAdjNodeNames[]" and "unvisitedAdjNodeNamesIndex[]" for later use.

        2. push currentNodeName to visited, and pop from unvisited.
        - if "currentNodeName" is not visited yet then do above.

        3. Among unvisitedAdjNodeNames[], find adjNodes that have shortest distance in shortestKnownDistanceFromSource[unvisitedAdjNodeIndex].
        - if found, set it to "currentNodeName".
        - update "currentVisitedDistance" = shortestKnownDistanceFromSource[currentNodeNameINDEX]

        4. Cover scenario: If (unvisitedAdjNodeNames.length ==0, && unvisitedNodesNames.length >0)
        - loop through visitedNodesNames[], find the first nodeName that still have unvisitedAdjNodeNames.
         - if found, set it to "currentNodeName".
        - update "currentVisitedDistance" = shortestKnownDistanceFromSource[currentNodeNameINDEX]

        repeat 1-4..      */

    //----------setup:start----------//
    const visitedNodesNames = [];
    const unvisitedNodesNames = Object.keys(this.nodes); //array
    const nodesNames = unvisitedNodesNames.slice();
    const shortestKnownDistanceFromSource = new Array(
      unvisitedNodesNames.length
    ).fill(Infinity);
    const prevNodesNames = new Array(unvisitedNodesNames.length).fill(null);

    /*  0.Initialized "srcNodeName":
          - "currentNodeName" = "srcNodeName"
          - "currentVisitedDistance" = 0;
          - "currentNodeNameIndex" = nodesNames.indexOf(srcNodeName);
          - shortestKnownDistanceFromSource[currentNodeNameIndex] = currentVisitedDistance;
          - prevNodesNames[currentNodeNameIndex] = currentNodeName;     */
    let currentNodeName = srcNodeName;
    let currentVisitedDistance = 0;
    let currentNodeNameIndex = nodesNames.indexOf(srcNodeName);
    shortestKnownDistanceFromSource[currentNodeNameIndex] =
      currentVisitedDistance;
    prevNodesNames[currentNodeNameIndex] = currentNodeName;
    //----------setup:end----------//

    while (unvisitedNodesNames.length > 0) {
      /* 1.currentNodeName:
        - get all unvisited adjNodes, and update to shortestKnownDistanceFromSource[].
          a. Compare "newDistanceToAdjNode" to "knownDistanceToAdjNode".
          b. newDistanceToAdjNode = currentVisitedDistance + adjNodeDistance
          c. "knownDistanceToAdjNode" = shortestKnownDistanceFromSource[unvisitedAdjNodeIndex].
          d. if "newDistanceToAdjNode" < "knownDistanceToAdjNode"
            - update "newDistanceToAdjNode" to shortestKnownDistanceFromSource[unvisitedAdjNodeIndex].
            - prevNodesNames[currentNodeNameIndex] = currentNodeName;
        - update "unvisitedAdjNodeNames[]" and "unvisitedAdjNodeNamesIndex[]" for later use.        */
      let adjacentNodesNames =
        this.getNode(currentNodeName).getAdjacentNodesNames();
      let adjacentNodesDistances =
        this.getNode(currentNodeName).getLinesDistances();

      let unvisitedAdjNodeNames = [];
      let unvisitedAdjNodeNamesIndex = [];

      //loop through all adjacentNodesNames
      for (let i = 0; i < adjacentNodesNames.length; i++) {
        // find only unvisited adjNodes.
        if (visitedNodesNames.indexOf(adjacentNodesNames[i]) === -1) {
          //add unvisitedAdjNodeNames to Arr for later process.
          unvisitedAdjNodeNames.push(adjacentNodesNames[i]);
          // get newDistanceToAdjNode(unvisited)
          let newDistanceToAdjNode =
            currentVisitedDistance + adjacentNodesDistances[i];
          //get knownDistanceToAdjNode(from table).
          let adjNodeIndex = nodesNames.indexOf(adjacentNodesNames[i]);
          //add unvisitedAdjNodeNamesIndex to Arr for later process
          unvisitedAdjNodeNamesIndex.push(adjNodeIndex);
          let knownDistanceToAdjNode =
            shortestKnownDistanceFromSource[adjNodeIndex];
          let newMinusKnownDistanceToAdjNode =
            newDistanceToAdjNode - knownDistanceToAdjNode;
          if (newMinusKnownDistanceToAdjNode < 0) {
            shortestKnownDistanceFromSource[adjNodeIndex] =
              newDistanceToAdjNode;
            prevNodesNames[adjNodeIndex] = currentNodeName;
          }
        }
      }

      /*  2. push currentNodeName to visited, and pop from unvisited.
            - if "currentNodeName" is not visited yet then do above.      */
      if (visitedNodesNames.indexOf(currentNodeName) === -1) {
        visitedNodesNames.push(currentNodeName);
        let index = unvisitedNodesNames.indexOf(currentNodeName);
        unvisitedNodesNames.splice(index, 1);
      }

      /* 3. Among unvisitedAdjNodeNames[], find adjNodes that have shortest distance in shortestKnownDistanceFromSource[unvisitedAdjNodeIndex].
        - if found, set it to "currentNodeName".
        - update "currentVisitedDistance" = shortestKnownDistanceFromSource[currentNodeNameINDEX]         */
      let shortestAdjNodeDistance = Infinity;
      for (let i = 0; i < unvisitedAdjNodeNames.length; i++) {
        let index = unvisitedAdjNodeNamesIndex[i];
        let knownDistance = shortestKnownDistanceFromSource[index];
        if (knownDistance < shortestAdjNodeDistance) {
          shortestAdjNodeDistance = knownDistance;
          currentNodeName = unvisitedAdjNodeNames[i];
          currentVisitedDistance = knownDistance;
        }
      }

      /*4. Cover scenario: If (unvisitedAdjNodeNames.length ==0, && unvisitedNodesNames.length >0)
        - loop through visitedNodesNames[], find the first nodeName that still have unvisitedAdjNodeNames.
         - if found, set it to "currentNodeName".
        - update "currentVisitedDistance" = shortestKnownDistanceFromSource[currentNodeNameINDEX]       */
      if (
        unvisitedAdjNodeNames.length === 0 &&
        unvisitedNodesNames.length > 0
      ) {
        for (let i = 0; i < visitedNodesNames.length; i++) {
          let found = 0; //0 = not found; 1= found;
          let nodeName = visitedNodesNames[i];
          let adjacentNodesNames =
            this.getNode(nodeName).getAdjacentNodesNames();

          for (let j = 0; j < adjacentNodesNames.length; j++) {
            // find only unvisited adjNodes.
            if (visitedNodesNames.indexOf(adjacentNodesNames[j]) === -1) {
              found = 1;
              currentNodeName = adjacentNodesNames[j];
              currentNodeNameIndex = nodesNames.indexOf(currentNodeName);
              currentVisitedDistance =
                shortestKnownDistanceFromSource[currentNodeNameIndex];
              break;
            }
          }
          if (found === 1) {
            break;
          }
        }
      }
    }
    return {
      sourceNodeName: srcNodeName,
      nodesNames: nodesNames,
      shortestDistanceFromSource: shortestKnownDistanceFromSource,
      prevNodesNames: prevNodesNames,
    };
  }

  // generate a Square Shaped Undirected Graph, using Adjacency List Graph HashMap Implementation
  // each node is linked to neighbouring nodes horizontally and vertically .
  static squareGraphGenerator(nodesPerSide) {
    const graph = new Graph();
    const totalHorizontalNodes = nodesPerSide;
    const totalVerticalNodes = nodesPerSide;
    const nodesNames = [];
    const horizontalDistances = [];
    const verticalDistances = [];
    const adjacentNodesNames = [];
    const adjacentNodesDistances = [];

    (function generateNodes() {
      // add nodeName starting from "a","b"...."z","aa","ab","ac"...
      let charCode = 97; // "a":97, "z":122
      let nodeName = String.fromCharCode(charCode);
      let charPrefix = "";
      for (let row = 0; row < totalVerticalNodes; row++) {
        for (let col = 0; col < totalHorizontalNodes; col++) {
          if (charCode > 122) {
            charCode = 97;
            charPrefix = charPrefix + String.fromCharCode(charCode);
          }
          nodeName = charPrefix + String.fromCharCode(charCode);
          graph.addNode(nodeName);
          nodesNames.push(nodeName);
          charCode++;
        }
      }
    })();

    (function populateLines() {
      let nodesObjs = graph.getNodes(); // {"a": NodeA, "b":NodeB}
      let nodesNames = Object.keys(nodesObjs); // ["a","b"]
      let horizontalDistancesPerRow = [];
      let verticalDistancesPerRow = [];

      for (let i = 0; i < nodesNames.length; i++) {
        // add lines to nodes horizontally
        if ((i + 1) % totalHorizontalNodes !== 0) {
          let randNumb1 = Math.floor(Math.random() * 9 + 1); //random number: 1 to 9

          nodesObjs[nodesNames[i]].addAdjacentNode(
            nodesObjs[nodesNames[i + 1]],
            randNumb1
          );
          nodesObjs[nodesNames[i + 1]].addAdjacentNode(
            nodesObjs[nodesNames[i]],
            randNumb1
          );
          horizontalDistancesPerRow.push(randNumb1);
        } else {
          horizontalDistances.push(horizontalDistancesPerRow);
          horizontalDistancesPerRow = [];
        }
        // add lines to nodes veritically
        if (i < nodesNames.length - totalHorizontalNodes) {
          let randNumb = Math.floor(Math.random() * 9) + 1; //random number: 1 to 9

          //for each node, push above node to it.
          nodesObjs[nodesNames[i]].addAdjacentNode(
            nodesObjs[nodesNames[i + totalHorizontalNodes]],
            randNumb
          );
          nodesObjs[nodesNames[i + totalHorizontalNodes]].addAdjacentNode(
            nodesObjs[nodesNames[i]],
            randNumb
          );
          verticalDistancesPerRow.push(randNumb);
          if (verticalDistancesPerRow.length === totalVerticalNodes) {
            verticalDistances.push(verticalDistancesPerRow);
            verticalDistancesPerRow = [];
          }
        }
      }
    })();

    // get adjacent nodes names and distances.
    for (let i = 0; i < nodesNames.length; i++) {
      let Node = graph.getNode(nodesNames[i]);
      adjacentNodesNames.push(Node.getAdjacentNodesNames());
      adjacentNodesDistances.push(Node.getLinesDistances());
    }

    return {
      nodes: graph,
      nodesNames: nodesNames,
      adjacentNodesNames: adjacentNodesNames,
      adjacentNodesDistances: adjacentNodesDistances,
      rows: totalVerticalNodes,
      columns: totalHorizontalNodes,
      horizontalDistances: horizontalDistances,
      verticalDistances: verticalDistances,
    };
  }
}

export { Graph };
