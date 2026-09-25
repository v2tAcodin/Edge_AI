// ==========================================
// 🎵 EDGE AI HUB — AUDIO ENGINE
// Web Audio API: Lo-Fi Music + SFX System
// Fully synthesized, zero dependencies, offline ready
// ==========================================

const AudioEngine = (() => {
    // ── Internal State ──
    let audioCtx = null;
    let masterGain = null;
    let musicGain = null;
    let sfxGain = null;
    let isPlaying = false;
    let musicEnabled = true;
    let sfxEnabled = true;
    let musicVolume = 0.55;
    let sfxVolume = 0.75;
    let currentBPM = 72;
    let loopTimers = [];
    let activeOscillators = [];
    let panelOpen = false;

    const STORAGE_KEY = 'edge_ai_audio_prefs_v2';

    // ── Lo-Fi Chord Progressions (Jazz / Chillhop) ──
    const chordProgressions = [
        // Progression 1: Cmaj7 → Am7 → Dm7 → G7
        [
            [261.63, 329.63, 392.00, 493.88], // Cmaj7
            [220.00, 261.63, 329.63, 392.00], // Am7
            [293.66, 349.23, 440.00, 523.25], // Dm7
            [196.00, 246.94, 293.66, 349.23], // G7
        ],
        // Progression 2: Fmaj7 → Em7 → Dm7 → Cmaj7
        [
            [174.61, 220.00, 261.63, 329.63], // Fmaj7
            [164.81, 196.00, 246.94, 293.66], // Em7
            [146.83, 174.61, 220.00, 261.63], // Dm7
            [130.81, 164.81, 196.00, 246.94], // Cmaj7
        ],
        // Progression 3: Am7 → Dm7 → Gmaj7 → Cmaj7
        [
            [220.00, 261.63, 329.63, 392.00], // Am7
            [293.66, 349.23, 440.00, 523.25], // Dm7
            [196.00, 246.94, 293.66, 369.99], // Gmaj7
            [261.63, 329.63, 392.00, 493.88], // Cmaj7
        ],
        // Progression 4: Dm9 → G13 → Cmaj9 → Am11 (Jazzy)
        [
            [146.83, 174.61, 220.00, 329.63], // Dm9
            [196.00, 246.94, 349.23, 440.00], // G13
            [130.81, 164.81, 293.66, 369.99], // Cmaj9
            [220.00, 261.63, 392.00, 493.88], // Am11
        ],
    ];

    let currentProgIdx = 0;
    let currentChordIdx = 0;

    // ── Initialize AudioContext ──
    function init() {
        if (audioCtx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            console.warn('[AudioEngine] Web Audio API is not supported in this environment.');
            return;
        }

        try {
            audioCtx = new AudioContextClass();

            // Master Bus
            masterGain = audioCtx.createGain();
            masterGain.gain.value = 1.0;
            masterGain.connect(audioCtx.destination);

            // Music Bus
            musicGain = audioCtx.createGain();
            musicGain.gain.value = musicVolume;
            musicGain.connect(masterGain);

            // SFX Bus
            sfxGain = audioCtx.createGain();
            sfxGain.gain.value = sfxVolume;
            sfxGain.connect(masterGain);

            loadPrefs();
        } catch (e) {
            console.warn('[AudioEngine] Init error:', e);
        }
    }

    // ── Unlock Audio on First User Gesture (Autoplay Policy) ──
    function setupAutoplayUnlock() {
        const unlock = () => {
            init();
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => {});
            }
            window.removeEventListener('pointerdown', unlock, true);
            window.removeEventListener('keydown', unlock, true);
            window.removeEventListener('touchstart', unlock, true);
        };
        window.addEventListener('pointerdown', unlock, { capture: true, once: true });
        window.addEventListener('keydown', unlock, { capture: true, once: true });
        window.addEventListener('touchstart', unlock, { capture: true, once: true });
    }

    // ── Preferences Persistence ──
    function savePrefs() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                musicEnabled, sfxEnabled, musicVolume, sfxVolume, currentBPM
            }));
        } catch (e) { }
    }

    function loadPrefs() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const p = JSON.parse(saved);
                musicEnabled = p.musicEnabled !== undefined ? p.musicEnabled : true;
                sfxEnabled = p.sfxEnabled !== undefined ? p.sfxEnabled : true;
                musicVolume = p.musicVolume !== undefined ? Math.max(0.35, p.musicVolume) : 0.55;
                sfxVolume = p.sfxVolume !== undefined ? Math.max(0.50, p.sfxVolume) : 0.75;
                currentBPM = p.currentBPM || 72;
                if (musicGain) musicGain.gain.value = musicVolume;
                if (sfxGain) sfxGain.gain.value = sfxVolume;
            }
        } catch (e) { }
    }

    // ══════════════════════════════════════════
    // 🎶 LO-FI MUSIC GENERATOR (Synthesized)
    // ══════════════════════════════════════════

    // Subtle vinyl crackle
    function createVinylCrackle() {
        if (!audioCtx) return null;
        const bufferSize = audioCtx.sampleRate * 4;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() < 0.0018 ? (Math.random() - 0.5) * 0.25 : 0;
        }
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2800;
        filter.Q.value = 0.6;

        const crackleGain = audioCtx.createGain();
        crackleGain.gain.value = 0.035;

        source.connect(filter);
        filter.connect(crackleGain);
        crackleGain.connect(musicGain);
        source.start();
        activeOscillators.push(source);
        return source;
    }

    // Warm ambient rain texture
    function createRainAmbience() {
        if (!audioCtx) return null;
        const bufferSize = audioCtx.sampleRate * 5;
        const buffer = audioCtx.createBuffer(2, bufferSize, audioCtx.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
            const data = buffer.getChannelData(ch);
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                data[i] = (i > 0 ? data[i - 1] * 0.997 : 0) + white * 0.02;
            }
        }
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 900;

        const rainGain = audioCtx.createGain();
        rainGain.gain.value = 0.045;

        source.connect(filter);
        filter.connect(rainGain);
        rainGain.connect(musicGain);
        source.start();
        activeOscillators.push(source);
        return source;
    }

    // Warm chord voicing
    function playChord(frequencies, startTime, duration) {
        if (!audioCtx) return;
        frequencies.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            // Subtle Lo-Fi detuning for natural chorus
            osc.frequency.value = freq * (1 + (Math.random() - 0.5) * 0.005);

            const gain = audioCtx.createGain();
            const attackTime = 0.12 + Math.random() * 0.08;
            const vol = 0.16 + Math.random() * 0.04;

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(vol, startTime + attackTime);
            gain.gain.setValueAtTime(vol, startTime + duration - 0.4);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            // Lo-Fi tone filter
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1400 + Math.random() * 500;
            filter.Q.value = 0.8;

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(musicGain);

            osc.start(startTime);
            osc.stop(startTime + duration + 0.05);
            activeOscillators.push(osc);
        });
    }

    // Punchy Lo-Fi kick drum
    function playKick(time) {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, time);
        osc.frequency.exponentialRampToValueAtTime(42, time + 0.14);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.40, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 240;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(musicGain);
        osc.start(time);
        osc.stop(time + 0.35);
        activeOscillators.push(osc);
    }

    // Crisp Lo-Fi hi-hat
    function playHiHat(time, open = false) {
        if (!audioCtx) return;
        const bufLen = audioCtx.sampleRate * (open ? 0.14 : 0.05);
        const buffer = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufLen; i++) {
            data[i] = (Math.random() * 2 - 1);
        }

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 6500;

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(open ? 0.12 : 0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + (open ? 0.14 : 0.05));

        source.connect(filter);
        filter.connect(gain);
        gain.connect(musicGain);
        source.start(time);
        activeOscillators.push(source);
    }

    // Warm deep bassline
    function playBass(freq, time, duration) {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq / 2; // Octave lower

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.28, time + 0.08);
        gain.gain.setValueAtTime(0.28, time + duration - 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 280;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(musicGain);
        osc.start(time);
        osc.stop(time + duration + 0.05);
        activeOscillators.push(osc);
    }

    // Main music scheduler loop
    function scheduleMusicLoop() {
        if (!isPlaying || !musicEnabled || !audioCtx) return;

        const beatDuration = 60 / currentBPM;
        const barDuration = beatDuration * 4;
        const now = audioCtx.currentTime;
        const prog = chordProgressions[currentProgIdx];

        // Schedule 4 bars ahead
        for (let bar = 0; bar < 4; bar++) {
            const barStart = now + bar * barDuration;
            const chord = prog[(currentChordIdx + bar) % prog.length];

            // Chords
            playChord(chord, barStart, barDuration - 0.05);

            // Bass root
            playBass(chord[0], barStart, barDuration * 0.85);

            // Drum pattern
            for (let beat = 0; beat < 4; beat++) {
                const beatTime = barStart + beat * beatDuration;

                // Kick on 1 and 3
                if (beat === 0 || beat === 2) {
                    playKick(beatTime);
                }

                // Hi-hat on beats
                playHiHat(beatTime, beat === 1 && Math.random() > 0.6);

                // Swing eighth-note hi-hat
                if (Math.random() > 0.35) {
                    playHiHat(beatTime + beatDuration * 0.66, false);
                }
            }
        }

        currentChordIdx = (currentChordIdx + 4) % prog.length;

        // Subtle progression variation
        if (Math.random() < 0.2) {
            currentProgIdx = Math.floor(Math.random() * chordProgressions.length);
        }

        const timer = setTimeout(() => scheduleMusicLoop(), barDuration * 4 * 1000 - 120);
        loopTimers.push(timer);
    }

    // ── Start / Stop Music ──
    function startMusic() {
        init();
        if (!audioCtx) return;
        if (isPlaying) return;

        const runMusic = () => {
            if (!isPlaying) return;
            stopActiveMusicNodes();
            createVinylCrackle();
            createRainAmbience();
            scheduleMusicLoop();
            updateUI();
        };

        isPlaying = true;
        updateUI();

        if (audioCtx.state === 'suspended') {
            audioCtx.resume().then(runMusic).catch(e => {
                console.warn('[AudioEngine] Resume failed:', e);
            });
        } else {
            runMusic();
        }
    }

    function stopActiveMusicNodes() {
        loopTimers.forEach(t => clearTimeout(t));
        loopTimers = [];
        activeOscillators.forEach(osc => {
            try { osc.stop(); } catch (e) { }
        });
        activeOscillators = [];
    }

    function stopMusic() {
        isPlaying = false;
        stopActiveMusicNodes();
        updateUI();
    }

    function toggleMusic() {
        if (isPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    }

    // ══════════════════════════════════════════
    // 🔊 SFX (Sound Effects) LIBRARY
    // Crisp, punchy, perfectly audible
    // ══════════════════════════════════════════

    function playSFX(type) {
        if (!sfxEnabled) return;
        init();
        if (!audioCtx) return;

        if (audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => {
                _triggerSFX(type);
            }).catch(() => {});
            return;
        }

        _triggerSFX(type);
    }

    function _triggerSFX(type) {
        if (!audioCtx || !sfxGain) return;
        const now = audioCtx.currentTime;

        switch (type) {
            case 'click': _sfxClick(now); break;
            case 'hover': _sfxHover(now); break;
            case 'success': _sfxSuccess(now); break;
            case 'error': _sfxError(now); break;
            case 'tab': _sfxTab(now); break;
            case 'toast': _sfxToast(now); break;
            case 'xp': _sfxXP(now); break;
            case 'levelup': _sfxLevelUp(now); break;
            case 'complete': _sfxComplete(now); break;
            case 'notify': _sfxNotify(now); break;
            case 'typing': _sfxTyping(now); break;
            case 'whoosh': _sfxWhoosh(now); break;
            case 'boot': _sfxBoot(now); break;
            default: _sfxClick(now);
        }
    }

    // Click — crisp digital blip
    function _sfxClick(t) {
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(950, t);
        osc.frequency.exponentialRampToValueAtTime(450, t + 0.05);
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.30, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.08);
    }

    // Hover — subtle tick
    function _sfxHover(t) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 1400;
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.04);
    }

    // Success — ascending chime (C5 → E5 → G5)
    function _sfxSuccess(t) {
        [523.25, 659.25, 783.99].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const g = audioCtx.createGain();
            const start = t + i * 0.09;
            g.gain.setValueAtTime(0, start);
            g.gain.linearRampToValueAtTime(0.35, start + 0.03);
            g.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
            osc.connect(g);
            g.connect(sfxGain);
            osc.start(start);
            osc.stop(start + 0.3);
        });
    }

    // Error — low descending buzz
    function _sfxError(t) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.linearRampToValueAtTime(130, t + 0.22);
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.28, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 650;
        osc.connect(filter);
        filter.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.26);
    }

    // Tab switch — smooth sweep
    function _sfxTab(t) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, t);
        osc.frequency.exponentialRampToValueAtTime(950, t + 0.06);
        osc.frequency.exponentialRampToValueAtTime(680, t + 0.12);
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.28, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.16);
    }

    // Toast notification — bright bell chime
    function _sfxToast(t) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 880;
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.28, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.4);

        // Harmonic
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 1318.51; // E6
        const g2 = audioCtx.createGain();
        g2.gain.setValueAtTime(0.18, t);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc2.connect(g2);
        g2.connect(sfxGain);
        osc2.start(t);
        osc2.stop(t + 0.3);
    }

    // XP gain — bright sparkle
    function _sfxXP(t) {
        [1046.50, 1318.51, 1567.98].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const g = audioCtx.createGain();
            const start = t + i * 0.06;
            g.gain.setValueAtTime(0.32, start);
            g.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
            osc.connect(g);
            g.connect(sfxGain);
            osc.start(start);
            osc.stop(start + 0.22);
        });
    }

    // Level Up — triumphant fanfare
    function _sfxLevelUp(t) {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
        notes.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = i < 2 ? 'sine' : 'triangle';
            osc.frequency.value = freq;
            const g = audioCtx.createGain();
            const start = t + i * 0.12;
            g.gain.setValueAtTime(0, start);
            g.gain.linearRampToValueAtTime(0.38, start + 0.04);
            g.gain.exponentialRampToValueAtTime(0.001, start + (i === 3 ? 0.6 : 0.3));
            osc.connect(g);
            g.connect(sfxGain);
            osc.start(start);
            osc.stop(start + 0.65);
        });
    }

    // Complete — achievement jingle
    function _sfxComplete(t) {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const g = audioCtx.createGain();
            const start = t + i * 0.08;
            g.gain.setValueAtTime(0.32, start);
            g.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
            osc.connect(g);
            g.connect(sfxGain);
            osc.start(start);
            osc.stop(start + 0.4);
        });
    }

    // Notify — two-tone chime
    function _sfxNotify(t) {
        [660, 880].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const g = audioCtx.createGain();
            const start = t + i * 0.14;
            g.gain.setValueAtTime(0.30, start);
            g.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
            osc.connect(g);
            g.connect(sfxGain);
            osc.start(start);
            osc.stop(start + 0.3);
        });
    }

    // Typing — subtle mechanical keyboard tick
    function _sfxTyping(t) {
        const freq = 1200 + Math.random() * 400;
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.03);
    }

    // Whoosh — modal and screen sweep
    function _sfxWhoosh(t) {
        const bufLen = audioCtx.sampleRate * 0.22;
        const buffer = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufLen; i++) {
            data[i] = (Math.random() * 2 - 1);
        }
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, t);
        filter.frequency.exponentialRampToValueAtTime(3500, t + 0.1);
        filter.frequency.exponentialRampToValueAtTime(700, t + 0.22);
        filter.Q.value = 2.2;

        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.22, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        source.connect(filter);
        filter.connect(g);
        g.connect(sfxGain);
        source.start(t);
    }

    // Boot — system startup sound
    function _sfxBoot(t) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.exponentialRampToValueAtTime(520, t + 0.4);
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.32, t);
        g.gain.setValueAtTime(0.32, t + 0.35);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.65);

        setTimeout(() => {
            if (audioCtx) _sfxSuccess(audioCtx.currentTime);
        }, 320);
    }

    // ══════════════════════════════════════════
    // 🎛️ UI CONTROLS & EVENT BINDINGS
    // ══════════════════════════════════════════

    function togglePanel() {
        panelOpen = !panelOpen;
        const panel = document.getElementById('audio-control-panel');
        const btn = document.getElementById('audio-fab-btn');
        if (panel) {
            panel.classList.toggle('open', panelOpen);
        }
        if (btn) {
            btn.classList.toggle('active', panelOpen);
        }
        if (panelOpen) {
            playSFX('whoosh');
        }
    }

    function updateUI() {
        const playBtn = document.getElementById('audio-music-toggle');
        const statusDot = document.getElementById('audio-status-dot');
        const statusText = document.getElementById('audio-status-text');
        const sfxBtn = document.getElementById('audio-sfx-toggle');
        const musicSlider = document.getElementById('audio-music-vol');
        const sfxSlider = document.getElementById('audio-sfx-vol');
        const bpmDisplay = document.getElementById('audio-bpm-display');
        const fabIcon = document.getElementById('audio-fab-icon');
        const visualizer = document.getElementById('audio-visualizer');

        // Header and Auth controls
        const headerBtn = document.getElementById('btn-audio-header');
        const headerIcon = document.getElementById('header-audio-icon');
        const headerLabel = document.getElementById('header-audio-label');
        const authBtn = document.getElementById('btn-audio-auth');

        if (playBtn) playBtn.innerHTML = isPlaying ? '⏸ Tạm Dừng' : '▶ Phát Nhạc';
        if (playBtn) playBtn.classList.toggle('playing', isPlaying);
        if (statusDot) statusDot.classList.toggle('active', isPlaying);
        if (statusText) statusText.textContent = isPlaying ? 'ĐANG PHÁT' : 'TẮT';
        if (sfxBtn) {
            sfxBtn.innerHTML = sfxEnabled ? '🔊 SFX: BẬT' : '🔇 SFX: TẮT';
            sfxBtn.classList.toggle('off', !sfxEnabled);
        }
        if (musicSlider) musicSlider.value = musicVolume * 100;
        if (sfxSlider) sfxSlider.value = sfxVolume * 100;
        if (bpmDisplay) bpmDisplay.textContent = currentBPM + ' BPM';
        if (fabIcon) fabIcon.textContent = isPlaying ? '🎵' : '🎶';
        if (visualizer) visualizer.classList.toggle('active', isPlaying);

        if (headerBtn) headerBtn.classList.toggle('playing', isPlaying);
        if (headerIcon) headerIcon.textContent = isPlaying ? '🔊' : '🎵';
        if (headerLabel) headerLabel.textContent = isPlaying ? 'Nhạc: BẬT' : 'Nhạc';
        if (authBtn) {
            authBtn.textContent = isPlaying ? '🔊' : '🎵';
            authBtn.classList.toggle('active', isPlaying);
        }
    }

    function setMusicVolume(val) {
        musicVolume = val / 100;
        if (musicGain) musicGain.gain.value = musicVolume;
        savePrefs();
    }

    function setSfxVolume(val) {
        sfxVolume = val / 100;
        if (sfxGain) sfxGain.gain.value = sfxVolume;
        savePrefs();
    }

    function toggleSfx() {
        sfxEnabled = !sfxEnabled;
        if (sfxEnabled) playSFX('click');
        savePrefs();
        updateUI();
    }

    function setBPM(bpm) {
        currentBPM = Math.max(50, Math.min(120, bpm));
        const bpmDisplay = document.getElementById('audio-bpm-display');
        if (bpmDisplay) bpmDisplay.textContent = currentBPM + ' BPM';
        savePrefs();
    }

    // ── Global SFX on User Clicks ──
    function attachGlobalSFX() {
        // All regular interactive buttons & cards
        document.addEventListener('click', (e) => {
            const el = e.target.closest('button, .btn, .portal-card, .mode-btn, .cs-cat-btn');
            if (!el) return;
            // Tabs have dedicated tab SFX in switchTab()
            if (el.classList.contains('tab-btn')) return;
            // Skip audio panel control elements so they don't produce click artifacts
            if (el.id === 'audio-fab-btn' || el.closest('#audio-control-panel') || el.id === 'btn-audio-header') return;
            playSFX('click');
        });

        // Keyboard feedback
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                playSFX('whoosh');
            }
        });
    }

    // ── Inject Floating Panel & FAB HTML ──
    function injectPanel() {
        if (document.getElementById('audio-fab-btn')) return;

        const html = `
        <!-- Audio FAB (Floating Action Button) -->
        <button class="audio-fab" id="audio-fab-btn" onclick="AudioEngine.togglePanel()" title="Bảng điều khiển Âm thanh (Nhạc Lo-Fi & SFX)">
            <span class="audio-fab-icon" id="audio-fab-icon">🎶</span>
            <div class="audio-fab-pulse" id="audio-visualizer"></div>
        </button>

        <!-- Audio Control Panel -->
        <div class="audio-panel" id="audio-control-panel">
            <div class="audio-panel-header">
                <div class="audio-panel-title">
                    <span>🎧</span> AUDIO ENGINE
                </div>
                <div class="audio-status">
                    <span class="audio-status-dot" id="audio-status-dot"></span>
                    <span class="audio-status-text" id="audio-status-text">TẮT</span>
                </div>
            </div>

            <div class="audio-panel-body">
                <!-- Music Section -->
                <div class="audio-section">
                    <div class="audio-section-label">🎶 Nhạc Nền Lo-Fi (Web Audio API)</div>
                    <button class="audio-btn audio-play-btn" id="audio-music-toggle" onclick="AudioEngine.toggleMusic()">
                        ▶ Phát Nhạc
                    </button>
                    <div class="audio-slider-group">
                        <label>🔉 Âm lượng Nhạc</label>
                        <input type="range" min="0" max="100" value="55" class="audio-slider" id="audio-music-vol"
                            oninput="AudioEngine.setMusicVolume(this.value)">
                    </div>
                    <div class="audio-bpm-control">
                        <button class="audio-bpm-btn" onclick="AudioEngine.setBPM(${currentBPM} - 5)">−</button>
                        <span class="audio-bpm-display" id="audio-bpm-display">${currentBPM} BPM</span>
                        <button class="audio-bpm-btn" onclick="AudioEngine.setBPM(${currentBPM} + 5)">+</button>
                    </div>
                </div>

                <!-- SFX Section -->
                <div class="audio-section">
                    <div class="audio-section-label">🔊 Hiệu Ứng Âm Thanh (SFX)</div>
                    <button class="audio-btn audio-sfx-btn" id="audio-sfx-toggle" onclick="AudioEngine.toggleSfx()">
                        🔊 SFX: BẬT
                    </button>
                    <div class="audio-slider-group">
                        <label>🔉 Âm lượng SFX</label>
                        <input type="range" min="0" max="100" value="75" class="audio-slider" id="audio-sfx-vol"
                            oninput="AudioEngine.setSfxVolume(this.value)">
                    </div>
                </div>

                <!-- SFX Test Grid -->
                <div class="audio-section">
                    <div class="audio-section-label">🧪 Thử Âm Thanh</div>
                    <div class="audio-test-grid">
                        <button class="audio-test-btn" onclick="AudioEngine.playSFX('click')">Click</button>
                        <button class="audio-test-btn" onclick="AudioEngine.playSFX('success')">Success</button>
                        <button class="audio-test-btn" onclick="AudioEngine.playSFX('error')">Error</button>
                        <button class="audio-test-btn" onclick="AudioEngine.playSFX('xp')">+XP</button>
                        <button class="audio-test-btn" onclick="AudioEngine.playSFX('levelup')">Level Up</button>
                        <button class="audio-test-btn" onclick="AudioEngine.playSFX('complete')">Complete</button>
                        <button class="audio-test-btn" onclick="AudioEngine.playSFX('notify')">Notify</button>
                        <button class="audio-test-btn" onclick="AudioEngine.playSFX('whoosh')">Whoosh</button>
                        <button class="audio-test-btn" onclick="AudioEngine.playSFX('boot')">Boot</button>
                        <button class="audio-test-btn" onclick="AudioEngine.playSFX('tab')">Tab</button>
                        <button class="audio-test-btn" onclick="AudioEngine.playSFX('toast')">Toast</button>
                    </div>
                </div>
            </div>

            <div class="audio-panel-footer">
                <span>⚡ Web Audio API • Offline Ready • No MP3s</span>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        // Dynamic BPM listeners
        document.querySelectorAll('.audio-bpm-btn').forEach((btn, idx) => {
            btn.onclick = () => {
                AudioEngine.setBPM(currentBPM + (idx === 0 ? -5 : 5));
            };
        });
    }

    // ── Boot ──
    function boot() {
        setupAutoplayUnlock();
        injectPanel();
        loadPrefs();
        attachGlobalSFX();
        updateUI();
    }

    // Auto-init on DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    // ── Public API ──
    return {
        init,
        startMusic,
        stopMusic,
        toggleMusic,
        togglePanel,
        toggleSfx,
        playSFX,
        setMusicVolume,
        setSfxVolume,
        setBPM,
        updateUI,
        get isPlaying() { return isPlaying; },
        get sfxEnabled() { return sfxEnabled; },
    };
})();
