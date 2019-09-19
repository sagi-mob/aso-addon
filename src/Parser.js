function jsonToTable(response, startInd, endInd, date){
  var dataObj = response.data;
  var table = [];
  var row = [];
  
  for (key in dataObj[0]){
    if(!key.equals("rank"))
      row.push(Capitalize(key).split(/(?=[A-Z])/).join(" "));
    else if(date.length == 0)
      row.push(new Date());
    else row.push(date);
  }
  
  table.push(row.slice(startInd-1, endInd-1));
  
  for(var i=0; i<dataObj.length; i++){
    row = [];
    var keyword = dataObj[i];
    for (key in keyword)
      row.push(keyword[key]);
    table.push(row.slice(startInd-1, endInd-1));
  }
  return table;
}

