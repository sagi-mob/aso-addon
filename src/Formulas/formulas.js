function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
/**
 * For each cell in {searchCol} that contains the cell content, it adds
 * the correspond value from the same row in {sumCol}
 * {criterion} is optional if want to add a condition the the {sumCol} value also need to fullfill.
 * @param {keywordsRange} input The column to check and iterate over.
 * @param {searchRange} input The column to check and iterate over.
 * @param {numericalRange} input The correspond column from which we add to sum.
 * @param {criterionRange} input An optional field - range to check the criterion on.
 * @param {criterion} input An optional field - adding a constraint on {criterionCol} values.
 * @return The sum of all cells that met the requirements.
 * @customfunction
 */
function SUMIFALL(keywordsRange, searchRange, numericalRange, criterionRange, criterion) {
  var checkCriteria =
    criterion != null
      ? encapsulateCriterion(criterion)
      : function(val) {
          return true;
        };
  if (searchRange.length != numericalRange.length) {
    throw new Error('searchRange and numericalRange should be of the same size');
  }
  var arrayOfSum = keywordsRange.map(function(cell) {
    var sum = 0;
    for (var i = 0; i < searchRange.length; i++) {
      var traffic = Number(numericalRange[i]);
      var criterionRangeVal = Number(criterionRange[i]);
      var phrase = searchRange[i].toString();
      var escapedCell = escapeRegExp(cell); // function can be found in utils.js
      var found = phrase.search(new RegExp('\\b('+escapedCell+')\\b', 'gim')) != -1;
      sum += checkCriteria(criterionRangeVal) && found ? traffic : 0;
    }
    return sum;
  });
  return arrayOfSum;
}

/**
 * For each cell in {searchCol} that contains the word {cell} content
 * adds the correspond value from the same row in {sumCol}
 * {criterion} is optional if want to add a condition the the {sumCol} value also need to fullfill.
 * @param {cell} A cell that contains the word to be searched.
 * @param {searchCol} input The column to check and iterate over.
 * @param {sumCol} input The correspond column from which we add to sum.
 * @param {criterion} input An optional field - adding a constraint on {sumCol} values.
 * @return The sum of all cells that met the requirements.
 * @customfunction
 */
function SUMIFREGEX(cell, searchCol, sumCol, criterion) {
  var checkCriteria =
    criterion !== null
      ? encapsulateCriterion(criterion)
      : function(val) {
          return true;
        };
        var sum = 0;
  for (var i = 0; i < searchCol.length; i++) {
    var traffic = Number(sumCol[i]);
    var phrase = searchCol[i].toString();
    var escapedCell = escapeRegExp(cell); // function can be found in utils.js
    var found = phrase.search(new RegExp('\\b('+escapedCell+')\\b', 'gim')) != -1;
    sum += checkCriteria(traffic) && found ? traffic : 0;
  }
  return sum;
}

/**
* For each cell in {keysRange} that contains the cell content, it adds
* the correspond value from the same row in {scoreRange}
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
    var escapedCurr = escapeRegExp(curr); // function can be found in utils.js
    if(String(cell).search(new RegExp("\\b" + escapedCurr + "\\b","gim")) !== -1){
      return acc + Number(scoreRange[ind]);
    }
    return acc;
  }, 0);
  return sum;
}


function encapsulateCriterion(criterion) {
  var allCriterions = criterion.split(/&/gim).map(function(curr) {
    var trimmed = curr.trim();
    var criteriaSplit = trimmed.search(/[0-9]/gi);
    return {
      criteria: trimmed.substring(0, criteriaSplit),
      number: Number(trimmed.substring(criteriaSplit))
    };
  });

  return function(val) {
    return allCriterions.reduce(function(acc, curr) {
      var criteria = curr.criteria;
      var number = curr.number;

      return (
        acc &&
        (criteria === '='
          ? val == number
          : criteria === '<'
          ? val < number
          : criteria === '>'
          ? val > number
          : criteria === '<='
          ? val <= number
          : criteria === '>='
          ? val >= number
          : criteria === '<>'
          ? val !== number
          : true)
      );
    }, true);
  };
}

/**
 * For each cell in {searchCol} that contains the cell content, it adds
 * the correspond value from the same row in {sumCol}
 * {criterion} is optional if want to add a condition the the {sumCol} value also need to fullfill.
 * @param {keywordsRange} input The column to check and iterate over.
 * @param {searchRange} input The column to check and iterate over.
 * @return The sum of all cells that met the requirements.
 * @customfunction
 */
function COUNTIFRANGE(keywordsRange, searchRange, criterionRange, criterion) {
  var checkCriteria =
    criterion != null
      ? encapsulateCriterion(criterion)
      : function(val) {
          return true;
        };
  var arrayOfCounts = keywordsRange.map(function(cell) {
    var counter = 0;
    for (var i = 0; i < searchRange.length; i++) {
      var criterionRangeVal = criterionRange ? criterionRange[i] : 0 ;
      var phrase = searchRange[i].toString();
      var escapedCell = escapeRegExp(cell.toString()); // function can be found in utils.js
      var found = phrase.search(new RegExp('\\b('+escapedCell+')\\b', 'gim')) != -1;
      counter += checkCriteria(criterionRangeVal) && found ? 1 : 0;
    }
    return counter;
  });
  return arrayOfCounts;
}

/**
 * @param {cell} input The column to check and iterate over.
 * @param {searchRange} input The column to check and iterate over.
 * @return The number of all cells the {cell} is a substring of.
 * @customfunction
 */
function COUNTIFCELL(cell, searchRange) {
    var counter = 0;
    var escapedCell = escapeRegExp(cell.toString()); // function can be found in utils.js
    for (var i = 0; i < searchRange.length; i++) {
      var phrase = searchRange[i].toString();
      var found = phrase.search(new RegExp('\\b'+escapedCell+'\\b', 'gim')) != -1;
      counter += found ? 1 : 0;
    }
    return counter;
}
