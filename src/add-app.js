import * as PropService from './services/PropService';
import loadAppsKeywords from './services/KeywordsService';
import { getDateStr } from './services/DateService';

const addApp = (mmpid, name, os, country, storeid, nickname) => {
  const isAppExists = PropService.getProp(`${mmpid}@storeid"`) !== null;

  if (!mmpid || !name || !os || !country) {
    throw Error('Please provide country code.');
  }
  if (!isAppExists) {
    const setField = PropService.SetAppFieldCtor(mmpid);
    setField('os', os);
    setField('storeid', storeid);
    setField('mmpid', mmpid);
    setField('name', name);
    setField('nickname', nickname || '');
  }

  loadAppsKeywords(mmpid, country, getDateStr());

  return 'App was added successfully.';
};

export default addApp;
