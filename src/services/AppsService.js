import * as DashboardService from './ApiService';
import { AppsListParser } from '../ma-apis-parser';
import * as PropService from './PropService';
import sortByAppName from '../sortings';

const GetMobileActionApps = () => AppsListParser(DashboardService.DashboardApps());

const GetDocumentApps = () => {
  const properties = PropService.getAll();
  const res = { ios: [], android: [] };

  Object.keys(properties).forEach(key => {
    const [mmpid, field] = key.split('@');
    if (field === 'storeid') {
      const getField = PropService.getAppFieldCtor(mmpid);
      const os = getField(`os`);
      res[os].push({
        mmpid,
        os,
        nickname: getField(`nickname`),
        storeid: getField(`storeid`),
        name: getField(`name`)
      });
    }
  });
  return {
    ios: res.ios.sort(sortByAppName),
    android: res.android.sort(sortByAppName)
  };
};

export { GetMobileActionApps, GetDocumentApps };
