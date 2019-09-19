import * as PropService from './PropService'

function addApp(id, name, os, country, storeid){
  const activeSs = SpreadsheetApp.getActive();
  const isAppExists = (PropService.getOne(id+"@id") != null)
  const sheetName = "API " + name + " " + os + " " + country.toUpperCase();
  
  
  if(!id || !name || !os || !country){
    throw Error("Please provide country code.");}
  
  const table = getData(country, "", id, 1, 5);
  if(activeSs.getSheetByName(sheetName) == null){
    activeSs.insertSheet(sheetName);
  }
  updateSheetWithContent(table, sheetName);
  
  
  if(!isAppExists){
    setOneProp(id+"@id", name);
    setOneProp(id+"@os", os);
    setOneProp(id+"@storeid", storeid);
  }
  
  return "App was added successfully.";
}

export default addApp;