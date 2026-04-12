//basic game state 
export const state = {
  elapsed: 0,     //overall time elapsed in card
  sparetime: 0,   //overall experience points
  lasttime: 0,    //last time for delta
  nextsave: 0,    //time until next autosave

  timeloops: [
    {
      id: 0,
      cardname: 'loop-card-0',

      duration: 60, //current loop duration, default=60s

      elapsed: 0,   //overall time elapsed in card
      curtime: 0,   //time elapsed in current cycle
      loops: 1,         //loop counter, start at 1
      looprunning: false,

      action: null,     //current loop action
      actions: [],      //actions performed in current loop
      lastactions: [],  //last loop actions

      //actionhooks: [],  //ehh

      resource: 0,  //resource gained this loop
      knowledge: 0,
      rested: 1,
      sleeptime: 0,

      resourcedelta: 0,  
      prospectiveresourcedelta: 0,  
      knowledgedelta: 0,
      resteddelta: 1,
      sleeptimedelta: 0,
      sparetimedelta: 0,

      //todo work/study/sleep multipliers
      //todo augments
      augments: [],
      automation: []
    }
  ]
};

//todo remove from basic game state, build on new game start
//blank time loop for later ;)
export const timeloop = {
  id: 0,
  cardname: 'loop-card-0',

  elapsed: 0,   //overall time elapsed in card
  curtime: 0,   //time elapsed in current cycle

  loops: 1,         //loop counter, start at 1
  action: null,     //current loop action
  actions: [],      //current loop actions
  lastactions: [],  //last loop actions

  duration: 60, //current loop duration, default=60s

  resource: 0,  //resource gained this loop
  knowledge: 0,
  rested: 1,
  sleeptime: 0,

  //todo work/study/sleep multipliers
  //todo augments
  augments: []
}