// Professional Queue Auto-Clicker
(function() {
    if (window.queueClickerActive) {
        console.log('Auto-clicker already running!');
        return;
    }
    window.queueClickerActive = true;

    let intervalId = null;
    let clickCount = 0;
    let isRunning = false;

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }

        @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 0, 0.3); }
            50% { box-shadow: 0 0 40px rgba(255, 107, 0, 0.6); }
        }

        .qc-overlay {
            display: none;
        }

        .qc-container {
            position: fixed;
            top: 80px;
            right: 30px;
            background: #ffffff;
            border-radius: 16px;
            border: 3px solid transparent;
            background-clip: padding-box;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            z-index: 9999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            width: 320px;
            overflow: hidden;
            animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .qc-container::before {
            content: '';
            position: absolute;
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
            background: linear-gradient(135deg, #ff6b00, #ff8c00, #ffa500, #ff6b00);
            background-size: 300% 300%;
            border-radius: 16px;
            z-index: -1;
            animation: shimmer 3s linear infinite;
        }

        .qc-header {
            background: linear-gradient(135deg, #ff6b00 0%, #ff8c00 50%, #ffa500 100%);
            color: white;
            padding: 20px 18px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .qc-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            animation: pulse 4s ease-in-out infinite;
        }

        .qc-header-content {
            position: relative;
            z-index: 1;
        }

        .qc-logo {
            font-size: 32px;
            margin-bottom: 8px;
            display: inline-block;
            animation: pulse 2s ease-in-out infinite;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .qc-header h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.5px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .qc-header p {
            margin: 4px 0 0 0;
            font-size: 11px;
            opacity: 0.95;
            font-weight: 500;
        }

        .qc-body {
            padding: 20px;
            background: linear-gradient(to bottom, #ffffff 0%, #fff8f0 100%);
        }

        .qc-input-group {
            margin-bottom: 16px;
        }

        .qc-label {
            display: block;
            font-size: 11px;
            font-weight: 700;
            color: #ff6b00;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .qc-input {
            width: 100%;
            padding: 10px 14px;
            border: 2px solid #ffe5cc;
            border-radius: 10px;
            font-size: 14px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-sizing: border-box;
            background: white;
        }

        .qc-input:focus {
            outline: none;
            border-color: #ff6b00;
            box-shadow: 0 0 0 4px rgba(255, 107, 0, 0.1);
            transform: translateY(-2px);
        }

        .qc-button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%);
            border: none;
            border-radius: 10px;
            color: white;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
        }

        .qc-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(255, 107, 0, 0.4);
            animation: glow 2s ease-in-out infinite;
        }

        .qc-button:active {
            transform: translateY(-1px);
        }

        .qc-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            animation: none;
        }

        .qc-button-success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .qc-button-success:hover {
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .qc-button-danger {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .qc-button-danger:hover {
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
        }

        .qc-stats {
            background: linear-gradient(135deg, #fff5eb 0%, #ffe5cc 100%);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
            border: 2px solid #ffd4a3;
        }

        .qc-stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .qc-stat-row:last-child {
            margin-bottom: 0;
        }

        .qc-stat-label {
            font-size: 11px;
            color: #b45309;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .qc-stat-value {
            font-size: 18px;
            font-weight: 800;
            color: #ff6b00;
            text-shadow: 0 2px 4px rgba(255, 107, 0, 0.1);
        }

        .qc-status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .qc-status-running {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            color: #065f46;
            animation: pulse 2s ease-in-out infinite;
        }

        .qc-status-stopped {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            color: #991b1b;
        }

        .qc-controls {
            display: flex;
            gap: 12px;
        }

        .qc-controls .qc-button {
            flex: 1;
        }

        .qc-footer {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            padding: 12px 20px;
            text-align: center;
            font-size: 10px;
            color: #9ca3af;
            border-top: 2px solid #ff6b00;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .qc-close-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            font-weight: bold;
            z-index: 10;
        }

        .qc-close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg) scale(1.1);
        }

        .qc-divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #ffd4a3, transparent);
            margin: 16px 0;
        }
    `;
    document.head.appendChild(style);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'qc-overlay';
    document.body.appendChild(overlay);

    // Create Main Screen
    const container = document.createElement('div');
    container.className = 'qc-container';
    container.innerHTML = `
        <div class="qc-header">
            <button class="qc-close-btn" id="qc-close-main">×</button>
            <div class="qc-header-content">
                <div class="qc-logo">🚀</div>
                <h2>QUEUE SNIPER</h2>
                <p>IDRIS SERVICES</p>
            </div>
        </div>
        <div class="qc-body">
            <div class="qc-stats">
                <div class="qc-stat-row">
                    <span class="qc-stat-label">Status</span>
                    <span class="qc-status-badge qc-status-stopped" id="qc-status">Stopped</span>
                </div>
                <div class="qc-stat-row">
                    <span class="qc-stat-label">Total Clicks</span>
                    <span class="qc-stat-value" id="qc-clicks">0</span>
                </div>
            </div>

            <div class="qc-input-group">
                <label class="qc-label">Interval (milliseconds)</label>
                <input type="number" class="qc-input" id="qc-interval" value="1" min="1" max="10000">
            </div>

            <div class="qc-controls">
                <button class="qc-button qc-button-success" id="qc-start">▶ Start</button>
                <button class="qc-button qc-button-danger" id="qc-stop" disabled>⏹ Stop</button>
            </div>

            <div class="qc-divider"></div>

            <div style="text-align: center; font-size: 11px; color: #b45309; font-weight: 600;">
                🎯 <strong>Target:</strong> "Join Queue"
            </div>
        </div>
        <div class="qc-footer">
            DQRKIS SERVICES - EZ QUEUE
        </div>
    `;
    document.body.appendChild(container);

    const startBtn = document.getElementById('qc-start');
    const stopBtn = document.getElementById('qc-stop');
    const closeBtn = document.getElementById('qc-close-main');
    const statusBadge = document.getElementById('qc-status');
    const clicksEl = document.getElementById('qc-clicks');
    const intervalInput = document.getElementById('qc-interval');

    function clickButton() {
        const button = Array.from(document.querySelectorAll('button')).find(
            btn => btn.textContent === 'Join Queue'
        );
        if (button) {
            button.click();
            clickCount++;
            clicksEl.textContent = clickCount;
        }
    }

    startBtn.addEventListener('click', () => {
        const interval = parseInt(intervalInput.value) || 1;
        intervalId = setInterval(clickButton, interval);
        isRunning = true;
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusBadge.textContent = 'Running';
        statusBadge.className = 'qc-status-badge qc-status-running';
    });

    stopBtn.addEventListener('click', () => {
        clearInterval(intervalId);
        isRunning = false;
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
        statusBadge.textContent = 'Stopped';
        statusBadge.className = 'qc-status-badge qc-status-stopped';
    });

    closeBtn.addEventListener('click', () => {
        if (intervalId) clearInterval(intervalId);
        container.remove();
        overlay.remove();
        window.queueClickerActive = false;
    });

    console.log('🚀 Queue Auto-Clicker Pro loaded and ready!');
})();
