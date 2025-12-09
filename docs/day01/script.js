const viz = new AlgoVisualizer();

// DOM Elements
const inputArea = document.getElementById('input');
const dialPlate = document.getElementById('dialPlate');
const curPosVal = document.getElementById('curPosVal');
const mathDisplay = document.getElementById('mathDisplay');
const statDir = document.getElementById('statDir');
const statDist = document.getElementById('statDist');
const statHits = document.getElementById('statHits');

// Dial Config
const DIAL_SIZE = 100;
let hits = 0;

// Initialize Dial Numbers
function initDial() {
    if (!dialPlate) return;
    dialPlate.innerHTML = '';
    const radius = 130; // Radius for numbers placement relative to center of 300px dial

    for (let i = 0; i < DIAL_SIZE; i++) {
        const el = document.createElement('div');
        el.className = 'dial-number';
        if (i % 10 === 0) el.classList.add('main-mark');
        el.textContent = i;

        // Position radially
        // We want 0 at Top. In CSS/Trig, 0 deg is typically Right.
        // So 0 should be at -90 deg.
        // Each number i is at i * 3.6 deg.
        const angleDeg = i * 3.6 - 90;
        const angleRad = angleDeg * (Math.PI / 180);

        // Position relative to center (150, 150)
        // Dial is 300x300. Center is 150, 150.
        // We want numbers slightly inside edge. Radius 130 is 20px from edge.

        // Since .dial-number is absolute centered in .dial-plate by default (top: 50%, left: 50%),
        // we just translate X/Y.

        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;

        // Also rotate the text so it's readable or aligned?
        // Let's rotate it so 0 is upright.
        // Actually, let's rotate it with the spoke.
        // CSS rotate is clockwise.
        el.style.transform = `translate(${x}px, ${y}px) rotate(${angleDeg + 90}deg)`;

        dialPlate.appendChild(el);
    }
}

initDial();

// Render Logic
viz.onRender = (step) => {
    // Rotation Logic:
    // The "Tick Mark" is fixed at the top (Green/Gold arrow).
    // We want the current number (step.pos) to be at the top.
    // If step.pos is 0, 0 is at -90deg (Top). Plate rotation should be 0.
    // If step.pos is 10 (which is at 36deg from 0), we want that 36deg spot to be at Top.
    // So we must rotate the plate -36deg.
    // general: rotation = -1 * step.pos * 3.6

    if (dialPlate) {
        const rotation = -1 * step.pos * 3.6;
        dialPlate.style.transform = `rotate(${rotation}deg)`;
    }

    if (curPosVal) curPosVal.textContent = step.pos;

    // Stats
    if (statDir) statDir.textContent = step.dir || '-';
    if (statDist) statDist.textContent = step.dist || '-';
    if (statHits) statHits.textContent = step.hits ?? hits;
    hits = step.hits ?? hits; // sync generic hits var

    // Math
    if (mathDisplay) {
        if (step.math) mathDisplay.textContent = step.math;
        else mathDisplay.textContent = ""; // clear if empty
    }
};

// Simulation Logic
function planSimulation() {
    viz.reset();
    hits = 0;
    let currentPos = 50;

    // Check Part
    const urlParams = new URLSearchParams(window.location.search);
    const isPart2 = urlParams.get('part') === '2';

    if (isPart2) {
        document.title = "Day 01 // Part 2 // Zero Count";
        const h1 = document.querySelector('h1');
        if (h1) h1.textContent = "DAY 01 // ZERO CROSSINGS";
    }

    // Initial State
    viz.addStep({
        pos: currentPos,
        hits: 0,
        log: `System initialized at pos 50 [Mode: ${isPart2 ? 'CROSSING COUNT' : 'ZERO HITS'}]`,
        line: 1
    });

    const instructions = parseInstructions(inputArea.value);

    for (const instr of instructions) {
        const startPos = currentPos;
        let targetPos;
        let mathStr = "";

        viz.addStep({
            pos: currentPos,
            dir: instr.direction,
            dist: instr.distance,
            line: 1,
            log: `Processing: ${instr.direction}${instr.distance}`
        });

        if (instr.direction === 'R') {
            viz.addStep({ pos: currentPos, dir: instr.direction, dist: instr.distance, line: 2 });
            mathStr = `(${startPos} + ${instr.distance}) % 100`;
            targetPos = (currentPos + instr.distance) % DIAL_SIZE;

            // Part 2 Logic: Crossings
            if (isPart2) {
                // R: (current + dist) / 100
                const crossings = Math.floor((currentPos + instr.distance) / DIAL_SIZE);
                if (crossings > 0) {
                    hits += crossings;
                    viz.addStep({
                        pos: currentPos, // Still at start visually for moment
                        hits: hits,
                        log: `Crossed Zero ${crossings} times`,
                        highlight: true
                    });
                }
            }

            viz.addStep({
                pos: currentPos,
                dir: instr.direction,
                dist: instr.distance,
                line: 3,
                math: mathStr + " = ..."
            });
        } else {
            viz.addStep({ pos: currentPos, dir: instr.direction, dist: instr.distance, line: 4 }); // 'else'
            mathStr = `(${startPos} - ${instr.distance} % 100 + 100) % 100`;
            targetPos = (currentPos - instr.distance % DIAL_SIZE + DIAL_SIZE) % DIAL_SIZE;

            // Part 2 Logic: Left Crossings
            if (isPart2) {
                let crossings = 0;
                if (currentPos === 0) {
                    crossings = Math.floor(instr.distance / DIAL_SIZE);
                } else if (instr.distance >= currentPos) {
                    crossings = 1 + Math.floor((instr.distance - currentPos) / DIAL_SIZE);
                }

                if (crossings > 0) {
                    hits += crossings;
                    viz.addStep({
                        pos: currentPos,
                        hits: hits,
                        log: `Crossed Zero ${crossings} times (Left Spin)`,
                        highlight: true
                    });
                }
            }

            viz.addStep({
                pos: currentPos,
                dir: instr.direction,
                dist: instr.distance,
                line: 5,
                math: mathStr + " = ..."
            });
        }

        currentPos = targetPos;

        // Part 1 Logic: Hit Zero
        if (!isPart2) {
            if (currentPos === 0) hits++;
        }

        // Finalize Step
        viz.addStep({
            pos: currentPos,
            dir: instr.direction,
            dist: instr.distance,
            hits: hits,
            math: `${mathStr} = ${currentPos}`,
            line: 8,
            log: `Moved to ${currentPos}${!isPart2 && currentPos === 0 ? ' [HIT ZERO]' : ''}`,
            highlight: !isPart2 && currentPos === 0
        });
    }

    viz.addStep({ pos: currentPos, line: 9, log: "Simulation Sequence Complete" });
    viz.start();
}

function parseInstructions(text) {
    const regex = /([RL])(\d+)/g;
    let match;
    const instructions = [];
    while ((match = regex.exec(text)) !== null) {
        instructions.push({
            direction: match[1],
            distance: parseInt(match[2])
        });
    }
    return instructions;
}

// Bind Buttons (Safe binding)
const btnPlay = document.getElementById('btnPlay');
if (btnPlay) {
    btnPlay.addEventListener('click', () => {
        if (viz.steps.length === 0) planSimulation();
        viz.togglePlay();
    });
}

const btnNext = document.getElementById('btnNext');
if (btnNext) {
    btnNext.addEventListener('click', () => {
        if (viz.steps.length === 0) planSimulation();
        viz.next();
    });
}

const btnPrev = document.getElementById('btnPrev');
if (btnPrev) {
    btnPrev.addEventListener('click', () => viz.prev());
}

// Load default input if empty
if (inputArea && !inputArea.value) {
    inputArea.value = "R10, L5, R20, L50, R100";
}
