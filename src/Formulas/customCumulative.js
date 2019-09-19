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
  const checkCriteria =
    criterion != null
      ? encapsulateCriterion(criterion)
      : function(val) {
          return true;
        };
  if (searchRange.length != numericalRange.length) {
    throw new Error('searchRange and numericalRange should be of the same size');
  }
  const arrayOfSum = keywordsRange.map(function(cell) {
    let sum = 0;
    for (let i = 0; i < searchRange.length; i++) {
      const traffic = Number(numericalRange[i]);
      const criterionRangeVal = Number(criterionRange[i]);
      const phrase = searchRange[i].toString();
      const found = phrase.search(new RegExp(`\\b(${cell})\\b`, 'gim')) != -1;
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
  const checkCriteria =
    criterion !== null
      ? encapsulateCriterion(criterion)
      : function(val) {
          return true;
        };
  let sum = 0;
  for (let i = 0; i < searchCol.length; i++) {
    const traffic = Number(sumCol[i]);
    const phrase = searchCol[i].toString();
    const found = phrase.search(new RegExp(`\\b(${cell})\\b`, 'gim')) != -1;
    sum += checkCriteria(traffic) && found ? traffic : 0;
  }
  return sum;
}

function encapsulateCriterion(criterion) {
  const allCriterions = criterion.split(/&/gim).map(function(curr) {
    const trimmed = curr.trim();
    const criteriaSplit = trimmed.search(/[0-9]/gi);
    return {
      criteria: trimmed.substring(0, criteriaSplit),
      number: Number(trimmed.substring(criteriaSplit))
    };
  });

  return function(val) {
    return allCriterions.reduce(function(acc, curr) {
      const { criteria } = curr;
      const { number } = curr;

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
