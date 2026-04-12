import {
  openModal } from "../ui.js";

import { 
  //liveTickAllLoops, 
  loopUpdateAction, 
  loopUpdateCheat,
  loopUpgrades } from "../logic/logic_timeloops.js";

import { 
  newElement } from "../helpers/html_helpers.js";

import { 
  getLoopGradient, 
  getStarsOpacity } from "../helpers/loopcard_flair.js";

import { 
  formatDecimalAsTime,
  capitalFirst } from "../helpers/string_format.js";


//todo render functions for loop card, augments, automation etc
/*  */
export function initAllTimeLoops(state, handlers) {
  const game_area = document.getElementById('game-area');
  if(game_area === null) {return;} //big badda boom

  const old_ui = document.getElementById('loop-grid');
  if(old_ui) { document.getElementById('game-area').removeChild(old_ui); }
  
  const new_grid = newElement('div', { id:'loop-grid', class:'loop-grid' });
  game_area.appendChild(new_grid);

  //todo add correct number of loop cards
  for(const key in state.timeloops) {
    initTimeLoop(state, state.timeloops[key], key, handlers);
  }

  //TODO ADD EMPTY CARD!!!
  const next_card = newElement('div', { class: 'loop-card empty locked' });
  next_card.textContent = '🔒';
  new_grid.appendChild(next_card);
}

function initTimeLoop(state, loop, index, handlers) {
  //const card = document.getElementById(loop.cardname);
  //get loop card and init UI functions
  //TODO generate loop card elements and return these instead of direct dom editing
  //todo probably more stuff later?
  const grid_ui = document.getElementById('loop-grid');
  const card = newElement('div', { id:`loop-card-${index}`, class:'loop-card' });
  card.innerHTML = loopcard;
  initLoopStars(card);
  //todo create augments menu
  //todo create automation menu
  grid_ui.appendChild(card);
  //todo ui building based on game state/phase etc

  bindLoopUI(state, loop, { 
    action: (action) => {
      loopUpdateAction(action, loop);
      renderLoopActionButtons(loop);
    }, 
    cheat: (state, action, loop) => {
      handlers.gain(loopUpdateCheat(action, loop));
      /*if(sparetime > 0) {
        state.sparetime += sparetime;
        pulseElement(document.getElementById('sparetime'));
      }*/
    },
    upgrades: (action) => loopUpgrades(state, action, loop)
  });
  //set css class for decorating active action button
  renderLoopActionButtons(loop);
}

/* Loop UI Init  */
function initLoopStars(card, stars=30) {
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
}


/* UI BINDINGS */
function bindLoopUI(state, loop, handlers) {
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


//modal bindings, todo refactor
export function bindLoopUpgradesModal({state, loop, buyhandler}) {
  const card = document.getElementById('modal-content');
  if(card === null) { return; }
  card.querySelectorAll(".upgrade-card")
    .forEach((augment) => {
      augment.onclick = () => buyhandler(state, loop, augment.id);
    });
}

export function renderAugmentsModal({state, loop, augments}, modal) {
  if(modal.content.params?.last_sparetime === state.sparetime) { return null; }
  modal.content.params.last_sparetime = state.sparetime;
  
  return `<div class="upgrade-grid">${augments.map(
    (augment) => {
      const owned = loop.augments.find((e) => e.id===augment.id);
      return `<div 
          id="${augment.id || ""}"
          class="upgrade-card` 
          + ` ${owned ? "owned" : 
            augment.hooks.isLocked(loop) ? " locked" :
            state.sparetime < augment.cost ? " unaffordable" : " affordable"}`
          + `">
        <div class="upgrade-title">
          <div class="upgrade-icon">${augment.icon}</div> 
          <div class="upgrade-details">
            <div class="smaller">${augment.name}</div>
            <div class="upgrade-desc">${
              augment.hooks.isLocked(loop) ? augment.lockdesc : augment.description
            }</div>
            <div class="flex-fill"></div>
            <div class="upgrade-cost">${owned ? "Owned" : "Cost: "+formatDecimalAsTime(augment.cost, {figs:1,nomil:true})}</div>
          </div>
        </div>
      </div>`
    }
  ).join(" ")}</div>`;
}

/* LOOP CARD (PHASE 1) RENDERING FUNCTIONS */
export function renderLoopCards(state) {
  for(const loop of state.timeloops) {
    renderLoopCard(loop);
  }
}

export function renderLoopCard(loop) {
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
  
  card.querySelector('#resource-delta').textContent = "+" + loop.resourcedelta.toFixed(2) + "/s";
  card.querySelector('#prospective-resource-delta').textContent = "(+" + loop.prospectiveresourcedelta.toFixed(2) + "/s)";
  card.querySelector('#knowledge-delta').textContent = "+" + loop.knowledgedelta.toFixed(1) + "/s";
  card.querySelector('#rested-delta').textContent = "⇨ " + loop.sleeptimedelta.toFixed(2) + "x";
  card.querySelector('#sparetime-delta').textContent = "⇨ " + formatDecimalAsTime(loop.sparetimedelta, {trim: 3});
  
  card.querySelector('#action').textContent = capitalFirst(loop.action || 'idl');
  card.querySelector("#loop-progress-bar").style.width = ((loop.curtime/loop.duration) * 100) + "%";
}

export function renderLoopActionButtons(loop) {
  const card = document.getElementById(loop.cardname);
  if(card === null) { return; }

  card.querySelectorAll("button.action-btn")
    .forEach(btn => btn.classList.remove("active-action"));

  if(loop.action === null) { return; }

  card.querySelector(`#${loop.action}`).classList.add("active-action");
}
/* LOOP CARD (PHASE1) */


/* PARTIALS */
const loopcard = 
`   <div id="stars" class="loop-stars"></div>

    <div class="loop-header">
        <div id="loop-progress-bar" class="loop-progress-bar"></div>

        <div class="loop-header-content">
            <div class="ctext"><div>Day #<span id="loop">0</span></div></div>
            <div class="ctext"><span id="sparetime-delta" class="hidden">⇨ 0s</span></div>
            <div class="ctext"><div>⏲️ <span id="curtime">0</span> / <span id="duration">0</span>s</div></div>
        </div>
    </div>

    <div class="loop-inner">

        <div id="stats" class="loop-stats">
            <div>💰 Resource: <span id="resource">0</span> <span id="resource-delta" class="smaller hidden">+0/s</span> <span id="prospective-resource-delta" class="smaller hidden">(+0/s)</span></div>
            <div>🧠 Knowledge: <span id="knowledge">0</span> <span id="knowledge-delta" class="smaller hidden">+0/s</span></div>
            <div>😴 Rested: <span id="rested">1.0</span>x <span id="rested-delta" class="smaller hidden">⇨ 1.00x</span></div>
        </div>

        <div id="actions" class="loop-actions">
            <button id="work" class="action-btn grow">Work</button>
            <button id="study" class="action-btn grow">Study</button>
            <button id="sleep" class="action-btn grow">Sleep</button>
        </div>

        <div id="progress" class="loop-progress">
            <div class="ctext"><span>Currently <span id="action">None</span>ing</span></div>
            
            <div>
                <button id="automation" class="smaller locked">🔒</button>
                <button id="augments" class="smaller">⚙️</button>
            </div>
        </div>
        <div id="cheats" class="loop-cheats">
            <button id="skip" class="grow">skip</button>
            <button id="add1" class="grow">+1s</button>
            <button id="add10" class="grow">+10s</button>
            <button id="skip10" class="grow">10x</button>
            <button id="skip100" class="grow">100x</button>
        </div>
    </div>
`;

/*const loopaugments = 
`<div class="upgrade-grid">

    <div class="upgrade-card">
        <div class="title">Better Tools</div>
        <div class="desc">+50% work output</div>
        <div class="cost">5 Spare Time</div>
    </div>

    <div class="upgrade-card locked">
        <div class="title">Coffee Breaks</div>
        <div class="desc">+25% work speed</div>
        <div class="cost">10 Spare Time</div>
    </div>

    <div class="upgrade-card">
        <div class="title">Study Techniques</div>
        <div class="desc">+50% knowledge gain</div>
        <div class="cost">8 Spare Time</div>
    </div>

    <div class="upgrade-card">
        <div class="title">Power Naps</div>
        <div class="desc">Sleep more effective</div>
        <div class="cost">10 Spare Time</div>
    </div>

</div>`;*/