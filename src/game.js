
import { 
  liveTickAllLoops, 
  loopUpdateAction, 
  loopUpdateCheat,
  loopUpgrades } from "./logic/logic_timeloops.js";

import { 
  initUI,
  updateUI, 
  bindMainUI, 
  pulseElement } from "./ui.js";

import { 
  initGame, 
  loadGame, 
  saveGame } from "./state_manager.js";


const TICK_RATE = 0.03; // 1 / framerate ~30fps limit
const SAVE_RATE = 15;   //save every 15s

let gameState = null;

//get latest autosave or blank, set state and bind controls
startGame(initGame(null));
window.state = gameState; //supposedly for debug but idk where to see it

function startGame(state) {
  gameState = state; //bind new state
  //init game
  bindMainUI(gameState, {
      save: saveGame,
      load: loadGame,
      reset: () => startGame(initGame(null, false)),
      autoload: () => startGame(initGame(null, true)),
  });

  //todo build ui stuff including:
  initUI(gameState);

  //calculate offline progress and reset lasttime
  const now = Date.now();
  //const game_delta = (now - gameState.lasttime) / 1000; // seconds
  //console.log(now, gameState.lasttime, game_delta);

  gameState.lasttime = now;
  gameState.lastAutosave = now - 900;

  //TODO calc progress with cap/limiting
  //liveTickAllLoops(game_delta, gameState);
  
  //finally update ui
  updateUI(gameState);
}

//main update loop
function animationCallback() {
  const now = Date.now();
  const game_delta = (now - gameState.lasttime) / 1000; // seconds
  const save_delta = (now - gameState.lastAutosave) / 1000;

  //update when delta exceeds framerate cap
  if(game_delta >= TICK_RATE) {
    gameState.lasttime = now;
    gameState.nextsave = SAVE_RATE - save_delta;
    //console.log("live tick:", delta)
    const sparetime = liveTickAllLoops(game_delta, gameState);
    updateUI(gameState);
    //TODO update modal??

    //console.log(`Gained ${sparetime} spare time`)
    if(sparetime > 0) {
      pulseElement(document.getElementById('sparetime'));
    }
  }

  //autosave
  if(save_delta >= SAVE_RATE) {
    //todo autosave
    saveGame(gameState, true);
    //todo autosave label
    gameState.lastAutosave = now;
  }

  //queue next frame
  requestAnimationFrame(animationCallback);
}
//queue first frame
requestAnimationFrame(animationCallback);

/*
//eeee dead slow n cpu hungy
setInterval(() => {
  const now = Date.now();
  const delta = (now - lastTime) / 1000; // seconds
  lastTime = now;
  //console.log("live tick:", delta)
  liveTick(delta);
  updateUI();
}, 
TICK_RATE * 1000);
*/
