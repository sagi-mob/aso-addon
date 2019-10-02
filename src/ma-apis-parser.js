import sortByAppName from './sortings';
// import { getDate } from './services/DateService';

const storeIdToOs = storeId => (new RegExp(/(?:(\D))/i).test(storeId) ? 'android' : 'ios');

/**
 * Summary: Parse the response from Mobile Action to a format more easy
 * to use in this system.
 * @param   {JSON} data holds the apps from Mobile Action in JSON format
 * @returns JSON of two elements: 'ios', 'android'. each one is an array
 * conatining JSON object with the following fields:
 * @field storeId
 * @field name
 * @field mmpid
 * @field os
 */
const AppsListParser = data => {
  const res = {
    ios: [],
    android: []
  };
  Object.keys(data).forEach(storeid => {
    const os = storeIdToOs(storeid);
    res[os].push({
      storeid,
      name: data[storeid].appName ? data[storeid].appName : storeid,
      mmpid: data[storeid].appId,
      os
    });
  });
  return {
    ios: res.ios.sort(sortByAppName),
    android: res.android.sort(sortByAppName)
  };
};

// TODO: I want to sort the list alphabetically
// Mind that the headers shouldn't be sorted - therefore to be added after sorting
const KeywordsListParser = (data, date) => {
  const headers = Object.keys(data[0]);
  headers.splice(4, 1, date);
  const res = [headers];
  data.forEach(entry => {
    res.push([
      entry.keyword,
      entry.searchVolume,
      entry.chance,
      entry.numberOfApps,
      entry.rank,
      entry.change,
      entry.combinationKeyword,
      entry.appTitleKeywordMatch
    ]);
  });
  return res;
};
export { AppsListParser, KeywordsListParser };
