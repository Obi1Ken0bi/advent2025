const viz = new AlgoVisualizer();

const packetDisplay = document.getElementById('packetDisplay');
const splitDisplay = document.getElementById('splitDisplay');
const statCur = document.getElementById('statCur');
const statLen = document.getElementById('statLen');
const statValid = document.getElementById('statValid');
const inputArea = document.getElementById('input');

let totalValid = 0;

// Render Logic
viz.onRender = (step) => {
    // Stat Updates
    statValid.textContent = step.totalValid ?? totalValid;
    totalValid = step.totalValid ?? totalValid;
    statCur.textContent = step.val || '-';
    statLen.textContent = step.len || '-';

    // Packet Visuals
    // To minimize complexity, we will just manage a single 'packet' div
    packetDisplay.innerHTML = '';
    splitDisplay.innerHTML = '';

    if (step.val !== undefined) {
        const pk = document.createElement('div');
        pk.className = `packet ${step.status || ''}`;
        pk.textContent = step.val;
        packetDisplay.appendChild(pk);
    }

    if (step.p1 !== undefined) {
        const d1 = document.createElement('div');
        d1.className = `part ${step.p1Status || ''}`;
        d1.textContent = step.p1;
        splitDisplay.appendChild(d1);
    }

    if (step.p2 !== undefined) {
        const d2 = document.createElement('div');
        d2.className = `part ${step.p2Status || ''}`;
        d2.textContent = step.p2;
        splitDisplay.appendChild(d2);
    }
};

function planSimulation() {
    viz.reset();
    totalValid = 0;

    const items = parseInput(inputArea.value);

    // Check Part
    const urlParams = new URLSearchParams(window.location.search);
    const isPart2 = urlParams.get('part') === '2';

    if (isPart2) {
        document.title = "Day 02 // Part 2 // Repeat Pattern";
        document.querySelector('h1').textContent = "DAY 02 // REPEATING PATTERNS";

        // Update Code Block visually (hacky but works for demo)
        document.querySelector('.code-block').innerHTML = `
<span id="line-1" class="code-line">fun checkValid(seq) {</span>
<span id="line-2" class="code-line">  for (i in 1..seq.len/2) {</span>
<span id="line-3" class="code-line">    pattern = seq.take(i)</span>
<span id="line-4" class="code-line">    rem = seq.drop(i)</span>
<span id="line-5" class="code-line">    if (checkPattern(p, rem)) return true</span>
<span id="line-6" class="code-line">  }</span>
<span id="line-7" class="code-line">  return false</span>
<span id="line-8" class="code-line">}</span>`;
    }

    for (const val of items) {
        const s = val.toString();
        const len = s.length;

        viz.addStep({
            val: val,
            len: len,
            line: 1,
            log: `Checking ${isPart2 ? 'Pattern' : 'Item'}: ${val}`
        });

        if (!isPart2) {
            // PART 1 LOGIC
            // Line 2: Mod check
            if (len % 2 !== 0) {
                viz.addStep({
                    val: val, len: len,
                    line: 2,
                    log: `Length ${len} is ODD -> Invalid`,
                    status: 'invalid'
                });
                continue;
            }

            // Line 3: Mid
            const mid = len / 2;
            const p1 = s.substring(0, mid);
            const p2 = s.substring(mid);

            viz.addStep({
                val: val, len: len,
                line: 3,
                p1: p1,
                p2: p2,
                p1Status: 'active',
                p2Status: 'active',
                log: `Splitting at index ${mid}`
            });

            // Line 4-5
            viz.addStep({
                val: val, len: len,
                line: 4,
                p1: p1, p2: p2,
                log: `Part 1: ${p1}, Part 2: ${p2}`
            });

            // Line 6: Compare
            const match = p1 === p2;

            if (match) {
                totalValid += parseInt(val);
                viz.addStep({
                    val: val, len: len,
                    line: 6,
                    p1: p1, p2: p2,
                    p1Status: 'match', p2Status: 'match',
                    status: 'valid',
                    totalValid: totalValid,
                    log: `Match Found! ${p1} == ${p2}`,
                    highlight: true
                });
            } else {
                viz.addStep({
                    val: val, len: len,
                    line: 6,
                    p1: p1, p2: p2,
                    p1Status: 'no-match', p2Status: 'no-match',
                    status: 'invalid',
                    log: `Mismatch. ${p1} != ${p2}`,
                });
            }
        } else {
            // PART 2 LOGIC
            let found = false;
            // Iterate pattern lengths 1 to len/2
            for (let i = 1; i <= len / 2; i++) {
                const pattern = s.substring(0, i);
                const remaining = s.substring(i);

                viz.addStep({
                    val: val,
                    line: 2,
                    p1: pattern,
                    p2: remaining,
                    p1Status: 'active',
                    log: `Trying Pattern len ${i}: "${pattern}"`
                });

                // Check if valid
                // Logic: remaining length must be multiple of pattern length
                // and must consist of pattern repeated

                // Simulating checkPattern (Line 5 check)
                if (remaining.length % pattern.length !== 0) {
                    viz.addStep({
                        val: val, line: 5, p1: pattern, p2: remaining,
                        log: `Skipping: Remainder len ${remaining.length} not divisible by ${pattern.length}`
                    });
                    continue;
                }

                // Check repetitions
                // Split remaining into chunks
                const chunks = [];
                for (let c = 0; c < remaining.length; c += pattern.length) {
                    chunks.push(remaining.substring(c, c + pattern.length));
                }

                const allMatch = chunks.every(c => c === pattern);

                if (allMatch) {
                    totalValid += parseInt(val); // Part 2 sums values or counts? Task code said sumOf { it.toLong() }.
                    // Wait, task 2 code:
                    // .filter { checkValid(it) }
                    // .sumOf { it.toLong() }
                    // So we sum the generic numbers.
                    // IMPORTANT: Part 1 Summed. Part 2 also sums.
                    // My variable is named totalValid, but I should probably treat it as sum for Part 2?
                    // Let's check Day 2 Task 1: .sumOf { it.toLong() }.
                    // My previous Part 1 implementation counted valid items or summed?
                    // createItem(num) -> totalSum += num; in my OLD impl (pre-refactor).
                    // In NEW refactor: totalValid++. Ah, I was counting COUNT, but task 1 was SUM.
                    // Let's fix that for both to match code: totalValid should be sum.

                    // Correction: I'll use it as sum.

                    found = true;
                    viz.addStep({
                        val: val,
                        line: 5,
                        p1: pattern,
                        p2: remaining,
                        p1Status: 'match',
                        p2Status: 'match',
                        status: 'valid',
                        log: `Pattern Matched! "${pattern}" repeats in "${remaining}"`,
                        highlight: true,
                        totalValid: totalValid // Should be incremented
                    });
                    break;
                } else {
                    viz.addStep({
                        val: val, line: 5, p1: pattern, p2: remaining,
                        p2Status: 'no-match',
                        log: `Pattern fail. "${pattern}" does not repeat perfectly.`
                    });
                }
            }

            if (found) {
                // Already handled in loop
            } else {
                viz.addStep({
                    val: val, line: 7, status: 'invalid', log: `No valid pattern found for ${val}`
                });
            }
        }
    }

    viz.addStep({ line: 7, log: "Batch Scan Complete" });
    viz.start();
}

function parseInput(text) {
    // Flexible parsing (commas, newlines, spaces)
    return text.split(/[,;\s]+/).map(s => s.trim()).filter(s => s.length > 0).map(Number).filter(n => !isNaN(n));
}

// Bind Buttons
document.getElementById('btnPlay').addEventListener('click', () => {
    if (viz.steps.length === 0) planSimulation();
    viz.togglePlay();
});
document.getElementById('btnNext').addEventListener('click', () => {
    if (viz.steps.length === 0) planSimulation();
    viz.next();
});
document.getElementById('btnPrev').addEventListener('click', () => viz.prev());
