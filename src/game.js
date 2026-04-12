
import { 
  initTimeLoopLogic,
  liveTickAllLoops } from "./logic/logic_timeloops.js";

import { 
  initUI,
  renderGame, 
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
  initUI(gameState, {
    gain: gainSparetime,
    spend: spendSparetime
  });

  //calculate offline progress and reset lasttime
  const now = Date.now();
  //const game_delta = (now - gameState.lasttime) / 1000; // seconds
  //console.log(now, gameState.lasttime, game_delta);

  gameState.lasttime = now;
  gameState.lastAutosave = now - 900;

  initTimeLoopLogic(gameState);

  //TODO calc progress with cap/limiting
  //liveTickAllLoops(game_delta, gameState);
  //uncomment last line to update offline progress
  
  //finally update ui
  renderGame(gameState);
}

export function gainSparetime(value) {
  if(value <= 0) { return; }
  gameState.sparetime += value;
  pulseElement(document.getElementById('sparetime'));
  //pulse green
}

export function spendSparetime(value) {
  if(value <= 0) { return null; }
  if(gameState.sparetime < value) { return false; }
  gameState.sparetime -= value;
  //pulse red?
  return true;
}

//main update loop
function animationCallback() {
  const now = Date.now();
  const game_delta = (now - gameState.lasttime) / 1000; // seconds
  const save_delta = (now - gameState.lastAutosave) / 1000;

  //update when delta exceeds framerate cap
  if(game_delta >= TICK_RATE) {
    //calculate delta for next game tick
    gameState.lasttime = now;
    gameState.nextsave = SAVE_RATE - save_delta;
    //console.log("live tick:", delta)

    gainSparetime(liveTickAllLoops(game_delta, gameState));

    renderGame(gameState);
    //TODO update modal?? - in ui
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
