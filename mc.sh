#!/bin/bash
# Mission Control CLI — agents use this to update tasks and goals
# Usage:
#   mc.sh add-task --title "Task name" --assignee "Agent" --priority "high" --status "in-progress" [--description "..."] [--due "2026-02-20"] [--project "MedStopLoss"]
#   mc.sh update-task --id "t5" --status "done"
#   mc.sh update-goal --id "g1" --progress 75
#   mc.sh list-tasks [--assignee "Agent"] [--status "in-progress"]

DATA_FILE="$(dirname "$0")/public/data.json"

if [ ! -f "$DATA_FILE" ]; then
  echo "Error: $DATA_FILE not found"
  exit 1
fi

ACTION="$1"
shift

case "$ACTION" in
  add-task)
    TITLE="" ASSIGNEE="" PRIORITY="medium" STATUS="backlog" DESC="" DUE="" PROJECT=""
    while [[ $# -gt 0 ]]; do
      case "$1" in
        --title) TITLE="$2"; shift 2 ;;
        --assignee) ASSIGNEE="$2"; shift 2 ;;
        --priority) PRIORITY="$2"; shift 2 ;;
        --status) STATUS="$2"; shift 2 ;;
        --description) DESC="$2"; shift 2 ;;
        --due) DUE="$2"; shift 2 ;;
        --project) PROJECT="$2"; shift 2 ;;
        *) shift ;;
      esac
    done
    if [ -z "$TITLE" ] || [ -z "$ASSIGNEE" ]; then
      echo "Error: --title and --assignee required"
      exit 1
    fi
    ID="t$(date +%s)"
    NOW=$(date +%s)000
    python3 -c "
import json, sys
with open('$DATA_FILE', 'r') as f: data = json.load(f)
task = {'id':'$ID','title':'$TITLE','assignee':'$ASSIGNEE','priority':'$PRIORITY','status':'$STATUS','description':'$DESC','dueDate':'$DUE','project':'$PROJECT','createdAt':$NOW,'updatedAt':$NOW}
data['tasks'].append(task)
data['lastUpdated'] = $NOW
with open('$DATA_FILE', 'w') as f: json.dump(data, f, indent=2)
print(f'Added task: {task[\"id\"]} — {task[\"title\"]} ({task[\"assignee\"]})')
"
    ;;

  update-task)
    ID="" STATUS="" PRIORITY="" TITLE="" ASSIGNEE="" DESC=""
    while [[ $# -gt 0 ]]; do
      case "$1" in
        --id) ID="$2"; shift 2 ;;
        --status) STATUS="$2"; shift 2 ;;
        --priority) PRIORITY="$2"; shift 2 ;;
        --title) TITLE="$2"; shift 2 ;;
        --assignee) ASSIGNEE="$2"; shift 2 ;;
        --description) DESC="$2"; shift 2 ;;
        *) shift ;;
      esac
    done
    if [ -z "$ID" ]; then
      echo "Error: --id required"
      exit 1
    fi
    NOW=$(date +%s)000
    python3 -c "
import json
with open('$DATA_FILE', 'r') as f: data = json.load(f)
found = False
for t in data['tasks']:
    if t['id'] == '$ID':
        if '$STATUS': t['status'] = '$STATUS'
        if '$PRIORITY': t['priority'] = '$PRIORITY'
        if '$TITLE': t['title'] = '$TITLE'
        if '$ASSIGNEE': t['assignee'] = '$ASSIGNEE'
        if '$DESC': t['description'] = '$DESC'
        t['updatedAt'] = $NOW
        found = True
        print(f'Updated task: {t[\"id\"]} — {t[\"title\"]} → {t[\"status\"]}')
        break
if not found: print(f'Task $ID not found')
data['lastUpdated'] = $NOW
with open('$DATA_FILE', 'w') as f: json.dump(data, f, indent=2)
"
    ;;

  update-goal)
    ID="" PROGRESS=""
    while [[ $# -gt 0 ]]; do
      case "$1" in
        --id) ID="$2"; shift 2 ;;
        --progress) PROGRESS="$2"; shift 2 ;;
        *) shift ;;
      esac
    done
    if [ -z "$ID" ] || [ -z "$PROGRESS" ]; then
      echo "Error: --id and --progress required"
      exit 1
    fi
    NOW=$(date +%s)000
    python3 -c "
import json
with open('$DATA_FILE', 'r') as f: data = json.load(f)
for g in data['goals']:
    if g['id'] == '$ID':
        g['progress'] = $PROGRESS
        print(f'Updated goal: {g[\"title\"]} → {$PROGRESS}%')
        break
data['lastUpdated'] = $NOW
with open('$DATA_FILE', 'w') as f: json.dump(data, f, indent=2)
"
    ;;

  list-tasks)
    ASSIGNEE="" STATUS=""
    while [[ $# -gt 0 ]]; do
      case "$1" in
        --assignee) ASSIGNEE="$2"; shift 2 ;;
        --status) STATUS="$2"; shift 2 ;;
        *) shift ;;
      esac
    done
    python3 -c "
import json
with open('$DATA_FILE', 'r') as f: data = json.load(f)
for t in data['tasks']:
    if '$ASSIGNEE' and t.get('assignee') != '$ASSIGNEE': continue
    if '$STATUS' and t.get('status') != '$STATUS': continue
    print(f'{t[\"id\"]:8s} [{t[\"status\"]:12s}] {t[\"priority\"]:8s} {t[\"assignee\"]:12s} {t[\"title\"]}')
"
    ;;

  *)
    echo "Mission Control CLI"
    echo "Usage:"
    echo "  mc.sh add-task --title \"...\" --assignee \"Agent\" [--priority high] [--status in-progress] [--description \"...\"] [--due 2026-02-20] [--project MedStopLoss]"
    echo "  mc.sh update-task --id \"t5\" --status \"done\""
    echo "  mc.sh update-goal --id \"g1\" --progress 75"
    echo "  mc.sh list-tasks [--assignee Agent] [--status done]"
    ;;
esac
