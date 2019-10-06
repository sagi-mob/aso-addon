import { flatten, reduce, findIndex, filter, zipObj, map } from 'ramda';
import { getAppFieldCtor } from './services/PropService';
import { DailyKeywordsRanking } from './services/ApiService';
import { escapeRegExp } from './utils';

const duplicateRemoveFilter = (curr, ind, array) => array.indexOf(curr) === ind;
const refactorArr = cellsTextArr =>
  reduce(
    (acc, curr) => {
      const currLower = curr.toLowerCase().trim();
      const regex = new RegExp(/\W+/gm);
      const toAdd = currLower.search(regex) ? currLower.split(regex) : currLower;
      return acc.concat(toAdd);
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
    return combined.filter(duplicateRemoveFilter).sort();
  } catch (e) {
    return Error(`Tab: Category, Relevance & Chosen
    does not exist. The algorithm can't run without it`);
  }
};

const getApiSheetWordsList = (ss, mmpid, cCode) => {
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

/*  
  A functor - first, get a list as an argument.
  Then, for each word given as an argument, it takes all the keywords in
  the list that have this wors as a substring oh the phrase. and removes them
  from the original list
  Purpose - once a phrase met a single criteria its already taken in count
  no need to take it into consideration when checking other phrases and therefore
  it should be removed
*/
const findAndExtractCtor = list => word => {
  const escapedWord = escapeRegExp(word);
  const finder = findIndex(
    el => el.keyword.search(new RegExp(`\\b${escapedWord}\\b`, `gim`)) !== -1
  );
  let ind = finder(list);
  let res = [];
  while (ind !== -1) {
    res = res.concat(list.splice(ind, 1));
    ind = finder(list);
  }
  return res;
};

const applyPrimOpCtor = () => {
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

/*
  all fields that are given by mobile action or can be calculated by 
  applying ptimitive operators are considered to be 'primitive'
*/
const getPrimFieldCtor = keyword => {
  const fieldObj = {
    traffic: keyword.searchVolume,
    difficulty: keyword.chance,
    competition: keyword.numberOfApps,
    rank: keyword.rank,
    tdl: keyword.searchVolume / keyword.keyword.length // tdl = Traffic divided by Length
  };
  return key => fieldObj[key];
};

const getSpecialFieldCtor = (oldKeywordsList, newKeywordsList) => {
  const keywordsString = map(keyword => keyword.keyword, newKeywordsList).join(',');
  const newKeywordsObj = reduce(
    (acc, keyword) => {
      acc[keyword.keyword] = keyword;
      return acc;
    },
    {},
    newKeywordsList
  );
  const oldKeywordsObj = reduce(
    (acc, keyword) => {
      acc[keyword.keyword] = keyword;
      return acc;
    },
    {},
    oldKeywordsList
  );
  return {
    pc: keyword => {
      const escapedWord = escapeRegExp(keyword);
      const matches = keywordsString.match(new RegExp(`\\b${escapedWord}\\b`, `gim`));
      return matches ? matches.length : 0;
    },
    rd: keyword => newKeywordsObj[keyword].rank - oldKeywordsObj[keyword].rank
  };
};

const filterListCtor = (oldKeywordsList, newKeywordsList, conds) => {
  const applyOp = applyPrimOpCtor();
  const getSpecialField = getSpecialFieldCtor(oldKeywordsList, newKeywordsList);
  return keyword => {
    const getPrimField = getPrimFieldCtor(keyword);
    return reduce(
      (acc, cond) =>
        acc ||
        applyOp(cond.cond)(
          getPrimField(cond.field) || getSpecialField[cond.field](keyword.keyword),
          cond.val
        ),
      false,
      conds
    );
  };
};

// const primCondFilter = cond =>
//   cond.field === 'traffic' ||
//   cond.field === 'difficulty' ||
//   cond.field === 'competition' ||
//   cond.field === 'rank' ||
//   cond.field === 'tdl';

// const specialCondFilter = cond => cond.field === 'pc' || cond.field === 'rd';

const createRecommendations = (mmpid, cCode, textRanges, comparisonDate, conds) => {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getActiveSheet();

  // const primConds = conds.filter(primCondFilter);
  // const specialConds = conds.filter(specialCondFilter);

  // Extract words in text assets and also Relevant keywords from 'relevance' tab
  const wordsList = getWordsList(ss, sheet, textRanges);
  // get all keywords of given app
  const oldKeywordsList = DailyKeywordsRanking(mmpid, cCode, comparisonDate);
  const newKeywordsList = getApiSheetWordsList(ss, mmpid, cCode);
  if (oldKeywordsList.length !== newKeywordsList.length) {
    throw Error('The API sheet is not updated with the latest keywords');
  }

  // Fetches all keywords that fulfill one of the given primitive conditions
  const filtering = filterListCtor(oldKeywordsList, newKeywordsList, conds);
  const primitiveFiltered = filter(filtering, newKeywordsList);
  //
  const extractor = findAndExtractCtor(primitiveFiltered);
  const unfiltered = reduce((acc, curr) => acc.concat(extractor(curr)), [], wordsList);
  return unfiltered
    .map(key => key.keyword)
    .concat(wordsList)
    .filter(duplicateRemoveFilter)
    .sort()
    .join('\n');
};

export default createRecommendations;
