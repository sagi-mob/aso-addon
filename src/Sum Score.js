/**
* For each cell in {searchCol} that contains the cell content, it adds
* the correspond value from the same row in {sumCol}
* {criterion} is optional if want to add a condition the the {sumCol} value also need to fullfill.
* @param {cell} input a cell.
* @param {keysRange} input The column to check and iterate over.
* @param {scoreRange} input The correspond column from which we add to sum.
* @return The sum of all cells that met the requirements.
* @customfunction
*/
function SUMSCORE(cell, keysRange, scoreRange) {
  if(keysRange.length != scoreRange.length)
    throw Error("Keywords Range and Score range don't match");
  var sum = keysRange.reduce(function(acc, curr, ind){
    if(String(cell).search(new RegExp("\\b" + curr + "\\b","gim")) !== -1){
      return acc + Number(scoreRange[ind]);
    }
    return acc;
  }, 0);
  return sum;
}


