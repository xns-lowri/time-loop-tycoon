import { formatDecimalAsTime } from "./helpers/string_format.js";
import { initAllTimeLoops, renderLoopCards } from "./view/ui_timeloops.js";



export function initUI(state) {
  initAllTimeLoops(state);
}


//todo html injection = bad soc here :(
export function openModal(modal, content) {
  document.getElementById('modal-title').textContent = modal;
  //todo select modal content from ???
  document.getElementById('modal-content').innerHTML = content || '';

  const modal_window = document.getElementById('modal-window');
  modal_window.classList.add('pop');
  document.getElementById('modal-overlay').classList.remove('hidden');
  setTimeout(() => modal_window.classList.remove('pop'), 150);
}

export function bindLoopUpgradesModal(state, loop, callback) {
  const card = document.getElementById('modal-content');
  if(card === null) { return; }
  card.querySelectorAll(".upgrade-card")
    .forEach((augment) => {
      augment.onclick = () => callback(state, loop, augment.id);
    });
}
/* TOP-LEVEL RENDERING */


//todo split out ui updates into modules?


/* UX CONTROL BINDING FUNCTIONS */
//bindings for main UI
export function bindMainUI(state, handlers) {
  document.getElementById("saveGame").onclick = () => handlers.save(state, false);
  document.getElementById("loadGame").onclick = () => handlers.load(false);
  document.getElementById("resetGame").onclick = () => handlers.reset();
  document.getElementById("autosave").onclick = () => handlers.save(state, true);
  document.getElementById("autoload").onclick = () => handlers.autoload();

  document.getElementById("modal-close").onclick = () => {
    const modal = document.getElementById('modal-overlay');
    modal.classList.add('hidden');
    //modal.style.opacity = 0;
  }
}

// bindings for time loop (phase 1) controls
/* UX BINDINGS */


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
  renderLoopCards(state);
  //todo render modal
}

export function pulseElement(element) {
  element.classList.remove("pulse");
  element.classList.add("pulse");
  setTimeout(() => element.classList.remove("pulse"), 200);
}