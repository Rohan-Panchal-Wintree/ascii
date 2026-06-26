# ASCII Terminal Animations

A fun terminal animation project inspired by [ascii.live](https://ascii.live). Users can stream ASCII animations directly in their terminal using `curl`.

## Live Demo

You can view the Parrot animation from the deployed project with:

```bash
curl -N https://ascii-2iht.onrender.com/parrot
```

The `-N` flag disables buffering, so the animation streams smoothly in your terminal.

## Run Locally

Fork the project and run it locally on your machine.

### 1. Install dependencies

```bash
npm install
```

### 2. Start the project

```bash
npm start
```

By default, the project will run on:

```text
http://localhost:3000
```

### 3. View the animation locally

Open another terminal window and run:

```bash
curl -N localhost:3000/parrot
```

You should now see the Parrot animation streaming directly in your terminal.

## Example Endpoint

| Animation | Command |
|---|---|
| Parrot | `curl -N https://ascii-2iht.onrender.com/parrot` |

## Tech Stack

- Node.js
- Express.js
- ASCII animations streamed over HTTP

## Inspiration

This project is inspired by [ascii.live](https://ascii.live), where users can watch animated ASCII art directly from the command line.
