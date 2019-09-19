function addNewDateWithStableCol(){
  insertEmptyColBeforeLast("Sheet1")
  addNewDate("","");
}

function addNewDate(country, date, col){
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var keywordsTableNotation = getKeywordsTableRange(sheet);
  var keywordsTableRange = sheet.getRange(keywordsTableNotation);
  
  var dataTable = keywordsTableRange.getValues();
  
  var apiSheet = ss.getSheetByName(getAPISheet());
//  var apiTableFirstCol = apiSheet.getRange("A:A").getValues().join().split(",");
//  var apiKeywordsList = apiTableFirstCol.splice(1, apiTableFirstCol.indexOf("")-1);
  var apiKeywordsList = getData(country, date, 1, 1).join().split(",").splice(1);
    
  if(date == null || date.length == 0)
    date = new Date();
  
  var newDateRanks = getData(country, date, 5, 5).join().split(",").splice(1);
      
  var newRankings = [[date]];
  for(var i=1; i<dataTable.length; i++){
    var key = dataTable[i][0];
    var keyRow = getKeyRow(key, apiKeywordsList);
    
    var rank = newDateRanks[keyRow-2];
    newRankings.push([rank]);
  }
  
 if(col == null)
    var col = keywordsTableRange.getLastColumn()+1;
  else
    sheet.insertColumnBefore(col);
  var colRange = sheet.getRange(Number(getTopCellRow()), col, dataTable.length, 1);
  colRange.setValues(newRankings);
}


function getKeyRow(key, arr){
  var keyRow = binarySearch(arr,key)+2;
  return keyRow;
}

function insertEmptyColBeforeLast(name){
  var sheet = SpreadsheetApp.getActive().getSheetByName(name);
  var col = getLastCol(sheet);
  sheet.insertColumnBefore(col);
}

//if no col given, returning the last column
function getColRange(sheet, row, col){
  if(col == null){
    var lastColInd = getLastCol(sheet)+1;
    var colRange = numToChar(lastColInd);
  } else var colRange = numToChar(col);
  
  return sheet.getRange(colRange+row+":"+colRange+(sheet.getLastRow()+row-1));
  
}


function getKeywordsTableRange(sheet){
  var topCellCol = getTopCellCol();
  var firstColChar = numToChar(topCellCol);
  var wholeCol = firstColChar+":"+firstColChar;
  
  var topCellRow = getTopCellRow();
  var wholeRow = topCellRow+":"+topCellRow;
  
  var firstRow = sheet.getRange(wholeRow).getValues()[0];
  var lastCol = firstRow.indexOf("", topCellCol-1);
  var lastColChar = numToChar(lastCol);
  
  var firstCol = sheet.getRange(wholeCol).getValues().join().split(",");
  var lastRow = firstCol.indexOf("", topCellRow-1);
  
  var range = firstColChar+topCellRow+":"+lastColChar+lastRow;
  return range;
}

function getLastCol(sheet){
  var row = getTopCellRow()+":"+getTopCellRow();
  var topRow = sheet.getRange(row).getValues()[0];
  return topRow.indexOf("");
}






