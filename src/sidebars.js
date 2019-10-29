const openSidebar = (filename, title, config) => {
  const template = HtmlService.createTemplateFromFile(filename);
  template.config = config;
  const sidebar = template
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle(title);
  SpreadsheetApp.getUi().showSidebar(sidebar);
};

// const showControlPanel = () => configureSidebar('manage-app', 'Manage App');
// const showMultiplySidebar = () => configureSidebar('multiplySidebar', 'Multiplications');
// const showHightlightSidebar = () => configureSidebar('highlightSidebar', 'Highlighter');
// const showKeysCounterSidebar = () => configureSidebar('keyCounterSidebar', 'Keywords Counter');

export default openSidebar;

// { //T HERE IS AN OPTION TO PASS VARIABLE TO THE TEMPLATE
//   const template = HtmlService.createTemplateFromFile('ControlPanel');
//   template.myVar = 'Sagi'; // <--- This is how
//   const sidebar = template
//     .evaluate()
//     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
//     .setWidth(300)
//     .setTitle('Control Panel');
//   SpreadsheetApp.getUi().showSidebar(sidebar);
// }
