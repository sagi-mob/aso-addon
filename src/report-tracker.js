import { AppDetail } from './services/ApiService';
import { getAppFieldCtor } from './services/PropService';
import { getDate } from './services/DateService';

function getLang(cCode, os) {
  if (os === 'android') {
    return cCode === 'us' ? 'en' : cCode;
  }
  return cCode;
}

function addToTracker(mmpid, cCode) {
  if (!mmpid) throw Error('You have to select an app first.');
  if (!cCode || cCode === '') throw Error('You have to provide Country Code.');

  const getField = getAppFieldCtor(mmpid);
  const ss = SpreadsheetApp.getActive();
  const thisId = ss.getId();
  const thisName = ss.getName();
  const os = getField('os').toLowerCase();
  const lang = getLang(cCode, os);

  const tracker = SpreadsheetApp.openById('1CKuPziqcYG44Lo8ge2TL3deg9T_OJMK4nm5B3PZbBvk');
  const sheet = tracker.getSheets()[0];
  const lastRow = sheet.getLastRow();
  const version = AppDetail(mmpid, lang).versionDiffs[0].currentVersionReleaseDate;
  const activeUser = Session.getActiveUser().getEmail();
  sheet
    .getRange(lastRow + 1, 1, 1, 9)
    .setValues([
      [
        thisName,
        getField('name'),
        getField('storeid'),
        cCode,
        os,
        thisId,
        getDate(),
        version,
        activeUser
      ]
    ]);
  return 'Updated';
}

export default addToTracker;
