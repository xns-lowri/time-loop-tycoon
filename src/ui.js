import { formatDecimalAsTime } from "./time_format.js";

export function updateUI(state) {
  document.getElementById('sparetime').textContent = formatDecimalAsTime(state.sparetime);

  for(const loop of state.timeloops) {
    updateLoopCard(loop);
  }
}

export function updateLoopCard(loop) {
  const card = document.getElementById(loop.cardname);
  if(card === null) { return; }

  card.querySelector('#curtime').textContent = loop.curtime.toFixed(1);
  card.querySelector('#duration').textContent = loop.duration.toFixed(0);
  card.querySelector('#loop').textContent = loop.loops;
  card.querySelector('#resource').textContent = loop.resource.toFixed(2);
  card.querySelector('#knowledge').textContent = loop.knowledge.toFixed(1);
  card.querySelector('#rested').textContent = loop.rested.toFixed(2);
  card.querySelector('#action').textContent = loop.action || 'none';
  card.querySelector("#loop-progress-bar").style.width = ((loop.curtime/loop.duration) * 100) + "%";
}

export function bindLoopUI(state, loop, actionHandler, cheatHandler) {
  bindLoopControls(loop, (action) => actionHandler(action, loop));
  bindLoopCheats(loop, (action) => cheatHandler(state, action, loop));
}

export function bindLoopControls(loop, handler) {
  const card = document.getElementById(loop.cardname);
  if(card === null) { return; }

  card.querySelector("#work").onclick = () => handler("work");
  card.querySelector("#study").onclick = () => handler("study");
  card.querySelector("#sleep").onclick = () => handler("sleep");
}

export function bindLoopCheats(loop, handler) {
  const card = document.getElementById(loop.cardname);
  if(card === null) { return; }

  card.querySelector("#skip").onclick = () => handler("cheat-skiploop");
  card.querySelector("#add1").onclick = () => handler("cheat-loopadd1");
  card.querySelector("#add10").onclick = () => handler("cheat-loopadd10");
}