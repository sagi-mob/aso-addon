function updateTopRankings(){
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var tops = {"top5":{"count":0,
                      "traffic":0},
              "top10":{"count":0,
                       "traffic":0},
              "top25":{"count":0,
                       "traffic":0},
              "top50":{"count":0,
                       "traffic":0},
              "top200":{"count":0,
                        "traffic":0}};
  var startRow = 16;
  for(var row=startRow; row<startRow+lastRow; row++){
    var rank = sheet.getRange(row, lastCol-1).getValue();
    var traffic = sheet.getRange(row, 2).getValue();
    
    if(rank>0){
      if(rank<5){
        tops["top5"].count++;
        tops["top5"].traffic += traffic;
      } else if (rank<10){
        tops["top10"].count++;
        tops["top10"].traffic += traffic;
      } else if (rank<25){
        tops["top25"].count++;
        tops["top25"].traffic += traffic;
      } else if (rank<50){
        tops["top50"].count++;
        tops["top50"].traffic += traffic;
      } else if (rank<200){
        tops["top200"].count++;
        tops["top200"].traffic += traffic;
      }
    }
  }
  
  return {"topRankings": rankingCol,
          "topTraffic": trafficCol};
}

function setTopRankings(){
  var tops = updateTopRankings();
  return [[tops.top5.count], [tops.top10.count], [tops.top25.count], [tops.top50.count], [tops.top200.count]]
}

function setTopTraffic(){
  var tops = updateTopRankings();
  return [[tops.top5.traffic], [tops.top10.traffic], [tops.top25.traffic], [tops.top50.traffic], [tops.top200.traffic]]
}

function setTopTable(cellA1Notation){
  var cell = SpreadsheetApp.getActive().getSheetByName(name).getRange(cellA1Notation).setValue(setTopRankings());
}

