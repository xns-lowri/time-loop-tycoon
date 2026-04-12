export const loopcard = 
`<div class="loop-card" id="loop-card-0">
    <div class="loop-header">
        <div id="loop-progress-bar" class="loop-progress-bar"></div>

        <div class="loop-header-content">
            <div class="ctext"><div>Loop #<span id="loop">0</span></div></div>
            <div class="ctext"><div>⏲️ <span id="curtime">0</span> / <span id="duration">0</span>s</div></div>
        </div>
    </div>

    <div class="loop-inner">

        <div class="stats">
            <div>💰 Resource: <span id="resource">0</span></div>
            <div>🧠 Knowledge: <span id="knowledge">0</span></div>
            <div>😴 Rested: <span id="rested">1.0</span>x</div>
        </div>

        <div class="actions">
            <button id="work" class="grow">Work</button>
            <button id="study" class="grow">Study</button>
            <button id="sleep" class="grow">Sleep</button>
        </div>

        <div class="progress">
            Current Action: <span id="action">None</span>
        </div>
            <div>
            <button id="skip" class="grow">skip</button>
            <button id="add1" class="grow">+1s</button>
            <button id="add10" class="grow">+10s</button>
        </div>
    </div>
</div>`;

export const loopaugments = 
`<div class="upgrade-grid">

    <div class="upgrade-card">
        <div class="title">Better Tools</div>
        <div class="desc">+50% work output</div>
        <div class="cost">5 Spare Time</div>
    </div>

    <div class="upgrade-card locked">
        <div class="title">Coffee Breaks</div>
        <div class="desc">+25% work speed</div>
        <div class="cost">10 Spare Time</div>
    </div>

    <div class="upgrade-card">
        <div class="title">Study Techniques</div>
        <div class="desc">+50% knowledge gain</div>
        <div class="cost">8 Spare Time</div>
    </div>

    <div class="upgrade-card">
        <div class="title">Power Naps</div>
        <div class="desc">Sleep more effective</div>
        <div class="cost">10 Spare Time</div>
    </div>

</div>`;

//todo render functions for loop card, augments, automation etc