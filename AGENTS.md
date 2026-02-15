# Mission Control - Agent Integration

All agents should update Mission Control when completing tasks.

## CLI: `~/workspace/mission-control/mc.sh`

```bash
# Add a new task
mc.sh add-task --title "Task name" --assignee "AgentName" --priority "high" --status "in-progress"

# Mark task done
mc.sh update-task --id "t5" --status "done"

# Update goal progress
mc.sh update-goal --id "g1" --progress 75

# List tasks
mc.sh list-tasks --assignee "AgentName"
```

Priorities: low, medium, high, critical
Statuses: backlog, in-progress, done
