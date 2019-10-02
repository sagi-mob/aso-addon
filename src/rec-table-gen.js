import { flatten, reduce, zipObj } from 'ramda';
import { getAppFieldCtor } from './services/PropService';

const refactorArr = cellsTextArr =>
  reduce(
    (acc, curr) =>
      curr.indexOf(',') !== -1
        ? acc.concat(curr.toLowerCase().split(new RegExp(/\W+/gm)))
        : acc.concat(curr.trim().toLowerCase()),
    [],
    cellsTextArr
  );

const getWordsList = (ss, sheet, textRanges) => {
  const ranges = sheet.getRangeList(textRanges.split(',')).getRanges();
  const cellsTextArr = refactorArr(
    flatten(reduce((acc, range) => acc.concat(range.getValues()), [], ranges))
  );

  try {
    const relSheet = ss.getSheetByName('Category, Relevance & Chosen');
    // table is array of arrays, each entry is of:
    // [["Keyword", "Category", "Relevancy", "Chosen↵iOS", "Chosen↵Android"]
    // ["cheetah", "Brand", 3, "", ""]]
    // Therefore, relevancy is in each entry in index 2
    const relevanceTable = relSheet
      .getDataRange()
      .getValues()
      .filter(curr => curr[2] === 3)
      .map(curr => curr[0]);
    const combined = cellsTextArr.concat(relevanceTable);
    return combined.filter((curr, ind) => combined.indexOf(curr) === ind).sort();
  } catch (e) {
    return Error(`Tab: Category, Relevance & Chosen
    does not exist. The algorithm can't run without it`);
  }
};

const getApiKeywordsList = (ss, mmpid, cCode) => {
  const getField = getAppFieldCtor(mmpid);
  const name = getField(`nickname`) || getField(`name`);
  const os = getField('os');

  const apiSheet = ss.getSheetByName(`API ${name} ${os} ${cCode.toUpperCase()}`);
  const keywordsApiTable = apiSheet.getDataRange().getValues();
  const headers = keywordsApiTable[0].map(curr =>
    curr instanceof Date ? 'rank' : curr.toString()
  );
  const keywordsApiObj = keywordsApiTable.slice(1).map(curr => zipObj(headers, curr));
  return keywordsApiObj;
};

const createRecommendations = (mmpid, cCode, textRanges) => {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getActiveSheet();

  const wordsList = getWordsList(ss, sheet, textRanges);
  const apiKeywordsList = getApiKeywordsList(ss, mmpid, cCode);
  Logger.log(`${wordsList} ${apiKeywordsList}`);
  return 'Done.';
};

export default createRecommendations;
