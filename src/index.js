import * as Sidebars from './sidebars';
import { onOpen, onInstall } from './onEvents';
import * as DashboardService from './services/ApiService';
import { GetMobileActionApps, GetDocumentApps } from './services/AppsService';
import addApp from './add-app';
import { deleteApp } from './delete-app';
import loadAppsKeywords from './services/KeywordsService';
import addToTracker from './report-tracker';
import highlighter from './highlighter';
<<<<<<< HEAD
import wordCounter from './keysDescriptionCounter';
import multiplication from './multiplication';
=======
import createRecommendations from './rec-table-gen';
>>>>>>> 912cc7bc7d3de0e6f0d6bbb83bac88cd151cc5af

global.showControlPanel = Sidebars.showControlPanel;
global.showHightlightSidebar = Sidebars.showHightlightSidebar;
global.showKeysCounterSidebar = Sidebars.showKeysCounterSidebar;
global.showMultiplySidebar = Sidebars.showMultiplySidebar;
global.onOpen = onOpen;
global.onInstall = onInstall;
global.include = filename => HtmlService.createHtmlOutputFromFile(filename).getContent();
global.printGlobal = () => Logger.log(Object.keys(global));
global.DashboardApps = DashboardService.DashboardApps;
global.DailyKeywordsRanking = DashboardService.DailyKeywordsRanking;
global.GetMobileActionApps = GetMobileActionApps;
global.GetDocumentApps = GetDocumentApps;
global.addApp = addApp;
global.deleteApp = deleteApp;
global.loadAppsKeywords = loadAppsKeywords;
global.addToTracker = addToTracker;
global.highlighter = highlighter;
<<<<<<< HEAD
global.multiplication = multiplication;
global.wordCounter = wordCounter;
=======
global.createRecommendations = createRecommendations;
>>>>>>> 912cc7bc7d3de0e6f0d6bbb83bac88cd151cc5af
