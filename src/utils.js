const include = filename => HtmlService.createHtmlOutputFromFile(filename).getContent();
const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const numToChar = (num) => 'abcdefghijklmnopqrstuvwxyz'.charAt(num - 1);

export { include, capitalize, numToChar }
// function binarySearch(a, key, comparator) {
//   key = key.toLowerCase();
//   let output = -1; // default (not found) value
//   let found = false;
//   let low = 0;
//   let high = a.length - 1;
//   while ((low <= high) & !found) {
//     const middle = Math.floor((low + high) / 2);
//     const val = a[middle].toLowerCase();
//     if ((comparator != 'undefined' && comparator(key, val) == 0) || val == key) {
//       output = middle;
//       found = true;
//     } else if ((comparator != 'undefined' && comparator(key, val) < 0) || key < val)
//       high = middle - 1;
//     else if ((comparator != 'undefined' && comparator(key, val) > 0) || true) low = middle + 1;
//   }
//   return output;
// }
