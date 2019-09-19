

function getTopCellRow(){
 return getScriptProp("row");
}

function getTopCellCol(){
 return getScriptProp("col");
}

function getTopCell(sheet){
  var row = getScriptProp("row");
  var col = getScriptProp("col");
  
  if(row == null | col == null){
    setTopCell();
    var row = getScriptProp("row");
    var col = getScriptProp("col");
  }
  var topCellAddress = numToChar(col).toUpperCase()+row;
  
  if(sheet==null)
    var range = SpreadsheetApp.getActive().getActiveSheet().getRange(topCellAddress);
  else var range = sheet.getRange(topCellAddress);
  return range;
}


function setTopCell(a1Notation){
  
  if(a1Notation == null){
    var ui = SpreadsheetApp.getUi();
    var response = ui.prompt("Please provide the cell location", ui.ButtonSet.OK);
    if(response.getSelectedButton() == "OK")
      var range = SpreadsheetApp.getActive().getRange(response.getResponseText());
    
  } else var range = SpreadsheetApp.getActive().getActiveSheet().getRange(a1Notation);
  
  setScriptProp({"row":range.getRow(),
                                    "col":range.getColumn()});
}
