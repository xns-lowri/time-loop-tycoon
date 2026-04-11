
import { liveTickAllLoops, loopUpdateAction, loopUpdateCheat } from "./time_loops.js";
import { updateUI, updateLoopActionButtons, bindMainUI, bindLoopUI, pulseElement } from "./ui.js";
import { initGameState, loadGame, saveGame } from "./state_manager.js";

const TICK_RATE = 0.03; // 1 / framerate ~30fps limit
const SAVE_RATE = 15;   //save every 15s

let gameState = null;

//get latest autosave or blank, set state and bind controls
bindNewState(initGameState(null));
window.state = gameState; //supposedly for debug but idk where to see it

function bindNewState(state) {
  gameState = state; //bind new state
  //init game
  bindMainUI(gameState, {
      save: saveGame,
      load: loadGame,
      reset: () => bindNewState(initGameState(null, false)),
      autoload: () => bindNewState(loadGame(true)),
  });

  //todo build ui stuff including:
  //todo add correct number of loop cards
  for(const loop of gameState.timeloops) {
      //todo
    //const card = document.getElementById(loop.cardname);
    //todo ui building based on game state/phase etc
    bindLoopUI(state, loop, { 
      action: (action, loop) => {
        loopUpdateAction(action, loop);
        updateLoopActionButtons(loop);
      }, 
      cheat: (state, action, loop) => {
        const sparetime = loopUpdateCheat(action, loop);
        if(sparetime > 0) {
          state.sparetime += sparetime;
          pulseElement(document.getElementById('sparetime'));
        }
      }
    });
    //set css class for decorating active action button
    updateLoopActionButtons(loop);
  }

  gameState.lasttime = Date.now();
  gameState.lastAutosave = Date.now() - 900;
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
