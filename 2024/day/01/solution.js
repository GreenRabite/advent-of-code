// Read input from input.txt
const fs = require("fs");
const path = require("path");

// Input file path
const inputFilePath = path.join(__dirname, "input.txt");

// Read input line by line
const inputLines = fs.readFileSync(inputFilePath, "utf8").trim().split("\n");

const solver = (inputLines) => {
  const locationIds = inputLines.map((line) => line.split("   "));
  const leftLocationIds = locationIds.map((location) => location[0]);
  const rightLocationIds = locationIds.map((location) => location[1]);

  const sortedLeftLocationIds = leftLocationIds
    .map((locationId) => Number(locationId))
    .sort();
  const sortedRightLocationIds = rightLocationIds
    .map((locationId) => Number(locationId))
    .sort();

  if (sortedLeftLocationIds.length !== sortedRightLocationIds.length) throw new Error("Lists are not the same length");
  if (sortedLeftLocationIds.length !== 1000) throw new Error("Lists are not the same length");

  const totalDistance = sortedLeftLocationIds.reduce((totalDistance, leftLocationId, index) => {
    const rightLocationId = sortedRightLocationIds[index];
    const distance = Math.abs(rightLocationId - leftLocationId);
    return totalDistance + distance
  }, 0)

  console.log('Part A:', totalDistance);

  const frequencyMap = sortedRightLocationIds.reduce((frequencyMap, rightLocationId) => {
    if(frequencyMap[rightLocationId]) {
      frequencyMap[rightLocationId] += 1;
    }else{
      frequencyMap[rightLocationId] = 1;
    }

    return frequencyMap;
  }, {})

  const totalSimilarityScore =  sortedLeftLocationIds.reduce((totalSimilarityScore, leftLocationId) => {
    return (
      totalSimilarityScore + (leftLocationId * (frequencyMap[leftLocationId] ?? 0))
    );
  }, 0)

  console.log('Part B:', totalSimilarityScore);

  return;
};

solver(inputLines);
