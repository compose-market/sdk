#!/usr/bin/env node
/**
 * Synchronize every package/spec version from the single source of truth
 * (package.json).
 *
 * Runs before every build and every test. Nothing else in the tree hand-writes
 * a version constant or contract/package metadata; this script owns the
 * invariant that local builds cannot publish mixed root/generated/spec
 * versions after package.json changes.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(scriptDir, "..");
const pkgPath = join(rootDir, "package.json");

const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
const version = pkg.version;
if (typeof version !== "string" || version.length === 0) {
    console.error("[version] package.json is missing a `version` field");
    process.exit(1);
}

const generatedTargets = ["agentic", "inference", "x402"];

function readUtf8(path) {
    return readFileSync(path, "utf-8");
}

function writeIfChanged(path, contents) {
    if (!existsSync(path)) {
        writeFileSync(path, contents, "utf-8");
        return true;
    }

    const previous = readUtf8(path);
    if (previous === contents) {
        return false;
    }

    writeFileSync(path, contents, "utf-8");
    return true;
}

function updateJson(path, updater) {
    if (!existsSync(path)) {
        return false;
    }

    const value = JSON.parse(readUtf8(path));
    updater(value);
    return writeIfChanged(path, `${JSON.stringify(value, null, 2)}\n`);
}

function replaceRequired(path, pattern, replacement, label) {
    if (!existsSync(path)) {
        return false;
    }

    const previous = readUtf8(path);
    if (!pattern.test(previous)) {
        throw new Error(`[version] ${label} was not found in ${path}`);
    }

    const next = previous.replace(pattern, replacement);
    return writeIfChanged(path, next);
}

function updateInfoVersion(path) {
    return replaceRequired(
        path,
        /(^info:\n(?:[ \t].*\n)*?[ \t]+version:[ \t]*).+$/m,
        `$1${version}`,
        "info.version",
    );
}

const changed = new Set();

function track(path, didChange) {
    if (didChange) {
        changed.add(path.replace(`${rootDir}/`, ""));
    }
}

track(join(rootDir, "package-lock.json"), updateJson(join(rootDir, "package-lock.json"), (lock) => {
    lock.version = version;
    if (lock.packages?.[""]) {
        lock.packages[""].version = version;
    }
}));

for (const spec of ["agentic.openapi.yaml", "inference.openapi.yaml", "x402.openapi.yaml"]) {
    const path = join(rootDir, "specs", spec);
    track(path, updateInfoVersion(path));
}

track(join(rootDir, ".speakeasy", "tests.arazzo.yaml"), updateInfoVersion(join(rootDir, ".speakeasy", "tests.arazzo.yaml")));

track(join(rootDir, ".speakeasy", "gen.yaml"), replaceRequired(
    join(rootDir, ".speakeasy", "gen.yaml"),
    /(^typescript:\n(?:[ \t].*\n)*?[ \t]+version:[ \t]*).+$/m,
    `$1${version}`,
    "typescript.version",
));

for (const target of generatedTargets) {
    const targetDir = join(rootDir, "generated", target);
    track(join(targetDir, "package.json"), updateJson(join(targetDir, "package.json"), (generatedPkg) => {
        generatedPkg.version = version;
    }));
    track(join(targetDir, "jsr.json"), updateJson(join(targetDir, "jsr.json"), (jsr) => {
        jsr.version = version;
    }));
    track(join(targetDir, "package-lock.json"), updateJson(join(targetDir, "package-lock.json"), (lock) => {
        lock.version = version;
        if (lock.packages?.[""]) {
            lock.packages[""].version = version;
        }
    }));
    track(join(targetDir, "examples", "package-lock.json"), updateJson(join(targetDir, "examples", "package-lock.json"), (lock) => {
        if (lock.packages?.[".."]) {
            lock.packages[".."].version = version;
        }
    }));

    const genLock = join(targetDir, ".speakeasy", "gen.lock");
    if (existsSync(genLock)) {
        track(genLock, replaceRequired(genLock, /(^  docVersion:[ \t]*).+$/m, `$1${version}`, "management.docVersion"));
        track(genLock, replaceRequired(genLock, /(^  releaseVersion:[ \t]*).+$/m, `$1${version}`, "management.releaseVersion"));
    }

    const generatedConfig = join(targetDir, "src", "lib", "config.ts");
    if (existsSync(generatedConfig)) {
        track(generatedConfig, replaceRequired(
            generatedConfig,
            /(\bopenapiDocVersion:\s*")[^"]+(")/,
            `$1${version}$2`,
            "SDK_METADATA.openapiDocVersion",
        ));
        track(generatedConfig, replaceRequired(
            generatedConfig,
            /(\bsdkVersion:\s*")[^"]+(")/,
            `$1${version}$2`,
            "SDK_METADATA.sdkVersion",
        ));
        track(generatedConfig, replaceRequired(
            generatedConfig,
            /(\buserAgent:\s*"speakeasy-sdk\/typescript\s+)[^ ]+(\s+)/,
            `$1${version}$2`,
            "SDK_METADATA.userAgent sdkVersion",
        ));
    }
}

const versionPath = join(rootDir, "src", "version.ts");
const contents = `/**
 * GENERATED FILE - DO NOT EDIT.
 *
 * The canonical SDK version string. Regenerated from \`package.json\` before
 * every build and every test by \`scripts/sync-version.mjs\`. The only place
 * to change the version is \`package.json\`.
 */

export const SDK_VERSION = "${version}" as const;
`;

track(versionPath, writeIfChanged(versionPath, contents));

if (changed.size === 0) {
    console.log(`[version] all package/spec versions already ${version}`);
} else {
    const changedFiles = Array.from(changed);
    console.log(`[version] synced ${changedFiles.length} file(s) to ${version}: ${changedFiles.join(", ")}`);
}
