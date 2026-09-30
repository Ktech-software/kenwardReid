#!/usr/bin/env node
// KTech guard: a Claude Code PreToolUse hook for the Bash tool (CLAUDE.md §1, §5, §6.1).
//
// GitHub Free can't protect `main` on private repos, so this hook is the first
// line of enforcement in every Claude session (local and cloud):
//   - BLOCK: commits while on main/master, pushes that target main/master,
//     --all/--mirror pushes, and shell commands that touch secret files
//     (.dev.vars, .env, *.pem, *.key, *.p12). Listing names (ls, test -e,
//     git check-ignore, git status) is still allowed.
//   - ASK: everything on the "always requires my explicit confirmation" list,
//     so it prompts even when Claude runs unattended.
//
// Input: the hook JSON on stdin. Output: exit 2 + stderr to block; a JSON
// permissionDecision of "ask" to force a prompt; exit 0 to allow.
// Copied from ktech-standards/templates/claude/hooks/. Update it there first.

import { execFileSync } from 'node:child_process';

const PROTECTED = new Set(['main', 'master']);

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data));
  });
}

function block(reason) {
  process.stderr.write(`KTech guard blocked this command: ${reason}\n`);
  process.exit(2);
}

function ask(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: `KTech standards: ${reason} needs the owner's explicit confirmation.`,
      },
    }),
  );
  process.exit(0);
}

function currentBranch(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'rev-parse', '--abbrev-ref', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

// Split a command line into simple commands on ; && || | and newlines.
// Quoting is handled loosely; this is a guard, not a parser.
function segments(cmd) {
  return cmd
    .split(/\|\||&&|;|\||\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function tokens(seg) {
  return (seg.match(/"[^"]*"|'[^']*'|\S+/g) ?? []).map((t) => t.replace(/^["']|["']$/g, ''));
}

// git [-C dir] [-c k=v]... <sub> args  →  { dir, sub, args }
function parseGit(toks, cwd) {
  const i = toks.indexOf('git');
  if (i === -1) return null;
  let dir = cwd;
  let j = i + 1;
  while (j < toks.length && toks[j].startsWith('-')) {
    if (toks[j] === '-C' && toks[j + 1]) {
      dir = toks[j + 1].startsWith('/') ? toks[j + 1] : `${dir}/${toks[j + 1]}`;
      j += 2;
    } else if (toks[j] === '-c') j += 2;
    else j += 1;
  }
  return { dir, sub: toks[j], args: toks.slice(j + 1) };
}

const SECRET_FILE = /(^|[\s/'"=<>])(\.dev\.vars(?!\.example)(\.[\w-]+)?|\.env(?!\.example)(\.[\w-]+)?|[\w.-]+\.(pem|key|p12))(?=$|[\s'"<>|;&)])/;
const NAME_ONLY = /^(ls|test|\[|stat|git\s+(check-ignore|status|ls-files))\b/;

function checkSecrets(seg) {
  if (!SECRET_FILE.test(seg)) return;
  if (NAME_ONLY.test(seg)) return;
  block(
    'it references a secret file (.dev.vars, .env, *.pem, *.key). Never open or print secret files; check names only (e.g. `ls`, `git check-ignore`).',
  );
}

function refTargetsProtected(ref) {
  const dst = ref.includes(':') ? ref.split(':').pop() : ref;
  const name = dst.replace(/^\+/, '').replace(/^refs\/heads\//, '');
  return PROTECTED.has(name);
}

function checkGit(git) {
  const { dir, sub, args } = git;
  if (sub === 'commit') {
    const branch = currentBranch(dir);
    if (PROTECTED.has(branch))
      block(`you are on \`${branch}\`. Never commit directly to ${branch}: create a branch (feat/, fix/, chore/, docs/, test/, refactor/, security/) first.`);
  }
  if (sub === 'push') {
    const positional = args.filter((a) => !a.startsWith('-'));
    const force = args.some((a) => /^(-f|--force(-with-lease)?(=.*)?|--force-if-includes)$/.test(a)) || positional.some((r) => r.startsWith('+'));
    if (args.includes('--all') || args.includes('--mirror')) block('--all/--mirror pushes can update main.');
    const refs = positional.slice(1); // first positional is the remote
    if (refs.some(refTargetsProtected)) block('it pushes to main. Push your branch and merge through a pull request.');
    if (refs.length === 0 && PROTECTED.has(currentBranch(dir)))
      block('you are on main, so this push would update main. Push a branch and open a pull request.');
    if (args.includes('--delete') || args.includes('-d') || positional.some((r) => r.startsWith(':'))) ask('deleting a remote branch');
    if (force) ask('a force push (rewrites history)');
  }
  if (sub === 'reset' && args.includes('--hard')) ask('`git reset --hard`');
  if (sub === 'branch' && args.some((a) => a === '-D' || a === '-d' || a === '--delete')) ask('deleting a branch');
  if ((sub === 'rebase' || sub === 'filter-branch' || sub === 'filter-repo')) ask(`\`git ${sub}\` (rewrites history)`);
}

function checkOther(seg) {
  const t = seg.replace(/^(sudo\s+|npx\s+|pnpm\s+exec\s+|npm\s+exec\s+--\s+)/, '');
  if (/^rm\s+(-\w*r\w*f|-\w*f\w*r|-r\s+-f|-f\s+-r|--recursive)/.test(t)) ask('`rm -rf`');
  if (/^wrangler\s+(deploy|publish|rollback)\b/.test(t)) ask('a production deploy or rollback run by hand');
  if (/^wrangler\s+pages\s+deploy\b/.test(t)) ask('a Pages deploy run by hand');
  if (/^wrangler\s+d1\s+(execute|migrations\s+apply)\b.*--remote\b/.test(t)) ask('a command against remote D1 data');
  if (/^wrangler\s+(kv|r2)\b.*\b(put|delete|create)\b/.test(t) && !/--local\b/.test(t)) ask('a KV/R2 write or delete');
  if (/^wrangler\s+(secret|pages\s+secret)\s+(put|delete|bulk)\b/.test(t)) ask('creating, changing or deleting a secret');
  if (/^wrangler\s+(d1|kv|r2|queues)\b.*\b(create|delete)\b/.test(t)) ask('creating or deleting a Cloudflare resource');
  if (/^npm\s+(i|install|add|uninstall|remove|rm|un|update|upgrade)\b/.test(t) && !/^npm\s+(i|install)\s*$/.test(t))
    ask('installing, removing or upgrading dependencies');
}

const raw = await readStdin();
let input;
try {
  input = JSON.parse(raw);
} catch {
  process.exit(0); // not our input; never break the session
}
if (input?.tool_name !== 'Bash') process.exit(0);
const command = String(input?.tool_input?.command ?? '');
const cwd = input?.cwd || process.cwd();

for (const seg of segments(command)) {
  checkSecrets(seg);
  const git = parseGit(tokens(seg), cwd);
  if (git) checkGit(git);
  else checkOther(seg);
}
process.exit(0);
