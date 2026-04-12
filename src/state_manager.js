
import { 
    state as blankGameState, 
    timeloop as blankTimeloop } from "./objects/state.js";

const CURRENT_VERSION = '0.0.1';
const AUTOSAVE_LABEL = 'timeloopTycoonAutosave';

export function initGameState(state, loadauto = true) {
    //todo move html building from main page to script?
    //try to load from last autosave, else load new blank game
    let new_state = state || null;
    if(new_state === null && loadauto) {
        new_state = loadGame(true);
    }
    if(new_state === null) {
        new_state = structuredClone(blankGameState);
    }
    else {
        //todo offline progress
        //console.warn("Offline progress lost - TODO!");
    }

    new_state.lastTime = Date.now();
    return new_state;
}

export function loadGame(auto) {
    //todo
    let savefile = null;

    if(auto) {
        //load last autosave or return null
        const rawload = localStorage.getItem(AUTOSAVE_LABEL);
        if(rawload === null) { 
            console.warn("Autosave not found, starting new game");
            return null; 
        }

        try {
            savefile = JSON.parse(rawload);

            //const now = Date.now();
            //savefile.gamedata.lastTime = now;
            //savefile.gamedata.lastSave = now;

            console.log("Loaded autosave!");
            return savefile.gamedata;
        }
        catch(err) {
            console.error("Failed to parse last autosave:", err);
            return null;
        }
    }
    else {
        //todo load button
    }

    return null;
}

export function saveGame(gameState, auto) {
    //pack game state with version and timestamp
    const save_data = {
        version: CURRENT_VERSION,
        timestamp: Date.now(),
        gamedata: gameState
    };
    const save_file = JSON.stringify(save_data);

    if(auto) {
        //autosave
        localStorage.setItem(AUTOSAVE_LABEL, save_file);
    }
    else {
        //manual save
        const blob = new Blob([save_file], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `timelooptycoon-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}