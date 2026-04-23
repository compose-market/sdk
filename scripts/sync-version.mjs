#!/usr/bin/env node
/**
 * Regenerate src/version.ts from the single source of truth (package.json).
 *
 * Runs before every build and every test. Nothing else in the tree
 * hand-writes a version constant; this script owns the invariant that the
 * `SDK_VERSION` export always matches `package.json:version` byte-for-byte.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(scriptDir, "..", "package.json");
const versionPath = join(scriptDir, "..", "src", "version.ts");

const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
const version = pkg.version;
if (typeof version !== "string" || version.length === 0) {
    console.error("[version] package.json is missing a `version` field");
    process.exit(1);
}

const contents = `/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * The canonical SDK version string. Regenerated from \`package.json\` before
 * every build and every test by \`scripts/sync-version.mjs\`. The only place
 * to change the version is \`package.json\`.
 */

export const SDK_VERSION = "${version}" as const;
`;

writeFileSync(versionPath, contents, "utf-8");
console.log(`[version] src/version.ts -> ${version}`);
