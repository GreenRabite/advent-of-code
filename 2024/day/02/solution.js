// Read input from input.txt
const fs = require("fs");
const path = require("path");

// Input file path
const inputFilePath = path.join(__dirname, "input.txt");

// Read input line by line
const inputLines = fs.readFileSync(inputFilePath, "utf8").trim().split("\n");

const withinRange = (report) => {
  return report.every((value, idx) =>{
      if (idx === report.length - 1) return true;
      const diff = Math.abs(value - report[idx + 1]);
      return diff < 4 && diff > 0;
    });
};

const allAscending = (report) => {
  return report.every((level, idx) => {
    if (idx === report.length - 1) return true;
    return level < report[idx + 1];
  });
}

const allDescending = (report) => {
  return report.every((level, idx) => {
    if (idx === report.length - 1) return true;
    return level > report[idx + 1];
  });
}

const isSafe = (report) => {
  const safeDirection = allAscending(report) || allDescending(report);
  const withRange = withinRange(report);
  return safeDirection && withRange;
}

const isSafeWithOneRemoved = (report) => {
  const alreadySafe = isSafe(report);
  if(alreadySafe) return true;
  
  return report.some((value, idx) => {
    const shallowReport = report.slice();
    shallowReport.splice(idx, 1);
    if (isSafe(shallowReport)) return true;

    return false
  });
}

const solver = (inputLines) => {
  const reports = inputLines.map((line) =>
    line.split(" ").map((value) => parseInt(value))
  );

  // Good Report = All increasing or decreasing && each increment is between 1 or 3
  const goodReports = reports.filter(isSafe);

  console.log("Part A:", goodReports.length);
  // 631

  // Good Report = All increasing or decreasing && each increment is between 1 or 3, we can remove one
  const goodReportsWithOneRemoved = reports.filter(isSafeWithOneRemoved);
  console.log("Part B:", goodReportsWithOneRemoved.length);

  return;
}

solver(inputLines);
