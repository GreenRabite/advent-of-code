const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
require("dotenv").config();
const { exec } = require("child_process");

const argv = yargs(hideBin(process.argv))
  .option("year", {
    alias: "y",
    type: "string",
    description: "Year of the puzzle",
    demandOption: true,
  })
  .option("day", {
    alias: "d",
    type: "string",
    description: "Day of the puzzle",
    demandOption: true,
  })
  .help().argv;

// Directory where the file will be written
const directory = `./${argv.year}/day/${String(argv.day).padStart(2, "0")}`;

command = `node ${directory}/solution.js`;

// Execute the command
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Standard Error: ${stderr}`);
        return;
    }
    console.log(`Output:\n${stdout}`);
});