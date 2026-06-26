const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

function loadFrames(name) {
  const file = path.join(__dirname, "animations", `${name}.txt`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf8");

  return raw
    .trimEnd()
    .split(/\r?\n\r?\n/)
    .map((frame) => {
      return frame
        .replace(/\r/g, "")
        .replace(/\t/g, "        ")
        .split("\n")
        .map((line) => line.trimEnd())
        .join("\n")
        .trimEnd();
    })
    .filter((frame) => frame.length > 0);
}

function normalizeFrames(frames) {
  const parsed = frames.map((f) => f.split("\n"));

  let maxWidth = 0;
  let maxHeight = 0;

  for (const lines of parsed) {
    maxHeight = Math.max(maxHeight, lines.length);
    for (const line of lines) {
      maxWidth = Math.max(maxWidth, line.length);
    }
  }

  return parsed.map((lines) => {
    while (lines.length < maxHeight) lines.push("");

    const paddedLines = lines.map((l) => l.padEnd(maxWidth, " "));

    // \x1b[1;1H — move to absolute row 1 col 1 (pure ANSI, works in all terminals)
    // \x1b[2K   — erase each line before writing (no leftover chars from wider frames)
    // \x1b[J    — after last line, erase everything below (kills stale lines from
    //             taller previous frames so nothing bleeds to the top on next cycle)
    const body = paddedLines.map((l) => "\x1b[2K" + l).join("\r\n");

    return Buffer.from("\x1b[1;1H" + body + "\x1b[J", "utf8");
  });
}

app.get("/:name", (req, res) => {
  let frames = loadFrames(req.params.name);
  if (!frames) return res.status(404).send("Animation not found.");

  frames = normalizeFrames(frames);

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("X-Accel-Buffering", "no");

  const socket = req.socket;
  socket.setNoDelay(true);
  socket.setKeepAlive(true);

  let frame = 0;
  let stopped = false;
  let timer = null;

  const FRAME_MS = 100;
  let lastTime = process.hrtime.bigint();

  function render() {
    if (stopped) return;

    res.write(frames[frame]);
    frame = (frame + 1) % frames.length;

    const now = process.hrtime.bigint();
    const elapsed = Number(now - lastTime) / 1_000_000;
    const nextDelay = Math.max(0, FRAME_MS - (elapsed - FRAME_MS));
    lastTime = now;

    timer = setTimeout(render, nextDelay);
  }

  // \x1b[?25l  — hide cursor
  // \x1b[2J    — clear entire screen once on connect only
  // \x1b[1;1H  — go to absolute row 1 col 1
  // No \x1b[s/\x1b[u — those are xterm-only and silently fail in many terminals,
  // causing the restore to land at the wrong row. \x1b[1;1H is pure ANSI.
  res.write("\x1b[?25l\x1b[2J\x1b[1;1H");

  timer = setTimeout(render, 50);

  function cleanup() {
    if (stopped) return;
    stopped = true;
    if (timer) clearTimeout(timer);
    try {
      res.write("\x1b[?25h");
      res.end();
    } catch (_) {}
  }

  req.on("close", cleanup);
  res.on("close", cleanup);
  socket.on("error", cleanup);
});

app.get("/", (req, res) => {
  res.send(
    `ASCII Animation Server\n\nUsage:\n  curl -N http://localhost:${PORT}/parrot\n`,
  );
});

app.listen(PORT, () => {
  console.log(`ASCII server running on port ${PORT}`);
});
