// ----------- SCRIPT PROPERTIES ---------------
const getService = () => PropertiesService.getDocumentProperties();

const getAll = () => PropertiesService.getDocumentProperties().getProperties();

const getProp = key => PropertiesService.getDocumentProperties().getProperty(key);

const setProp = (key, val) => PropertiesService.getDocumentProperties().setProperty(key, val);

const deleteProp = key => PropertiesService.getDocumentProperties().deleteProperty(key);

const deleteAllProps = () => PropertiesService.getDocumentProperties().deleteAllProperties();

const getAppFieldCtor = mmpid => field => getProp(`${mmpid}@${field}`);

const SetAppFieldCtor = mmpid => (field, value) => setProp(`${mmpid}@${field}`, value);

export {
  getService,
  getAll,
  getProp,
  setProp,
  deleteProp,
  deleteAllProps,
  getAppFieldCtor,
  SetAppFieldCtor
};
