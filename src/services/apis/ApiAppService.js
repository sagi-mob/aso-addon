import { getAppFieldCtor } from '../PropService';

const apiKey = '569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28';
const base = 'https://api.mobileaction.co';
const errMsg = 'Api request failed';
const ApiRequest = url => UrlFetchApp.fetch(url, { muteHttpExceptions: true });

const AppDetail = (mmpid, lang) => {
  const getField = getAppFieldCtor(mmpid);
  const os = getField(`os`);
  const storeid = getField(`storeid`);

  const store = os === 'ios' ? 'appstore-appinfo-v2' : 'playstore-appinfo-v2';
  const url = `${base}/${store}/versions/${[storeid, lang].join('/')}/?token=${apiKey}`;

  try {
    return JSON.parse(ApiRequest(url));
  } catch (e) {
    throw Error(errMsg);
  }
};

export default AppDetail;
