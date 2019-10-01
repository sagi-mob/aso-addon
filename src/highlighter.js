import { flatten, reduce, forEach } from 'ramda';

const colorRangeToHex = c => {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

const rgbToHex = ([r, g, b]) => {
  return `#${colorRangeToHex(r)}${colorRangeToHex(g)}${colorRangeToHex(b)}`;
};

const randomRgbVals = () => {
  const r = 110 + Math.round(Math.random() * 145);
  const g = 125 + Math.round(Math.random() * 130);
  const b = Math.round(Math.random() * 150);
  return [r, g, b];
};

const markerCtor = (body, randomColor) => word => {
  const color = !randomColor ? '#FCFC00' : rgbToHex(randomRgbVals());
  const regex = `(?i)\\b${word}\\b`;
  let foundElement = body.findText(regex);

  while (foundElement != null) {
    // Get the text object from the element
    const foundText = foundElement.getElement().asText();

    // Where in the element is the found text?
    const start = foundElement.getStartOffset();
    const end = foundElement.getEndOffsetInclusive();

    // Change the background color to predefined color
    foundText.setBackgroundColor(start, end, color);

    // Find the next match
    foundElement = body.findText(regex, foundElement);
  }
};

const highlight = (words, docId, randomColor) => {
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();
  const marker = markerCtor(body, randomColor);
  forEach(marker, words);
};

const highlighter = (rangeList, randomColor) => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const finder = sheet
    .createTextFinder('Description Link')
    .matchEntireCell(true)
    .findAll();
  const docId = finder[0]
    .getFormula()
    .match(/d\/[\w|-]+/g)[0]
    .substring(2);
  const ranges = sheet.getRangeList(rangeList).getRanges();

  const words = flatten(reduce((acc, range) => acc.concat(range.getValues()), [], ranges));
  highlight(words, docId, randomColor);

  return `Done.`;
};

export default highlighter;
