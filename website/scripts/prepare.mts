// Generates the release-driven parts of the site before `docusaurus start|build`:
// - versioned docs from git tags: the latest patch of each minor line becomes a version, so /docs matches
//   what's on npm and master's docs show as "Next" at /docs/next. Nothing is committed; tags are the source.
// - src/pages/changelog.md from the root CHANGELOG.md that release-please maintains.
import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Older tags predate the docs components the current site provides.
const FIRST_VERSIONED = [0, 3];

const site = path.join(import.meta.dirname, '..');
const git = (...args: string[]) => execFileSync('git', args, { cwd: site, encoding: 'utf8' });

const releaseLines = () => {
  const lines = new Map<string, string>();
  for (const tag of git('tag', '--list', 'v*', '--sort=-v:refname').split('\n')) {
    const match = /^v(\d+)\.(\d+)\.(\d+)$/.exec(tag);
    if (!match) continue;
    const [major, minor] = [Number(match[1]), Number(match[2])];
    const isOld = major < FIRST_VERSIONED[0] || (major === FIRST_VERSIONED[0] && minor < FIRST_VERSIONED[1]);
    const line = `${major}.${minor}`;
    if (!isOld && !lines.has(line)) lines.set(line, tag);
  }
  return lines;
};

const sidebarsAt = (tag: string): unknown => {
  const { outputText } = ts.transpileModule(git('show', `${tag}:website/sidebars.ts`), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  const module = { exports: {} as { default?: unknown } };
  vm.runInNewContext(outputText, { module, exports: module.exports });
  return module.exports.default;
};

const writeVersions = () => {
  const docsDir = path.join(site, 'versioned_docs');
  const sidebarsDir = path.join(site, 'versioned_sidebars');
  fs.rmSync(docsDir, { recursive: true, force: true });
  fs.rmSync(sidebarsDir, { recursive: true, force: true });
  fs.mkdirSync(sidebarsDir, { recursive: true });

  const lines = releaseLines();
  for (const [line, tag] of lines) {
    const dir = path.join(docsDir, `version-${line}`);
    fs.mkdirSync(dir, { recursive: true });
    // From the repo root: inside a subdirectory, git archive only includes that subdirectory.
    execSync(`git archive ${tag}:website/docs | tar -x -f - -C "${dir}"`, { cwd: path.join(site, '..') });
    fs.writeFileSync(path.join(sidebarsDir, `version-${line}-sidebars.json`), JSON.stringify(sidebarsAt(tag), null, 2));
  }
  fs.writeFileSync(path.join(site, 'versions.json'), JSON.stringify([...lines.keys()], null, 2));
  console.log(`[prepare] docs versions: ${[...lines.values()].join(', ') || 'none'}`);
};

const writeChangelog = () => {
  const changelog = fs.readFileSync(path.join(site, '../CHANGELOG.md'), 'utf8');
  const frontMatter =
    '---\ntitle: Changelog\ndescription: "Release notes for every version of React Native Pickers: new pickers, features, bug fixes and breaking changes, generated from each release."\n---\n\n';
  fs.writeFileSync(path.join(site, 'src/pages/changelog.md'), frontMatter + changelog);
};

writeVersions();
writeChangelog();
