const sortByAppName = (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase());

const ascendArrLen = (a, b) => a.length - b.length;

const descdArrLen = (a, b) => b.length - a.length;

export { sortByAppName, ascendArrLen, descdArrLen };
