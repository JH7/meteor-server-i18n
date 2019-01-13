import get from 'lodash.get';

let i18nJson = {};


// eslint-disable-next-line
export const ServerI18n = {
  /**
   * Initializes the object with the given translation json (as string)
   * @param {string} i18nText The i18n string.
   * @throws JSONError
   */
  init(i18nText) {
    i18nJson = JSON.parse(i18nText);
  },
  /**
   * Translates a given key for a given language.
   * @param {string} key The translation key
   * @param {string} lang The language to translate to
   * @param {string | string[]} sprintf The replacements for '%s'
   */
  __(key, lang, sprintf) {
    if (!i18nJson || !i18nJson[lang]) {
      throw new Error('not initialized');
    }

    let value = get(i18nJson[lang], key, key);
    if (sprintf) {
      const workingArr = Array.isArray(sprintf) ? sprintf : [sprintf];

      for (let i = 0; i < workingArr.length; i += 1) {
        value = value.replace('%s', workingArr[i]);
      }
    }

    return value;
  },
  /**
   * Returns a translation function for using with SSR for example.
   * @param {string} lang The language to be used in the translations.
   * @returns {Function} The translation function (key, ...sprintfArgs)
   */
  ssrTranslation(lang) {
    return (key, ...args) => {
      let sprintf = false;
      if (args && args.length > 0) {
        sprintf = args;
      }

      return ServerI18n.__(key, lang, sprintf);
    };
  },
};
