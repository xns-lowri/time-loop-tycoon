import { state } from "./state.js";

export function updateUI() {
  document.getElementById('time').textContent = state.curtime.toFixed(1);
  document.getElementById('duration').textContent = state.duration.toFixed(0);
  document.getElementById('loop').textContent = state.loop;
  document.getElementById('res').textContent = state.res.toFixed(2);
  document.getElementById('know').textContent = state.know.toFixed(1);
  document.getElementById('rest').textContent = state.rest.toFixed(2);
  document.getElementById('spare').textContent = state.sparetime.toFixed(2);
  document.getElementById('action').textContent = state.action || 'none';
}

export function bindUI() {
  document.getElementById("work").onclick = () => state.action = "work";
  document.getElementById("study").onclick = () => state.action = "study";
  document.getElementById("sleep").onclick = () => state.action = "sleep";
}