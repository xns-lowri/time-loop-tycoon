// base rates
const base_work = 1;
const base_study = 0.5;

//factors
const factor_work = 0.15;
const factor_study = 0.05;

export function newAction(action, event, state) {
    state.action = action;
    state.actions.push({action: action, time: state.curtime});
}

export function liveTick(dt, state) {
  dt *= 1;

  let dt_max = 0; //most dt to add to current loop
  let extra = 0; //dt less max_dt = overspill

  do {
    dt_max = state.duration - state.curtime; //most dt to add to current loop
    extra = dt - dt_max; //dt less max_dt = overspill

    //console.log("do increment loop", dt, dt_max.toFixed(3), extra.toFixed(3));

    let this_dt = Math.min(dt, dt_max); //select min from dt, max
    incrementLoop(this_dt, state);

    dt = extra; //dt on next loop is this loop's overspill
    //console.log("do increment loop", dt, (state.duration - state.curtime).toFixed(3), extra.toFixed(3))
  } while(extra > 0);
}

function incrementLoop(dt, state) {
  //console.log("incrementing loop:", dt, state.action);
  state.curtime += dt;
  state.elapsed += dt;

  if (state.action === 'work') {
    state.resource += base_work * (1 + factor_work * state.knowledge) * state.rested * dt;
  }

  if (state.action === 'study') {
    state.knowledge += base_study * (1 + factor_study * state.knowledge) * state.rested * dt;
  }

  if (state.action === 'sleep') {
    state.sleeptime += dt;
  }

  if (state.curtime >= state.duration) {
    endLoop(state);
  }
}

function endLoop(state) {
  // calculate leftover time
  const gained = Math.floor(Math.pow(state.resource, 0.6) * state.rested) / 10;

  // calculate next rest bonus
  let newRest = 1 + 0.02 * Math.pow(state.sleeptime, 0.8);

  if(state.action === 'sleep') {
    newRest = Math.max(newRest, state.rested);
    //bonus if last action was sleep
    newRest *= 1.1;
  }

  state.sparetime += gained;

  if(state.actions.length) {
    console.log(state.actions); //debug
    state.lastactions = state.actions;
    state.actions = [];
  }

  // reset loop values
  state.curtime = 0;
  state.resource = 0;
  state.knowledge = 0;
  state.sleeptime = 0;
  state.rested = newRest;
  //state.action = null;

  state.loop += 1;
}