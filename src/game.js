
import { liveTickAllLoops, liveTickLoop, loopUpdateAction } from "./time_loops.js";
import { updateUI, bindLoopControls, bindLoopCheats } from "./ui.js";
import { initGameState } from "./state_manager.js";

const TICK_RATE = 0.03; // 1 / framerate ~30fps limit
const gameState = initGameState();

window.state = gameState; //supposedly for debug but idk where to see it


//main update loop
function animationCallback() {
  const now = Date.now();
  const delta = (now - gameState.lastTime) / 1000; // seconds
  //update when delta exceeds framerate cap
  if(delta >= TICK_RATE) {
    gameState.lastTime = now;
    //console.log("live tick:", delta)
    liveTickAllLoops(delta, gameState);
    updateUI(gameState);
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
