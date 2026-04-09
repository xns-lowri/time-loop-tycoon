// base rates
const base_work = 1;
const base_study = 0.5;

//factors
const factor_work = 0.15;
const factor_study = 0.05;


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
  //console.log("incrementing loop:", dt);
  state.curtime += dt;
  state.elapsed += dt;

  if (state.action === 'work') {
    state.res += base_work * (1 + factor_work * state.know) * state.rest * dt;
  }

  if (state.action === 'study') {
    state.know += base_study * (1 + factor_study * state.know) * state.rest * dt;
  }

  if (state.action === 'sleep') {
    state.sleepTime += dt;
  }

  if (state.curtime >= state.duration) {
    endLoop(state);
  }
}

function endLoop(state) {
  // calculate next rest bonus
  const newRest = 1 + 0.02 * Math.pow(state.sleepTime, 0.8);

  // calculate leftover time
  const gained = Math.floor(Math.pow(state.res, 0.6) * newRest) / 10;

  state.sparetime += gained;


  // reset loop values
  state.curtime = 0;
  state.res = 0;
  state.know = 0;
  state.sleepTime = 0;
  state.rest = newRest;
  //state.action = null;

  state.loop += 1;
}