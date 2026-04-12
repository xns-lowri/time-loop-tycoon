export const augments = [
    //tier 1
    {
        icon: "👓",
        id: "glasses-reading",
        name: "Reading Glasses",
        description: "Show Resource gain per second",
        cost: 2.5,
        hooks: {
            isLocked: () => false,
            /* available hooks: 
                onInit
                onAction
                onLoopStart
                onLoopTick
                onLoopEnd 
            */
            onInit: (loop) => {
                const card = document.getElementById(loop.cardname);
                if(card === null) { return; }
                card.querySelector('#knowledge-delta').classList.remove('hidden');
            }
        }
    },
    {
        icon: "😎",
        id: "glasses-working",
        name: "Working Glasses",
        description: "Show Knowledge gain per second",
        cost: 3.5,
        hooks: {
            isLocked: () => false,
            /* available hooks: 
                onInit
                onAction
                onLoopStart
                onLoopTick
                onLoopEnd 
            */
            onInit: (loop) => {
                const card = document.getElementById(loop.cardname);
                if(card === null) { return; }
                card.querySelector('#resource-delta').classList.remove('hidden');
            }
        }
    },
    {
        icon: "😎",
        id: "glasses-working2",
        name: "Working Glasses II",
        description: "Show potential Knowledge gain per second",
        lockdesc: "Where did I put these?",
        cost: 15,
        hooks: {
            isLocked: (loop) => !loop.augments.find((e)=>e.id==='glasses-working'),
            /* available hooks: 
                onInit
                onAction
                onLoopStart
                onLoopTick
                onLoopEnd 
            */
            onInit: (loop) => {
                const card = document.getElementById(loop.cardname);
                if(card === null) { return; }
                card.querySelector('#prospective-resource-delta').classList.remove('hidden');
            }
        }
    },
    {
        icon: "💤",
        id: "glasses-sleeping",
        name: "Sleeping Glasses?",
        description: "Show your Rested gain for tomorrow",
        cost: 5,
        hooks: {
            isLocked: () => false,
            /* available hooks: 
                onInit
                onAction
                onLoopStart
                onLoopTick
                onLoopEnd 
            */
            onInit: (loop) => {
                const card = document.getElementById(loop.cardname);
                if(card === null) { return; }
                card.querySelector('#rested-delta').classList.remove('hidden');
            }
        }
    },
    {
        icon: "🌞",
        id: "glasses-time",
        name: "Time Glasses??",
        description: "Show Spare Time as it accumulates each day",
        lockdesc: "Try another pair first.",
        cost: 30,
        hooks: {
            isLocked: (loop) => {
                const pres = ['glasses-working', 'glasses-reading', 'glasses-sleeping'];
                let locked = false;
                pres.forEach((p)=>{
                    locked ||= loop.augments.find((e)=>e.id===p)==undefined;
                });
                return locked;
            },
            /* available hooks: 
                onInit
                onAction
                onLoopStart
                onLoopTick
                onLoopEnd 
            */
            onInit: (loop) => {
                const card = document.getElementById(loop.cardname);
                if(card === null) { return; }
                //todo add spare time gain indicator to loop card
                card.querySelector('#sparetime-delta').classList.remove('hidden');
            }
        }
    },
    {
        icon: "🌞",
        id: "glasses-time",
        name: "Time Glasses??",
        description: "Show Spare Time as it accumulates each day",
        lockdesc: "Try another pair first.",
        cost: 30,
        hooks: {
            isLocked: (loop) => {
                const pres = ['glasses-working', 'glasses-reading', 'glasses-sleeping'];
                let locked = false;
                pres.forEach((p)=>{
                    locked ||= loop.augments.find((e)=>e.id===p)==undefined;
                });
                return locked;
            },
            /* available hooks: 
                onInit
                onAction
                onLoopStart
                onLoopTick
                onLoopEnd 
            */
            onInit: (loop) => {
                const card = document.getElementById(loop.cardname);
                if(card === null) { return; }
                //todo add spare time gain indicator to loop card
                card.querySelector('#sparetime-delta').classList.remove('hidden');
            }
        }
    }
];