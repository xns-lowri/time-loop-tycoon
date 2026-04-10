export const state = {
  elapsed: 0,   //overall time elapsed in card
  sparetime: 0,  //overall experience points

  curtime: 0,   //time elapsed in current loop
  loop: 1,      
  action: null, //current loop action
  actions: [],
  lastactions: [],

  duration: 60, //current loop duration, default=60s

  resource: 0,
  knowledge: 0,
  rested: 1,
  sleeptime: 0
};