function getFilename(){
  var spname = SpreadsheetApp.getActive().getName();
 return spname.substring(0, spname.search(/\W/g));
}

function multiplication(mults, toFile, toSheet){
  var ss = SpreadsheetApp.getActive();
  mults = parseMults(mults);
  var keywords = getKeywords(ss);
  var hash = multiply(mults, keywords);
  var headers = mults.map(function(curr){ 
    return curr.join("*").toLowerCase(); 
  }).sort();
  
  if(toSheet) { multToSheet(ss, hash, mults.length, headers); };
  if(toFile) { return multToFile(hash, headers); };
  
}


function multToFile(hash, headers){
  var flattened = headers.reduce(function(acc, curr){
    return acc.concat(hash[curr]);
  },[]);
  
  var arr = flattened.filter(function(curr, i){
    return flattened.indexOf(curr) === i;
  });
  
  return { 'name': getFilename(),
          'text': arr.join('\n')};
}

function multToSheet(ss, hash, numOfCols, headers){
  setSheets(ss);
  var sheet = ss.getSheetByName("Multiplications");
  
  var longestArr = 0;
  for(var key in hash){
    longestArr = hash[key].length > longestArr ? hash[key].length : longestArr;
  }
  
  var res = arrangeResult(longestArr, headers, hash);
  sheet.clear();
  var sheet = ss.getSheetByName("Multiplications");
  var lastCol = sheet.getLastColumn();
  sheet.getRange(1, 1, longestArr+1, numOfCols).setValues(res);
  sheet.createTextFinder("undefined").replaceAllWith("");
}

function arrangeResult(longestArr, headers, hash){
  var table = [headers.map(function(curr){ return curr.toUpperCase() })];
  for(var i=0; i<longestArr; i++){
    var row = [];
    for(var el=0; el<headers.length; el++){
      var key = headers[el].toLowerCase();
      row.push(hash[key][i] == "undefined" ? new String() : hash[key][i]);
    }
    table.push(row);
  }
  return table;
}

function incLength(a, b){
    return a.length-b.length;
}

function decsLength(a, b){
    return b.length-a.length;
}

function setSheets(ss){
  var keysSheet = ss.getSheetByName("Words");
  if(keysSheet == null)
    throw Error('No Keywords Sheet to generate multiplications');
  
  var multSheet = ss.getSheetByName("Multiplications");
  if(multSheet == null)
    ss.insertSheet("Multiplications");
}

function multiply(mults, keywords){
  var hash = hashInit(keywords);
  mults.forEach(function(mult){
    var str = mult.join("*");
    var hashKeys = Object.keys(hash).sort(decsLength);
    var arr = optimizeLists(str, hashKeys, this, []);
    var zipped = specialZip(arr);
    this[str] = zipped;
    //assume no repetitions of formulas (only one occurence for each formula)
    
  }, hash);
  return hash;
}

function fromRowToCol(row){
  var arr = [];
  row.forEach(function(curr){
    this.push([curr]);
  }, arr);
  return arr;
}
function optimizeLists(str, hashKeys, hash, optimizedArray){
//  Logger.log("Hash: " + Object.keys(hash));
//  Logger.log("Formula: " + str);
  var arr = new Array(str.replace(/\*/g,"").length);
  for(var i=0; i<hashKeys.length && str.match(/\w/g) != null; i++){
    var ind = str.indexOf(hashKeys[i]);
//    Logger.log(ind);
    if(ind != -1){
      var ind = str.indexOf(hashKeys[i]); //for now it doesn't support formulas that conatin words
      var astInHash = hashKeys[i].match(/\*/g);
      var numOfCellsToRemove = astInHash != null ? hashKeys[i].length - astInHash.length : hashKeys[i].length;
      var numOfAstToInd = str.substring(0,ind).match(/\*/g) != null ? str.substring(0,ind).match(/\*/g).length : 0;
      var from = ind - numOfAstToInd;
      var to = from + numOfCellsToRemove;
      var toConcat = hash[hashKeys[i]] === null ? [] : hash[hashKeys[i]];
      arr = arr.slice(0,from).concat([toConcat]).concat(arr.slice(to));
      var escapeAstrix = hashKeys[i].replace(/\*/g, "\\*");
      var regex = new RegExp('('+escapeAstrix+')');
      str = str.replace(regex,"@");
//      Logger.log("Formula: " + str);
    }
  }
  return arr;
}


function hashInit(keywords){
  var hash = new Object();
  for(var i=0; i<keywords.length; i++){
    hash[String.fromCharCode(i+97)] = keywords[i];
  }
  return hash;
}

function zipArray(arr1, arr2){
  if(arr1.length === 0 && arr2.length != 0) return arr2;
  else if(arr1.length != 0 && arr2.length === 0) return arr1;
  var zipped = [];
  for(var i=0; i<arr1.length; i++){
    for(var j=0; j<arr2.length; j++){
      zipped.push(arr1[i] + " " + arr2[j]);
    }
  }
  return zipped;
}

function specialZip(twoDimArr){
  if(twoDimArr.length === 0) return [];
  else if(twoDimArr.length === 1) return twoDimArr[0];
  else if(twoDimArr.length === 2) return zipArray(twoDimArr[0], twoDimArr[1]);
  else return zipArray(specialZip(twoDimArr.slice(0, twoDimArr.length/2)),
                       specialZip(twoDimArr.slice(twoDimArr.length/2)));
}

function parseMults(mults){
  var res = [];
  mults.forEach(function(curr){
    if(!curr==""){
      var newVal = curr.toLowerCase().split("*");
      res.push(newVal);
    }
  });
  return res.sort(incLength);
}

function getKeywords(ss){
//  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getActiveSheet();
//  var sheet= ss.getSheetByName("Words");
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var wordsArr = sheet.getSheetValues(1, 1, lastRow, lastCol);
  var cols = [];
  for(var col=0; col<lastCol; col++){
    var nextCol = [];
    for(var row=1; row<lastRow; row++){
      if(wordsArr[row][col] != "")
        nextCol.push(wordsArr[row][col])
        }
    cols.push(nextCol);
  }
  return cols;
}

