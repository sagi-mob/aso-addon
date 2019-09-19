import * as PropService from './PropService';


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

const deleteAppTabs = (id) => {
  const name = PropService.getOne(id+"@id");
  const tabName = "API " + name;
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for(let sheet of sheets){
    if(sheet.getName().indexOf(tabName) != -1)
      SpreadsheetApp.getActive().deleteSheet(sheet);
  }
}

const deleteAppProps = (id) => {
  PropService.deleteOne(id+"@id");
  PropService.deleteOne(id+"@os");
  PropService.deleteOne(id+"@storeid");
}

const deleteApp = (id) => {
  if(!id)
    throw Error("No app was selected");
  const ui = SpreadsheetApp.getUi();

  const res = ui.alert(`Just wanted to be sure...`,
    `Do you want to delete app's Sheets as well?\n(or just the documents' properties)`,
    ui.ButtonSet.YES_NO_CANCEL);

  if(res === ui.Button.CANCEL || res === ui.Button.CLOSE){
    return "No changes were made."
  }
  else if(res === ui.Button.YES){
    deleteAppTabs(id);
  }

  deleteAppProps(id);

  return "The app and its related tabs were deleted successfully!";
}

export default deleteApp;