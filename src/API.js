function refreshApiData(country, date, os, sheetName, appId, startCol, endCol){
  if(country === '')
    throw Error("Please provide country code");
  var table = getData(country, date, appId, startCol, endCol);
  updateSheetWithContent(table, sheetName);
  
}


function getData(pCountry, pDate, appId, statrInd, endInd){ //lower 'p' stands for "parameter"  
  // --------- Validating parameters --------
  var date="", country="US";
  
  if(pDate!=null && pDate.length > 0)
    date = "&date=" + pDate;
  
  if(pCountry!=null && pCountry.length!=0)
    country = pCountry;
  
  // ------ Sending a request -----------
  var url = 'https://api.mobileaction.co/keywords/'+ appId +'/' + country
  + '?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28' + date;
  try{ var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true}); } 
  catch(e) { throw Error ("Failed to fetch data from Mobile Action."); }
  
  var parsed = JSON.parse(response);
  if(parsed['data'].length === 0){ throw Error("No data in Mobile Action for this app/country"); }
  else { return jsonToTable(parsed,statrInd,endInd+1, pDate); }
}
