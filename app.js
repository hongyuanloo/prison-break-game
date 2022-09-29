import { gameContainerSetup } from "./src/gameContainerSetup.js";
import { populateGameContainer } from "./src/populateGameContainer.js";

/*  1.calculate the distance from a given "nodeNamesArr"    */
const getPathDistance = function (nodeNamesArr, gameContainerSetupVar) {
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
    //gameContainerSetup//
    gameContainer,
    userSelectionsSelector,
    clearanceToBorder,
    nodeDia,
    distBetweenNode,
    gameContainerCoordinateX,
    gameContainerCoordinateY,
    userSolution,
    messageSelector,
    userScoreSelector,
    currentLevelSelector,
    user,
    unlockedLevelSelector,
  } = gameContainerSetupVar;

  let sumDistance = 0;
  for (let i = 0; i < nodeNamesArr.length - 1; i++) {
    let startNodeIndex = nodesNames.indexOf(nodeNamesArr[i]);
    let adjNodeNames = adjacentNodesNames[startNodeIndex];
    let adjNodeIndexOfNextNode = adjNodeNames.indexOf(nodeNamesArr[i + 1]);
    sumDistance +=
      adjacentNodesDistances[startNodeIndex][adjNodeIndexOfNextNode];
  }
  return sumDistance;
};

/*  1.Compare user solution to PC solution.
    2.Both solutions must have same number of nodes.
    3.if sum distance for both solutions is same, return true.
    4.if both solutions exact answer(compare each element in array), 
    return true. 
    */
const isSolutionCorrect = function (gameContainerSetupVar) {
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
    //gameContainerSetup//
    gameContainer,
    userSelectionsSelector,
    clearanceToBorder,
    nodeDia,
    distBetweenNode,
    gameContainerCoordinateX,
    gameContainerCoordinateY,
    userSolution,
    messageSelector,
    userScoreSelector,
    currentLevelSelector,
    user,
    unlockedLevelSelector,
  } = gameContainerSetupVar;

  //---Both solutions must have same number of nodes.---//
  if (shortestPathNodesNamesSolution.length !== userSolution.length) {
    return false;
  }
  //---if sum distance for both solutions is same, return true.---//
  if (
    getPathDistance(shortestPathNodesNamesSolution, gameContainerSetupVar) ===
    getPathDistance(userSolution, gameContainerSetupVar)
  ) {
    return true;
  }

  return false;
};

/*  1."click" event Handler of user selection.
    2.On adjacent nodes selection:
        - toggle to "selected"
        - update "userSolution"
        - if it is last node, invoke "isSolutionCorrect"  
    */
const updateUserSelection = function (gameContainerSetupVar) {
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
    //gameContainerSetup//
    gameContainer,
    userSelectionsSelector,
    clearanceToBorder,
    nodeDia,
    distBetweenNode,
    gameContainerCoordinateX,
    gameContainerCoordinateY,
    userSolution,
    messageSelector,
    userScoreSelector,
    currentLevelSelector,
    user,
    unlockedLevelSelector,
  } = gameContainerSetupVar;

  return function (event) {
    /*click event handler.
            when user click on a node, append/remove it from "userSolution"*/
    let nodeName = event.target.innerText;
    let isSelected = event.target.classList.contains("selected");
    let lastInsertedNodeName = userSolution[userSolution.length - 1];

    //---if selection !== "startNode"---//
    if (nodeName !== startNode) {
      let adjNodesNames = nodes
        .getNode(lastInsertedNodeName)
        .getAdjacentNodesNames();
      //---if selection is adjNode of "lastInsertedNodeName" && is not selected---//
      if (isSelected === false && adjNodesNames.indexOf(nodeName) !== -1) {
        userSolution.push(nodeName);
        event.target.classList.add("selected");
        //---if it is final node, check solution.---//
        if (nodeName === finalNode) {
          if (isSolutionCorrect(gameContainerSetupVar) === true) {
            //---update score ---//
            user.score += user.currentLevel * 10;
            userScoreSelector.innerText = user.score;

            //---if currLevel !=3, update unlockedLevel ---//
            let currLevel = user.currentLevel;
            let unlockLevel = user.unlockedLevel;
            if (currLevel === unlockLevel && currLevel !== 3) {
              user.unlockedLevel++;
              unlockedLevelSelector.innerText = user.unlockedLevel;
            }
            //---if user scored "targetScore" before time limit ---//
            if (user.score === user.targetScore && currLevel != 3) {
              currLevel = "targetScore";
            }
            let message;
            switch (currLevel) {
              case 1:
              case 2:
                message = `Congratulations!

                You have completed level ${currLevel} and progressed to level ${user.unlockedLevel}.
                
                To move to other game level, select:
                    [Previous Level]: New Game on PREVIOUS level.
                    [Next Level]: New Game on NEXT level.`;
                nextLevelGame(message);
                break;
              case 3:
                stopTimer();
                message = `Congratulations! You Win!
                    You have completed all ${user.unlockedLevel} levels.`;
                messageSelector.innerText = message;
                openPopUpBox(
                  "Mission Accomplised",
                  `Congratulations! You have completed all ${user.unlockedLevel} levels.` +
                    " \nYou are free now. \nHelp your friend to escape by playing [New Game]?"
                );
                break;
              case "targetScore":
                stopTimer();
                message = `Congratulations! You Win!
                    You just scored ${user.score} points.`;
                messageSelector.innerText = message;
                openPopUpBox(
                  "Mission Accomplised",
                  `Congratulations! You just scored ${user.score} points.` +
                    "\nYou are free now. \nHelp your friend to escape by playing [New Game]?"
                );
                break;
              default:
                console.log(`not supposed to show up`);
            }
          } else {
            messageSelector.innerText = "Good attemp! Try again.";
          }
        }
      }
      //---if selection is "lastInsertedNodeName", unselect it---//
      if (
        isSelected === true &&
        nodeName === lastInsertedNodeName &&
        lastInsertedNodeName !== startNode
      ) {
        userSolution.pop();
        event.target.classList.remove("selected");
      }
      //---if selection is not adjNode of "lastInsertedNodeName" && is not selected---//
      if (isSelected === false && adjNodesNames.indexOf(nodeName) === -1) {
        // TODO add some CSS to highlight where is the last node.
        messageSelector.innerText = "Non-adjacent node is selected.";
      }
    } else {
      //---if selection === "startNode"---//
      // TODO add CSS to tell user select next node.
    }

    //---display user selections---//
    userSelectionsSelector.textContent = "";
    let userSolution_processed = userSolution
      .toString()
      .replaceAll(",", " -- ");
    userSelectionsSelector.append(userSolution_processed);
    // process to display a -- b -- c -- d
  };
};

/*  Reset: "gameContainer", "userSelectionsSelector", "messageSelector", "userSolution" */
const resetToDefault = function () {
  gameContainer.textContent = "";
  userSelectionsSelector.textContent = "";
  messageSelector.textContent = "Click 'a' to start.";
  //empty "userSolution"
  if (userSolution.length !== 0) {
    userSolution.splice(0, userSolution.length);
  }
};

/*  Setup new game with "userInformation" */
const setupGameLevel = function (totalNodesPerSide, userInformation) {
  const gameContainerSetupVar = gameContainerSetup(
    totalNodesPerSide,
    userInformation
  );
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
    //gameContainerSetup//
    gameContainer,
    userSelectionsSelector,
    clearanceToBorder,
    nodeDia,
    distBetweenNode,
    gameContainerCoordinateX,
    gameContainerCoordinateY,
    userSolution,
    messageSelector,
    userScoreSelector,
    currentLevelSelector,
    user,
    unlockedLevelSelector,
  } = gameContainerSetupVar;
  Object.assign(user, userInformation);
  populateGameContainer(
    gameContainerSetupVar,
    updateUserSelection,
    TIME_SECONDS
  );
};

/*  Reset and setup new game with same game level.
    - keep user information.*/
const newGame = function () {
  stopTimer();
  toggleSoundOn();
  let reset_userInformation = {
    score: 0,
    currentLevel: 1, //level 1 to 3 equals to totalNodesPerSide: 4 to 6
    unlockedLevel: 1,
    targetScore: 60,
    startNode: "--",
    finalNode: "--",
  };
  Object.assign(user, reset_userInformation); //reset user infor
  Object.assign(userInformation, user);
  resetToDefault();
  let gameLevel = 4;
  setupGameLevel(gameLevel, userInformation);

  startTimer(TIME_SECONDS, DELAY_MILISECONDS);
};

/*  Reset and setup new game with NEXT game level.
    - keep user information.*/
const nextLevelGame = function (message) {
  Object.assign(userInformation, user);
  let currLevel = userInformation.currentLevel;
  let unlockLevel = userInformation.unlockedLevel;
  let nextGameLevel = currLevel + 3;

  if (unlockLevel - currLevel > 0) {
    // if currLevel < unlockLevel,  user.currentLevel++
    nextGameLevel++;
    userInformation.currentLevel++;
  }
  resetToDefault();
  setupGameLevel(nextGameLevel, userInformation);
  messageSelector.innerText = message;
};

/*  Reset and setup new game with NEXT game level.
    - keep user information.
    - with additional text message.*/
const nextLevelGameEventHandler = function (message) {
  let currLevel = user.currentLevel;
  if (user.currentLevel < user.unlockedLevel) {
    currLevel = user.currentLevel + 1;
  }

  nextLevelGame("");

  let messageText = `Level: ${currLevel} is selected.
  
  Mission for prison escape: 
  - Find shortest path from '${user.startNode}' to '${user.finalNode}'.
  - '${user.startNode}' is pre-selected, start with next Node.
  
  **To win: Complete all 3 levels or score ${user.targetScore} points within ${TIME_SECONDS}s.`;
  messageSelector.innerText = messageText;
  // nextLevelGame(messageText);
};

/*  Reset and setup new game with PREVIOUS game level.
    - keep user information.
    - with additional text message.*/
const previousLevelGameEventHandler = function () {
  Object.assign(userInformation, user);

  let currLevel = userInformation.currentLevel;
  let previousGameLevel = currLevel + 3;
  if (currLevel > 1) {
    userInformation.currentLevel--;
    previousGameLevel--;
  }
  resetToDefault();
  setupGameLevel(previousGameLevel, userInformation);

  let messageText = `Level: ${user.currentLevel} is selected.

  Mission for prison escape: 
  - Find shortest path from '${user.startNode}' to '${user.finalNode}'.
  - '${user.startNode}' is pre-selected, start with next Node.
  
  **To win: Complete all 3 levels or score ${user.targetScore} points within ${TIME_SECONDS}s.`;
  messageSelector.innerText = messageText;
};

/*  openPopUpBox with messages*/
const openPopUpBox = function (headerMessage, contentMessage) {
  popUpBoxOverlaySelector.style.display = "flex";
  popUpBoxHeaderSelector.innerText = headerMessage;
  popUpBoxContentSelector.innerText = contentMessage;
};

/*  closePopUpBox and launch new game.*/
const closePopUpBox = function () {
  popUpBoxOverlaySelector.style.display = "none";
  newGame();
};

const toggleSoundOn = function () {
  muteSelector.style.display = "none";
  unmuteSelector.style.display = "inline-block";
  audio.currentTime = 0; //rewind to 0second (stop the audio)
  audio.play();
};

const toggleSoundOff = function () {
  muteSelector.style.display = "inline-block";
  unmuteSelector.style.display = "none";
  audio.pause();
};

/*  countdown from "TIME_SECONDS".*/
const countDownCounter = function () {
  timeCountSelector.innerText = timeCounter;
  if (timeCounter <= 0) {
    stopTimer();
    openPopUpBox(
      "Time Out!",
      `Score: ${user.score} points` +
        "\nGood attempt. You are smarter now. \nTry again [New Game]?"
    );
  }
  timeCounter--;
};

/*  start countdown timer from "TIME_SECONDS".*/
const startTimer = function (totalSeconds, ms_delay) {
  timeCounter = totalSeconds;
  timeout = setInterval(countDownCounter, ms_delay);
};

/*  stop countdown timer.*/
const stopTimer = function () {
  clearTimeout(timeout);
};

//*-----------------//
//* Main:Start here
//*-----------------//
//---Initialize user's information---//
const userInformation = {
  score: 0,
  currentLevel: 1, //level 1 to 3 equals to totalNodesPerSide: 4 to 6
  unlockedLevel: 1,
  targetScore: 60,
  startNode: "--",
  finalNode: "--",
};

//---Initialize timer---//
const TIME_SECONDS = 200;
const DELAY_MILISECONDS = 1000;
let timeCounter;
let timeout;
startTimer(TIME_SECONDS, DELAY_MILISECONDS);

//---First Game Setup---//
const gameContainerSetupVar = gameContainerSetup(4, userInformation);
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
  //gameContainerSetup//
  gameContainer,
  userSelectionsSelector,
  clearanceToBorder,
  nodeDia,
  distBetweenNode,
  gameContainerCoordinateX,
  gameContainerCoordinateY,
  userSolution,
  messageSelector,
  userScoreSelector,
  currentLevelSelector,
  user,
  unlockedLevelSelector,
} = gameContainerSetupVar;
populateGameContainer(gameContainerSetupVar, updateUserSelection, TIME_SECONDS);

//---Selectors and Event Listeners---//
const newGameSelector = document.getElementById("newGame");
const nextLevelSelector = document.getElementById("nextLevel");
const previousLevelSelector = document.getElementById("previousLevel");

const popUpBoxOverlaySelector = document.getElementById("popUpBox-overlay");
const closePopUpBoxButton = document.getElementById("close-popUpBox");
const popUpBoxHeaderSelector = document.getElementById("popUpBox-header");
const popUpBoxContentSelector = document.getElementById("popUpBox-content");

const unmuteSelector = document.getElementById("unmute");
const muteSelector = document.getElementById("mute");

const timeCountSelector = document.getElementById("timeCount");

newGameSelector.addEventListener("click", newGame);
nextLevelSelector.addEventListener("click", nextLevelGameEventHandler);
previousLevelSelector.addEventListener("click", previousLevelGameEventHandler);
closePopUpBoxButton.addEventListener("click", closePopUpBox);
unmuteSelector.addEventListener("click", toggleSoundOff);
muteSelector.addEventListener("click", toggleSoundOn);
timeCountSelector.addEventListener("click", countDownCounter);

//---Autoplay Audio---//
const audio = new Audio("./audio/The-Pink-Panther-Theme-Song.mp3");
toggleSoundOff();
