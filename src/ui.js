import { getLoopGradient, getStarsOpacity } from "./helpers/loopcard_flair.js";
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
  //todo render modal
}

export function pulseElement(element) {
  element.classList.remove("pulse");
  element.classList.add("pulse");
  setTimeout(() => element.classList.remove("pulse"), 200);
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


/* LOOP CARD (PHASE 1) RENDERING FUNCTIONS */
export function updateLoopCard(loop) {
  const card = document.getElementById(loop.cardname);
  if(card === null) { return; }

  //update card background
  const t = loop.curtime / loop.duration;
  card.style.background = getLoopGradient(t);
  card.querySelector('#stars').style.opacity = getStarsOpacity(t);

  //update value labels
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

export function initLoopUI(loop, stars=30) {
  //get loop card and init UI functions
  //todo probably more stuff later?
  const card = document.getElementById(loop.cardname);
  if(card === null) { return; }

  //create stars
  const container = card.querySelector("#stars");
  if(container === null) { return; }
  container.innerHTML = ''; //clear existing stars on load

  for (let i = 0; i < stars; i++) {
    const star = document.createElement("div");
    star.className = "loop-star";

    // random position
    star.style.left = 1 + (Math.random() * 98) + "%";
    star.style.top = 1+((1-Math.pow(Math.random(), 0.25)) * 98) + "%";

    // random size variation
    const size = Math.pow(Math.random() * 2, 0.5) + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";

    // random twinkle timing
    const duration = 1.5 + Math.random() * 2;
    const delay = Math.random() * 2;

    star.style.animation = `twinkleAnimation ${duration}s infinite`;
    star.style.animationDelay = delay + "s";

    container.appendChild(star);
  }

  //todo create augments menu
  //todo create automation menu
}

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
export function bindLoopUI(state, loop, handlers) {
  bindLoopActions(loop, (action) => handlers.action(action, loop));
  bindLoopUpgrades(loop, (action) => handlers.upgrades(action));
  bindLoopCheats(loop, (action) => handlers.cheat(state, action, loop));
}

function bindLoopActions(loop, handler) {
  const card = document.getElementById(loop.cardname);
  if(card === null) { return; }

  card.querySelector("#work").onclick = () => handler("work");
  card.querySelector("#study").onclick = () => handler("study");
  card.querySelector("#sleep").onclick = () => handler("sleep");
}

function bindLoopUpgrades(loop, handler) {
  const card = document.getElementById(loop.cardname);
  if(card === null) { return; }

  //todo how to open the right modals n such??
  card.querySelector("#automation").onclick = () => handler("automation");
  card.querySelector("#augments").onclick = () => handler("augments");
}

function bindLoopCheats(loop, handler) {
  const card = document.getElementById(loop.cardname);
  if(card === null) { return; }

  card.querySelector("#skip").onclick = () => handler("cheat-skiploop");
  card.querySelector("#add1").onclick = () => handler("cheat-loopadd1");
  card.querySelector("#add10").onclick = () => handler("cheat-loopadd10");
}
/* UX BINDINGS */