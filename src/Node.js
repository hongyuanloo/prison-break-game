//-----------------//
// Node class
//-----------------//
class Node {
  constructor(nodeName) {
    this.name = nodeName;
    this.adjacentNodes = []; //array of Node objects
    this.linesDistances = []; //array of numbers
  }
  #findAdjacentNodeIndex(node) {
    // if "node" is found in "this.adjacentNodes", return its index, else "-1"
    let foundIndex = -1;
    for (let i = 0; i < this.adjacentNodes.length; i++) {
      if (this.adjacentNodes[i] === node) {
        foundIndex = i;
      }
    }
    return foundIndex;
  }
  setName(newName) {
    // validate if newName is string
    const oldName = this.name;
    if (typeof newName === "string") {
      this.name = newName;
      return this.getName();
    } else {
      return `'${newName}' is not a string.`;
    }
  }
  getName() {
    return this.name;
  }
  getAdjacentNodes() {
    return this.adjacentNodes;
  }
  getAdjacentNodesNames() {
    const adjacentNodesNames = [];
    this.adjacentNodes.forEach((adjacentNode) => {
      adjacentNodesNames.push(adjacentNode.getName());
    });
    return adjacentNodesNames;
  }
  addAdjacentNode(node, lineDistance) {
    // if "node" doesn't exist, update by pushing "this.adjacentNodes" and "this.linesDistances"
    let foundIndex = this.#findAdjacentNodeIndex(node);
    if (foundIndex == -1) {
      this.adjacentNodes.push(node);
      this.linesDistances.push(lineDistance);
      return lineDistance;
    } else {
      return `'${node}' already exist.`;
    }
  }
  getLinesDistances() {
    return this.linesDistances;
  }
  setLineDistance(num, node) {
    // if "node" is one of "this.adjacentNodes" , overwrite its linesDistances value.
    // check if "this.adjacentNodes" contains "node". if yes, overwrite its linesDistances value.
    // then, recursely call "node.setLineDistance(value, this)" to update linesDistances value of "this" inside node.

    // validate if num is numeric
    let value;
    if (isNaN(num) === false && num > 0) {
      value = Number.parseInt(num);
    } else {
      return `'${num}' is not a number.`;
    }

    let foundIndex = this.#findAdjacentNodeIndex(node);
    if (foundIndex !== -1) {
      if (this.linesDistances[foundIndex] == value) {
        return;
      } else {
        this.linesDistances[foundIndex] = value;
        node.setLineDistance(value, this);
      }
      return value;
    } else {
      return `'${node}' is not found.`;
    }
  }
}

export { Node };
