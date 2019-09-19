function customOnEdit(e){
  // Set a comment on the edited cell to indicate when it was changed.
  var range = e.range;
  var rangeCol = range.getColumn();
  var rangeRow = range.getRow();
  
  //check if it's even relevant to continue the algorithm by sheet
  var sheet = e.range.getSheet();
  var sheetName = sheet.getName();
  
  if(!(range.getValue() instanceof Date)) return ;
  else{
    var date = formatDateObj(range.getValue().toString());
    addNewDate("",date, rangeCol);
  }
  
}

function formatDateObj(date){
  var d = new Date(date);
  var month = '' + (d.getMonth() + 1);
  var day = '' + d.getDate();
  var year = d.getFullYear();
  
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  
  return [year, month, day].join('-');
  
}


