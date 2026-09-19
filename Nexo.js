// nexo services - turtle queue sniper
(function() {
    if (window.queueClickerActive) {
        console.log('Auto Clicker already running.');
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
        }

        .qc-container {
            position: fixed;
            top: 80px;
            right: 30px;
            width: 320px;
            background: radial-gradient(circle at top, #0CFF00, #058700);
            border-radius: 18px;
            border: 2px solid #7f5cff;
            box-shadow: 0 0 30px rgba(127, 92, 255, 0.6);
            z-index: 9999999;
            font-family: 'Segoe UI', ariel;
            overflow: hidden;
            animation: slideInRight 0.4s ease;
        }

        .qc-header {
            padding: 18px;
            text-align: center;
            background: linear-gradient(135deg, #5CFF59, #3D8F3D);
            color: white;
            position: relative;
        }

        .qc-logo {
            font-size: 40px;
        }

        .qc-header h2 {
            margin: 6px 0 0;
            font-size: 20px;
        }

        .qc-header p {
            font-size: 13px;
            opacity: 0.92;
        }

        .qc-body {
            padding: 20px;
            background: linear-gradient(180deg, #0b001a, #004000);
            color: white;
        }

        .qc-input, .qc-button {
            width: 100%;
            padding: 10px;
            border-radius: 10px;
            border: none;
            margin-top: 10px;
        }

        .qc-input {
            background: #007500;
            color: white;
            border: 1px solid #82FF82;
        }

        .qc-button {
            background: linear-gradient(135deg, #00DE00, #208520);
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: 0.5s;
        }

        .qc-button:hover {
            transform: scale(1.07);
        }

        .qc-button-danger {
            background: linear-gradient(135deg, #FF0000, #8F0000);
        }

        .qc-footer {
            text-align: center;
            font-size: 10px;
            padding: 10px;
            color: #00FF00;
            border-top: 1px solid #00BD00;
        }

        .qc-status-running {
            color: #98fb98;
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
            <div class="qc-logo">🐢</div>
            <h2>turtle queue sniper</h2>
            <p>a product of discord.gg/nexo</p>
        </div>

        <div class="qc-body">
            <div>
                <strong>Status:</strong>
                <span id="qc-status" class="qc-status-stopped">Stopped</span>
            </div>

            <label style="margin-top:12px; display:block;">Interval (milliseconds)</label>
            <input class="qc-input" id="qc-interval" type="number" value="1">

            <button class="qc-button" id="qc-start">▶️Start</button>
            <button class="qc-button qc-button-danger" id="qc-stop" disabled>⏸️Stop</button>
        </div>

        <div class="qc-footer">
            discord.gg/nexo - turtle queue sniper
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

    console.log("discord.gg/nexo - turtle queue sniper");
})();
