import { flatten, reduce, findIndex, filter } from 'ramda';
// import { getAppFieldCtor } from './services/PropService';
import { DailyKeywordsRanking } from './services/ApiService';

const refactorArr = cellsTextArr =>
  reduce(
    (acc, curr) => {
      const currLower = curr.toLowerCase().trim();
      if (curr.indexOf(',') !== -1) {
        return acc.concat(currLower.split(new RegExp(/\W+/gm)));
      }
      if (curr.indexOf(' ') !== -1) {
        // return acc.concat([currLower, ...currLower.split(new RegExp(/\W+/gm))]);
        return acc.concat(currLower.split(new RegExp(/\W+/gm)));
      }
      return acc.concat(currLower);
    },
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

// const getApiKeywordsList = (ss, mmpid, cCode) => {
//   const getField = getAppFieldCtor(mmpid);
//   const name = getField(`nickname`) || getField(`name`);
//   const os = getField('os');

//   const apiSheet = ss.getSheetByName(`API ${name} ${os} ${cCode.toUpperCase()}`);
//   const keywordsApiTable = apiSheet.getDataRange().getValues();
//   const headers = keywordsApiTable[0].map(curr =>
//     curr instanceof Date ? 'rank' : curr.toString()
//   );
//   const keywordsApiObj = keywordsApiTable.slice(1).map(curr => zipObj(headers, curr));
//   return keywordsApiObj;
// };

const findAndRemoveCtor = list => word => {
  const finder = findIndex(el => el.keyword.search(new RegExp(`\\b${word}\\b`, `gim`)) !== -1);
  let ind = finder(list);
  let res = [];
  while (ind !== -1) {
    res = res.concat(list.splice(ind, 1));
    ind = finder(list);
  }
  return res;
};

const operatorObj = () => {
  const obj = {
    gt: (val1, val2) => val1 > val2,
    gte: (val1, val2) => val1 >= val2,
    lt: (val1, val2) => val1 < val2,
    lte: (val1, val2) => val1 <= val2,
    eq: (val1, val2) => val1 === val2,
    neq: (val1, val2) => val1 !== val2
  };
  return key => obj[key];
};

const fieldObj = () => {
  const obj = {
    traffic: 'searchVolume',
    difficulty: 'chance',
    competition: 'numberOfApps',
    rank: 'rank'
  };
  return key => obj[key];
};

const filterListCtor = conds => {
  const applyOp = operatorObj();
  const getField = fieldObj();
  return key =>
    reduce(
      (acc, cond) => acc && applyOp(cond.cond)(key[getField(cond.field)], cond.val),
      true,
      conds
    );
};

const createRecommendations = (mmpid, cCode, textRanges, conds) => {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getActiveSheet();

  const wordsList = getWordsList(ss, sheet, textRanges);
  const apiKeywordsList = DailyKeywordsRanking(mmpid, cCode);
  const filtering = filterListCtor(conds);
  const filteredKeys = filter(filtering, apiKeywordsList);
  const remover = findAndRemoveCtor(filteredKeys);
  const unfiltered = reduce((acc, curr) => acc.concat(remover(curr)), [], wordsList);
  return unfiltered.map(key => key.keyword).join('\n');
};

export default createRecommendations;
