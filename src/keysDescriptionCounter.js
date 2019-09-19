function WORDCOUNTER(wordsRange, outputRange) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var finder = sheet.createTextFinder("Description Link").matchEntireCell(true).findAll();
  var docId = finder[0].getFormula().match(/d\/[\w|\-]+/g)[0].substring(2);
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody().getText();
  
  var words = fromTwoToOne(sheet.getRange(wordsRange).getValues());
  if(words.length != sheet.getRange(outputRange).getValues().length || !isSameStartRow(wordsRange, outputRange)){
    return "Keywords range doesn't match Output range.\nCould be that the size is different, or the range rows are not correlated";
  }
  var output = [];
  for(var i=0; i<words.length; i++){
    var matches = body.match(new RegExp('\\b'+words[i]+'\\b','gmi'));
    output.push(matches ? [matches.length] : [0]);
  }
  
  sheet.getRange(outputRange).setValues(output); 
}

function isSameStartRow(wordsRange, outputRange){
  return wordsRange.match(/[0-9]+/g)[0] == outputRange.match(/[0-9]+/g)[0];
}
