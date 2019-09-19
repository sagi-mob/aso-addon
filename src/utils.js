function concatArrays(array) {
  let arr = array[0];
  for (let i = 1; i < array.length; i++) {
    arr = arr.concat(array[i]);
  }
  return arr;
}

function Capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateSheetWithContent(table, sheetName) {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getActiveSheet();
  if (sheetName != null) sheet = ss.getSheetByName(sheetName);

  sheet.clear();

  const lastRow = table.length;
  const lastColumn = table[0].length;
  sheet.getRange(1, 1, lastRow, lastColumn).setValues(table);

  return 'Data was loaded succefully';
}

function numToChar(num) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return alphabet.charAt(num - 1);
}

function binarySearch(a, key, comparator) {
  key = key.toLowerCase();
  let output = -1; // default (not found) value
  let found = false;
  let low = 0;
  let high = a.length - 1;
  while ((low <= high) & !found) {
    const middle = Math.floor((low + high) / 2);
    const val = a[middle].toLowerCase();
    if ((comparator != 'undefined' && comparator(key, val) == 0) || val == key) {
      output = middle;
      found = true;
    } else if ((comparator != 'undefined' && comparator(key, val) < 0) || key < val)
      high = middle - 1;
    else if ((comparator != 'undefined' && comparator(key, val) > 0) || true) low = middle + 1;
  }
  return output;
}
