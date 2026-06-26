# ASCII Animation Server

A simple Node.js server that streams ASCII animations in the terminal using HTTP and ANSI escape codes.

## What it does

It reads animation frames from text files and streams them to your terminal so they play like a real-time animation (similar to ascii.live).

## How it works

* Each animation is stored in `animations/<name>.txt`
* Frames are separated by a blank line
* The server loads and normalizes frames (same size for smooth rendering)
* It streams frames over HTTP using chunked transfer
* ANSI escape codes move the cursor and redraw frames

## Run locally

```bash
npm install
npm start
```

Server runs on:

```text
http://localhost:3000
```

## Play an animation

```bash
curl -N http://localhost:3000/parrot
```

Replace `parrot` with your animation file name.

## Deploy

Deploy on any Node.js hosting (Render, Railway, etc.)

Start command:

```bash
npm start
```

Then use:

```bash
curl -N https://your-domain.com/parrot
```

## Add new animation

* Create a `.txt` file in `animations/`
* Separate frames with a blank line
* Name file as the route you want

Example:

```
animations/cat.txt → /cat
```
