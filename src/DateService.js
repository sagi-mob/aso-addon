const getDate = () => {
  const today = new Date();
  const dd = String(today.getDate());
  const mm = String(today.getMonth() + 1); // January is 0!
  const yyyy = today.getFullYear();
  Logger.log([yyyy, mm, dd].join('-'));
  return [yyyy, mm, dd].join('-');
};

const getCurrMonth = () =>
  [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ].indexOf(new Date().getMonth());

export { getDate, getCurrMonth };
