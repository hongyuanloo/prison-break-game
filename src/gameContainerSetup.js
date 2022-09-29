import { squareGraphSetup } from "./squareGraphSetup.js";

const gameContainerSetup = function (totalNodesPerSide, userInformation) {
  //---Setup for squareGraphSetupVar---//
  const squareGraphSetupVar = squareGraphSetup(totalNodesPerSide);
  const {
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
  } = squareGraphSetupVar;

  //---Element Selectors---//
  const gameContainer = document.querySelector(".gameContainer");
  const userSelectionsSelector = document.getElementById("userSelections");

  //---Initialization: gameContainer and Node Setup---//
  const clearanceToBorder = 20;
  const nodeDia = 40;
  const gameContainerWidth = gameContainer.offsetWidth; // width and height same size.
  const distBetweenNode =
    (gameContainerWidth - (clearanceToBorder + nodeDia) * 2) / (columns - 1);

  //element to display message to user.
  const messageSelector = document.getElementById("message");
  const userScoreSelector = document.getElementById("userScore");
  const currentLevelSelector = document.getElementById("currentLevel");
  const unlockedLevelSelector = document.getElementById("unlockedLevel");

  //store node names of user selection.
  const userSolution = [];

  //store user's information.
  const user = userInformation;
  user.startNode = startNode;
  user.finalNode = finalNode;

  return {
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
    //gameContainerSetup//
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
  };
};

export { gameContainerSetup };
