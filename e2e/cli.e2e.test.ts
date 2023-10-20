import assert from "node:assert";
import { execFile, spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { resolve } from "node:path";
import test, { describe, it } from "node:test";
import { promisify } from "node:util";

const project = "./Developer/github.com/LadaKuzmina/2282241-six-cities-2";
const tsv = "./mocks/text.tsv";

const cwd = resolve(homedir(), project);
const env = Object.assign(process.env, { "FORCE_COLOR": "0", });
const pkg = await import(resolve(cwd, "package.json"), { assert: { type: "json" } }).then((m) => m.default);

test.skip("4.1.1. Приложение предоставляет Command Line Interface (CLI)", async () => {
	assert.notStrictEqual(pkg["scripts"]["cli"], undefined, "expect cli script in package.json");
});

test("4.1.2. Модуль, отвечающий за запуск CLI, содержит корректный shebang.", () => {
	const content = readFileSync(resolve(cwd, "./src/main.cli.ts"), { encoding: "utf-8" });

	assert.strictEqual(content.startsWith("#!"), true, "expect cli has shebang");
});

describe("CLI", () => {
	it("4.1.4. Запуск CLI без аргументов приводит к исполнению команды --help.", async () => {
		assert.strictEqual(
			(await promisify(execFile)("tsx", ["./src/main.cli.ts"], { cwd, env })).stdout,
			(await promisify(execFile)("tsx", ["./src/main.cli.ts", "--help"], { cwd, env })).stdout,
		);
	});

	it("Command: --help", ({ signal }, done) => {
		const child = spawn("tsx", ["./src/main.cli.ts", "--help"], { cwd, env, signal });
		child.once("exit", (code) => {
			assert.strictEqual(code, 0, "expect exit code 0");

			done();
		});

		child.stderr.once("data", (buff: Buffer) => {
			assert.strictEqual(buff.length, 0, "expect empty stderr");
		});

		child.stdout.once("data", (buff: Buffer) => {
			assert.strictEqual(buff.length > 0, true, "expect data emitted to stdout");

			const output = buff.toString("utf-8");

			assert.match(output, /--help/, "expect --help subcommand definition");
			assert.match(output, /--import/, "expect --import subcommand definition");
			assert.match(output, /--version/, "expect --version subcommand definition");
			assert.match(output, /--generate/, "expect --generate subcommand definition");
		});
	});

	it("Command: --version", ({ signal }, done) => {
		const child = spawn("tsx", [resolve(homedir(), project, "./src/main.cli.ts"), "--version"], { cwd: tmpdir(), env, signal });

		child.once("exit", (code) => {
			assert.strictEqual(code, 0, "expect exit code 0");

			done();
		});

		child.stderr.once("data", (buff: Buffer) => {
			console.log(buff.toString("utf-8"));

			assert.strictEqual(buff.length, 0, "expect empty stderr");
		});

		child.stdout.once("data", (buff: Buffer) => {
			const output = buff.toString("utf-8").trim();

			assert.strictEqual(output, pkg["version"], "expect version from package.json");
		});
	});

	it("Command: --import", ({ signal }, done) => {
		const child = spawn("tsx", ["./src/main.cli.ts", "--import", tsv], { cwd, env, signal });
		child.once("exit", (code) => {
			assert.strictEqual(code, 0, "expect exit code 0");

			done();
		});

		child.stderr.once("data", (buff: Buffer) => {
			assert.strictEqual(buff.length, 0, "expect empty stderr");
		});

		child.stdout.once("data", (buff: Buffer) => {
			assert.strictEqual(buff.length > 0, true, "expect emit imported data to stdout");
		});
	});

	it("Command: --generate", ({ signal }, done) => {
		const data = resolve(tmpdir(), "data.tsv");
		const endpoint = "http://localhost:3123/api";

		const child = spawn("tsx", ["./src/main.cli.ts", "--generate", "5", data, endpoint], { cwd, env, signal });
		child.once("exit", (code) => {
			assert.strictEqual(code, 0, "expect exit code 0");

			assert.strictEqual(existsSync(data), true, "expect generated file to exist");
			const generated = readFileSync(data, { encoding: "utf-8" });
			assert.strictEqual(generated.length > 0, true, "expect generated file has content");

			done();
		});

		child.stderr.once("data", (buff: Buffer) => {
			console.log(buff.toString("utf-8"));

			assert.strictEqual(buff.length, 0, "expect empty stderr");
		});
	});
});
