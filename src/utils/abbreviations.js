import config from '../config';

const { keys, values } = config.abbreviations;

const abbreviationsUtils = {
  abbreviateObject(obj) {
    return processObject(obj, keys, values, true);
  },

  unabbreviateObject(obj) {
    return processObject(obj, keys, values, false);
  }
};

function processObject(obj, keysAbbreviations, valuesAbbreviations, abbreviate) {
  const result = {};

  for (const key in obj) {
    let abbreviatedKey = key;
    let abbreviatedValue = obj[key];

    if (abbreviate) {
      if (keysAbbreviations.hasOwnProperty(key)) {
        abbreviatedKey = keysAbbreviations[key];
      }

      if (valuesAbbreviations.hasOwnProperty(obj[key])) {
        abbreviatedValue = valuesAbbreviations[obj[key]];
      }
    } else {
      for (const abbrevKey in keysAbbreviations) {
        if (keysAbbreviations[abbrevKey] === key) {
          abbreviatedKey = abbrevKey;
          break;
        }
      }

      for (const abbrevValue in valuesAbbreviations) {
        if (valuesAbbreviations[abbrevValue] === obj[key]) {
          abbreviatedValue = abbrevValue;
          break;
        }
      }
    }

    result[abbreviatedKey] = abbreviatedValue;
  }

  return result;
}

export default abbreviationsUtils;
