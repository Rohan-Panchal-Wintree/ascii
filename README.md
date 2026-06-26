# ASCII Animation Server

A simple Node.js server that streams ASCII animations in the terminal using HTTP and ANSI escape codes.

## Live Demo

https://ascii-2iht.onrender.com

## What it does

It reads animation frames from text files and streams them to your terminal so they play like real-time ASCII animations (similar to ascii.live).

## How it works

- Animations are stored in `animations/<name>.txt`
- Frames are separated by a blank line
- Server loads and normalizes frames for smooth playback
- Streams frames over HTTP using chunked transfer encoding
- Uses ANSI escape codes to animate in the terminal

## Run locally

```bash
npm install
npm start
