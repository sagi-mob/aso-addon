function highlighter(rangeList, randomColor){
  var sheet = SpreadsheetApp.getActiveSheet();
  var finder = sheet.createTextFinder("Description Link").matchEntireCell(true).findAll();
  var docId = finder[0].getFormula().match(/d\/[\w|\-]+/g)[0].substring(2);
  var ranges = sheet.getRangeList(rangeList).getRanges();
  var words = ranges.reduce(function(acc, range){
    return acc.concat(fromTwoToOne(range.getValues()));
  }, []);
  highlight(words, docId, randomColor);
  
  return "Done.";
}

function fromTwoToOne(twoDim){
  var arr = twoDim.reduce(function(acc, curr){ 
    return acc.concat(curr); 
  }, []); 
   
  return arr;
}

function highlight(words, docId, randomColor) {
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();
  var color = "#FCFC00";
  for(var i=0; i<words.length; i++){
    
    var word = words[i];
    var regex = "(?i)\\b" + word + "\\b";
    var foundElement = body.findText(regex);
    if(randomColor){
      var red = 110 + Math.round(Math.random()*145);
      var green = 125 + Math.round(Math.random()*130);
      var blue = Math.round(Math.random()*150);
      color = rgbToHex(red, green, blue);
    }
    while (foundElement != null) {
      // Get the text object from the element
      var foundText = foundElement.getElement().asText();
      
      // Where in the element is the found text?
      var start = foundElement.getStartOffset();
      var end = foundElement.getEndOffsetInclusive();
      
      // Change the background color to yellow
      
      foundText.setBackgroundColor(start, end, color);
      
      // Find the next match
      foundElement = body.findText(regex, foundElement);

    }
  }
}

function colorRangeToHex(c){
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + colorRangeToHex(r) + colorRangeToHex(g) + colorRangeToHex(b);
}