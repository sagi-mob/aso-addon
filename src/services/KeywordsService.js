import { KeywordsListParser } from '../ma-apis-parser';
import { DailyKeywordsRanking } from './ApiService';
import { getAppFieldCtor } from './PropService';

const loadAppsKeywords = (mmpid, country, date) => {
  const getField = getAppFieldCtor(mmpid);
  const name = getField(`nickname`) || getField(`name`);
  const os = getField('os');

  const data = DailyKeywordsRanking(mmpid, country, date);
  if (data.length === 0) {
    throw Error(`No keywords for ${name}-${country.toUpperCase()} in Mobile Action`);
  }
  const table = KeywordsListParser(data, date);

  const sheetName = `API ${name} ${os} ${country.toUpperCase()}`;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName(sheetName) === null) {
    ss.insertSheet(sheetName);
  }

  const lastRow = table.length;
  const lastColumn = table[0].length;
  ss.getSheetByName(sheetName)
    .getRange(1, 1, lastRow, lastColumn)
    .setValues(table);
};

export default loadAppsKeywords;
