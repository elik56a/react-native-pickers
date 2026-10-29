// Generates the release-driven parts of the site before `docusaurus start|build`:
// - versioned docs from git tags: the latest patch of each minor line becomes a version, so /docs matches
//   what's on npm and master's docs show as "Next" at /docs/next. Nothing is committed; tags are the source.
//   Only the newest BUILT_LINES lines are built; older ones are listed in archived-versions.json and linked to their
//   docs on GitHub, as Docusaurus recommends, since every built version is a full copy of the docs to compile.
// - src/pages/changelog.md from the root CHANGELOG.md that release-please maintains.
import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Older tags predate the docs components the current site provides.
const FIRST_VERSIONED = [0, 3];
const BUILT_LINES = 2;

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

// Runs a TS module as it was at the tag. Its relative imports (sidebars.ts reads the catalog) load from the same tag;
// package imports are type-only, so the transpiler drops them.
const moduleAt = (tag: string, file: string): Record<string, unknown> => {
  const { outputText } = ts.transpileModule(git('show', `${tag}:${file}`), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  const module = { exports: {} as Record<string, unknown> };
  const require = (spec: string) => moduleAt(tag, `${path.posix.join(path.posix.dirname(file), spec)}.ts`);
  vm.runInNewContext(outputText, { module, exports: module.exports, require });
  return module.exports;
};

const sidebarsAt = (tag: string): unknown => moduleAt(tag, 'website/sidebars.ts').default;

const writeVersions = () => {
  const docsDir = path.join(site, 'versioned_docs');
  const sidebarsDir = path.join(site, 'versioned_sidebars');
  fs.rmSync(docsDir, { recursive: true, force: true });
  fs.rmSync(sidebarsDir, { recursive: true, force: true });
  fs.mkdirSync(sidebarsDir, { recursive: true });

  const all = [...releaseLines()];
  const lines = new Map(all.slice(0, BUILT_LINES));
  const archived = all.slice(BUILT_LINES).map(([line, tag]) => ({
    line,
    tag,
  }));
  for (const [line, tag] of lines) {
    const dir = path.join(docsDir, `version-${line}`);
    fs.mkdirSync(dir, { recursive: true });
    // From the repo root: inside a subdirectory, git archive only includes that subdirectory.
    execSync(`git archive ${tag}:website/docs | tar -x -f - -C "${dir}"`, { cwd: path.join(site, '..') });
    fs.writeFileSync(path.join(sidebarsDir, `version-${line}-sidebars.json`), JSON.stringify(sidebarsAt(tag), null, 2));
  }
  fs.writeFileSync(path.join(site, 'versions.json'), JSON.stringify([...lines.keys()], null, 2));
  fs.writeFileSync(path.join(site, 'archived-versions.json'), JSON.stringify(archived, null, 2));
  console.log(
    `[prepare] docs versions: ${[...lines.values()].join(', ') || 'none'}; on GitHub: ${archived.map((a) => a.tag).join(', ') || 'none'}`
  );
};

const writeChangelog = () => {
  const changelog = fs.readFileSync(path.join(site, '../CHANGELOG.md'), 'utf8');
  const frontMatter =
    '---\ntitle: Changelog\ndescription: "Release notes for every version of React Native Pickers: new pickers, features, bug fixes and breaking changes, generated from each release."\n---\n\n';
  fs.writeFileSync(path.join(site, 'src/pages/changelog.md'), frontMatter + changelog);
};

writeVersions();
writeChangelog();
