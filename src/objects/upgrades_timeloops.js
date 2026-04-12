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
                card.querySelector('#resource-delta').classList.remove('hidden');
            }
        }
    },
    {
        icon: "😎",
        id: "glasses-working",
        name: "Working Glasses",
        description: "See how much resource you're gaining every second",
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
        icon: "🥂",
        id: "glasses-sleeping",
        name: "Sleeping Glasses?",
        description: "See how much rest you'll carry over to the next loop",
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
                card.querySelector('#rested-delta').classList.remove('hidden');
            }
        }
    },
    {
        icon: "🌞",
        id: "glasses-time",
        name: "TIME Glasses??",
        description: "See how much spare time you'll gain from the current loop",
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
                //todo add spare time gain indicator to loop card
                card.querySelector('#sparetime-delta').classList.remove('hidden');
            }
        }
    },
    {
        icon: "🛠️",
        name: "test1",
        description: "testing",
        cost: 5,
        hooks: {}
    },
    {
        icon: "📖",
        name: "test1",
        description: "testing",
        cost: 10,
        hooks: {}
    },
    {
        icon: "📚",
        name: "test1",
        description: "testing",
        cost: 30,
        hooks: {}
    },
    {
        icon: "💤",
        name: "test1",
        description: "testing",
        cost: 60,
        hooks: {}
    },
    {
        icon: "🛏️",
        name: "test1",
        description: "testing",
        cost: 180,
        hooks: {}
    },
    {
        icon: "👀",
        id: "eyes1",
        name: "test1",
        description: "testing",
        cost: 360,
        hooks: {}
    },
    {
        icon: "🏭",
        name: "test1",
        description: "testing",
        cost: 900,
        hooks: {}
    },
    //tier 2
    {
        icon: "🔧",
        name: "test1",
        description: "testing",
        cost: 3600,
        hooks: {}
    },
    {
        icon: "🐓",
        name: "test1",
        description: "testing",
        cost: 86400,
        hooks: {}
    },
    {
        icon: "⏰",
        name: "test1",
        description: "testing",
        cost: 129600,
        hooks: {}
    }
];