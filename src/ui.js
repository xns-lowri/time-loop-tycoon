import { state } from "./state.js";

export function updateUI() {
  document.getElementById('curtime').textContent = state.curtime.toFixed(1);
  document.getElementById('duration').textContent = state.duration.toFixed(0);
  document.getElementById('loop').textContent = state.loop;
  document.getElementById('resource').textContent = state.res.toFixed(2);
  document.getElementById('knowledge').textContent = state.know.toFixed(1);
  document.getElementById('rested').textContent = state.rest.toFixed(2);
  document.getElementById('sparetime').textContent = state.sparetime.toFixed(2);
  document.getElementById('action').textContent = state.action || 'none';
}

export function bindUI() {
  document.getElementById("work").onclick = () => state.action = "work";
  document.getElementById("study").onclick = () => state.action = "study";
  document.getElementById("sleep").onclick = () => state.action = "sleep";
}