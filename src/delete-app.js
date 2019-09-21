import * as PropService from './services/PropService';

// const deleteTabs = (id) => {
//   var name = getScriptProp(id+"id");
//   var tabName = "API " + name;
//   var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
//   for(var ind in sheets){
//     var sheet = sheets[ind];
//     var currSheetName = sheet.getName();
//     if(currSheetName.indexOf(tabName) != -1)
//       SpreadsheetApp.getActive().deleteSheet(sheet);
//   }
// }

const deleteAppTabs = id => {
  const name = PropService.getProp(`${id}@nickname`) || PropService.getProp(`${id}@name`);
  const tabName = `API ${name}`;
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  sheets.forEach(sheet => {
    if (sheet.getName().indexOf(tabName) !== -1) {
      SpreadsheetApp.getActive().deleteSheet(sheet);
    }
  });
};

const deleteAppProps = mmpid => {
  PropService.deleteProp(`${mmpid}@mmpid`);
  PropService.deleteProp(`${mmpid}@os`);
  PropService.deleteProp(`${mmpid}@storeid`);
  PropService.deleteProp(`${mmpid}@name`);
  PropService.deleteProp(`${mmpid}@nickname`);
};

const deleteApp = mmpid => {
  if (!mmpid) throw Error('No app was selected');
  const ui = SpreadsheetApp.getUi();

  const res = ui.alert(
    `Just wanted to be sure...`,
    `Do you want to delete app's Sheets as well?
    (or just the documents' properties)`,
    ui.ButtonSet.YES_NO_CANCEL
  );

  if (res === ui.Button.CANCEL || res === ui.Button.CLOSE) {
    return 'No changes were made.';
  }
  if (res === ui.Button.YES) {
    deleteAppTabs(mmpid);
  }
  deleteAppProps(mmpid);

  return 'The app and its related tabs were deleted successfully!';
};

export { deleteApp, deleteAppProps };
