
// ----------- SCRIPT PROPERTIES ---------------
const getService = () => 
  PropertiesService.getDocumentProperties();
  
const getAll = () =>
  PropertiesService.getDocumentProperties().getProperties();
  
  
const getOne = (key) =>
  PropertiesService.getDocumentProperties().getProperty(key);
  
  
const setOne = (key, val) =>
  PropertiesService.getDocumentProperties().setProperty(key, val);
  
  
const deleteOne = (key) =>
  PropertiesService.getDocumentProperties().deleteProperty(key);
  
  
const deleteAll = () =>
  PropertiesService.getDocumentProperties().deleteAllProperties(); 

export { getService, getAll, getOne, setOne, deleteOne, deleteAll }