const apiKey = '569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28';
const base = 'https://api.mobileaction.co';
const errMsg = 'Api request failed';
const ApiRequest = url => UrlFetchApp.fetch(url, { muteHttpExceptions: true });

const DashboardApps = () => {
  const url = `${base}/apps/?token=${apiKey}`;
  try {
    const res = JSON.parse(ApiRequest(url));
    return res.data;
  } catch (e) {
    throw Error(errMsg);
  }
};

const DailyKeywordsRanking = (appId, countryCode, date) => {
  const url = `${base}/keywords/${appId}/${countryCode}?token=${apiKey}&date=${date}`;
  try {
    const res = JSON.parse(ApiRequest(url));
    if (res.success) {
      return res.data;
    }
    throw Error('Api response failed');
  } catch (e) {
    throw Error(errMsg);
  }
};

export { DashboardApps, DailyKeywordsRanking };
