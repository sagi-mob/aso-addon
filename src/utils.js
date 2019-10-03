const include = filename => HtmlService.createHtmlOutputFromFile(filename).getContent();
const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const numToChar = (num) => 'abcdefghijklmnopqrstuvwxyz'.charAt(num - 1);

function binarySearch(a, key, comparator) {
  let output = -1; // default (not found) value
  let low = 0;
  let high = a.length - 1;
  while ((low <= high)) {
    const middle = Math.floor((low + high) / 2);
    const val = a[middle];
    if ((comparator != 'undefined' && comparator(key, val) == 0) || val == key) {
      return middle;
    } else if ((comparator != 'undefined' && comparator(key, val) < 0) || key < val)
      high = middle - 1;
    else if ((comparator != 'undefined' && comparator(key, val) > 0) || true) low = middle + 1;
  }
  return output;
}

export { include, capitalize, numToChar, binarySearch }

