import { formatDecimalAsTime, capitalFirst } from "./helpers/string_format.js";

/* TOP LEVEL (MAIN UI) RENDERING */
//render (update) main UI elements
export function updateUI(state) {
  document.getElementById('sparetime').textContent = formatDecimalAsTime(state.sparetime);
  document.getElementById('next-autosave').textContent = 
    state.lasttime - state.lastAutosave < 800 ?
    "Saved!" :
    `Next save in: ${state.nextsave.toFixed(1)}s`;
  //console.log(state.lasttime - state.lastAutosave);
  //todo later phases, switch or handler functions for each phase?
  for(const loop of state.timeloops) {
    updateLoopCard(loop);
  }
}

export function pulseElement(element) {
  element.classList.remove("pulse");
  element.classList.add("pulse");
  setTimeout(() => element.classList.remove("pulse"), 200);
}
/* TOP-LEVEL RENDERING */


/* LOOP CARD (PHASE 1) RENDERING FUNCTIONS */
export function updateLoopCard(loop) {
  const card = document.getElementById(loop.cardname);
  if(card === null) { return; }

  card.querySelector('#curtime').textContent = loop.curtime.toFixed(1);
  card.querySelector('#duration').textContent = loop.duration.toFixed(0);
  card.querySelector('#loop').textContent = loop.loops;
  card.querySelector('#resource').textContent = loop.resource.toFixed(2);
  card.querySelector('#knowledge').textContent = loop.knowledge.toFixed(1);
  card.querySelector('#rested').textContent = loop.rested.toFixed(2);
  card.querySelector('#action').textContent = capitalFirst(loop.action || 'idle');
  card.querySelector("#loop-progress-bar").style.width = ((loop.curtime/loop.duration) * 100) + "%";
}

export function updateLoopActionButtons(loop) {
  const card = document.getElementById(loop.cardname);
  if(card === null) { return; }

  card.querySelectorAll("button.action-btn")
    .forEach(btn => btn.classList.remove("active-action"));

  if(loop.action === null) { return; }

  card.querySelector(`#${loop.action}`).classList.add("active-action");
}
/* LOOP CARD (PHASE1) */
//todo split out ui updates into modules?


/* UX CONTROL BINDINGS FOR INIT */
//bindings for main UI
export function bindMainUI(state, handlers) {
  document.getElementById("saveGame").onclick = () => handlers.save(state, false);
  document.getElementById("loadGame").onclick = () => handlers.load(false);
  document.getElementById("resetGame").onclick = () => handlers.reset();
  document.getElementById("autosave").onclick = () => handlers.save(state, true);
  document.getElementById("autoload").onclick = () => handlers.autoload();
}

// bindings for time loop (phase 1) controls
export function bindLoopUI(state, loop, handlers) {
  bindLoopControls(loop, (action, loop) => handlers.action(action, loop));
  //todo bind augment+automation window buttons
  bindLoopCheats(loop, (action, loop) => handlers.cheat(state, action, loop));
}

export function bindLoopControls(loop, handler) {
  const card = document.getElementById(loop.cardname);
  if(card === null) { return; }

  card.querySelector("#work").onclick = () => handler("work", loop);
  card.querySelector("#study").onclick = () => handler("study", loop);
  card.querySelector("#sleep").onclick = () => handler("sleep", loop);
}

export function bindLoopCheats(loop, handler) {
  const card = document.getElementById(loop.cardname);
  if(card === null) { return; }

  card.querySelector("#skip").onclick = () => handler("cheat-skiploop", loop);
  card.querySelector("#add1").onclick = () => handler("cheat-loopadd1", loop);
  card.querySelector("#add10").onclick = () => handler("cheat-loopadd10", loop);
}
/* UX BINDINGS */