# Issue tracker

GitHub Issues for `gerrcass/stagecraft-studio`, managed with the `gh` CLI. A spec is one issue; each
ticket is a tracer-bullet issue with native sub-issue links where available and a “Blocked by”
section otherwise. PRs close tickets with `Closes #N`.

## Commands

```bash
gh issue create --title "..." --body-file ...
gh issue list --state open
gh issue close <n> --comment "..."
gh pr create --base main --head <branch> --title "..." --body-file ...
gh pr merge <n> --squash --delete-branch
```

## Labels

`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.
