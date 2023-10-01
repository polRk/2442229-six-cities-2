import assert from "node:assert";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import test, { afterEach, beforeEach, describe, mock } from "node:test";

process.env["FORCE_COLOR"] = "0";
const argv = [...process.argv];

let output = "";

beforeEach(() => {
	mock.method(console, "log", (...args: string[]) => {
		output += args.join(" ");
	});

	const require = createRequire(import.meta.url);
	const loader = require("internal/process/esm_loader");
	loader.esmLoader.loadCache.delete(import.meta.resolve("./cli.ts"));
});

afterEach(() => {
	output = "";
	process.argv = [...argv];
	mock.reset();
});

describe("cli.js", () => {
	test("help", async (t) => {
		await t.test("print help", async () => {
			process.argv = ["", ""];
			await import("./cli");

			assert.notEqual(output, "");
			assert.match(output, /NAME/);
			assert.match(output, /USAGE/);
			assert.match(output, /VERSION/);
			assert.match(output, /COMMANDS/);
		});

		await t.test("print help", async () => {
			process.argv = ["", "", "help"];
			await import("./cli");

			assert.notEqual(output, "");
			assert.match(output, /NAME/);
			assert.match(output, /USAGE/);
			assert.match(output, /VERSION/);
			assert.match(output, /COMMANDS/);
		});
	});

	test("import", async (t) => {
		await t.test("print help", async () => {
			process.argv = ["", "", "import"];
			await import("./cli");

			assert.notEqual(output, "");
			assert.match(output, /NAME/);
			assert.match(output, /USAGE/);
			assert.match(output, /ARGUMENTS/);
		});

		await t.test("print help", async () => {
			process.argv = ["", "", "import", "--help"];
			await import("./cli");

			assert.notEqual(output, "");
			assert.match(output, /NAME/);
			assert.match(output, /USAGE/);
			assert.match(output, /ARGUMENTS/);
		});

		await t.test("print data", async () => {
			t.mock.method(fs, "readFile", async () => "Квартира#1	Уютная квартира в центре Парижа	2023-10-01T20:12:31.708Z	Paris	https://localhost/flat1.jpg	https://localhost/flat1-1.jpg,https://localhost/flat1-2.jpg,https://localhost/flat1-3.jpg,https://localhost/flat1-4.jpg,https://localhost/flat1-5.jpg,https://localhost/flat1-6.jpg	true	false	4.7	apartment	5	7	15000	Breakfast,Washer,Towels,Fridge	Пользователь#1	1	48.8572,2.3615");

			process.argv = ["", "", "import", "./file.tsv"];
			await import("./cli");

			assert.notEqual(output, "");
			assert.match(output, /Квартира#1/);
		});
	});

	test("version",async (t) => {
		await t.test("print version", async () => {
			process.argv = ["", "", "version"];
			await import("./cli");

			assert.notEqual(output, "");
			assert.match(output, /^(\d)\.(\d)\.(\d)$/);
		});
	});
});
