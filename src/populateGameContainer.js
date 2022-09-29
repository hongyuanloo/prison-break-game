/*return a "node" class div with given nodeName and coordinates.
    <div class="node" style="left: 406.833px; top: 159.719px;">b</div>*/
const nodeDiv = function (nodeName, coordinateX, coordinateY) {
  const div = document.createElement("div");
  div.classList.add("node");
  div.innerText = nodeName;
  div.style.left = coordinateX + "px";
  div.style.top = coordinateY + "px";
  return div;
};

/* return a "lineContainer" class div that contains "horizontalLine_div" and "horizontalLineText_h2"
<div class="lineContainer" style="left: 223.5px; top: 199.719px;">
  <div class="horizontalLine" style="width: 223.333px;"></div>
  <h2 class="horizontalLineText" style="left: 101.515px;">3</h2>
</div>;*/
const horizontalLineDiv = function (
  lineLength,
  lineText,
  coordinateX,
  coordinateY
) {
  //return a "lineContainer" class div that contains "horizontalLine_div" and "horizontalLineText_h2"
  const lineContainer_div = document.createElement("div");
  lineContainer_div.classList.add("lineContainer");

  const horizontalLine_div = document.createElement("div");
  horizontalLine_div.classList.add("horizontalLine");
  horizontalLine_div.style.width = lineLength + "px";

  const horizontalLineText_h2 = document.createElement("h2");
  horizontalLineText_h2.classList.add("horizontalLineText");
  horizontalLineText_h2.innerText = lineText;
  horizontalLineText_h2.style.left = lineLength / 2.2 + "px";
  // horizontalLineText_h2.style.top = 0 + "px";
  // horizontalLineText_h2.style.left = lineLength / 2 + "px";
  // horizontalLineText_h2.style.top = -lineLength / 3 + "px";

  lineContainer_div.append(horizontalLine_div, horizontalLineText_h2);
  lineContainer_div.style.left = coordinateX + "px";
  lineContainer_div.style.top = coordinateY + "px";

  return lineContainer_div;
};

/*  return a "lineContainer" class div that contains "verticalLine_div" and "verticalLineText_h2"
        <div class="lineContainer" style="left: 893.5px; top: 199.719px;">
            <div class="verticalLine" style="height: 223.333px;"></div>
            <h2 class="verticalLineText" style="top: 60.3604px;">5</h2>
        </div>;*/
const verticalLineDiv = function (
  lineLength,
  lineText,
  coordinateX,
  coordinateY
) {
  //return a "lineContainer" class div that contains "verticalLine_div" and "verticalLineText_h2"
  const lineContainer_div = document.createElement("div");
  lineContainer_div.classList.add("lineContainer");

  const verticalLine_div = document.createElement("div");
  verticalLine_div.classList.add("verticalLine");
  verticalLine_div.style.height = lineLength + "px";

  const verticalLineText_h2 = document.createElement("h2");
  verticalLineText_h2.classList.add("verticalLineText");
  verticalLineText_h2.innerText = lineText;
  verticalLineText_h2.style.top = lineLength / 3.7 + "px";

  lineContainer_div.append(verticalLine_div, verticalLineText_h2);
  lineContainer_div.style.left = coordinateX + "px";
  lineContainer_div.style.top = coordinateY + "px";

  return lineContainer_div;
};

/*  1.append nodes, lines, distances and event listeners to gameContainer.
    2.initialized start node and final node.*/
const populateGameContainer = function (
  gameContainerSetupVar,
  updateUserSelection,
  TIME_SECONDS
) {
  const {
    //squareGraphSetupVar//
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
    //gameContainerSetup1//
    gameContainer,
    userSelectionsSelector,
    clearanceToBorder,
    nodeDia,
    distBetweenNode,
    userSolution,
    messageSelector,
    userScoreSelector,
    currentLevelSelector,
    user,
    unlockedLevelSelector,
  } = gameContainerSetupVar;

  //---Append nodes and event listeners---//
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      let newNode = nodeDiv(
        nodesNames[row * rows + col],
        distBetweenNode * col + clearanceToBorder,
        distBetweenNode * row + clearanceToBorder
      );
      gameContainer.append(newNode);
      newNode.addEventListener(
        "click",
        updateUserSelection(gameContainerSetupVar)
      );
    }
  }

  //---Append horizontal lines---//
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns - 1; col++) {
      let distance = horizontalDistances[row][col];
      gameContainer.append(
        horizontalLineDiv(
          distBetweenNode,
          distance,
          distBetweenNode * col + clearanceToBorder + nodeDia,
          distBetweenNode * row + clearanceToBorder + nodeDia
        )
      );
    }
  }

  //---Append vertical lines---//
  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < columns; col++) {
      let randomNumber = Math.floor(Math.random() * 9) + 1; //1-9
      let distance = verticalDistances[row][col];
      gameContainer.append(
        verticalLineDiv(
          distBetweenNode,
          distance,
          distBetweenNode * col + clearanceToBorder + nodeDia,
          distBetweenNode * row + clearanceToBorder + nodeDia
        )
      );
    }
  }

  //---Initialized start node---//
  //auto select node1, style it and push to "userSolution"
  const nodeOne = document.querySelector(".node:first-child");
  nodeOne.classList.add("startNode");
  nodeOne.removeEventListener(
    "click",
    updateUserSelection(gameContainerSetupVar)
  );
  userSolution.push(startNode);
  userSelectionsSelector.append(userSolution);

  //---Initialized final node---//
  let childNumber = nodesNames.indexOf(finalNode) + 1;
  const nodeFinal = document.querySelector(`.node:nth-child(${childNumber})`);
  nodeFinal.classList.add("endNode");

  //---Initialized user information---//
  userScoreSelector.innerText = user.score;
  currentLevelSelector.innerText = user.currentLevel;
  unlockedLevelSelector.innerText = user.unlockedLevel;
  let messageText = `Welcome to Prison Break Game.

  Mission for prison escape: 
  - Find shortest path from '${startNode}' to '${finalNode}'.
  - '${startNode}' is pre-selected, start with next Node.
  
  **To win: Complete all 3 levels or score 60 points within ${TIME_SECONDS}s.`;
  messageSelector.innerText = messageText;
};
export { populateGameContainer };
