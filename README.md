# IRON SIX — Next.js 3D Body Tracker

## Requirements
- Node.js 18.17+ (Node 20 LTS recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Features
- Next.js App Router + TypeScript
- Three.js rendered through React Three Fiber
- Front/back 3D-style anatomical body models
- Drag to rotate and scroll/pinch to zoom
- Select a workout day and mark target muscle groups as trained
- Green = trained, red = target group not completed, grey = not targeted

## Notes
This is a standalone Next.js starter implementation of the 3D body tracker, inspired by the supplied reference. It is not yet connected to the existing IRON SIX app's saved exercise history; the demo tracker state is held in React state for the current page session.
