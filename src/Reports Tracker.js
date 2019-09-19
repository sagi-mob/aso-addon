function addToTracker(appName, cCode, os, storeid) {
  if(cCode === '')
    throw new Error("You have to provide Country Code");
  var ss = SpreadsheetApp.getActive();
  var thisId = ss.getId();
  var thisName = ss.getName();
  var date = getDate();
  os = String(os).toLowerCase();
  var lang = getLang(cCode, os);
  
  var tracker = SpreadsheetApp.openById('1CKuPziqcYG44Lo8ge2TL3deg9T_OJMK4nm5B3PZbBvk');
  var sheet = tracker.getSheets()[0];
  var lastRow = sheet.getLastRow();
  var version = getVersion(storeid, lang, os);
  var activeUser = Session.getActiveUser().getEmail();
  sheet.getRange(lastRow + 1, 1, 1, 9).setValues([[thisName, appName, storeid, cCode, os, thisId, getDate(), version, activeUser]]);
  return "Updated";
}

function getDate(){
  var today = new Date();
  var dd = String(today.getDate());
  var mm = String(today.getMonth() + 1); //January is 0!
  var yyyy = today.getFullYear();
  
  return [yyyy,mm,dd].join("-");
}

function getVersion(storeid, lang, os){
  var store = os === 'ios' ? 'appstore-appinfo-v2' : 'playstore-appinfo-v2';
  var url =  'https://api.mobileaction.co/' + store + '/versions/' + [storeid,lang].join('/') + '?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28';
  var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  var obj = JSON.parse(response);
  return (obj["versionDiffs"][0]["currentVersionReleaseDate"]);
}

function getLang(cCode, os){
  if(os == 'android'){
    return cCode == 'us' ? 'en': cCode;
  }
  return cCode;
}