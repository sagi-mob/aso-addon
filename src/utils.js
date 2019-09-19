function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function concatArrays(array){
  var arr = array[0];
  for(var i=1; i<array.length; i++){
   arr = arr.concat(array[i]); 
  }
  return arr;
}

function Capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateSheetWithContent(table, sheetName){
  var ss = SpreadsheetApp.getActive();
  var sheet =ss.getActiveSheet();
  if(sheetName != null)
    sheet = ss.getSheetByName(sheetName);
  
  sheet.clear();
  
  var lastRow = table.length;
  var lastColumn = table[0].length;
  sheet.getRange(1,1,lastRow,lastColumn).setValues(table);
  
  return "Data was loaded succefully";
}

function numToChar(num){
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  return alphabet.charAt(num-1);
}


function binarySearch(a, key, comparator){
  key = key.toLowerCase();
  var output = -1;   // default (not found) value
  var found = false;
  var low = 0, high = a.length-1;
  while (low <= high & !found){
    var middle = Math.floor((low+high)/2);
    var val = a[middle].toLowerCase();
    if((comparator != 'undefined' && comparator(key, val) == 0) || val == key){
      output = middle;
      found = true;
    }
    else if ((comparator != 'undefined' && comparator(key, val) < 0) || key < val)
        high = middle-1;
    else if((comparator != 'undefined' && comparator(key, val) > 0) || true)
      low = middle+1;
  }   
  return output;
}