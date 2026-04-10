import { state } from "./state.js"
import { liveTick, newAction } from "./loop.js";
import { updateUI, bindUI, bindCheat } from "./ui.js";

const TICK_RATE = 0.03; // 1 / framerate

window.state = state;

function setAction(a) {
  state.action = a;
}

bindUI((action, event) => newAction(action, event, state));
bindCheat((action, event) => {
  liveTick(state.duration - state.curtime, state);
  updateUI();
})

let lastTime = Date.now();

function animationCallback() {
  const now = Date.now();
  const delta = (now - lastTime) / 1000; // seconds
  //update when delta exceeds framerate cap
  if(delta >= TICK_RATE) {
    lastTime = now;
    //console.log("live tick:", delta)
    liveTick(delta, state);
    updateUI();
  }
  //queue next frame
  requestAnimationFrame(animationCallback);
}
//queue first frame
requestAnimationFrame(animationCallback);

/*
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
