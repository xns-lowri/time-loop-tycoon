import { loopUpdateAction, loopUpdateCheat } from "./time_loops.js";
import { 
    state as blankGameState, 
    timeloop as blankTimeloop 
} from "./state.js";
import { bindLoopUI } from "./ui.js";

export function initGameState() {
    //todo try to load from last autosave

    //html stuff from ui?

    //else load blank
    const new_state = getBlankGameState();
    
    for(const loop of new_state.timeloops) {
      bindLoopUI(new_state, loop, loopUpdateAction, loopUpdateCheat);
    }

    return new_state;
}


export function getBlankGameState() {
    const blank_state = structuredClone(blankGameState);
    blank_state.lastTime = Date.now();
    blank_state.timeloops.push(structuredClone(blankTimeloop));
    
    return blank_state;
}