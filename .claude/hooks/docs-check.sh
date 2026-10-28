#!/bin/bash
# Stop hook: when library code changed, stop Claude once per change to check the docs, home page, SEO and llms text
# (AGENTS.md, "Docs stay in sync"). Exit 2 blocks the stop and hands stderr to Claude.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

base=$(git merge-base HEAD origin/master 2>/dev/null || echo HEAD)
changed=$({ git diff --name-only "$base"; git ls-files --others --exclude-standard; } | sort -u)
src=$(grep -E '^src/.*\.tsx?$' <<<"$changed" | grep -vE '\.test\.tsx?$')
[ -z "$src" ] && exit 0

# Keyed on the changed code itself, so the reminder comes back only after the code changes again.
stamp="$(git rev-parse --git-dir)/claude-docs-check"
hash=$({ echo "$src"; cat $src 2>/dev/null; } | shasum | cut -d' ' -f1)
[ "$(cat "$stamp" 2>/dev/null)" = "$hash" ] && exit 0
echo "$hash" >"$stamp"

docs=$(grep -E '^(README\.md|package\.json|context7\.json|website/docs/|website/src/home/|website/src/showcase/|website/docusaurus\.config\.ts|website/sidebars\.ts)' <<<"$changed")

cat >&2 <<EOF
Library code changed. Before finishing, check whether it changes what users see or call (a component, prop, default,
behavior or design). If it does, update every place listed in AGENTS.md under "Docs stay in sync": the component page and
props table, API reference, guides, the AI cheat sheet (resources/ai.mdx), README, the home page constants and FAQ, and
the SEO descriptions and keywords. If nothing user-facing changed, say so and finish.

Changed library files:
$src

Docs, home page and SEO files already changed:
${docs:-(none)}
EOF
exit 2
