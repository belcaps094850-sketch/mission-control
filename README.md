# Mission Control

Team dashboard for tracking tasks, goals, and agent status across Bel's 12-agent AI team.

## Features

- **Task Board** — Track tasks by status, assignee, project, and priority
- **Goals Tracker** — Monitor progress on strategic goals
- **Team View** — Agent roster with avatars and roles
- **Ideas Board** — Capture and prioritize product ideas
- **CLI Integration** — `mc.sh` script for agent-driven task updates

## CLI Usage

```bash
./mc.sh add-task --title "..." --assignee "Agent" --priority high --status done --project "Project"
./mc.sh update-task --id "t5" --status "done"
./mc.sh update-goal --id "g1" --progress 75
./mc.sh list-tasks [--assignee Agent] [--status in-progress]
```

## Stack

- React + Vite
- JSON-file data store (`public/data.json`)

## Run

```bash
npm install
npm run dev     # http://localhost:3001
npm run build   # Production build → dist/
```

## Deployment

Runs as a LaunchAgent (`com.mission-control.dev`) — auto-starts on boot at port 3001.
