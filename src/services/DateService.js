const getDateStr = today => {
  if (today) return today;
  const date = new Date();
  const dd = String(date.getDate());
  const mm = String(date.getMonth() + 1); // January is 0!
  const yyyy = date.getFullYear();
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

export { getDateStr, getCurrMonth };
