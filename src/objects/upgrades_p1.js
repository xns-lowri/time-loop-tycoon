export const augments = [
    //tier 1
    {
        icon: "👓",
        id: "glasses",
        name: "Basic Awareness",
        description: "See how much resource you're making every second",
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