/**
* @NotOnlyCurrentDoc
*
* The above comment directs Apps Script to limit the scope of file
* access for this add-on. It specifies that this add-on will only
* attempt to read or modify the files in which the add-on is used,
* and not all of the user's files. The authorization request message
* presented to users will reflect this limited scope.
*/

/**
* Creates a menu entry in the Google Docs UI when the document is opened.
* This method is only used by the regular add-on, and is never called by
* the mobile add-on version.
*
* @param {object} e The event parameter for a simple onOpen trigger. To
*     determine which authorization mode (ScriptApp.AuthMode) the trigger is
*     running in, inspect e.authMode.
*/

function onInstall(e) {
  onOpen(e);
}

// ----------- SCRIPT PROPERTIES ---------------
function getScriptPropService(){
  return PropertiesService.getDocumentProperties();
}

function getAllProps(){
  return PropertiesService.getDocumentProperties().getProperties();
}

function getScriptProp(key){
  return PropertiesService.getDocumentProperties().getProperty(key);
}

function setScriptProp(key, val){
  PropertiesService.getDocumentProperties().setProperty(key, val);
}

function deleteScriptProp(key){
  PropertiesService.getDocumentProperties().deleteProperty(key);
}

function deleteAllProps(){ PropertiesService.getDocumentProperties().deleteAllProperties(); }


// ----------- GLOBAL VARIABLES ----------------


function getCurrMonth(){
  var monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
  
  var d = new Date();
  return monthNames[d.getMonth()];
}

//---------- BUILDER FUNCTIONS -----------------
function addAnApp(id, name, os, country, storeid){
  var ui = SpreadsheetApp.getUi();
  var isAppExists = (getScriptProp(id+"id") != null)
  var sheetName = "API " + name + " " + os + " " + country.toUpperCase();
  
  
  if(!id || !name || !os || !country){
    throw Error("Please provide country code.");}
  
  var table = getData(country, "", id, 1, 5);
  if(SpreadsheetApp.getActive().getSheetByName(sheetName) == null){
    SpreadsheetApp.getActive().insertSheet(sheetName);
  }
  updateSheetWithContent(table, sheetName);
  
  
  if(!isAppExists){
    setScriptProp(id+"id", name);
    setScriptProp(id+"os", os);
    setScriptProp(id+"@storeid", storeid);
  }
  
  return "App was added successfully.";
}


function deleteAnApp(id){
  if(!id)
    throw Error("No app was selected");
  var ui = SpreadsheetApp.getUi();
  
  var res = ui.alert("Just wanted to be sure...", "Do you want to delete app's Sheets as well?\n(or just the documents' properties)" , ui.ButtonSet.YES_NO_CANCEL);
  if(res === ui.Button.CANCEL || res === ui.Button.CLOSE){
    return "No changes were made."}
  else if(res === ui.Button.YES){
    deleteTabs(id);}
  
  deleteScriptProp(id+"id");
  deleteScriptProp(id+"os");
  deleteScriptProp(id+"@storeid");
  
  return "The app and its related tabs were deleted successfully!";
}

function deleteTabs(id){
  var name = getScriptProp(id+"id");
  var tabName = "API " + name;
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for(var ind in sheets){
    var sheet = sheets[ind];
    var currSheetName = sheet.getName();
    if(currSheetName.indexOf(tabName) != -1)
      SpreadsheetApp.getActive().deleteSheet(sheet);
  }
}


// ---------- MAIN FUNCTIONS -------------------


function onOpen(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createAddonMenu();
  menu.addItem("Install", "onInstall")
  .addSeparator();
  menu.addItem("Control Panel", "loadControlPanel")
  .addSeparator()
  .addItem("Keywords Multiplication", "loadMultiplySidebar")
  .addSeparator()
  .addItem("Highlight Keywords", "loadHightlightSidebar")
  .addItem("Description Keywords Counter", "loadKeysCounterSidebar");
  
  menu.addToUi();
}

function loadSidebar(filename, title){
  var sidebar = HtmlService.createTemplateFromFile("ControlPanel").evaluate()
  .setSandboxMode(HtmlService.SandboxMode.IFRAME)
  .setWidth(150)
  .setTitle("Control Panel");
  SpreadsheetApp.getUi().showSidebar(sidebar);
}

function loadControlPanel(){
  var sidebar = HtmlService.createTemplateFromFile("ControlPanel").evaluate()
  .setSandboxMode(HtmlService.SandboxMode.IFRAME)
  .setWidth(150)
  .setTitle("Control Panel");
  SpreadsheetApp.getUi().showSidebar(sidebar);
}


function loadMultiplySidebar(){
  var sidebar = HtmlService.createTemplateFromFile("multiplySidebar").evaluate()
  .setSandboxMode(HtmlService.SandboxMode.IFRAME)
  .setWidth(1000)
  .setTitle("Insert Formulas");
  SpreadsheetApp.getUi().showSidebar(sidebar);
}

function loadHightlightSidebar(){
  var sidebar = HtmlService.createTemplateFromFile("highlightSidebar").evaluate()
  .setSandboxMode(HtmlService.SandboxMode.IFRAME)
  .setWidth(1000)
  .setTitle("Insert Ranges");
  SpreadsheetApp.getUi().showSidebar(sidebar);
}

function loadKeysCounterSidebar(){
  var sidebar = HtmlService.createTemplateFromFile("keyCounterSidebar").evaluate()
  .setSandboxMode(HtmlService.SandboxMode.IFRAME)
  .setWidth(1000)
  .setTitle("Insert Ranges");
  SpreadsheetApp.getUi().showSidebar(sidebar);
}