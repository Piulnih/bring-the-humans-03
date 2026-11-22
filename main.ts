// bring-the-humans-03 entry (Node 22, standard library only).
//
// The entry is the video, not this program: an original short vertical ad
// for make.fun, made by an AI agent with ffmpeg in the recorded session,
// posted publicly on TikTok from @clipclopuy. This program's only job is to
// hand the video's address to the gate: it reads VIDEO.json from the
// repository, checks the address really names a TikTok video (a full
// https://www.tiktok.com/@<handle>/video/<digits> address, never a short
// link), and copies the file unchanged to the output directory.
//
// The ad itself shows make.fun's brand (the mascot mark and the make.fun
// wordmark, from the press pack) from its first frame, tells viewers what
// make.fun is and why they should join, and ends on make.fun's referral
// end card with the account's own referral code. The press files live in
// the press pack (https://make.fun/press/manifest.json); this repository
// holds no copy of them.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A TikTok video address has this shape and nothing else: the house reads
// the video from it, and a short link (vt.tiktok.com, vm.tiktok.com) or a
// non-TikTok address names no video, so refuse those here, loudly, instead
// of handing the gate an address it cannot read.
const VIDEO_URL = /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/;

const source = join(BOT_DIR, 'VIDEO.json');

let url;
try {
  const parsed = JSON.parse(readFileSync(source, 'utf8'));
  url = parsed.url;
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof url !== 'string' || !VIDEO_URL.test(url)) {
  console.error(`VIDEO.json does not name a TikTok video: ${JSON.stringify(url)}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(source, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
