// 22qq Queue Sniper - Browser Console Version (IMPROVED)
// Paste this entire script into your browser console to create the UI
// Features: Rainbow Color Slider | Queue Sniper | Rainbow Button | Draggable GUI & Settings
// IMPROVED: Proper queue detection and spam clicking with no stutters
// ⚡ 22qq Queue Sniper

(function() {
  const COLORS = [
    { name: "Red", accent: "#ff3d3d", bright: "#ff6060", glow: "rgba(255, 61, 61, 0.35)" },
    { name: "Orange", accent: "#ff8c00", bright: "#ffb84d", glow: "rgba(255, 140, 0, 0.35)" },
    { name: "Yellow", accent: "#ffd700", bright: "#ffed4e", glow: "rgba(255, 215, 0, 0.35)" },
    { name: "Green", accent: "#00c853", bright: "#4dff91", glow: "rgba(77, 255, 145, 0.35)" },
    { name: "Cyan", accent: "#00bfff", bright: "#4dd9ff", glow: "rgba(0, 191, 255, 0.35)" },
    { name: "Blue", accent: "#1a6fff", bright: "#4d8fff", glow: "rgba(26, 111, 255, 0.35)" },
    { name: "Purple", accent: "#b366ff", bright: "#d699ff", glow: "rgba(179, 102, 255, 0.35)" },
    { name: "Magenta", accent: "#ff00ff", bright: "#ff66ff", glow: "rgba(255, 0, 255, 0.35)" },
    { name: "Pink", accent: "#ff1493", bright: "#ff69b4", glow: "rgba(255, 20, 147, 0.35)" },
    { name: "Lime", accent: "#32cd32", bright: "#66ff66", glow: "rgba(50, 205, 50, 0.35)" },
  ];

  let state = {
    status: "Idle",
    clicks: 0,
    target: "Join Queue",
    delay: 50,
    turboMode: false,
    isRunning: false,
    currentColorIdx: 5,
    showSettings: false,
    queueSniperActive: false,
  };

  let worker = null;
  let clickCountRef = 0;

  // Create CSS
  const style = document.createElement("style");
  style.textContent = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: radial-gradient(ellipse at center, #0d1628 0%, #060c18 60%, #040810 100%); color: #c8d8f0; font-family: 'IBM Plex Sans', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    body::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(26, 111, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 111, 255, 0.03) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; z-index: 0; }
    .dq-container { position: fixed; z-index: 9999; width: 340px; background: #150d26; border: 1px solid #3b1e6e; border-radius: 10px; box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(140,80,255,0.08), inset 0 1px 0 rgba(180,130,255,0.1); overflow: hidden; animation: fadeIn 0.4s ease forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .dq-title-bar { background: linear-gradient(180deg, #1a0f30 0%, #150d26 100%); border-bottom: 1px solid #3b1e6e; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; cursor: move; user-select: none; }
    .dq-title-text { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 22px; letter-spacing: 0.12em; color: #fff; line-height: 1; text-shadow: 0 0 10px rgba(140,80,255,0.9), 0 0 25px rgba(140,80,255,0.6), 0 0 50px rgba(140,80,255,0.35), 0 2px 4px rgba(0,0,0,0.8); -webkit-text-stroke: 0.5px rgba(200,160,255,0.3); }
    .dq-title-sub { font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 0.3em; color: #7a5a9e; margin-top: 2px; }
    .dq-window-controls { display: flex; gap: 6px; }
    .dq-win-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid #3b1e6e; background-color: #150d26; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s ease; color: #9c7ac0; font-size: 12px; }
    .dq-win-btn:hover { border-color: #5a2a99; color: #d8c8f0; }
    .dq-win-btn.close:hover { background-color: rgba(255, 60, 60, 0.2); border-color: rgba(255, 60, 60, 0.5); color: #ff6060; }
    .dq-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; max-height: calc(100vh - 200px); overflow-y: auto; }
    .dq-body::-webkit-scrollbar { width: 4px; }
    .dq-body::-webkit-scrollbar-track { background: #150d26; }
    .dq-body::-webkit-scrollbar-thumb { background: #5a2a99; border-radius: 2px; }
    .dq-panel { background-color: #150d26; border: 1px solid #3b1e6e; border-radius: 6px; padding: 8px 12px; }
    .dq-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #7a5a9e; }
    .dq-value { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 500; color: #d8c8f0; margin-top: 4px; }
    .dq-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .status-idle { color: #9c7ac0; }
    .status-running { color: #4dff91; text-shadow: 0 0 8px rgba(77, 255, 145, 0.5); }
    .status-error { color: #ff3d3d; }
    .dq-delay-section { padding: 4px 2px; }
    .dq-delay-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
    .dq-delay-value { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; color: var(--dq-accent-bright); min-width: 48px; }
    .dq-slider { width: 100%; height: 4px; border-radius: 2px; background: linear-gradient(to right, var(--dq-accent) var(--slider-pct, 5%), #3b1e6e var(--slider-pct, 5%)); outline: none; -webkit-appearance: none; appearance: none; cursor: pointer; }
    .dq-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--dq-accent-bright); border: 2px solid #ffffff; box-shadow: 0 0 10px var(--dq-accent), 0 0 20px var(--dq-glow); cursor: pointer; transition: box-shadow 0.2s ease; }
    .dq-slider::-webkit-slider-thumb:hover { box-shadow: 0 0 15px var(--dq-accent), 0 0 30px var(--dq-glow); }
    .dq-slider::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: var(--dq-accent-bright); border: 2px solid #ffffff; box-shadow: 0 0 10px var(--dq-accent); cursor: pointer; }
    .dq-turbo-section { display: flex; align-items: center; gap: 10px; padding: 2px 0; }
    .dq-checkbox { width: 18px; height: 18px; border: 2px solid #5a2a99; border-radius: 3px; background-color: #150d26; appearance: none; -webkit-appearance: none; cursor: pointer; position: relative; flex-shrink: 0; transition: all 0.15s ease; }
    .dq-checkbox:checked { background-color: var(--dq-accent); border-color: var(--dq-accent); box-shadow: 0 0 8px var(--dq-glow); }
    .dq-checkbox:checked::after { content: ''; position: absolute; left: 3px; top: 0px; width: 5px; height: 9px; border: 2px solid white; border-top: none; border-left: none; transform: rotate(45deg); }
    .dq-turbo-label { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; letter-spacing: 0.15em; color: #d8c8f0; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: color 0.2s ease; }
    .dq-turbo-label.active { color: #ff3d3d; text-shadow: 0 0 8px rgba(255, 61, 61, 0.8); }
    .dq-join-btn { background: linear-gradient(135deg, var(--dq-accent-dark) 0%, var(--dq-accent) 50%, var(--dq-accent-bright) 100%); border: 1px solid rgba(160, 100, 255, 0.4); border-radius: 8px; color: #ffffff; font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; padding: 14px 24px; width: 100%; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 20px var(--dq-glow), 0 0 0 1px rgba(140, 80, 255, 0.2); }
    .dq-join-btn:hover { box-shadow: 0 4px 30px var(--dq-glow), 0 0 0 1px rgba(140, 80, 255, 0.4); transform: translateY(-1px); }
    .dq-join-btn:active { transform: translateY(0); box-shadow: 0 2px 10px var(--dq-glow); }
    .dq-join-btn.running { animation: rainbow-pulse 0.6s ease-in-out infinite; }
    .dq-join-btn.stop { background: linear-gradient(135deg, #8b0000 0%, #cc0000 50%, #e00000 100%); }
    @keyframes rainbow-pulse { 0% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(180deg); } 100% { filter: hue-rotate(360deg); } }
    .dq-settings-panel { display: none; position: fixed; z-index: 10000; width: 300px; background: #150d26; border: 1px solid #3b1e6e; border-radius: 10px; box-shadow: 0 20px 60px rgba(0,0,0,0.6); padding: 0; cursor: move; }
    .dq-settings-panel.show { display: block; }
    .dq-settings-header { background: linear-gradient(180deg, #1a0f30 0%, #150d26 100%); border-bottom: 1px solid #3b1e6e; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; cursor: move; user-select: none; }
    .dq-settings-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 16px; letter-spacing: 0.1em; color: #ece0ff; }
    .dq-settings-close { width: 24px; height: 24px; border-radius: 4px; border: 1px solid #3b1e6e; background-color: #150d26; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #9c7ac0; font-size: 14px; transition: all 0.15s ease; }
    .dq-settings-close:hover { border-color: #5a2a99; color: #ff6060; }
    .dq-settings-body { padding: 14px; display: flex; flex-direction: column; gap: 12px; }
    .dq-color-slider { width: 100%; height: 6px; border-radius: 3px; background: linear-gradient(90deg, #ff3d3d, #ff8c00, #ffd700, #00c853, #00bfff, #1a6fff, #b366ff, #ff00ff, #ff1493, #32cd32); outline: none; -webkit-appearance: none; appearance: none; cursor: pointer; }
    .dq-color-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: white; border: 2px solid #3b1e6e; box-shadow: 0 0 8px rgba(0,0,0,0.5); cursor: pointer; }
    .dq-color-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: white; border: 2px solid #3b1e6e; box-shadow: 0 0 8px rgba(0,0,0,0.5); cursor: pointer; }
    .dq-color-name { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; color: var(--dq-accent); text-align: center; }
    .dq-sniper-btn { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--dq-accent); background-color: rgba(140, 80, 255, 0.1); color: var(--dq-accent); font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
    .dq-sniper-btn:hover { box-shadow: 0 0 8px var(--dq-glow); }
    .dq-sniper-btn.active { background-color: var(--dq-accent); color: #0d1526; box-shadow: 0 0 12px var(--dq-glow); }
    .dq-destruct-btn { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid rgba(255, 60, 60, 0.5); background: linear-gradient(135deg, #8b0000 0%, #cc0000 50%, #e00000 100%); color: #ffffff; font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
    .dq-destruct-btn:hover { box-shadow: 0 4px 20px rgba(200, 0, 0, 0.5); }
  `;
  document.head.appendChild(style);

  // Add Google Fonts
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  // Create HTML structure
  const container = document.createElement("div");
  container.className = "dq-container";
  container.id = "dq-container";
  container.style.left = "50%";
  container.style.top = "50%";
  container.style.transform = "translate(-50%, -50%)";
  container.innerHTML = `
    <div class="dq-title-bar" id="dq-title-bar">
      <div>
                <div class="dq-title-text">⚡ 22QQ QUEUE SNIPER ⚡</div>
                <div class="dq-title-sub">QUEUE SYSTEM</div>
      </div>
      <div class="dq-window-controls">
        <button class="dq-win-btn" id="dq-settings-btn" title="Settings">⚙️</button>
        <button class="dq-win-btn minimize" id="dq-minimize-btn" title="Minimize">−</button>
        <button class="dq-win-btn close" id="dq-close-btn" title="Close">✕</button>
      </div>
    </div>

    <div class="dq-body">
      <div class="dq-row-grid">
        <div class="dq-panel">
          <div class="dq-label">Status</div>
          <div class="dq-value" id="dq-status" style="margin-top: 4px; font-size: 15px;">Idle</div>
        </div>
        <div class="dq-panel">
          <div class="dq-label">Clicks</div>
          <div class="dq-value" id="dq-clicks" style="margin-top: 4px; font-size: 15px;">0</div>
        </div>
      </div>

      <div class="dq-panel">
        <div class="dq-label">Target</div>
        <div class="dq-value" id="dq-target" style="margin-top: 4px; font-size: 17px; font-weight: 600; color: #d0e4ff;">Join Queue</div>
      </div>

      <div class="dq-delay-section">
        <div class="dq-delay-header">
          <span class="dq-label" style="font-size: 10px;">Delay</span>
          <span class="dq-delay-value" id="dq-delay-value">50ms</span>
        </div>
        <input type="range" class="dq-slider" id="dq-delay-slider" min="1" max="5000" step="1" value="50">
      </div>

      <div class="dq-turbo-section">
        <input type="checkbox" class="dq-checkbox" id="dq-turbo-checkbox">
        <label for="dq-turbo-checkbox" class="dq-turbo-label" id="dq-turbo-label">TURBO MODE</label>
      </div>

      <button class="dq-join-btn" id="dq-join-btn">JOIN QUEUE</button>
    </div>
  `;

  document.body.appendChild(container);

  // Create Settings Panel
  const settingsPanel = document.createElement("div");
  settingsPanel.className = "dq-settings-panel";
  settingsPanel.id = "dq-settings-panel";
  settingsPanel.style.left = "50%";
  settingsPanel.style.top = "50%";
  settingsPanel.style.transform = "translate(-50%, -50%)";
  settingsPanel.innerHTML = `
    <div class="dq-settings-header" id="dq-settings-header">
      <div class="dq-settings-title">Settings</div>
      <button class="dq-settings-close" id="dq-settings-close">✕</button>
    </div>
    <div class="dq-settings-body">
      <div>
        <div class="dq-label" style="margin-bottom: 8px;">Theme Color</div>
        <input type="range" class="dq-color-slider" id="dq-color-slider" min="0" max="9" step="1" value="5">
        <div class="dq-color-name" id="dq-color-name">Blue</div>
      </div>
      <button class="dq-sniper-btn" id="dq-sniper-btn">🎯 QUEUE SNIPER</button>
      <button class="dq-destruct-btn" id="dq-destruct-btn">💥 SELF DESTRUCT</button>
    </div>
  `;
  document.body.appendChild(settingsPanel);

  // Draggable functionality for main container
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  const titleBar = document.getElementById("dq-title-bar");
  titleBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = container.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
  });

  // Draggable functionality for settings panel
  let isSettingsDragging = false;
  let settingsDragOffsetX = 0;
  let settingsDragOffsetY = 0;

  const settingsHeader = document.getElementById("dq-settings-header");
  settingsHeader.addEventListener("mousedown", (e) => {
    isSettingsDragging = true;
    const rect = settingsPanel.getBoundingClientRect();
    settingsDragOffsetX = e.clientX - rect.left;
    settingsDragOffsetY = e.clientY - rect.top;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      container.style.left = (e.clientX - dragOffsetX) + "px";
      container.style.top = (e.clientY - dragOffsetY) + "px";
      container.style.transform = "none";
    }
    if (isSettingsDragging) {
      settingsPanel.style.left = (e.clientX - settingsDragOffsetX) + "px";
      settingsPanel.style.top = (e.clientY - settingsDragOffsetY) + "px";
      settingsPanel.style.transform = "none";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    isSettingsDragging = false;
  });

  function updateSlider() {
    const slider = document.getElementById("dq-delay-slider");
    const pct = Math.round(((state.delay - 1) / (5000 - 1)) * 100);
    slider.style.setProperty("--slider-pct", `${pct}%`);
    document.getElementById("dq-delay-value").textContent = `${state.delay}ms`;
  }

  document.getElementById("dq-delay-slider").addEventListener("input", (e) => {
    state.delay = Number(e.target.value);
    updateSlider();
  });

  document.getElementById("dq-turbo-checkbox").addEventListener("change", (e) => {
    state.turboMode = e.target.checked;
    const label = document.getElementById("dq-turbo-label");
    if (state.turboMode) {
      label.classList.add("active");
    } else {
      label.classList.remove("active");
    }
  });

  function applyColorVars(color) {
    // Set on both documentElement AND the container/settings so they persist
    // even if the page navigates or re-renders the root element
    const targets = [document.documentElement, container, settingsPanel];
    targets.forEach(el => {
      if (!el) return;
      el.style.setProperty("--dq-accent", color.accent);
      el.style.setProperty("--dq-accent-bright", color.bright);
      el.style.setProperty("--dq-accent-dark", color.accent.replace("ff", "cc"));
      el.style.setProperty("--dq-glow", color.glow);
    });
  }

  function changeColor(idx) {
    state.currentColorIdx = idx;
    const color = COLORS[idx];
    applyColorVars(color);
    document.getElementById("dq-color-name").textContent = color.name;
  }

  // Re-apply colors whenever the tab becomes visible again (prevents glow loss)
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      applyColorVars(COLORS[state.currentColorIdx]);
    }
  });

  // Also re-apply on focus (covers alt-tabbing back from another app)
  window.addEventListener("focus", () => {
    applyColorVars(COLORS[state.currentColorIdx]);
  });

  document.getElementById("dq-color-slider").addEventListener("input", (e) => {
    changeColor(Number(e.target.value));
  });

  document.getElementById("dq-settings-btn").addEventListener("click", () => {
    const panel = document.getElementById("dq-settings-panel");
    panel.classList.toggle("show");
  });

  document.getElementById("dq-settings-close").addEventListener("click", () => {
    const panel = document.getElementById("dq-settings-panel");
    panel.classList.remove("show");
  });

  function getStatusClass() {
    switch (state.status) {
      case "Running":
      case "Queued":
      case "Success":
        return "status-running";
      case "Error":
        return "status-error";
      default:
        return "status-idle";
    }
  }

  function updateUI() {
    const statusEl = document.getElementById("dq-status");
    statusEl.textContent = state.status;
    statusEl.className = `dq-value ${getStatusClass()}`;
    document.getElementById("dq-clicks").textContent = state.clicks.toLocaleString();
    document.getElementById("dq-target").textContent = state.target;
  }

  // Find the actual "Join Queue" button on the page
  function findJoinQueueButton() {
    const buttons = document.querySelectorAll("button, a, div[role='button'], span");
    for (let btn of buttons) {
      const text = (btn.innerText || btn.textContent || "").trim();
      if (text.includes("Join Queue") || text.includes("join queue")) {
        return btn;
      }
    }
    return null;
  }

  function stopQueue() {
    // Kill the worker immediately — no more ticks, no lingering clicks
    if (worker) {
      worker.terminate();
      worker = null;
    }
    state.isRunning = false;
    state.status = "Idle";
    state.target = "Join Queue";
    const btn = document.getElementById("dq-join-btn");
    btn.classList.remove("running", "stop");
    btn.textContent = "JOIN QUEUE";
    updateUI();
  }

  function startQueue() {
    state.isRunning = true;
    state.status = "Running";
    state.target = "Searching...";
    clickCountRef = state.clicks;

    const btn = document.getElementById("dq-join-btn");
    btn.classList.add("running", "stop");
    btn.textContent = "STOP QUEUE";

    let targetButton = null;
    let uiTickCounter = 0;

    // Build an inline Web Worker so the timer is NEVER throttled by the browser,
    // even when this tab is in the background or minimized.
    const workerCode = `
      let iv = null;
      self.onmessage = function(e) {
        if (e.data.cmd === 'start') {
          if (iv) clearInterval(iv);
          iv = setInterval(function() { self.postMessage('tick'); }, e.data.ms);
        }
        if (e.data.cmd === 'update') {
          if (iv) clearInterval(iv);
          iv = setInterval(function() { self.postMessage('tick'); }, e.data.ms);
        }
        if (e.data.cmd === 'stop') {
          if (iv) clearInterval(iv);
          iv = null;
        }
      };
    `;
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    worker = new Worker(URL.createObjectURL(blob));

    // Every tick from the worker = one click attempt
    worker.onmessage = () => {
      if (!state.isRunning) return;

      // Find button if not already found
      if (!targetButton || !targetButton.isConnected) {
        targetButton = findJoinQueueButton();
        if (targetButton) {
          state.status = "Found";
          state.target = "Clicking...";
        }
      }

      // Click immediately when found
      if (targetButton) {
        targetButton.click();
        clickCountRef += 1;
        state.clicks = clickCountRef;

        // Only update UI every 8 clicks to reduce DOM overhead
        uiTickCounter++;
        if (uiTickCounter >= 8) {
          uiTickCounter = 0;
          updateUI();
        }
      }
    };

    // Start the worker — turbo = 1ms (fastest possible), normal = user delay
    const ms = state.turboMode ? 1 : Math.max(1, state.delay);
    worker.postMessage({ cmd: 'start', ms: ms });
    updateUI();
  }

  function handleJoinClick() {
    if (state.isRunning) {
      stopQueue();
    } else {
      startQueue();
    }
  }

  function toggleQueueSniper() {
    state.queueSniperActive = !state.queueSniperActive;
    const btn = document.getElementById("dq-sniper-btn");
    btn.classList.toggle("active", state.queueSniperActive);

    if (state.queueSniperActive) {
      if (!state.isRunning) {
        handleJoinClick();
      }
    } else {
      if (state.isRunning) {
        stopQueue();
      }
    }
  }

  function selfDestruct() {
    const container = document.getElementById("dq-container");
    const settingsPanel = document.getElementById("dq-settings-panel");
    const style = document.querySelector("style");
    const link = document.querySelector("link[href*='fonts.googleapis.com']");

    if (container) container.remove();
    if (settingsPanel) settingsPanel.remove();
    if (style) style.remove();
    if (link) link.remove();

    if (worker) { worker.terminate(); worker = null; }

    console.log("💥 22qq Queue Sniper self-destructed!");
  }

  // Window control functions
  let isMinimized = false;

  function toggleMinimize() {
    const body = container.querySelector(".dq-body");
    isMinimized = !isMinimized;
    body.style.display = isMinimized ? "none" : "flex";
  }

  function closeWindow() {
    stopQueue();
    selfDestruct();
  }

  // Event listeners
  document.getElementById("dq-join-btn").addEventListener("click", handleJoinClick);
  document.getElementById("dq-close-btn").addEventListener("click", closeWindow);
  document.getElementById("dq-minimize-btn").addEventListener("click", toggleMinimize);
  document.getElementById("dq-sniper-btn").addEventListener("click", toggleQueueSniper);
  document.getElementById("dq-destruct-btn").addEventListener("click", selfDestruct);

  // Initialize color scheme
  changeColor(5);
  updateSlider();
  updateUI();

  console.log("⚡ 22qq Queue Sniper loaded!");
  console.log("📌 Features: Rainbow Color Slider | Queue Detection & Spam Click | No Stutters | True Turbo Mode");
})();
