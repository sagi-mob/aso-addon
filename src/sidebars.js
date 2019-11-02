import { reduce } from 'ramda';

const createView = (view, component) => {
  const viewsArray = {
    html: {
      'manage-app': ['basic-app-settings-view', 'manage-app-view'],
      'add-app': ['basic-app-settings-view', 'add-app-view'],
      'rec-table': ['basic-app-settings-view', 'rec-table-view'],
      multiplicator: ['multiplicator'],
      'keys-counter': ['keys-counter'],
      highlighter: ['highlighter']
    },
    script: {
      'manage-app': ['manage-app-js'],
      'add-app': ['add-app-js'],
      'rec-table': ['rec-table-js'],
      multiplicator: ['multiplicator-js'],
      'keys-counter': ['keys-counter-js'],
      highlighter: ['highlighter-js']
    }
  };

  const html = reduce(
    (acc, curr) => acc.append(HtmlService.createHtmlOutputFromFile(curr).getContent()),
    HtmlService.createHtmlOutput(),
    viewsArray[component][view]
  );
  return html.getContent();
};

const openSidebar = (filename, title, view) => {
  const template = HtmlService.createTemplateFromFile(filename);
  template.view = createView(view, 'html');
  template.script = createView(view, 'script');
  template.currentView = view;
  const sidebar = template
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle(title);
  SpreadsheetApp.getUi().showSidebar(sidebar);
};

export default openSidebar;
