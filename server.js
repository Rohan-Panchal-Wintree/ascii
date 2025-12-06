const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Load animation frames from /animations/*.txt
function loadFrames(name) {
  const file = path.join(__dirname, "animations", `${name}.txt`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf8");
  return raw
    .trim()
    .split("\n\n")
    .map((f) => f + "\n");
}

app.get("/:name", (req, res) => {
  const frames = loadFrames(req.params.name);

  if (!frames) {
    return res.status(404).send("Animation not found");
  }

  // Streaming headers
  res.set({
    "Content-Type": "text/plain; charset=utf-8",
    "Transfer-Encoding": "chunked",
    "Cache-Control": "no-cache",
  });

  let index = 0;

  const interval = setInterval(() => {
    const frame = frames[index];

    // Clear terminal + print frame
    res.write("\x1b[2J\x1b[H");
    res.write(frame);

    index = (index + 1) % frames.length;
  }, 100); // speed

  req.on("close", () => clearInterval(interval));
});

app.get("/", (req, res) => {
  res.send("Usage: /parrot (curl recommended)");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
