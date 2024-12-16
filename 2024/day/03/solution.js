// Read input from input.txt
const fs = require("fs");
const path = require("path");

// Input file path
const inputFilePath = path.join(__dirname, "input.txt");

// Read input line by line
const inputLines = fs.readFileSync(inputFilePath, "utf8").trim().split("\n");

const isValid = (index, validCommandsIndices) => {
  return validCommandsIndices.some(([start, end]) => {
    if (index >= start && index <= end) {
      return true;
    }else{
      return false;
    }
  })
};

const solver = (inputLines) => {
  const textString = inputLines.join("");

  // Regex to match all the mul(xxx,xxx) expressions where xxx is a number 1-3 digits long
  const regexMatch = new RegExp(/mul\(\d{1,3},\d{1,3}\)/, "g");
  const matches = textString.matchAll(regexMatch);
  const matchesArray = [...matches].map((match) => {
    return { expression: match[0], index: match.index };
  });
  // mul(602,165);
  const result = matchesArray
    .map((x) => x.expression)
    .reduce((acc, match) => {
      const [valueA, valueB] = match
        .slice(4, match.length - 1)
        .split(",")
        .map(Number);
      return acc + valueA * valueB;
    }, 0);

  console.log("Part A:", result);
  // 184511516;

  const doFunction = new RegExp(/do\(\)/, "g");
  const dontFunction = new RegExp(/don\'t\(\)/, "g");

  const preciseDoResult = textString.matchAll(doFunction);
  const doFunctionIndex = [...preciseDoResult].map((x) => ({
    state: "do",
    index: x.index,
  }));

  const preciseDontResult = textString.matchAll(dontFunction);
  const dontFunctionIndex = [...preciseDontResult].map((x) => ({
    state: "dont",
    index: x.index,
  }));

  const orderOfExecution = [...doFunctionIndex, ...dontFunctionIndex].sort(
    (a, b) => a.index - b.index
  );

  let isInitialIndexSet;
  let initialIndex;
  let isEnabled;
  const validCommandsIndices = orderOfExecution.reduce((tuples, command, idx) => {
    if (!isInitialIndexSet) {
      isInitialIndexSet = true
      initialIndex = 0;
      isEnabled = true;
    }

    if (!isEnabled && command.state === "do") {
      initialIndex = command.index;
      isEnabled = true;
    }else if(isEnabled && command.state === "dont"){
      isEnabled = false;
      tuples.push([initialIndex, command.index]);
    }

    if (isEnabled && idx === orderOfExecution.length - 1) {
      tuples.push([initialIndex, textString.length]);
    }

    return tuples;
  }, []);

  console.log({ validCommandsIndices });


  const accurateResults = matchesArray.reduce((total, command) => {
    const commandIsValid = isValid(command.index, validCommandsIndices);

    if (commandIsValid) {
      const [valueA, valueB] = command.expression
        .slice(4, command.expression.length - 1)
        .split(",")
        .map(Number);
      return total + (valueA * valueB);
    } else {
      return total;
    }
  },0);

  console.log("Part B:", accurateResults);
  // 88501145; low
  
  return;
};

solver(inputLines);
