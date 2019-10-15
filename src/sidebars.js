const configureSidebar = (filename, title) => {
  const template = HtmlService.createTemplateFromFile(filename);
  template.navbar = 'navbar.html';
  const sidebar = template
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    // .setWidth(width || 300)
    .setTitle(title);
  SpreadsheetApp.getUi().showSidebar(sidebar);
};

const showControlPanel = () => configureSidebar('ControlPanel', 'Control Panel');
const showMultiplySidebar = () => configureSidebar('multiplySidebar', 'Multiplications');
const showHightlightSidebar = () => configureSidebar('highlightSidebar', 'Highlighter');
const showKeysCounterSidebar = () => configureSidebar('keyCounterSidebar', 'Keywords Counter');

export { showControlPanel, showMultiplySidebar, showHightlightSidebar, showKeysCounterSidebar };

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
