import { formatDecimalAsTime } from "./helpers/string_format.js";
import { initAllTimeLoops, renderLoopCards } from "./view/ui_timeloops.js";


const currentModal = {
  open: false,
  type: "augments",
  content: {},
  binding: {},
  params: {}
}

export function initUI(state, handlers) {
  initAllTimeLoops(state, handlers);
}
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
    const modalcontent = document.getElementById('modal-content');
    modalcontent.innerHTML = '';
  }
}
/* UX BINDINGS */


//todo html injection = bad soc here?? :(
export function openModal(state, title, content, binding) {
  document.getElementById('modal-title').textContent = title;
  //todo select modal content from ???
  currentModal.content = content;
  currentModal.binding = binding;
  currentModal.open = true;

  //set inner content
  //document.getElementById('modal-content').innerHTML = content(params) || '';

  const modal_window = document.getElementById('modal-window');
  modal_window.classList.add('pop');
  document.getElementById('modal-overlay').classList.remove('hidden');
  setTimeout(() => modal_window.classList.remove('pop'), 150);
}
/* TOP-LEVEL RENDERING */

function renderModal(state) {
  if(!currentModal.open) {return;}
  if(currentModal.content.callback === null) {return;}
  const html_updated = currentModal.content.callback(currentModal.content.params, currentModal);
  if(html_updated === null) { return; } //don't update unnecessarily - ruins transitions n effects
  document.getElementById('modal-content').innerHTML = html_updated;
}

/* TOP LEVEL (MAIN UI) RENDERING */
//render (update) main UI elements
export function renderGame(state) {
  document.getElementById('sparetime').textContent = formatDecimalAsTime(state.sparetime);
  document.getElementById('next-autosave').textContent = 
    state.lasttime - state.lastAutosave < 800 ?
    "Saved!" :
    `Next save in: ${state.nextsave.toFixed(1)}s`;
  
  //console.log(state.lasttime - state.lastAutosave);
  //todo later phases, switch or handler functions for each phase?
  renderLoopCards(state);
  //todo render modal
  renderModal(state);
  
  //console.log(`Gained ${sparetime} spare time`)
  /*if(sparetime > 0) {
    pulseElement(document.getElementById('sparetime'));
  }*/
}

export function pulseElement(element) {
  element.classList.remove("pulse");
  element.classList.add("pulse");
  setTimeout(() => element.classList.remove("pulse"), 200);
}