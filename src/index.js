import * as Sidebars from './sidebars';
import { onOpen, onInstall } from './onEvent';

global.loadControlPanel = Sidebars.loadControlPanel;
global.loadHightlightSidebar = Sidebars.loadHightlightSidebar;
global.loadKeysCounterSidebar = Sidebars.loadKeysCounterSidebar;
global.loadMultiplySidebar = Sidebars.loadMultiplySidebar;
global.onOpen = onOpen;
global.onInstall = onInstall;
global.include = filename => HtmlService.createHtmlOutputFromFile(filename).getContent();
global.printGlobal = () => Logger.log(Object.keys(global));
