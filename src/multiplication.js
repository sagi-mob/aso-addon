import { reduce } from 'ramda';
import { ascendArrLen, descdArrLen } from './sortings';

function getFilename() {
  const spname = SpreadsheetApp.getActive().getName();
  return spname.substring(0, spname.search(/\W/g));
}

function zipArray(arr1, arr2) {
  if (arr1.length === 0 && arr2.length !== 0) return arr2;
  if (arr1.length !== 0 && arr2.length === 0) return arr1;
  const zipped = [];
  for (let i = 0; i < arr1.length; i += 1) {
    for (let j = 0; j < arr2.length; j += 1) {
      zipped.push(`${arr1[i]} ${arr2[j]}`);
    }
  }
  return zipped;
}

function specialZip(twoDimArr) {
  if (twoDimArr.length === 0) return [];
  if (twoDimArr.length === 1) return twoDimArr[0];
  if (twoDimArr.length === 2) return zipArray(twoDimArr[0], twoDimArr[1]);
  return zipArray(
    specialZip(twoDimArr.slice(0, twoDimArr.length / 2)),
    specialZip(twoDimArr.slice(twoDimArr.length / 2))
  );
}

function setSheets(ss) {
  const keysSheet = ss.getSheetByName('Words');
  if (keysSheet == null) throw Error('No Keywords Sheet to generate multiplications');

  const multSheet = ss.getSheetByName('Multiplications');
  if (multSheet == null) ss.insertSheet('Multiplications');
}

function arrangeResult(longestArr, headers, hash) {
  const table = [
    headers.map(function(curr) {
      return curr.toUpperCase();
    })
  ];
  for (let i = 0; i < longestArr; i += 1) {
    const row = [];
    for (let el = 0; el < headers.length; el += 1) {
      const key = headers[el].toLowerCase();
      row.push(hash[key][i] === 'undefined' ? `` : hash[key][i]);
    }
    table.push(row);
  }
  return table;
}

function multToSheet(ss, hash, numOfCols, headers) {
  setSheets(ss);
  const sheet = ss.getSheetByName('Multiplications');

  const longestArr = reduce(
    (acc, key) => Math.max(hash[key] ? hash[key].length : 0, acc),
    0,
    Object.keys(hash)
  );

  const res = arrangeResult(longestArr, headers, hash);
  sheet.clear();
  sheet.getRange(1, 1, longestArr + 1, numOfCols).setValues(res);
  sheet.createTextFinder('undefined').replaceAllWith('');
}

function parseMults(mults) {
  const res = [];
  mults.forEach(function(curr) {
    if (curr !== '') {
      const newVal = curr.toLowerCase().split('*');
      res.push(newVal);
    }
  });
  return res.sort(ascendArrLen);
}

function multToFile(hash, headers) {
  const flattened = headers.reduce(function(acc, curr) {
    return acc.concat(hash[curr]);
  }, []);

  const arr = flattened.filter(function(curr, i) {
    return flattened.indexOf(curr) === i;
  });

  return { name: getFilename(), text: arr.join('\n') };
}

function hashInit(keywords) {
  const hash = {};
  for (let i = 0; i < keywords.length; i += 1) {
    hash[String.fromCharCode(i + 97)] = keywords[i];
  }
  return hash;
}

function optimizeLists(str, hashKeys, hash) {
  //  Logger.log("Hash: " + Object.keys(hash));
  //  Logger.log("Formula: " + str);
  let arr = new Array(str.replace(/\*/g, '').length);
  let updatedStr = str;
  for (let i = 0; i < hashKeys.length && updatedStr.match(/\w/g) !== null; i += 1) {
    const ind = updatedStr.indexOf(hashKeys[i]);
    //    Logger.log(ind);
    if (ind !== -1) {
      const astInHash = hashKeys[i].match(/\*/g);
      const numOfCellsToRemove =
        astInHash != null ? hashKeys[i].length - astInHash.length : hashKeys[i].length;
      const numOfAstToInd =
        updatedStr.substring(0, ind).match(/\*/g) != null
          ? updatedStr.substring(0, ind).match(/\*/g).length
          : 0;
      const from = ind - numOfAstToInd;
      const to = from + numOfCellsToRemove;
      const toConcat = hash[hashKeys[i]] === null ? [] : hash[hashKeys[i]];
      arr = arr
        .slice(0, from)
        .concat([toConcat])
        .concat(arr.slice(to));
      const escapeAstrix = hashKeys[i].replace(/\*/g, '\\*');
      const regex = new RegExp(`(${escapeAstrix})`);
      updatedStr = updatedStr.replace(regex, '@');
      //      Logger.log("Formula: " + str);
    }
  }
  return arr;
}

function multiply(mults, keywords) {
  const hash = hashInit(keywords);
  mults.forEach(function(mult) {
    const str = mult.join('*');
    const hashKeys = Object.keys(hash).sort(descdArrLen);
    const arr = optimizeLists(str, hashKeys, this);
    const zipped = specialZip(arr);
    this[str] = zipped;
    // assume no repetitions of formulas (only one occurence for each formula)
  }, hash);
  return hash;
}

function getKeywords(ss) {
  //  var ss = SpreadsheetApp.getActive();
  const sheet = ss.getActiveSheet();
  //  var sheet= ss.getSheetByName("Words");
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const wordsArr = sheet.getSheetValues(1, 1, lastRow, lastCol);
  const cols = [];
  for (let col = 0; col < lastCol; col += 1) {
    const nextCol = [];
    for (let row = 1; row < lastRow; row += 1) {
      if (wordsArr[row][col] !== '') nextCol.push(wordsArr[row][col]);
    }
    cols.push(nextCol);
  }
  return cols;
}

const multiplication = (mults, toFile, toSheet) => {
  const ss = SpreadsheetApp.getActive();
  const parsedMults = parseMults(mults);
  const keywords = getKeywords(ss);
  const hash = multiply(parsedMults, keywords);
  const headers = parsedMults
    .map(function(curr) {
      return curr.join('*').toLowerCase();
    })
    .sort();

  Logger.log('got this far');
  if (toSheet) {
    multToSheet(ss, hash, parsedMults.length, headers);
  }
  Logger.log('then here');
  if (toFile) {
    return multToFile(hash, headers);
  }

  return 'Done that.';
};

export default multiplication;
