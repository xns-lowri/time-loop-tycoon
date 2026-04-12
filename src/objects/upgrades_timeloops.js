export const augments = [
    //tier 1
    {
        icon: "👓",
        id: "glasses-reading",
        name: "Reading Glasses",
        description: "See how much knowledge you're gaining every second",
        cost: 2.5,
        hooks: {
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
        description: "See how much resource you're gaining every second",
        cost: 3.5,
        hooks: {
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
        icon: "🥂",
        id: "glasses-sleeping",
        name: "Sleeping Glasses?",
        description: "See how much rest you'll carry over to the next loop",
        cost: 5,
        hooks: {
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
        name: "TIME Glasses??",
        description: "See how much spare time you'll gain from the current loop",
        cost: 30,
        locked: true,
        hooks: {
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