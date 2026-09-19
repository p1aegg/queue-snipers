// Solwce Services - Galaxy Queue Clicker
(function() {
    if (window.queueClickerActive) {
        console.log('Auto-clicker already running!');
        return;
    }
    window.queueClickerActive = true;

    let intervalId = null;
    let clickCount = 0;
    let isRunning = false;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }

        @keyframes galaxyGlow {
            0% { box-shadow: 0 0 20px #7f5cff; }
            50% { box-shadow: 0 0 45px #c77dff; }
            100% { box-shadow: 0 0 20px #7f5cff; }
        }

        @keyframes shootingStar {
            0% { transform: translateX(-200px) translateY(-100px); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateX(600px) translateY(300px); opacity: 0; }
        }

        body::after {
            content: "";
            position: fixed;
            top: -200px;
            left: -200px;
            width: 4px;
            height: 4px;
            background: white;
            box-shadow:
                200px 100px white,
                400px 300px white,
                600px 200px white,
                800px 500px white;
            animation: shootingStar 6s linear infinite;
            pointer-events: none;
            z-index: 9999998;
        }

        .qc-container {
            position: fixed;
            top: 80px;
            right: 30px;
            width: 320px;
            background: radial-gradient(circle at top, #1b0033, #050010);
            border-radius: 18px;
            border: 2px solid #7f5cff;
            box-shadow: 0 0 30px rgba(127, 92, 255, 0.6);
            z-index: 9999999;
            font-family: 'Segoe UI', sans-serif;
            overflow: hidden;
            animation: slideInRight 0.4s ease, galaxyGlow 4s infinite;
        }

        .qc-header {
            padding: 18px;
            text-align: center;
            background: linear-gradient(135deg, #6a00ff, #240046);
            color: white;
            position: relative;
        }

        .qc-logo {
            font-size: 34px;
            animation: galaxyGlow 3s infinite;
        }

        .qc-header h2 {
            margin: 6px 0 0;
            font-size: 18px;
        }

        .qc-header p {
            font-size: 11px;
            opacity: 0.85;
        }

        .qc-body {
            padding: 18px;
            background: linear-gradient(180deg, #0b001a, #12002b);
            color: white;
        }

        .qc-input, .qc-button {
            width: 100%;
            padding: 10px;
            border-radius: 10px;
            border: none;
            margin-top: 8px;
        }

        .qc-input {
            background: #1e003b;
            color: white;
            border: 1px solid #7f5cff;
        }

        .qc-button {
            background: linear-gradient(135deg, #7f5cff, #b517ff);
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: 0.3s;
        }

        .qc-button:hover {
            transform: scale(1.05);
        }

        .qc-button-danger {
            background: linear-gradient(135deg, #ff4d6d, #c9184a);
        }

        .qc-footer {
            text-align: center;
            font-size: 10px;
            padding: 10px;
            color: #cdb4ff;
            border-top: 1px solid #7f5cff;
        }

        .qc-status-running {
            color: #7fffda;
        }

        .qc-status-stopped {
            color: #ff6b6b;
        }

        .qc-close-btn {
            position: absolute;
            top: 8px;
            right: 10px;
            background: transparent;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'qc-container';
    container.innerHTML = `
        <div class="qc-header">
            <button class="qc-close-btn" id="qc-close-main">✕</button>
            <div class="qc-logo">🌌</div>
            <h2>Solwce Services</h2>
            <p>Galaxy Queue Controller</p>
        </div>

        <div class="qc-body">
            <div>
                <strong>Status:</strong>
                <span id="qc-status" class="qc-status-stopped">Stopped</span>
            </div>

            <div style="margin-top:10px;">
                <strong>Total Clicks:</strong>
                <span id="qc-clicks">0</span>
            </div>

            <label style="margin-top:12px; display:block;">Interval (ms)</label>
            <input class="qc-input" id="qc-interval" type="number" value="1">

            <button class="qc-button" id="qc-start">▶ Start</button>
            <button class="qc-button qc-button-danger" id="qc-stop" disabled>⏹ Stop</button>
        </div>

        <div class="qc-footer">
            SOLWCE SERVICES • GALAXY EDITION
        </div>
    `;
    document.body.appendChild(container);

    const startBtn = document.getElementById('qc-start');
    const stopBtn = document.getElementById('qc-stop');
    const closeBtn = document.getElementById('qc-close-main');
    const status = document.getElementById('qc-status');
    const clicks = document.getElementById('qc-clicks');
    const intervalInput = document.getElementById('qc-interval');

    function clickButton() {
        const btn = [...document.querySelectorAll("button")]
            .find(b => b.textContent === "Join Queue");
        if (btn) {
            btn.click();
            clicks.textContent = ++clickCount;
        }
    }

    startBtn.onclick = () => {
        intervalId = setInterval(clickButton, parseInt(intervalInput.value) || 1);
        status.textContent = "Running";
        status.className = "qc-status-running";
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    stopBtn.onclick = () => {
        clearInterval(intervalId);
        status.textContent = "Stopped";
        status.className = "qc-status-stopped";
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };

    closeBtn.onclick = () => {
        if (intervalId) clearInterval(intervalId);
        container.remove();
        window.queueClickerActive = false;
    };

    console.log("🌌 Solwce Services Galaxy Queue Loaded");
})();
