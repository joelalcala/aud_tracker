import config from "../config.js";
const { abbreviations } = config;

const abbreviationsUtil = {
    getAbbreviatedData(data) {
      const abbreviatedData = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== null) {
          const abbreviation = abbreviations.keys[key] || key;
  
          if (key === "urlParams") {
            const urlParams = data[key];
            const abbreviatedUrlParams = {};
  
            for (const paramKey in urlParams) {
              if (abbreviations.urlParams[paramKey]) {
                const abbreviatedKey = abbreviations.urlParams[paramKey];
                abbreviatedUrlParams[abbreviatedKey] = urlParams[paramKey];
              }
            }
  
            abbreviatedData[abbreviation] = abbreviatedUrlParams;
          } else {
            abbreviatedData[abbreviation] = data[key];
          }
        }
      }
      return abbreviatedData;
    },

    getAbbreviatedValue(value) {
      for (const map of Object.values(abbreviations)) {
        const abbreviation = Object.keys(map).find(key => map[key] === value);
        if (abbreviation) {
          return abbreviation;
        }
      }
      return value;
    },

    unabbreviate(value, type) {
      const abbreviationMap = abbreviations[type];
      for (const key in abbreviationMap) {
        if (abbreviationMap[key] === value) {
          return key;
        }
      }
      return value;
    },
  };

  export default abbreviationsUtil;