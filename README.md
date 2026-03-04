# PR Review Guide

Static site rendering dillon-wispr's PR review style guide with syntax-highlighted examples. Live at **https://pr-review-guide.vercel.app**.

## Content

The source content lives at `content/pr-review-style.md` and is the source of truth for both this site and the `review-pr` Claude skill.

`~/.claude/skills/review-pr/references/pr-review-style.md` is a symlink pointing here:

```
~/.claude/skills/review-pr/references/pr-review-style.md -> ~/Dev/pr-review-guide/content/pr-review-style.md
```

Editing the skill reference file directly edits the repo file. To publish changes to the live site:

```bash
cd ~/Dev/pr-review-guide
git add content/pr-review-style.md
git commit -m "docs: update PR review style guide"
git push
```

Vercel auto-deploys on push to `main`.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
