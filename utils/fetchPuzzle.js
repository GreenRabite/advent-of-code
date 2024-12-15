const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
require("dotenv").config();

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
  .option("force", {
    alias: "f",
    type: "boolean",
    description: "Force overwrite the directory like if there a part 2"
  })
  .help().argv;

// Directory where the file will be written
const directory = `./${argv.year}/day/${String(argv.day).padStart(2, "0")}`;

// Ensure the directory exists
if (!fs.existsSync(directory) || argv.force) {
  fs.mkdirSync(directory, { recursive: true });
} else {
  console.log("Directory already exists - we done here 🦊");
  process.exit(0);
}

const sessionId = process.env.SESSION_ID;
const headers = {
  Cookie: `session=${sessionId}`,
};

axios
  .get(`https://adventofcode.com/${argv.year}/day/${argv.day}`, { headers })
  .then((response) => {
    // Load the HTML into cheerio
    const $ = cheerio.load(response.data);

    // Extract the content inside <main> tags
    const mainContent = $("main").html();

    if (!mainContent) {
      console.log("No <main> tag found in the HTML.");
    }

    // Convert main content to Markdown format
    const mdContent = convertToMarkdown(mainContent);

    // Write to a file
    const fileName = "output.md";
    fs.writeFileSync(path.join(directory, fileName), mdContent, "utf8");
    console.log(`🦊: Main content written to ${fileName}`);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

axios
  .get(`https://adventofcode.com/${argv.year}/day/${argv.day}/input`, { headers })
  .then((response) => {
    const data = response.data;
    const fileName = "input.txt";
    fs.writeFileSync(path.join(directory, fileName), data, "utf8");
    console.log(`🦊: Text file written to ${fileName}`);
  })
  .catch((error) => {
    console.error("Error:", error);
    console.error("Error:", error.message);
  });

// Create Solution File
const broilerplate = `// Read input from input.txt
const fs = require("fs");
const path = require("path");

// Input file path
const inputFilePath = path.join(__dirname, "input.txt");

// Read input line by line
const inputLines = fs.readFileSync(inputFilePath, "utf8").trim().split("\\n");

const solver = (inputLines) => {
  // Your solution code goes here
  return;
}

solver(inputLines);
`;

// Write the solution file if it doesn't exist
if (!fs.existsSync(path.join(directory, "solution.js"))){
  fs.writeFileSync(path.join(directory, "solution.js"), broilerplate, "utf8");
}

// Convert HTML to a simple Markdown format
function convertToMarkdown(html) {
  const $ = cheerio.load(html);

  // Optional: Clean up unwanted tags like <script> or <style>
  $("script, style").remove();

  // Replace <pre><code> with Markdown triple backticks
  $("pre code").each((i, el) => {
    const codeContent = $(el).text(); // Extract the text content
    $(el).replaceWith(`<p>\`\`\`\n${codeContent}\n\`\`\`</p>`); // Replace with Markdown syntax
  });

  // Remove the <pre> tag wrapper, if present
  $("pre").each((i, el) => {
    $(el).replaceWith($(el).html());
  });

  // Process <ul> and <li> into Markdown list format
  $("ul")
    .each((j, ul) => {
      const listItems = $(ul)
        .find("li")
        .map((k, li) => {
          const item = $(li)
            .html()
            .replace(/<code>/g, "`")
            .replace(/<\/code>/g, "`")
            .replace(/<em>/g, "*")
            .replace(/<\/em>/g, "*")
            .replace(/<\/?li>/g, "")
            .trim();
          return `- ${item}`; // Markdown list item
        })
        .get()
        .join("\n");
      $(ul).replaceWith(`<p>${listItems}</p>`); // Replace the <ul> with Markdown list
    });

  // Extract text content from tags
  return $("article.day-desc")
    .map((i, el) => {
      const header = $(el).find("h2").text();
      const paragraphs = $(el)
        .find("p")
        .map((j, p) => $(p).text())
        .get()
        .join("\n\n");

      return `## ${header}\n\n${paragraphs}`;
    })
    .get()
    .join("\n\n");
}
