import { flatten, map } from 'ramda';

function isSameStartRow(wordsRange, outputRange) {
  return wordsRange.match(/[0-9]+/g)[0] === outputRange.match(/[0-9]+/g)[0];
}

const wordCounter = (wordsRange, outputRange) => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const finder = sheet
    .createTextFinder('Description Link')
    .matchEntireCell(true)
    .findAll();
  const docId = finder[0]
    .getFormula()
    .match(/d\/[\w|-]+/g)[0]
    .substring(2);
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody().getText();

  const words = flatten(sheet.getRange(wordsRange).getValues());
  if (
    words.length !== sheet.getRange(outputRange).getValues().length ||
    !isSameStartRow(wordsRange, outputRange)
  ) {
    return "Keywords range doesn't match Output range.\nCould be that the size is different, or the range rows are not correlated";
  }
  const output = map(word => {
    const matches = body.match(new RegExp(`\\b${word}\\b`, 'gmi'));
    return matches ? [matches.length] : [0];
  }, words);

  sheet.getRange(outputRange).setValues(output);

  return 'Counting Done.';
};

export default wordCounter;
