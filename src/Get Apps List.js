function docAppsByOs(os){
  var apps = returnDocApps();
  return apps.filter(function(curr) { return curr['os'].toLowerCase().localeCompare(os) === 0 });
}

function returnDocApps() {
  var properties = getAllProps();
  var allApps = [];
  for (var key in properties) {
    if(key.substr(-2) == "id" && key.substr(-7) != "storeid"){
      var id = key.substr(0,key.length-2);
      allApps.push({
        "mmpid": id,
        "name": properties[key],
        "os": properties[id+"os"],
        "storeid": properties[id+"@storeid"]
      });
    }
  }
  allApps.sort(sortByName);
  return allApps;
}

function getAppsApiList(){
  try{
    var url = 'https://api.mobileaction.co/apps/?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28';
    var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
    return sortAppByOS(JSON.parse(response));
  } catch(e){
    return "Something went wrong trying to fetch data from API, please wait a minute and try again.\nIf the error is not resolved, contact Mobile-Action.";
  }
}

function sortAppByOS(appObj) {
  
  var regex = new RegExp();
  regex = /(?:(\D))/i;
  var ios = [];
  var android = [];
  appObj = appObj["data"];
  
  for (var id in appObj) {
    var appName = appObj[id].appName;
    var mmpId = appObj[id].appId;
    var storeId = id;
    if (regex.test(id)) {
      android.push({
        'name': appName,
        'mmpId': mmpId,
        'storeid': storeId
      });
    } else {
      ios.push({
        'name': appName,
        'mmpId': mmpId,
        'storeid': storeId
      });
    }
  }
  return { "ios": ios.sort(sortByName), "android": android.sort(sortByName) };
};


function sortByName(a, b){
  return a['name'].toLowerCase().localeCompare(b['name'].toLowerCase());
}