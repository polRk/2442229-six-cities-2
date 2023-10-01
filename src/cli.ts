import chalk from "chalk";
import fs from "node:fs/promises";
import { EOL } from "node:os";
import { resolve } from "node:path";
import pkg from "../package.json" assert { type: "json" };
import type { IOffer } from "./models/offer";

const [, , command, options, ...args] = process.argv;
if (options && !options.startsWith("--")) {
	args.push(args[0]);
	args[0] = options;
}

switch (command) {
case "import":
case "--import":
	await importCommand();
	break;
case "version":
case "--version":
	versionCommand();
	break;
case "help":
case "--help":
default:
	helpCommand();
}

function helpCommand() {
	console.log("NAME:");
	console.log(`    ${pkg.name} - ${pkg.description}`);
	console.log();
	console.log("USAGE:");
	console.log(`    ${chalk.bold("cli.js")} ${chalk.blue("command")} ${chalk.cyan("[command options]")} ${chalk.magenta("[arguments...]")}`);
	console.log();
	console.log("VERSION:");
	console.log(`    ${pkg.version}`);
	console.log();
	console.log("COMMANDS:");
	console.log(`    ${chalk.blue("help, h")}\tShows a list of commands`);
	console.log(`    ${chalk.blue("import, i")}\tImports data from TSV-file`);
	console.log(`    ${chalk.blue("version, v")}\tShows a version`);
}

function versionCommand() {
	console.log(pkg.version);
}

async function importCommand() {
	if ((!options && args.length === 0) || options === "--help") {
		console.log("NAME:");
		console.log(`    ${chalk.bold.blue("import")} - Imports data from TSV-file`);
		console.log();
		console.log("USAGE:");
		console.log(`    cli.js ${chalk.bold.blue("import")} ${chalk.magenta("<path>")}`);
		console.log();
		console.log("ARGUMENTS:");
		console.log(`    ${chalk.magenta("<path>")}\tThe path to the file from which you want to import data in tsv format`);

		return;
	}

	const path = args[0];
	const content = await fs.readFile(resolve(path), {encoding: "utf-8"});
	const lines = content.split(EOL);

	const keys = [
		"title",
		"description",
		"publicationDate",
		"city",
		"preview",
		"images",
		"premium",
		"favourite",
		"rating",
		"housingType",
		"roomCount",
		"guestCount",
		"cost",
		"facilities",
		"author",
		"commentsCount",
		"coordinates",
	];

	for (const line of lines) {
		const values = line.split(/\t/g);

		const offer = Object.fromEntries(keys.map((key, i) => [key, values[i]])) as unknown as IOffer;
		offer.images = (offer.images as unknown as string).split(",") as IOffer["images"];
		offer.facilities = (offer.facilities as unknown as string).split(",") as IOffer["facilities"];
		offer.publicationDate = new Date((offer.publicationDate as unknown as string));
		offer.premium = (offer.premium as unknown as string) === "true";
		offer.favourite = (offer.favourite as unknown as string) === "true";
		offer.rating = parseFloat(offer.rating as unknown as string);
		offer.roomCount = parseInt(offer.roomCount as unknown as string, 10);
		offer.guestCount = parseInt(offer.guestCount as unknown as string, 10);
		offer.cost = parseInt(offer.cost as unknown as string, 10);
		offer.coordinates = function() {
			const [latitude, longitude] = (offer.coordinates as unknown as string).split(",");

			return {latitude: parseFloat(latitude), longitude:parseFloat(longitude)};
		}();

		console.log(JSON.stringify(offer));
	}
}
