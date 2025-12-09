class AlgoVisualizer {
    constructor() {
        this.steps = [];
        this.currentStepIndex = -1;
        this.isPlaying = false;
        this.speed = 800;
        this.timer = null;

        // UI Elements
        this.logPanel = document.getElementById('logPanel');
        this.statePanel = document.getElementById('statePanel');

        // Speed Control
        this.speedSlider = document.getElementById('speedSlider');
        if (this.speedSlider) {
            // Reverse logic: High value = Low delay (Fast), Low value = High delay (Slow)
            // Or typically slider left = slow (high delay), slider right = fast (low delay)
            // Let's do: Min (Left) = 2000ms, Max (Right) = 50ms
            this.speedSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                // Map range 0-100 to 2000-50
                // simple inverse: speed = 2050 - (val * 20) ?
                // Let's just make the slider values transparent: <input type="range" min="50" max="2000" ... >
                // But usually right is faster. So slider Should be "Speed".
                // If slider is 1..100. Delay = 2000 / slider?
                // Let's stick to reading value as delay for now, but inverted for UX if needed.
                // Simpler: HTML <input type="range" min="10" max="1000" class="speed-control">
                // We'll treat value as "Speed" (updates per secondish), so delay = 1000 / value.
                // Actually, let's just assume the slider gives us the delay directly for simplicity, but we want right = fast.
                // So HTML: min="50" max="2000" value="800" style="direction: rtl" ??

                // Let's do this: Slider Value 1 (Slow) to 100 (Fast).
                // Delay = maxDelay * (1 - value/100) + minDelay
                const maxDelay = 2000;
                const minDelay = 50;
                const percent = val / 100;
                this.speed = maxDelay - (percent * (maxDelay - minDelay));
            });
        }
    }

    addStep(state) {
        this.steps.push(state);
    }

    reset() {
        this.steps = [];
        this.currentStepIndex = -1;
        this.pause();
        this.clearLog();
    }

    start() {
        this.currentStepIndex = -1;
        this.next();
    }

    next() {
        if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++;
            this.renderStep(this.steps[this.currentStepIndex]);
        } else {
            this.pause();
        }
    }

    prev() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.renderStep(this.steps[this.currentStepIndex]);
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (this.currentStepIndex >= this.steps.length - 1) {
            this.currentStepIndex = -1;
        }
        this.isPlaying = true;
        this.loop();
    }

    pause() {
        this.isPlaying = false;
        clearTimeout(this.timer);
    }

    loop() {
        if (!this.isPlaying) return;
        this.next();
        if (this.isPlaying) { // Check again in case next() paused it (end of list)
            this.timer = setTimeout(() => this.loop(), this.speed);
        }
    }

    renderStep(step) {
        // Log Logic
        if (step.log) {
            this.addLogEntry(step.log, step.highlight);
        }

        // Highlighting Logic (if code block exists)
        if (step.line !== undefined) {
            document.querySelectorAll('.code-line').forEach(el => el.classList.remove('active'));
            const lineEl = document.getElementById(`line-${step.line}`);
            if (lineEl) lineEl.classList.add('active');
        }

        // Custom Render Callback
        if (this.onRender) {
            this.onRender(step);
        }
    }

    addLogEntry(text, highlight = false) {
        if (!this.logPanel) return;
        const entry = document.createElement('div');
        entry.className = `log-entry ${highlight ? 'highlight' : ''}`;
        entry.innerHTML = `> ${text}`;
        this.logPanel.prepend(entry);
    }

    clearLog() {
        if (this.logPanel) this.logPanel.innerHTML = '';
    }
}
