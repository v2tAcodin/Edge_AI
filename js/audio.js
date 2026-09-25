// ==========================================
// 🎵 EDGE AI HUB — AUDIO ENGINE
// Web Audio API: Lo-Fi Music + SFX System
// Fully synthesized, no external files needed
// ==========================================

const AudioEngine = (() => {
    // ── State ──
    let audioCtx = null;
    let masterGain = null;
    let musicGain = null;
    let sfxGain = null;
    let isPlaying = false;
    let musicEnabled = true;
    let sfxEnabled = true;
    let musicVolume = 0.35;
    let sfxVolume = 0.55;
    let currentBPM = 72;
    let loopTimers = [];
    let activeOscillators = [];
    let panelOpen = false;

    const STORAGE_KEY = 'edge_ai_audio_prefs_v1';

    // ── Lo-Fi Chord Progressions (Jazz/Chill) ──
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
        // Progression 4: Dm9 → G13 → Cmaj9 → Am11 (jazzy)
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
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Master chain
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.8;
        masterGain.connect(audioCtx.destination);

        // Music bus
        musicGain = audioCtx.createGain();
        musicGain.gain.value = musicVolume;
        musicGain.connect(masterGain);

        // SFX bus
        sfxGain = audioCtx.createGain();
        sfxGain.gain.value = sfxVolume;
        sfxGain.connect(masterGain);

        loadPrefs();
    }

    // ── Persistence ──
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
                musicVolume = p.musicVolume !== undefined ? p.musicVolume : 0.35;
                sfxVolume = p.sfxVolume !== undefined ? p.sfxVolume : 0.55;
                currentBPM = p.currentBPM || 72;
                if (musicGain) musicGain.gain.value = musicVolume;
                if (sfxGain) sfxGain.gain.value = sfxVolume;
            }
        } catch (e) { }
    }

    // ══════════════════════════════════════════
    // 🎶 LO-FI MUSIC GENERATOR
    // ══════════════════════════════════════════

    // Create a warm, vinyl-crackle noise
    function createVinylCrackle() {
        const bufferSize = audioCtx.sampleRate * 4;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            // Sparse crackle: mostly silence with rare pops
            data[i] = Math.random() < 0.002 ? (Math.random() - 0.5) * 0.3 : 0;
        }
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        // Bandpass to make it sound like vinyl
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3000;
        filter.Q.value = 0.5;

        const crackleGain = audioCtx.createGain();
        crackleGain.gain.value = 0.08;

        source.connect(filter);
        filter.connect(crackleGain);
        crackleGain.connect(musicGain);
        source.start();
        activeOscillators.push(source);
        return source;
    }

    // Create ambient rain/white noise
    function createRainAmbience() {
        const bufferSize = audioCtx.sampleRate * 6;
        const buffer = audioCtx.createBuffer(2, bufferSize, audioCtx.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
            const data = buffer.getChannelData(ch);
            for (let i = 0; i < bufferSize; i++) {
                // Brown noise approximation (smoother)
                const white = Math.random() * 2 - 1;
                data[i] = (i > 0 ? data[i - 1] * 0.998 : 0) + white * 0.02;
            }
        }
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        const rainGain = audioCtx.createGain();
        rainGain.gain.value = 0.06;

        source.connect(filter);
        filter.connect(rainGain);
        rainGain.connect(musicGain);
        source.start();
        activeOscillators.push(source);
        return source;
    }

    // Play a single warm chord voicing
    function playChord(frequencies, startTime, duration) {
        frequencies.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            // Alternate between sine and triangle for warmth
            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            // Subtle detune for Lo-Fi warmth
            osc.frequency.value = freq * (1 + (Math.random() - 0.5) * 0.004);

            const gain = audioCtx.createGain();
            const attackTime = 0.15 + Math.random() * 0.1;
            const vol = 0.06 + Math.random() * 0.02;

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(vol, startTime + attackTime);
            gain.gain.setValueAtTime(vol, startTime + duration - 0.5);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            // Lo-Fi filter — slight wobble
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1200 + Math.random() * 600;
            filter.Q.value = 0.7;

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(musicGain);

            osc.start(startTime);
            osc.stop(startTime + duration + 0.05);
            activeOscillators.push(osc);
        });
    }

    // Soft kick drum (Lo-Fi style)
    function playKick(time) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(musicGain);
        osc.start(time);
        osc.stop(time + 0.35);
        activeOscillators.push(osc);
    }

    // Soft hi-hat (noise-based)
    function playHiHat(time, open = false) {
        const bufLen = audioCtx.sampleRate * (open ? 0.15 : 0.06);
        const buffer = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufLen; i++) {
            data[i] = (Math.random() * 2 - 1);
        }

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(open ? 0.04 : 0.03, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + (open ? 0.15 : 0.06));

        source.connect(filter);
        filter.connect(gain);
        gain.connect(musicGain);
        source.start(time);
        activeOscillators.push(source);
    }

    // Sub bass line
    function playBass(freq, time, duration) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq / 2; // One octave down

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.10, time + 0.08);
        gain.gain.setValueAtTime(0.10, time + duration - 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 250;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(musicGain);
        osc.start(time);
        osc.stop(time + duration + 0.05);
        activeOscillators.push(osc);
    }

    // ── Main Music Loop Scheduler ──
    function scheduleMusicLoop() {
        if (!isPlaying || !musicEnabled) return;

        const beatDuration = 60 / currentBPM;
        const barDuration = beatDuration * 4;
        const now = audioCtx.currentTime;
        const prog = chordProgressions[currentProgIdx];

        // Schedule 4 bars (one full progression cycle)
        for (let bar = 0; bar < 4; bar++) {
            const barStart = now + bar * barDuration;
            const chord = prog[(currentChordIdx + bar) % prog.length];

            // Chord pad
            playChord(chord, barStart, barDuration - 0.05);

            // Bass root
            playBass(chord[0], barStart, barDuration * 0.8);

            // Drum pattern per bar
            for (let beat = 0; beat < 4; beat++) {
                const beatTime = barStart + beat * beatDuration;

                // Kick on beats 1 and 3 (sometimes skip for variation)
                if ((beat === 0 || beat === 2) && Math.random() > 0.15) {
                    playKick(beatTime);
                }

                // Hi-hat on every beat, open on beat 2 sometimes
                if (Math.random() > 0.1) {
                    playHiHat(beatTime, beat === 1 && Math.random() > 0.5);
                }

                // Offbeat hi-hat for swing feel
                if (Math.random() > 0.4) {
                    playHiHat(beatTime + beatDuration * 0.66, false);
                }
            }
        }

        // Advance chord index
        currentChordIdx = (currentChordIdx + 4) % prog.length;

        // Occasionally switch progression for variety
        if (Math.random() < 0.2) {
            currentProgIdx = Math.floor(Math.random() * chordProgressions.length);
        }

        // Schedule next loop
        const timer = setTimeout(() => scheduleMusicLoop(), barDuration * 4 * 1000 - 100);
        loopTimers.push(timer);
    }

    // ── Start / Stop Music ──
    function startMusic() {
        init();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        if (isPlaying) return;
        isPlaying = true;

        // Start ambient layers
        createVinylCrackle();
        createRainAmbience();

        // Start chord + drum loop
        scheduleMusicLoop();
        updateUI();
    }

    function stopMusic() {
        isPlaying = false;

        // Clear scheduled loops
        loopTimers.forEach(t => clearTimeout(t));
        loopTimers = [];

        // Stop all oscillators
        activeOscillators.forEach(osc => {
            try { osc.stop(); } catch (e) { }
        });
        activeOscillators = [];

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
    // ══════════════════════════════════════════

    function playSFX(type) {
        if (!sfxEnabled) return;
        init();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const now = audioCtx.currentTime;

        switch (type) {
            case 'click':
                _sfxClick(now);
                break;
            case 'hover':
                _sfxHover(now);
                break;
            case 'success':
                _sfxSuccess(now);
                break;
            case 'error':
                _sfxError(now);
                break;
            case 'tab':
                _sfxTab(now);
                break;
            case 'toast':
                _sfxToast(now);
                break;
            case 'xp':
                _sfxXP(now);
                break;
            case 'levelup':
                _sfxLevelUp(now);
                break;
            case 'complete':
                _sfxComplete(now);
                break;
            case 'notify':
                _sfxNotify(now);
                break;
            case 'typing':
                _sfxTyping(now);
                break;
            case 'whoosh':
                _sfxWhoosh(now);
                break;
            case 'boot':
                _sfxBoot(now);
                break;
            default:
                _sfxClick(now);
        }
    }

    // Click — short digital blip
    function _sfxClick(t) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.06);
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.1);
    }

    // Hover — very subtle high tick
    function _sfxHover(t) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 1200;
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.04, t);
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
            const start = t + i * 0.1;
            g.gain.setValueAtTime(0, start);
            g.gain.linearRampToValueAtTime(0.18, start + 0.04);
            g.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
            osc.connect(g);
            g.connect(sfxGain);
            osc.start(start);
            osc.stop(start + 0.3);
        });
    }

    // Error — descending buzz (E4 → C4)
    function _sfxError(t) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(329.63, t);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.2);
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1500;
        osc.connect(filter);
        filter.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.3);

        // Second tone
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(261.63, t + 0.12);
        osc2.frequency.exponentialRampToValueAtTime(150, t + 0.35);
        const g2 = audioCtx.createGain();
        g2.gain.setValueAtTime(0.06, t + 0.12);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc2.connect(filter);
        filter.connect(g2);
        g2.connect(sfxGain);
        osc2.start(t + 0.12);
        osc2.stop(t + 0.45);
    }

    // Tab switch — quick sweep
    function _sfxTab(t) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(900, t + 0.07);
        osc.frequency.exponentialRampToValueAtTime(700, t + 0.12);
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.10, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.18);
    }

    // Toast notification — soft bell
    function _sfxToast(t) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 880;
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.45);

        // Harmonic overtone
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 1318.51; // E6
        const g2 = audioCtx.createGain();
        g2.gain.setValueAtTime(0.06, t);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc2.connect(g2);
        g2.connect(sfxGain);
        osc2.start(t);
        osc2.stop(t + 0.35);
    }

    // XP gain — coin-like sparkle
    function _sfxXP(t) {
        [1046.50, 1318.51, 1567.98].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const g = audioCtx.createGain();
            const start = t + i * 0.06;
            g.gain.setValueAtTime(0.14, start);
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
            g.gain.linearRampToValueAtTime(0.16, start + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, start + (i === 3 ? 0.6 : 0.3));
            osc.connect(g);
            g.connect(sfxGain);
            osc.start(start);
            osc.stop(start + 0.65);
        });
    }

    // Complete — achievement jingle
    function _sfxComplete(t) {
        // A major arpeggio + octave
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const g = audioCtx.createGain();
            const start = t + i * 0.08;
            g.gain.setValueAtTime(0.15, start);
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
            const start = t + i * 0.15;
            g.gain.setValueAtTime(0.12, start);
            g.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
            osc.connect(g);
            g.connect(sfxGain);
            osc.start(start);
            osc.stop(start + 0.3);
        });
    }

    // Typing — subtle keyboard click
    function _sfxTyping(t) {
        const freq = 1000 + Math.random() * 500;
        const osc = audioCtx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = freq;
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.02, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        osc.connect(filter);
        filter.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.03);
    }

    // Whoosh — sweep for transitions
    function _sfxWhoosh(t) {
        const bufLen = audioCtx.sampleRate * 0.25;
        const buffer = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufLen; i++) {
            data[i] = (Math.random() * 2 - 1);
        }
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500, t);
        filter.frequency.exponentialRampToValueAtTime(4000, t + 0.12);
        filter.frequency.exponentialRampToValueAtTime(800, t + 0.25);
        filter.Q.value = 2;

        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.08, t + 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        source.connect(filter);
        filter.connect(g);
        g.connect(sfxGain);
        source.start(t);
    }

    // Boot — system startup sound
    function _sfxBoot(t) {
        // Deep sweep + sparkle
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.exponentialRampToValueAtTime(440, t + 0.4);
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.10, t);
        g.gain.setValueAtTime(0.10, t + 0.35);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(t);
        osc.stop(t + 0.65);

        // Sparkle on top
        setTimeout(() => {
            _sfxSuccess(audioCtx.currentTime);
        }, 350);
    }

    // ══════════════════════════════════════════
    // 🎛️ UI PANEL — Floating Audio Control
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

    // ══════════════════════════════════════════
    // 🔗 AUTO-ATTACH SFX TO UI EVENTS
    // ══════════════════════════════════════════

    function attachGlobalSFX() {
        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => playSFX('tab'));
        });

        // All regular buttons (non-tab)
        document.addEventListener('click', (e) => {
            const el = e.target.closest('button, .btn, .portal-card, .mode-btn, .cs-cat-btn');
            if (!el) return;
            if (el.classList.contains('tab-btn')) return; // already handled
            if (el.id === 'audio-fab-btn' || el.closest('#audio-control-panel')) return;
            playSFX('click');
        });

        // Keyboard shortcut feedback
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                playSFX('whoosh');
            }
        });
    }

    // ── Inject UI Panel HTML ──
    function injectPanel() {
        if (document.getElementById('audio-fab-btn')) return;

        const html = `
        <!-- Audio FAB (Floating Action Button) -->
        <button class="audio-fab" id="audio-fab-btn" onclick="AudioEngine.togglePanel()" title="Bảng điều khiển Âm thanh">
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
                    <div class="audio-section-label">🎶 Nhạc Nền Lo-Fi</div>
                    <button class="audio-btn audio-play-btn" id="audio-music-toggle" onclick="AudioEngine.toggleMusic()">
                        ▶ Phát Nhạc
                    </button>
                    <div class="audio-slider-group">
                        <label>🔉 Âm lượng</label>
                        <input type="range" min="0" max="100" value="35" class="audio-slider" id="audio-music-vol"
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
                    <div class="audio-section-label">🔊 Hiệu Ứng Âm Thanh</div>
                    <button class="audio-btn audio-sfx-btn" id="audio-sfx-toggle" onclick="AudioEngine.toggleSfx()">
                        🔊 SFX: BẬT
                    </button>
                    <div class="audio-slider-group">
                        <label>🔉 Âm lượng SFX</label>
                        <input type="range" min="0" max="100" value="55" class="audio-slider" id="audio-sfx-vol"
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
                <span>⚡ Web Audio API • Offline Ready</span>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        // Fix BPM button onclick after injection (dynamic values)
        document.querySelectorAll('.audio-bpm-btn').forEach((btn, idx) => {
            btn.onclick = () => {
                AudioEngine.setBPM(currentBPM + (idx === 0 ? -5 : 5));
            };
        });
    }

    // ── Boot ──
    function boot() {
        injectPanel();
        loadPrefs();
        attachGlobalSFX();
        updateUI();
    }

    // Auto-init when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    // ── Public API ──
    return {
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
