const onOpen = () => {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createAddonMenu();
  menu.addItem('Install', 'onInstall').addSeparator();
  menu
    .addItem('Control Panel', 'loadControlPanel')
    .addSeparator()
    .addItem('Keywords Multiplication', 'loadMultiplySidebar')
    .addSeparator()
    .addItem('Highlight Keywords', 'loadHightlightSidebar')
    .addItem('Description Keywords Counter', 'loadKeysCounterSidebar');

  menu.addToUi();
};

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

const onInstall = e => {
  onOpen(e);
};
export { onOpen, onInstall };
