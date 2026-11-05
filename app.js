const escapeHtml = (text) =>
    String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

module.exports = (req, res) => {
    const requestUrl = new URL(req.url, "http://localhost");

    res.setHeader("Cache-Control", "no-store");

    if (requestUrl.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({
            status: "online",
            uptime: Math.floor(process.uptime()),
            timestamp: new Date().toISOString()
        }));
        return;
    }

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#10131d">
    <title>Node Server Studio</title>
    <style>
        :root {
            color-scheme: dark;
            --page: #10131d;
            --panel: #191d2a;
            --panel-soft: #1e2332;
            --text: #f3f5fb;
            --muted: #9ba4b8;
            --line: #2a3040;
            --accent: #9a8cff;
            --accent-bright: #b6aaff;
            --green: #63e6a3;
            --shadow: 0 24px 70px rgba(0, 0, 0, .24);
        }
        * { box-sizing: border-box; }
        body {
            min-height: 100vh;
            margin: 0;
            background:
                radial-gradient(ellipse at 82% 4%, rgba(116, 95, 255, .16), transparent 34rem),
                var(--page);
            color: var(--text);
            font: 15px/1.6 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        button { font: inherit; }
        .shell { max-width: 1080px; margin: 0 auto; padding: 28px 24px 52px; }
        .topbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .brand { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 700; letter-spacing: -.02em; }
        .brand-mark {
            display: grid; width: 38px; height: 38px; place-items: center; border: 1px solid rgba(182, 170, 255, .32);
            border-radius: 12px; background: rgba(154, 140, 255, .13); color: var(--accent-bright); font-size: 20px;
        }
        .top-actions { display: flex; align-items: center; gap: 10px; }
        .status-pill { display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border: 1px solid var(--line); border-radius: 999px; color: var(--muted); font-size: 12px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 12px rgba(99, 230, 163, .65); }
        .icon-button, .secondary-button, .primary-button {
            min-height: 40px; border: 1px solid var(--line); border-radius: 11px; color: var(--text); cursor: pointer;
            transition: transform .18s ease, border-color .18s ease, background .18s ease;
        }
        .icon-button:hover, .secondary-button:hover { border-color: #555d73; background: var(--panel-soft); }
        .icon-button:active, .secondary-button:active, .primary-button:active { transform: translateY(1px); }
        .icon-button { width: 40px; background: var(--panel); font-size: 17px; }
        .hero { display: grid; grid-template-columns: minmax(0, 1fr) 250px; gap: 32px; align-items: center; padding: 70px 0 36px; }
        .eyebrow { margin: 0 0 12px; color: var(--accent-bright); font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
        h1 { max-width: 660px; margin: 0; font-size: clamp(36px, 6vw, 58px); line-height: 1.08; letter-spacing: -.055em; }
        .hero-copy { max-width: 590px; margin: 18px 0 0; color: var(--muted); font-size: 16px; }
        .hero-copy strong { color: var(--text); font-weight: 600; }
        .server-card { padding: 20px; border: 1px solid var(--line); border-radius: 17px; background: rgba(25, 29, 42, .78); box-shadow: var(--shadow); }
        .server-card-label { display: flex; align-items: center; gap: 9px; color: var(--muted); font-size: 12px; }
        .server-card-value { display: block; margin-top: 9px; font-size: 20px; font-weight: 700; letter-spacing: -.03em; }
        .server-card-note { margin: 5px 0 0; color: var(--muted); font-size: 12px; }
        .section-heading { display: flex; align-items: end; justify-content: space-between; gap: 14px; margin: 14px 0 15px; }
        .section-heading h2 { margin: 0; font-size: 18px; letter-spacing: -.02em; }
        .section-heading p { margin: 3px 0 0; color: var(--muted); font-size: 13px; }
        .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 15px; }
        .card { min-width: 0; padding: 20px; border: 1px solid var(--line); border-radius: 16px; background: var(--panel); box-shadow: 0 12px 32px rgba(0, 0, 0, .1); }
        .card-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .card-label { margin: 0; color: var(--muted); font-size: 13px; }
        .card-icon { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 10px; background: rgba(154, 140, 255, .12); color: var(--accent-bright); font-size: 16px; }
        .metric { margin: 14px 0 0; font-size: 27px; font-weight: 700; letter-spacing: -.04em; }
        .metric-note { margin: 2px 0 0; color: var(--muted); font-size: 12px; }
        .action-card { display: flex; min-height: 224px; flex-direction: column; align-items: flex-start; }
        .action-card .metric { margin-bottom: 4px; }
        .primary-button { margin-top: auto; padding: 9px 14px; border: 0; background: var(--accent); color: #141322; font-size: 13px; font-weight: 700; }
        .primary-button:hover { background: var(--accent-bright); }
        .secondary-button { margin-top: auto; padding: 8px 12px; background: transparent; font-size: 12px; }
        .result { min-height: 19px; margin: 8px 0 0; color: var(--green); font-size: 12px; }
        .request-card { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 15px; }
        .request-item { min-width: 0; padding: 13px 15px; border: 1px solid var(--line); border-radius: 12px; background: rgba(25, 29, 42, .7); }
        .request-label { display: block; color: var(--muted); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
        .request-value { display: block; overflow: hidden; margin-top: 4px; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
        footer { display: flex; justify-content: space-between; gap: 12px; margin-top: 28px; color: var(--muted); font-size: 12px; }
        body.light {
            color-scheme: light; --page: #f4f5fb; --panel: #fff; --panel-soft: #f0efff; --text: #202235;
            --muted: #697087; --line: #e2e4ef; --accent: #7765ea; --accent-bright: #6654d4; --green: #138b57;
            --shadow: 0 24px 70px rgba(47, 48, 88, .1);
        }
        body.light .primary-button { color: #fff; }
        @media (max-width: 720px) {
            .shell { padding: 20px 17px 38px; }
            .hero { grid-template-columns: 1fr; gap: 22px; padding: 52px 0 25px; }
            .server-card { max-width: 330px; }
            .grid { grid-template-columns: 1fr; }
            .action-card { min-height: 190px; }
        }
        @media (max-width: 420px) {
            .status-pill { padding: 6px 9px; }
            .brand { gap: 8px; font-size: 13px; }
            .top-actions { gap: 7px; }
            .request-card { grid-template-columns: 1fr; }
            footer { flex-direction: column; }
        }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; } }
    </style>
</head>
<body>
    <main class="shell">
        <header class="topbar">
            <div class="brand"><span class="brand-mark" aria-hidden="true">⌘</span><span>Node Server Studio</span></div>
            <div class="top-actions">
                <span class="status-pill"><span class="dot" aria-hidden="true"></span>Server online</span>
                <button class="icon-button" id="theme-toggle" type="button" aria-label="Switch to light theme" title="Toggle theme">☼</button>
            </div>
        </header>

        <section class="hero" aria-labelledby="page-title">
            <div>
                <p class="eyebrow">Your server is up and running</p>
                <h1 id="page-title">A little more life in your Node server.</h1>
                <p class="hero-copy">Welcome to your interactive dashboard. Try the controls, test the server connection, and see your request details update live.</p>
            </div>
            <aside class="server-card">
                <div class="server-card-label"><span class="dot" aria-hidden="true"></span>Current status</div>
                <span class="server-card-value">All systems go</span>
                <p class="server-card-note">Serving your page right now</p>
            </aside>
        </section>

        <section aria-labelledby="tools-heading">
            <div class="section-heading">
                <div><h2 id="tools-heading">Your control panel</h2><p>Click around — everything here is interactive.</p></div>
            </div>
            <div class="grid">
                <article class="card action-card">
                    <div class="card-top"><p class="card-label">Click counter</p><span class="card-icon" aria-hidden="true">✦</span></div>
                    <p class="metric" id="count" aria-live="polite">0</p>
                    <p class="metric-note">Clicks on this visit</p>
                    <button class="primary-button" id="count-button" type="button">Add a click <span aria-hidden="true">＋</span></button>
                </article>
                <article class="card action-card">
                    <div class="card-top"><p class="card-label">Connection check</p><span class="card-icon" aria-hidden="true">⌁</span></div>
                    <p class="metric" id="connection-state">Ready</p>
                    <p class="metric-note">Check your server responds</p>
                    <button class="secondary-button" id="health-button" type="button">Test connection</button>
                    <p class="result" id="health-result" aria-live="polite"></p>
                </article>
                <article class="card action-card">
                    <div class="card-top"><p class="card-label">Local time</p><span class="card-icon" aria-hidden="true">◷</span></div>
                    <p class="metric" id="clock">--:--:--</p>
                    <p class="metric-note" id="date-label">Your browser's live clock</p>
                    <button class="secondary-button" id="reset-button" type="button">Reset click counter</button>
                </article>
            </div>
            <div class="request-card" aria-label="Current request details">
                <div class="request-item"><span class="request-label">Request path</span><span class="request-value">${escapeHtml(req.url)}</span></div>
                <div class="request-item"><span class="request-label">HTTP method</span><span class="request-value">${escapeHtml(req.method)}</span></div>
            </div>
        </section>
        <footer><span>Built with Node.js — no extra packages required.</span><span id="footer-status">Ready when you are.</span></footer>
    </main>
    <script>
        const countLabel = document.getElementById("count");
        const healthButton = document.getElementById("health-button");
        const healthResult = document.getElementById("health-result");
        const connectionState = document.getElementById("connection-state");
        const footerStatus = document.getElementById("footer-status");
        let count = 0;

        document.getElementById("count-button").addEventListener("click", () => {
            count += 1;
            countLabel.textContent = count;
        });

        document.getElementById("reset-button").addEventListener("click", () => {
            count = 0;
            countLabel.textContent = count;
            footerStatus.textContent = "Counter reset.";
        });

        document.getElementById("theme-toggle").addEventListener("click", (event) => {
            const light = document.body.classList.toggle("light");
            event.currentTarget.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
            footerStatus.textContent = light ? "Light theme enabled." : "Dark theme enabled.";
        });

        healthButton.addEventListener("click", async () => {
            healthButton.disabled = true;
            healthButton.textContent = "Checking…";
            connectionState.textContent = "Checking";
            healthResult.textContent = "";
            try {
                const response = await fetch("/health", { cache: "no-store" });
                if (!response.ok) throw new Error("Server returned " + response.status);
                const result = await response.json();
                connectionState.textContent = result.status === "online" ? "Connected" : "Unavailable";
                healthResult.textContent = result.status === "online" ? "✓ Server responded successfully" : "Server did not report online";
                footerStatus.textContent = result.status === "online" ? "Connection test passed." : "Check the server status.";
            } catch (error) {
                connectionState.textContent = "Offline";
                healthResult.textContent = "Could not reach the server. Is it running?";
                footerStatus.textContent = "Connection test failed.";
            } finally {
                healthButton.disabled = false;
                healthButton.textContent = "Test connection";
            }
        });

        const updateClock = () => {
            const now = new Date();
            document.getElementById("clock").textContent = now.toLocaleTimeString();
            document.getElementById("date-label").textContent = now.toLocaleDateString(undefined, {
                weekday: "long", month: "short", day: "numeric"
            });
        };
        updateClock();
        setInterval(updateClock, 1000);
    </script>
</body>
</html>`);
};
