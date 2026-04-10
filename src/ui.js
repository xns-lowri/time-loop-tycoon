import { state } from "./state.js";
import { formatDecimalAsTime } from "./timeFormat.js";

export function updateUI() {
  document.getElementById('sparetime').textContent = formatDecimalAsTime(state.sparetime);

  document.getElementById('curtime').textContent = state.curtime.toFixed(1);
  document.getElementById('duration').textContent = state.duration.toFixed(0);
  document.getElementById('loop').textContent = state.loop;
  document.getElementById('resource').textContent = state.resource.toFixed(2);
  document.getElementById('knowledge').textContent = state.knowledge.toFixed(1);
  document.getElementById('rested').textContent = state.rested.toFixed(2);
  document.getElementById('action').textContent = state.action || 'none';
  document.getElementById("loop-progress-bar").style.width = ((state.curtime/state.duration) * 100) + "%";
}

export function bindUI(handler) {
  document.getElementById("work").onclick = (e) => handler("work", e);
  document.getElementById("study").onclick = (e) => handler("study", e);
  document.getElementById("sleep").onclick = (e) => handler("sleep", e);
}

export function bindCheat(handler) {
  document.getElementById("cheat1").onclick = () => handler("cheat1, e");
}