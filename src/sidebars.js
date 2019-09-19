const loadControlPanel = () => {
  const template = HtmlService.createTemplateFromFile('ControlPanel');
  // template.myVar = 'Sagi'; //Injecting variables to template
  const sidebar = template
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(300)
    .setTitle('Control Panel');
  SpreadsheetApp.getUi().showSidebar(sidebar);
};

const loadMultiplySidebar = () => {
  const sidebar = HtmlService.createTemplateFromFile('multiplySidebar')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(1000)
    .setTitle('Insert Formulas');

  SpreadsheetApp.getUi().showSidebar(sidebar);
};

const loadHightlightSidebar = () => {
  const sidebar = HtmlService.createTemplateFromFile('highlightSidebar')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(1000)
    .setTitle('Insert Ranges');
  SpreadsheetApp.getUi().showSidebar(sidebar);
};

const loadKeysCounterSidebar = () => {
  const sidebar = HtmlService.createTemplateFromFile('keyCounterSidebar')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(1000)
    .setTitle('Insert Ranges');
  SpreadsheetApp.getUi().showSidebar(sidebar);
};

export { loadControlPanel, loadHightlightSidebar, loadKeysCounterSidebar, loadMultiplySidebar };
