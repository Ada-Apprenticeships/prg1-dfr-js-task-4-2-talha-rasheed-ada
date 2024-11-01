const fs = require("fs");

function fileExists(filename) {
 return fs.existsSync(filename);
}

// Checks if value is a valid number
function validNumber(value) {
 if (typeof value === 'number') return true;
 if (typeof value !== 'string') return false;
 return /^-?\d*\.?\d+$/.test(value);
}

// Returns the dimensions of the dataframe
function dataDimensions(dataframe) {
 if (dataframe === undefined || dataframe === "" || dataframe.length === 0) {
  return [-1, -1];
 }
 const rows = dataframe.length;
 const cols = Array.isArray(dataframe[0]) ? dataframe[0].length : -1;
 return [rows, cols];
}

// Calculates the sum of number values in the dataset
function findTotal(dataset) {
 if (dataDimensions(dataset)[1] !== -1 || dataset.length === 0) {
  return 0;
 }
 let total = 0;
 for (let i = 0; i < dataset.length; i++) {
  if (validNumber(dataset[i])) {
   total += parseFloat(dataset[i]);
  }
 }
 return total;
}

// Calculates the average of the number values
function calculateMean(dataset) {
 if (dataDimensions(dataset)[1] !== -1 || dataset.length === 0) {
  return 0;
 }
 let sum = 0;
 let count = 0;
 for (let i = 0; i < dataset.length; i++) {
  if (validNumber(dataset[i])) {
   sum += parseFloat(dataset[i]);
   count++;
  }
 }
 return count > 0 ? sum / count : 0;
}

// Calculates the median of the number values
function calculateMedian(dataset) {
 if (dataDimensions(dataset)[1] !== -1 || dataset.length === 0) {
  return 0;
 }
 // Sorts only numeric values in ascending order and gets the middle index
 const validNumbers = dataset.filter(validNumber).map(Number).sort((a, b) => a - b);
 const mid = Math.floor(validNumbers.length / 2);
 return validNumbers.length % 2 === 0
  ? (validNumbers[mid - 1] + validNumbers[mid]) / 2
  : validNumbers[mid];
}

// Converts values to numbers and returns successful conversions
function convertToNumber(dataframe, col) {
 let count = 0;
 if (dataframe === undefined || dataframe.length === 0) {
  return 0;
 }
 for (let i = 0; i < dataframe.length; i++) {
  if (dataframe[i][col] && validNumber(dataframe[i][col])) {
   dataframe[i][col] = parseFloat(dataframe[i][col]);
   count++;
  }
 }
 return count;
}

// Flattens dataframe into a 1D array
function flatten(dataframe) {
 if (dataDimensions(dataframe)[1] !== 1 || dataframe.length === 0) {
  return [];
 }
 return dataframe.map(row => row[0]);
}

// Loads CSV file into a dataframe so that rows and columns can be filtered
function loadCSV(csvFile, ignoreRows = [], ignoreCols = []) {
 if (!fileExists(csvFile)) {
  return [[], -1, -1];
 }
 const data = fs.readFileSync(csvFile, 'utf-8')
  .split('\n')
  .map(row => row.split(','));
 const totalRows = data.length;
 const totalCols = data[0].length;
 const dataframe = data
  .filter((_, rowIndex) => !ignoreRows.includes(rowIndex))
  .map(row => row.filter((_, colIndex) => !ignoreCols.includes(colIndex)));
 return [dataframe, totalRows, totalCols];
}

// Extracts the specific rows that match to specific columns and is stored in an empty array
function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {
  const result = [];
  if (dataframe === undefined || dataframe.length === 0) {
    return [];
  }
  for (const row of dataframe) {
    if (pattern === '*' || row[columnIndex] === pattern) {
      if (exportColumns.length === 0) {
        result.push([...row]);
      } else {
        const newRow = [];
        for (const colIndex of exportColumns) {
          if (colIndex < row.length) {
            newRow.push(row[colIndex]);
          }
        }
        result.push(newRow);
      }
    }
  }
  return result;
}

module.exports = {
  fileExists,
  validNumber,
  dataDimensions,
  calculateMean,
  findTotal,
  convertToNumber,
  flatten,
  loadCSV,
  calculateMedian,
  createSlice,
};