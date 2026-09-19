/**
 * JP SERVICE - STEALTH PRIORITIZED QUEUE SNIPER
 * IB: @.j.p.1
 */

(function () {

    // safe storage wrapper (discord sandbox compatible)
    const storage = (() => {
        try {
            const t = "__JP_test";
            window.localStorage.setItem(t, "1");
            window.localStorage.removeItem(t);
            return window.localStorage;
        } catch {
            return {
                getItem: () => null,
                setItem: () => {},
                removeItem: () => {}
            };
        }
    })();

    const STORAGE_KEY = "JP_sniper_state";

    const existing = document.getElementById("JP-ultra-safe");
    if (existing) existing.remove();

    const saved = (() => {
        try {
            return JSON.parse(storage.getItem(STORAGE_KEY) || "{}");
        } catch {
            return {};
        }
    })();

    let state = {
        running: false,
        scanCount: saved.scanCount || 0,
        clicked: false,
        locked: false,
        lastElement: null,
        drag: { x: 0, y: 0, active: false }
    };

    const TARGET_TEXT = "join queue";
    const QUEUE_DETECTED_TEXT = "already in the queue";

    const ui = document.createElement("div");
    ui.id = "JP-ultra-safe";
    ui.innerHTML = `
<style>
.JP-btn {
  transition: transform .15s ease, box-shadow .15s ease;
}
.JP-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0,0,0,.15);
}
</style>

<div id="JP-box" style="
 position:fixed;
 top:${saved.top || 25}px;
 left:${saved.left || 'auto'};
 right:${saved.left ? 'auto' : 25}px;
 z-index:2147483647;
 width:260px;
 background:#000000;
 color:#666666;
 padding:20px;
 border-radius:18px;
 font-family:inter,sans-serif;
 border:2px solid #0D0D0D;
 box-shadow:0 10px 30px rgba(0,0,0,.15)
">

  <div id="JP-header" style="text-align:center;margin-bottom:12px;cursor:move">
    <div style="font-weight:800;letter-spacing:2px">
      JP <span style="color:#666666">service</span>
    </div>
    <div style="font-size:10px;color:#7D7D7D;margin-top:4px">
      Stealth Prioritized
    </div>
  </div>

  <div style="font-size:10px;margin-bottom:10px">
    status: <span id="JP-status" style="color:#d63031;font-weight:700">idle</span>
  </div>

  <button id="JP-start" class="JP-btn" style="
    width:100%;
    padding:12px;
    border-radius:10px;
    border:none;
    background:#5F0DA8;
    color:#0F061A;
    font-weight:800;
    font-size:12px;
    cursor:pointer
  ">START QUEUE SNIPER</button>

  <button id="JP-kill" class="JP-btn" style="
    margin-top:8px;
    width:100%;
    padding:8px;
    border-radius:8px;
    border:1px solid #1A1A1A;
    background:#000000;
    color:#c0392b;
    font-size:10px;
    cursor:pointer
  ">SELF DESTRUCT</button>

  <div style="margin-top:14px;font-size:10px;color:#27ae60">
    scans: <span id="JP-count">${state.scanCount}</span>
  </div>

  <div id="JP-log" style="
    margin-top:10px;
    height:90px;
    overflow:auto;
    background:#1A1A1A;
    padding:8px;
    border-radius:8px;
    font-family:consolas;
    font-size:10px;
    color:#111
  "></div>
</div>
`;
    document.body.appendChild(ui);

    const dom = {
        box: document.getElementById("JP-box"),
        header: document.getElementById("JP-header"),
        start: document.getElementById("JP-start"),
        kill: document.getElementById("JP-kill"),
        status: document.getElementById("JP-status"),
        count: document.getElementById("JP-count"),
        log: document.getElementById("JP-log")
    };

    function persist() {
        storage.setItem(STORAGE_KEY, JSON.stringify({
            scanCount: state.scanCount,
            top: dom.box.offsetTop,
            left: dom.box.offsetLeft
        }));
    }

    function log(msg, color = "#EBEBEB") {
        const d = document.createElement("div");
        d.style.color = color;
        d.textContent = "> " + msg;
        dom.log.appendChild(d);
        dom.log.scrollTop = dom.log.scrollHeight;
    }

    function randomDelay() {
        return 500 + Math.random() * 1000;
    }

    function resetState(manual = true) {
        state.running = false;
        state.clicked = false;
        state.locked = false;
        state.lastElement = null;
        dom.status.textContent = "idle";
        dom.status.style.color = "#d63031";
        dom.start.textContent = "START QUEUE SNIPER";
        dom.start.style.background = "#ffd400";
        if (manual) log("sniper stopped", "#c0392b");
    }

    function scanOnce() {
        if (!state.running || state.locked) return;

        state.scanCount++;
        dom.count.textContent = state.scanCount;
        persist();

        try {
            const elements = document.querySelectorAll("button,[role='button'],a");

            for (const el of elements) {
                const text = (el.innerText || "").toLowerCase();

                if (text.includes(QUEUE_DETECTED_TEXT)) {
                    state.locked = true;
                    dom.status.textContent = "queue detected";
                    dom.status.style.color = "#f39c12";
                    log("already in queue, sniper stopped", "#f39c12");
                    return;
                }

                if (text.includes(TARGET_TEXT) && !state.clicked && state.lastElement !== el) {
                    state.clicked = true;
                    state.lastElement = el;
                    el.style.outline = "2px solid #ffd400";
                    el.click();
                    dom.status.textContent = "clicked once";
                    dom.status.style.color = "#27ae60";
                    log("join queue clicked once");
                    log("sniper locked for safety", "#c0392b");
                    state.locked = true;
                    return;
                }
            }
        } catch {}

        setTimeout(scanOnce, randomDelay());
    }

    dom.start.onclick = () => {
        if (state.running) {
            resetState();
            return;
        }
        state.running = true;
        dom.status.textContent = "scanning";
        dom.status.style.color = "#27ae60";
        dom.start.textContent = "STOP QUEUE SNIPER";
        dom.start.style.background = "#ff7675";
        log("queue sniper started (stealth mode)");
        setTimeout(scanOnce, randomDelay());
    };

    dom.kill.onclick = () => {
        resetState(false);
        storage.removeItem(STORAGE_KEY);
        dom.box.remove();
    };

    dom.header.addEventListener("mousedown", e => {
        state.drag.active = true;
        state.drag.x = e.clientX - dom.box.offsetLeft;
        state.drag.y = e.clientY - dom.box.offsetTop;
    });

    document.addEventListener("mousemove", e => {
        if (!state.drag.active) return;
        dom.box.style.left = e.clientX - state.drag.x + "px";
        dom.box.style.top = e.clientY - state.drag.y + "px";
        dom.box.style.right = "auto";
    });

    document.addEventListener("mouseup", () => {
        if (state.drag.active) persist();
        state.drag.active = false;
    });

})();
