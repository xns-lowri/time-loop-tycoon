import { augments } from "../objects/upgrades_timeloops.js";
import { capitalFirst } from "../helpers/string_format.js";
import { openModal } from "../ui.js";
import { renderAugmentsModal, bindLoopUpgradesModal } from "../view/ui_timeloops.js";
import { spendSparetime } from "../game.js";

// base rates
const BASE_DURATION = 60;

const BASE_WORK = 1;
const BASE_STUDY = 0.5;

//factors - todo move to loop
const FACTOR_WORK = 0.15;
const FACTOR_STUDY = 0.05;
const FACTOR_REST = 0.02;

export function initTimeLoopLogic(state) {
  state.timeloops.forEach((loop) => initLoop(loop));
}

function initLoop(loop) {
  //apply all augments
  loop.augments.forEach(augment => {
    //rebind hooks for owned augments on restart, call onInit for each augment
    augment.hooks = augments.find((a) => a.id===augment.id).hooks;
    augment.hooks.onInit(loop);
  });
}

export function liveTickAllLoops(dt, state) {
  let sparetime = 0;
  for(const loop of state.timeloops) {
    sparetime += liveTickLoop(dt, loop);
  }
  //console.log(sparetime)
  //state.sparetime += sparetime; //todo action event somethingy to make this flash
  //state.sparetime = Math.round(state.sparetime * 1000) / 1000; //eee floats
  return sparetime;
}

export function liveTickLoop(dt, loop) {
  //return 0 early if loop is idle, wait for player (or other) input
  if(loop.action === null) { return 0; }

  //dt *= 1;  //testing, todo actual dt factor within loop - augments
  let dt_max = 0;     //most dt to add to current loop
  let dt_remain = 0;  //dt less dt_max: pos = overspill, 0 or neg = dt within remaining loop time
  let this_dt = 0;    //dt to apply in current loop

  let sparetimegain = 0;  //experience accumulator

  //runs at least once to apply dt, keeps adding cycles if dt overspills
  do {
    dt_max = loop.duration - loop.curtime; //most dt to add to current loop
    dt_remain = dt - dt_max; //dt less max_dt = overspill
    if(dt_remain < 1e-6) { dt_remain = 0; } //catch tiny errors?

    this_dt = Math.min(dt, dt_max); //select min from dt, max

    if(loop.looprunning === false) {
      //todo start loop hooks
      loop.looprunning = true;
    }
    
    //TODO split/add hooks for automation
    //TODO ^^^^^
    incrementLoop(this_dt, loop);
    //todo ^^^ iterated over loop actions & time allocated?

    dt = dt_remain; //dt on next loop is this loop's overspill
    if (loop.curtime >= loop.duration || dt_remain > 0)
    {
      //todo end loop hooks
      sparetimegain += endLoop(loop);
      //todo start loop hooks - not here ideally????
    }
    //console.log("do increment loop", dt, (state.duration - state.curtime).toFixed(3), extra.toFixed(3))
  } while(dt_remain > 0);

  //return winnings to main - todo move to module for specific loop-phase calcs
  return sparetimegain;
}

function incrementLoop(dt, loop) {
  //console.log("incrementing loop:", dt, state.action);
  loop.curtime += dt;
  loop.elapsed += dt;
  //increment resources based on loop action
  let delta = 0;
  switch(loop.action) {
    case 'work':
      delta = calculateWorkRate(loop) * dt;
      loop.resource += delta;
      loop.resourcedelta = delta / dt;
      loop.knowledgedelta = 0;
      //todo augment switch for showing prospective
      break;

    case 'study':
      delta = calculateStudyRate(loop) * dt;
      loop.knowledge += delta;
      loop.knowledgedelta = delta / dt;
      loop.resourcedelta = 0;
      loop.prospectiveresourcedelta = BASE_WORK * (1 + FACTOR_WORK * loop.knowledge) * loop.rested;
      break;

    case 'sleep':
      loop.sleeptime += dt;
      loop.resourcedelta = 0;
      loop.knowledgedelta = 0;
      break;

    default: //including null
      break;
  }

  loop.prospectiveresourcedelta = calculateWorkRate(loop);
  loop.sleeptimedelta = calculateNextRest(loop);
  loop.sparetimedelta = calculateSparetimeGain(loop);
}

function calculateWorkRate(loop) {
  return BASE_WORK * (1 + FACTOR_WORK * loop.knowledge) * loop.rested;
}

function calculateStudyRate(loop) {
  return BASE_STUDY * (1 + FACTOR_STUDY * loop.knowledge) * loop.rested;
}

function calculateNextRest(loop) {
  let newRest = 1 + FACTOR_REST * Math.pow(loop.sleeptime, 0.8);

  if(loop.actions.length <= 1 
    && loop.action === 'sleep') {
    //lazy bugger bonus if only action taken was sleep
    //take max of new rest (limit ~1.54x) and last rest
    newRest = Math.max(newRest, loop.rested);
    newRest *= 1.1;
    //todo maybe give this a drop off after ~1hr
  }

  return newRest;
}

function calculateSparetimeGain(loop) {
  return Math.floor(Math.pow(loop.resource, 0.6) * loop.rested) / 10;
}

function endLoop(loop) {
  // calculate leftover time
  const sparetimegain = calculateSparetimeGain(loop);
  // calculate next rest bonus
  //let newRest = 1 + FACTOR_REST * Math.pow(loop.sleeptime, 0.8);

  //if(loop.actions.length <= 1 
  //  && loop.action === 'sleep') {
  //  //lazy bugger bonus if only action taken was sleep
  //  //take max of new rest (limit ~1.54x) and last rest
  //  newRest = Math.max(newRest, loop.rested);
  //  newRest *= 1.1;
  //  //todo maybe give this a drop off after ~1hr
  //}
  const newRest = calculateNextRest(loop);

  if(loop.actions.length > 0) { //if new actions were performed
    console.log(loop.actions); //debug
    loop.lastactions = loop.actions;  //save actions
    loop.actions = []; //clear for next loop
  }

  // reset loop values
  loop.curtime = 0;
  loop.resource = 0;
  loop.knowledge = 0;
  loop.sleeptime = 0;
  loop.rested = newRest;
  //state.action = null;

  loop.loops += 1;
  loop.looprunning = false;

  return sparetimegain;
}

//callbacks for ui
export function loopUpdateAction(action, loop) {
    //updates action of selected loop and pushes change to actions log
    loop.action = action;
    if(loop.actions.length > 0) {
      if(loop.actions[loop.actions.length-1].action === action) {
        return false; //don't push if last action was same
      }
    }
    loop.actions.push({action: action, time: loop.curtime});
    return true; //true if pushed, for button colour flash?
}

export function loopUpdateCheat(action, loop) {
  let sparetime = 0;
  if(action === 'cheat-skiploop') {
    sparetime += liveTickLoop(loop.duration - loop.curtime, loop);
    //updateUI(state);
  }
  if(action === 'cheat-loopadd1') {
    sparetime += liveTickLoop(1, loop);
    //updateUI(state);
  }
  if(action === 'cheat-loopadd10') {
    sparetime += liveTickLoop(10, loop);
    //updateUI(state);
  }
  return sparetime;
}

export function loopUpgrades(state, action, loop) {
  if(action==='automation') {
    //automation, locked until ???
  }
  else if(action==='augments') {
    //augments menu
    //console.log("Augments menu:", state, loop, augments, buyLoopAugments);
    openModal(
      `Augments for Loop ${loop.id}`, 
      { //render
        callback: renderAugmentsModal, 
        params: {state, loop, augments}
      },
      { //binder
        callback: bindLoopUpgradesModal,
        params: {state, loop, buyhandler: buyLoopAugments}
      }
    ); //linked modal rendering through callback
  }
}


function buyLoopAugments(state, loop, id) {
  console.log(id);
  const augment = augments.find((e) => e.id === id);
  console.log(augment);
  if(augment === undefined) {
    console.error("Augment not found:", id);
  }
  else if(loop.augments.filter((e) => e.id === id).length >= 1) {
    console.log("you already have it")
    return;
  }
  else if(state.sparetime < augment.cost) {
    console.log("you can't afford it");
    return;
  }

  console.log("you can buy!", state.sparetime, augment.cost, loop.id);
  if(!spendSparetime(augment.cost)) {
    console.error("Error buying augment", augment, state);
    return;
  }
  console.log("you did buy!", state.sparetime, augment.cost, loop.id);
  loop.augments.push(augment);
  augment.hooks?.onInit(loop);
}